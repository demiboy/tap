import { default as install } from './install';
import { default as help } from './help';

type CommandMap = Map<string, ICommand>;

interface ICommand {
	name?: string;
	help: string;
	example: Record<'withoutArgs' | 'withArgs', string>;
	run: (args: string[], commands: CommandMap) => Promise<void>;
}

const commands: CommandMap = new Map([
	['install', install],
	['help', help],
]);

export { ICommand, commands, CommandMap };
