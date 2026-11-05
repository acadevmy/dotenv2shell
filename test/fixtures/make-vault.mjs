// Generates test/fixtures/vault/.env.vault with a fixed key, so the vault fixture is reproducible.
import { createCipheriv } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const key = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const nonce = Buffer.from('000102030405060708090a0b', 'hex');
const plaintext = 'VAULT_SECRET="from vault"\nVAULT_MULTILINE="a\nb"\nPRESET=from-vault\n';

const cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), nonce);
const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final(), cipher.getAuthTag()]);
const value = Buffer.concat([nonce, ciphertext]).toString('base64');

writeFileSync(
  new URL('./vault/.env.vault', import.meta.url),
  `DOTENV_VAULT_DEVELOPMENT="${value}"\n`,
);
console.log(`DOTENV_KEY=dotenv://:key_${key}@dotenv.org/vault/.env.vault?environment=development`);
