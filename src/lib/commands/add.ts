import { execa } from 'execa';
import { ensureConfigDirExists, error, success, templateDir } from '../utils';

export async function add(repos: string[], { verbose }: { verbose: boolean }) {
    await ensureConfigDirExists();
	await Promise.all(repos.map((repo) => clone(repo, verbose)));
}

async function clone(url: string, verbose: boolean = false) {
	try {
		await execa('git', ['clone', url], {
			stdio: verbose ? 'inherit' : undefined,
			cwd: templateDir,
		});

		success(`Cloned ${url}`);
	} catch (err) {
		error(`Failed to clone ${url}`);
	}
}
