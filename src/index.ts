#! /usr/bin/env node

import type { ITapConfig } from './lib/typings';

import { getPackageJSONData } from './lib/utils';
import { add, newProject, update } from './lib/commands';
import { createColors } from 'colorette';
import { Command } from 'commander';

createColors({ useColor: true });

const { version, description } = await getPackageJSONData();

// prettier-ignore
new Command()
	.name('tap')
	.version(version)
	.description(description)
	.command('add')
		.description('add a new template')
		.alias('a')
		.argument('<repos...>', 'repositories to add')
		.option('-v, --verbose', 'verbose output')
		.action(add)
	.command('update')
		.description('update a template')
		.alias('u')
		.argument('[repos...]', "repositories to update or 'all'", ['all'])
		.option('-v, --verbose', 'verbose output')
		.action(update)
	.command('new')
		.description('create a new project')
		.alias('n')
		.action(newProject)
	.parse(process.argv);

export function defineConfiguration(config: ITapConfig): ITapConfig {
	return config;
}
