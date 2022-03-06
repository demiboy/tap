#! /usr/bin/env node

import { createColors } from 'colorette';
import { Command } from 'commander';
import { add } from './lib/commands';
import { getPackageJSONData } from './lib/utils';

createColors({ useColor: true });

const tap = new Command();
const { version, description } = await getPackageJSONData();

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

tap.parse(process.argv);
