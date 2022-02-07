import type { ITapConfig, ICreateTemplateContentOptions } from './interfaces';

import { mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fatal, success } from './logging';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { render } from 'mustache';
import { copy } from 'fs-extra'; // TODO: remove this and implement it myself
import { execSync } from 'node:child_process';

const home = (path: string) => (path === '~' ? HOME : path.startsWith('~/') ? resolve(HOME, path.slice(2)) : path);
const filter = (file: string): boolean => (!DENY_LIST.some((deny) => file.includes(deny)) ? true : false);

const HOME = homedir();
const TEMPLATES_DIRECTORY = home('~/.config/tap/templates');
const DENY_LIST = ['node_modules', '.taprc.js'];

/**
 * Reads a directory recursively.
 */
const recursiveReaddir = async function* (directory: string): AsyncIterableIterator<string> {
	for (const dirent of await readdir(directory, { withFileTypes: true })) {
		const res = resolve(directory, dirent.name);

		if (dirent.isDirectory()) yield* recursiveReaddir(res);
		else yield res;
	}
};

/**
 * Creates a directory and if it exists, it errors out.
 */
const createDirectoryAndCheckForExistence = async (path: string) => {
	if (existsSync(path)) {
		fatal(`Directory ${path} already exists`);
		process.exit(1);
	}

	await mkdir(path);
};

/**
 * Gets the tap configuration file.
 */
const getTapConfig = async (template: string) =>
	<ITapConfig>(
		(await import(pathToFileURL(resolve(TEMPLATES_DIRECTORY, template, '.taprc.js')).toString()))
			.default
	);

/**
 * Walks through a template directory and creates a new directory with the same
 * structure.
 */
const createTemplateContents = async ({ template, name, responses }: ICreateTemplateContentOptions) => {
	const templatePath = resolve(TEMPLATES_DIRECTORY, template);
	const destinationPath = resolve(process.cwd(), name!);

	await copy(templatePath, destinationPath, { filter });

	for await (const file of recursiveReaddir(destinationPath)) {
		if (!file.endsWith('.template')) continue;

		const content = await readFile(file, 'utf8');
		await writeFile(file.replace('.template', ''), render(content, responses));
		await rm(file);
	}
};

const doFirstTimeInstall = async () => {
	const config = home('~/.config/tap');

	if (existsSync(config)) return;

	await mkdir(config, { recursive: true });
	execSync(
		`git clone --quiet git@github.com:demiboy/typescript-tsup-with-yarn-v3.git ${TEMPLATES_DIRECTORY}/typescript-tsup-with-yarn-v3`
	);

	success('Created ~/.config/tap');
	success('Added default template to ~/.config/tap/templates');
};

export {
	createDirectoryAndCheckForExistence,
	createTemplateContents,
	getTapConfig,
	doFirstTimeInstall,
	recursiveReaddir,
	home,
	TEMPLATES_DIRECTORY,
};
