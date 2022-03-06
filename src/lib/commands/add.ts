import { execa } from 'execa';
import { error, success, configDir } from '../utils';

export async function add(repos: string[], { verbose }: { verbose: boolean }) {
	await Promise.all(repos.map(clone(verbose, configDir)));
}

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
