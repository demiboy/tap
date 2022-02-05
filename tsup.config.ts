import { relative, resolve } from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig({
	target: 'es2021',
	sourcemap: true,
	clean: true,
	dts: false,
	entry: ['./src/index.ts'],
	globalName: 'tap',
	minify: false,
	skipNodeModulesBundle: true,
	tsconfig: relative(__dirname, resolve(process.cwd(), 'src', 'tsconfig.json')),
	keepNames: true,
});
