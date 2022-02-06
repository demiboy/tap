import type { CommandMap, ICommand } from './';

import { fatal, EscapeSequences } from '../logging';

export default <ICommand>{
	help: 'get help about tap',
	example: {
		withoutArgs: 'help <command>',
		withArgs: 'help install',
	},
	run: async ([name]: string[], commands: CommandMap) => {
		if (name) {
			const command = commands.get(name)!;
			if (!command) fatal(`Command ${name} not found`);

			console.log(
				[
					`${namespace(name, true)}:`,
					`${bar()}${command.help}`,
					'',
					`${namespace('example', true)}:`,
					`${bar()}${args(command.example.withoutArgs)}`,
					`${bar()}${args(command.example.withArgs)}`,
				].join('\n')
			);
			return;
		}

		console.log(
			[
				`${namespace('usage', true)}: ${namespace('tap')} <command> [<args>]`,
				`${namespace('commands', true)}:`,
				...[...commands.entries()].map(([name, command]) => `${bar()}${namespace(name)}: ${command.help}`),
				'',
				`${namespace('for more information about a command, run', true)}:`,
				`${bar()}${namespace('tap')} ${namespace('help')} <command>`,
			].join('\n')
		);
	},
};

const namespace = (namespace: string, underline = false) =>
	`${EscapeSequences.FG_MAGENTA}${underline ? EscapeSequences.UNDERLINE : ''}${EscapeSequences.BOLD}${namespace}${
		EscapeSequences.RESET
	}`;
const args = (args: string) =>
	args
		.split(' ')
		.map((string, index) => (index === 0 ? namespace(string) : string))
		.join(' ');
const bar = () => `${EscapeSequences.FG_MAGENTA}   | ${EscapeSequences.RESET}`;
