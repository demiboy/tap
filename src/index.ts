#! /usr/bin/env node

import type { ITapConfig } from './lib/typings';

import { access, mkdir, readFile } from 'node:fs/promises';
import { add, newProject, update } from './lib/commands';
import { createColors } from 'colorette';
import { configDir } from './lib/utils';
import { Command } from 'commander';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

createColors({ useColor: true });

try {
	await access(configDir, constants.F_OK);
} catch (err) {
	await mkdir(configDir, { recursive: true });
}

const tap = new Command();
const { version, description } = JSON.parse(await readFile(resolve(__dirname, '..', 'package.json'), 'utf-8'));

tap //
	.name('tap')
	.version(version)
	.description(description);

tap
	.command('add')
	.description('add a new template')
	.alias('a')
	.argument('<repos...>', 'repositories to add')
	.option('-v, --verbose', 'verbose output')
	.action(add);

tap
	.command('update')
	.description('update a template')
	.alias('u')
	.argument('[repos...]', "repositories to update or 'all'", ['all'])
	.option('-v, --verbose', 'verbose output')
	.action(update);

tap //
	.command('new')
	.description('create a new project')
	.alias('n')
	.action(newProject);

tap.parse(process.argv);

export function defineConfiguration(config: ITapConfig): ITapConfig {
	return config;
}
