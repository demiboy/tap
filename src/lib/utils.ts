import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { readFile, access, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { bold, greenBright, redBright } from 'colorette';

export const configDir = resolve(homedir(), '.config', 'tap');
export const templateDir = resolve(configDir, 'templates');

export async function getPackageJSONData(): Promise<Record<string, any>> {
	const file = await readFile(resolve(__dirname, '..', 'package.json'));
	return JSON.parse(file.toString());
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

export function error(message: string, exit?: boolean) {
	console.error(bold(redBright(`❌ ${message}`)));
	if (exit) process.exit(1);
}
