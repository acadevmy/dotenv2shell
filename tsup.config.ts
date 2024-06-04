import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  bundle: true,
  minify: true,
  clean: true,
  cjsInterop: true,
  outDir: 'bin',
  tsconfig: './tsconfig.json'
});