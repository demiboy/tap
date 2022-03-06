import { cp, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { getTemplates, configDir } from '../utils';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import mustache from 'mustache';
import prompts from 'prompts';

/**
 * .Taprc.js configuration
 */
interface ITapConfig {
	/**
	 * Questions to ask the user
	 * Result will be passed to the templates
	 */
	questions: prompts.PromptObject<string>[];
}

/**
 * Command to create a new project
 * @param name The name of the project
 */
export async function newProject(name: string) {
	const answer = await prompts([
		{
			name: 'name',
			initial: name ?? 'my-project',
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

	for await (const file of walk(answer.name)) {
		if (!file.endsWith('.template')) continue;

		await writeFile(file.replace('.template', ''), mustache.render(await readFile(file, 'utf-8'), data));
		await rm(file);
	}
}

/**
 * Gets the configuration file for a template
 * @param template The name of the template
 * @example
 * ```typescript
 * const config = await getTapConfig('my-template');
 * config; // { questions: [], ... }
 * ```
 *
 * @returns The configuration of the template
 */
async function getTapConfig(template: string): Promise<ITapConfig> {
	const module = await import(pathToFileURL(resolve(configDir, template, '.taprc.js')).toString());
	return module.default;
}

/**
 * Walks through a directory recursively
 * @param path The path to walk
 * @example
 * ```typescript
 * for await (const file of walk('/path/to/dir')) {
 * 	console.log(file);
 * }
 * ```
 *
 * @returns An iterator of files
 */
async function* walk(path: string): AsyncGenerator<string> {
	const dirents = await readdir(path, { withFileTypes: true });

	for (const dirent of dirents) {
		const resolved = resolve(path, dirent.name);
		dirent.isDirectory() ? yield* walk(resolved) : yield resolved;
	}
}
