import { execa } from 'execa';
import { error, success, configDir } from '../utils';

/**
 * Command to add a new template
 * @param repos The repositories to add
 * @param verbose Whether to print verbose output
 */
export async function add(repos: string[], { verbose }: { verbose: boolean }) {
	await Promise.all(repos.map(clone(verbose, configDir)));
}

/**
 * Clone a template
 * @param verbose Whether to print verbose output
 * @param cwd The current working directory
 * @example
 * ```typescript
 * // Clones the template to /home/user/tap/pinkcig/tap and prints the output
 * await clone(true, '/home/user/tap')('https://github.com/pinkcig/tap');
 *
 * // Clones the template to /home/user/tap/pinkcig/tap and does not print the output
 * await clone(false, '/home/user/tap')('https://github.com/pinkcig/tap');
 * ```
 *
 * @returns Function to clone a template
 */
function clone(verbose: boolean = false, cwd: string) {
	return async function (url: string) {
		try {
			await execa('git', ['clone', url], {
				stdio: verbose ? 'inherit' : undefined,
				cwd,
			});

			success(`Cloned ${url}`);
		} catch (err) {
			error(`Failed to clone ${url}`);
		}
	};
}
