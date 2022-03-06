import { readdir } from 'node:fs/promises';
import { bold, greenBright, redBright } from 'colorette';
import { resolve } from 'node:path';
import { homedir } from 'node:os';

export const configDir = resolve(homedir(), '.config', 'tap', 'templates');

export async function getTemplates(): Promise<string[]> {
	return readdir(configDir);
}

export function success(message: string) {
	console.log(bold(greenBright(`✔ ${message}`)));
}

export function error(message: string) {
	console.error(bold(redBright(`x ${message}`)));
}
