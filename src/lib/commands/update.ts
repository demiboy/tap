import { execa } from 'execa';
import { resolve } from 'node:path';
import { error, getTemplates, success, configDir } from '../utils';

/**
 * Command to update a template
 * @param repos The repositories to add
 */
export async function update(repos: string[], { verbose }: { verbose: boolean }) {
	if (repos[0] === 'all') repos = await getTemplates();
	await Promise.all(repos.map(pull(verbose, configDir)));
}

/**
 * Pulls new changes to a template
 *
 * @param verbose Whether to print verbose output
 * @param cwd The current working directory
 * @example
 * ```typescript
 * // Pulls the template to /home/user/tap/pinkcig/tap and prints the output
 * await pull(true, '/home/user/tap')('gba');
 *
 * // Pulls the template to /home/user/tap/pinkcig/tap and does not print the output
 * await pull(false, '/home/user/tap')('gba');
 */
function pull(verbose: boolean, cwd: string) {
	return async function (name: string) {
		try {
			await execa('git', ['pull'], {
				stdio: verbose ? 'inherit' : undefined,
				cwd: resolve(cwd, name),
			});

			success(`Updated ${name}`);
		} catch (err) {
			error(`Failed to update ${name}`);
		}
	};
}
