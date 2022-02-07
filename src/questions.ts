import type { Question } from 'inquirer';

import { readdirSync } from 'node:fs';
import { TEMPLATES_DIRECTORY } from './utilities';

export default <Question[]>[
	{
		name: 'template',
		type: 'list',
		message: 'Which template would you like to use?',
		choices: readdirSync(TEMPLATES_DIRECTORY),
		default: 'default',
	},
	{
		name: 'name',
		type: 'input',
		message: 'What is the name of your project?',
		validate: (input: string) => {
			// Check if  the input is kebab-case
			if (!/^[a-z0-9-]+$/.test(input)) return 'The name must be kebab-case.';
			return true;
		},
	},
];
