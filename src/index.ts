#! /usr/bin/env node

import type { ListQuestion, Question } from 'inquirer';
import type { ITapConfig } from './interfaces';

import {
	createDirectoryAndCheckForExistence,
	createTemplateContents,
	doFirstTimeInstall,
	getTapConfig,
	TEMPLATES_DIRECTORY,
} from './utilities';
import { default as questions } from './questions';
import { commands } from './commands';
import { resolve } from 'node:path';
import { prompt } from 'inquirer';
import { fatal } from './logging';
import { readdirSync } from 'fs-extra';

(async () => {
	await doFirstTimeInstall();
	await doProcessArguments();
	
	doAssignTemplates();
	await doGenerateProject();
})().catch(fatal);

function doAssignTemplates() {
	(<ListQuestion>questions[0]).choices = readdirSync(TEMPLATES_DIRECTORY);	
} 

async function doGenerateProject() {
	let data = await prompt(questions);
	const config = await getTapConfig(data.template);

	data = { ...data, ...(await prompt(config.questions)) };

	await createDirectoryAndCheckForExistence(resolve('.', data.name));
	await createTemplateContents({
		template: data.template,
		name: data.name,
		responses: data,
	});
}

async function doProcessArguments() {
	const [command, ...args] = process.argv.slice(2);

	if (!command) return;
	if (!commands.has(command)) fatal(`Command ${command} not found`);

	commands.get(command)!.run(args, commands);
	process.exit(0);
}

export const doDefineConfiguration = (questions: Question[]): ITapConfig => ({
	questions,
});
