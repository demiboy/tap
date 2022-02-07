import type { ICommand } from './';

import { execSync } from 'child_process';
import { home } from '../utilities';
import { success, warn } from '../logging';

export default <ICommand>{
	help: 'install a tap template',
	example: {
		withoutArgs: 'install <user>/<repo>',
		withArgs: 'install demiboy/gba',
	},
	run: async (repos: string[]) => {
		const invalid = [];

		for (const repo of repos) {
			if (!isValidRepo(repo)) {
				invalid.push(repo);
				continue;
			}

			const [user, repoName] = repo.split('/');
			execSync(
				`git clone --quiet git@github.com:${user}/${repoName}.git ${home(
					'~/.config/tap/templates/' + repoName
				)}`
			);

			success(`Installed ${repo} to ~/.config/tap/templates/${repoName}`);
		}

		if (invalid.length) warn(`Skipped because invalid: ${invalid.join(', ')}`);
	},
};

const isValidRepo = (repo: string) => {
	if (!~repo.indexOf('/') || repo.split('/').length > 2) return false;
	return true;
};
