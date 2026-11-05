// @ts-check
// CommonJS on purpose: the ESM build of @devmy/eslint-plugin 1.3.0 fails to resolve @ngrx/eslint-plugin/v9.
const tseslint = require('typescript-eslint');
const devmy = require('@devmy/eslint-plugin');

module.exports = tseslint.config({
  files: ['src/**/*.ts'],
  plugins: { devmy },
  extends: [devmy.configs.recommended],
});
