#! /usr/bin/env node

import type { QuestionCollection } from 'inquirer';

import { createDirectoryAndCheckForExistence, createTemplateContents, getTapConfig, ITapConfig } from './utilities';
import { default as questions } from './questions';
import { resolve } from 'node:path';
import { prompt } from 'inquirer';

interface IBaseAnswers {
	template: string;
	name: string;
}

prompt<IBaseAnswers>(questions).then(async ({ template, name }) => {
	const configQuestions = (await getTapConfig(template)).questions;

	prompt(configQuestions).then((responses) => {
		createDirectoryAndCheckForExistence(resolve('.', name));
		createTemplateContents(template, name, { ...responses, name });
	});
});

export const defineConfiguration = (questions: QuestionCollection): ITapConfig => ({
	questions,
});
