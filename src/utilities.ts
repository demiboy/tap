import type { Answers, QuestionCollection } from 'inquirer';

import { mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from 'mustache';
import { fatal } from './logging';
import { copy } from 'fs-extra'; // TODO: remove this and implement it myself

const DENY_LIST = ['node_modules', '.taprc.js'];

export interface ITapConfig {
	questions: QuestionCollection;

	name?: string;
}

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
const getTapConfig = async (template: string) => {
	return (await import(pathToFileURL(resolve(__dirname, '..', 'templates', template, '.taprc.js')).toString())).default as ITapConfig;
};

/**
 * Walks through a template directory and creates a new directory with the same
 * structure.
 */
const createTemplateContents = async (template: string, name: string, responses: Answers) => {
	const templatePath = resolve(__dirname, '..', 'templates', template);
	const destinationPath = resolve(process.cwd(), name!);

	await copy(templatePath, destinationPath, {
		filter: (file: string): boolean => (!DENY_LIST.some((deny) => file.includes(deny)) ? true : false),
	});

	for await (const file of recursiveReaddir(destinationPath)) {
		if (!file.endsWith('.template')) continue;

		const content = await readFile(file, 'utf8');
		await writeFile(file.replace('.template', ''), render(content, responses));
		await rm(file);
	}
};

export { createDirectoryAndCheckForExistence, createTemplateContents, getTapConfig };
