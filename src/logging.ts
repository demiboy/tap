import { EOL } from 'node:os';

enum Icon {
	SUCCESS = '✔',
	FATAL = 'X',
	WARN = '⚠',
	INFO = 'ℹ️',
}

type ColourEscapeSequence = `\x1b[${number}m`;

const log = (icon: Icon, colour: ColourEscapeSequence, ...args: unknown[]) => {
	process.stdout.write(`${colour}\x1b[1m${icon} ${args.join(' ')}\x1b[0m${EOL}`);

	return {
		info,
		warn,
		fatal,
		success,
	};
};

const info = (...args: unknown[]) => log(Icon.INFO, '\x1b[34m', ...args);
const warn = (...args: unknown[]) => log(Icon.WARN, '\x1b[33m', ...args);
const fatal = (...args: unknown[]) => {
	log(Icon.FATAL, '\x1b[31m', ...args);
	process.exit(1);
};
const success = (...args: unknown[]) => log(Icon.SUCCESS, '\x1b[32m', ...args);

export { info, warn, fatal, success };
