import { Dirent, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fatal, info } from './logging';

const DENY_LIST = ['node_modules', '.tap.json'];

/**
 * Creates a directory and if it exists, it errors.
 */
const createDirectoryAndCheckForExistence = (path: string): void => {
	if (existsSync(path)) {
		fatal(`Directory ${path} already exists`);
		process.exit(1);
	}

	mkdirSync(path);
};

/**
 * Walks through a template directory and creates a new directory with the same
 * structure.
 */
const createTemplateContents = (template: string, name: string): void => {
	const templatePath = resolve(__dirname, '..', 'templates', template);
	const destinationPath = resolve(process.cwd(), name);

	readdirSync(templatePath, { withFileTypes: true })
		.filter((file) => !DENY_LIST.some((deniedEntry) => file.name.endsWith(deniedEntry)))
		.forEach((dirent: Dirent): void => {
			const path = resolve(templatePath, dirent.name);

			if (dirent.isFile()) {
				const content = readFileSync(path, 'utf-8');
				const filePath = resolve(destinationPath, dirent.name);

				writeFileSync(filePath, content);
				info(`Created ${filePath}`);
			}

			if (dirent.isDirectory()) {
				const directoryPath = resolve(destinationPath, dirent.name);
				mkdirSync(directoryPath);
				createTemplateContents(path, directoryPath);

				info(`Created directory ${directoryPath}`);
			}

		});
};

export { createDirectoryAndCheckForExistence, createTemplateContents };
