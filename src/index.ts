import { env } from '@dotenv-run/core';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = await yargs(hideBin(process.argv))
  .option('override', {
    alias: 'o',
    boolean: true,
    default: false,
    description:
      'Override any environment variables that have already been set on your machine with values from your .env file',
  })
  .option('prefix', {
    alias: 'p',
    string: true,
    description: 'Prefix to filter environment variables',
  })
  .option('root', {
    alias: 'r',
    string: true,
    description: 'Root directory to search for .env files',
  })
  .option('files', {
    alias: 'f',
    string: true,
    array: true,
    description: '.env files to load',
  })
  .option('dotenv_key', {
    alias: 'd',
    string: true,
    description: 'Specify manually the DOTENV_KEY to decrypt .env.vault',
  })
  .help().argv;

// Kill all dotenv logs 🏴‍☠️
console.log = () => null;

const dotenvRun = env({
  prefix: argv.prefix,
  root: argv.root,
  files: argv.files,
  dotenv: {
    override: argv.override,
    DOTENV_KEY: argv.dotenv_key,
  },
});

const exportStatements = Object.entries(dotenvRun.raw)
  .map(([key, value]) => {
    value = JSON.stringify(value).replaceAll(/\r\n|\r|\n/g, '\n');

    return `export ${key}=${value}`;
  })
  .join('\n');

process.stdout.write(exportStatements);
