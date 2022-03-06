import { relative, resolve } from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig({
	target: 'esnext',
	sourcemap: true,
	clean: true,
	dts: false,
	format: ['esm'],
	entry: ['./src/index.ts'],
	globalName: 'tap',
	minify: true,
	tsconfig: relative(__dirname, resolve(process.cwd(), 'src', 'tsconfig.json')),
});
