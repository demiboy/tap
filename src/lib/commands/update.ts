import { execa } from 'execa';
import { resolve } from 'node:path';
import { error, getTemplates, success, configDir } from '../utils';

export async function update(repos: string[], { verbose }: { verbose: boolean }) {
	if (repos[0] === 'all') repos = await getTemplates();
	await Promise.all(repos.map(pull(verbose, configDir)));
}

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
