import type { Question, Answers } from 'inquirer';

interface ITapConfig {
	questions: Question[];

	name?: string;
}

interface ICreateTemplateContentOptions {
	template: string;
	name: string;
	responses: Answers;
}

export { ITapConfig, ICreateTemplateContentOptions };
