// Pins the exact stdout of the built CLI: pipelines run `@latest`, so any change here reaches CI at once.
// Run `UPDATE_SNAPSHOTS=1 node --test` only when an output change is intended.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('../bin/index.mjs', import.meta.url));
const fixture = (name) => fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));
const snapshot = (name) => new URL(`./__snapshots__/${name}.sh`, import.meta.url);

const DOTENV_KEY =
  'dotenv://:key_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef@dotenv.org/vault/.env.vault?environment=development';

// The CLI exports the whole process env too, so the child gets a fixed one.
const baseEnv = { PRESET: 'from-shell' };

const cases = [
  { name: 'plain-override', cwd: 'plain', args: ['-o'] },
  { name: 'plain-no-override', cwd: 'plain', args: [] },
  {
    name: 'plain-environment-prefix',
    cwd: 'plain',
    args: ['-e', 'production', '-p', 'MY_APP_', '-o'],
  },
  { name: 'plain-files', cwd: 'plain', args: ['-f', '.env.production', '-o'] },
  { name: 'vault-env-key', cwd: 'vault', args: ['-o'], env: { DOTENV_KEY } },
  { name: 'vault-arg-key', cwd: 'vault', args: ['-o', '-d', DOTENV_KEY] },
  { name: 'vault-without-key', cwd: 'vault', args: ['-o'] },
];

// macOS injects this variable into every process it launches.
const normalize = (output) => output.replace(/^export __CF_USER_TEXT_ENCODING=.*\n/m, '');

for (const { name, cwd, args, env } of cases) {
  test(`output: ${name}`, () => {
    const output = normalize(
      execFileSync(process.execPath, [bin, ...args], {
        cwd: fixture(cwd),
        env: { ...baseEnv, ...env },
        encoding: 'utf8',
      }),
    );

    if (process.env.UPDATE_SNAPSHOTS || !existsSync(snapshot(name))) {
      writeFileSync(snapshot(name), output);
    }

    assert.equal(output, readFileSync(snapshot(name), 'utf8'));
  });
}

const hasBash = spawnSync('bash', ['--version']).status === 0;

// Newlines reach the shell as a literal `\n` (see "Handling Backslash Escapes" in the README).
test('eval in bash exports the variables', { skip: !hasBash && 'bash not found' }, () => {
  const script = `eval "$("${process.execPath}" "${bin}" -o)" && printf '%s|%s|%s|%s' "$API_URL" "$WITH_SPACES" "$MULTILINE" "$PRESET"`;
  const output = execFileSync('bash', ['-c', script], {
    cwd: fixture('plain'),
    env: { ...baseEnv, PATH: process.env.PATH },
    encoding: 'utf8',
  });

  assert.equal(output, 'https://api.example.com/users|hello world|line1\\nline2\\nline3|from-dotenv');
});

test('eval in bash exports the vault variables', { skip: !hasBash && 'bash not found' }, () => {
  const script = `eval "$("${process.execPath}" "${bin}" -o)" && printf '%s|%s|%s' "$VAULT_SECRET" "$VAULT_MULTILINE" "$PRESET"`;
  const output = execFileSync('bash', ['-c', script], {
    cwd: fixture('vault'),
    env: { ...baseEnv, PATH: process.env.PATH, DOTENV_KEY },
    encoding: 'utf8',
  });

  assert.equal(output, 'from vault|a\\nb|from-vault');
});
