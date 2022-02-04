#! /usr/bin/env node

import { prompt } from 'inquirer';
import { resolve } from 'node:path';
import { createDirectoryAndCheckForExistence, createTemplateContents } from './utilities';
import { default as questions } from './questions';

interface IAnswers {
	template: string;
	name: string;
}

prompt<IAnswers>(questions).then(({ template, name }) => {
	createDirectoryAndCheckForExistence(resolve('.', name));
	createTemplateContents(template, name);
});
