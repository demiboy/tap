import type { ITapConfig } from '../typings';

import { cp, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { getTemplates, configDir } from '../utils';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
// Not destructured as ESM issues and bla bla bla
import mustache from 'mustache';
import prompts from 'prompts';

export async function newProject() {
	const answer = await prompts([
		{
			name: 'name',
			initial: 'my-project',
			type: 'text',
			message: "What's your project's name?",
		},
		{
			name: 'template',
			type: 'select',
			message: 'What template do you want to use?',
			choices: (await getTemplates()).map((name) => ({ title: name, value: name })),
		},
	]);

	const config = await getTapConfig(answer.template);

	await cp(resolve(configDir, answer.template), resolve(answer.name), {
		recursive: true,
		filter: (dest) => !['.git', 'node_modules', '.taprc.js'].some((name) => dest.endsWith(name)),
	});

	const data: Record<string, unknown> = { ...answer, ...(await prompts(config.questions)) };

	for await (const file of trasverse(answer.name)) {
		if (!file.endsWith('.template')) continue;

		await writeFile(file.replace('.template', ''), mustache.render(await readFile(file, 'utf-8'), data));
		await rm(file);
	}
}

async function getTapConfig(template: string): Promise<ITapConfig> {
	const module = await import(pathToFileURL(resolve(configDir, template, '.taprc.js')).toString());
	return module.default;
}

async function* trasverse(path: string): AsyncGenerator<string> {
	const dirents = await readdir(path, { withFileTypes: true });

	for (const dirent of dirents) {
		const resolved = resolve(path, dirent.name);
		dirent.isDirectory() ? yield* trasverse(resolved) : yield resolved;
	}
}
