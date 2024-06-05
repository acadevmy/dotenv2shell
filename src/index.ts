import { env } from '@dotenv-run/core';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = await yargs(hideBin(process.argv))
  .option('override', {
    alias: ['o', 'override'],
    boolean: true,
    default: false,
    description:
      'Override any environment variables that have already been set on your machine with values from your .env file',
  })
  .option('prefix', {
    alias: ['p', 'prefix'],
    string: true,
    description: 'Prefix to filter environment variables',
  })
  .option('root', {
    alias: ['r', 'root'],
    string: true,
    description: 'Root directory to search for .env files',
  })
  .option('files', {
    alias: ['f', 'files'],
    string: true,
    array: true,
    description: '.env files to load',
  })
  .option('dotenv_key', {
    alias: ['d', 'dotenv_key'],
    string: true,
    description: 'Specify manually the DOTENV_KEY to decrypt .env.vault',
  })
  .option('cwd', {
    alias: ['c', 'cwd'],
    string: true,
    description: 'Specify manually the DOTENV_KEY to decrypt .env.vault',
  })
  .help().argv;

// Kill all dotenv logs 🏴‍☠️
console.log = () => null;

const dotenvRun = env({
  cwd: process.cwd(),
  prefix: argv.prefix,
  root: argv.root,
  files: argv.files,
  dotenv: {
    override: argv.override,
    DOTENV_KEY: argv.dotenv_key ?? process.env['DOTENV_KEY'],
  },
});

const exportStatements =
  Object.entries(dotenvRun.raw)
    .map(([key, value]) => {
      value = JSON.stringify(value).replaceAll(/\r\n|\r|\n/g, '\n');

      return `export ${key}=${value}`;
    })
    .join('\n') + '\n';

process.stdout.write(exportStatements);
