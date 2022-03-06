import { readFile, access, mkdir, readdir } from 'node:fs/promises';
import { bold, greenBright, redBright } from 'colorette';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';

export const configDir = resolve(homedir(), '.config', 'tap');
export const templateDir = resolve(configDir, 'templates');

export async function getPackageJSONData(): Promise<Record<string, any>> {
	const file = await readFile(resolve(__dirname, '..', 'package.json'));
	return JSON.parse(file.toString());
}

export async function getTemplates(): Promise<string[]> {
	return readdir(templateDir);
}

export async function ensureConfigDirExists() {
	try {
		await access(configDir, constants.F_OK);
	} catch (err) {
		await mkdir(templateDir, { recursive: true });
	}
}

export function success(message: string) {
	console.log(bold(greenBright(`✅ ${message}`)));
}

export function error(message: string) {
	console.error(bold(redBright(`❌ ${message}`)));
}
