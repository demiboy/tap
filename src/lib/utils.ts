import { readdir } from 'node:fs/promises';
import { bold, greenBright, redBright } from 'colorette';
import { resolve } from 'node:path';
import { homedir } from 'node:os';

/**
 * Directory for the templates
 * Respects the XDG Base Directory Specification
 */
export const configDir = resolve(homedir(), '.config', 'tap', 'templates');

/**
 * Gets the available templates
 * @example
 * ```typescript
 * const templates = await getTemplates();
 * templates; // ['my-template', 'my-other-template']
 * ```
 *
 * @returns The available templates
 */
export async function getTemplates(): Promise<string[]> {
	return readdir(configDir);
}

/**
 * Prints a success message
 * @param message The message to print
 */
export function success(message: string) {
	console.log(bold(greenBright(`✔ ${message}`)));
}

/**
 * Prints an error message
 * @param message The message to print
 */
export function error(message: string) {
	console.error(bold(redBright(`x ${message}`)));
}
