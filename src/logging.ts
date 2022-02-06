import { EOL } from 'node:os';

enum Icon {
	SUCCESS = '✔',
	FATAL = 'X',
	WARN = '⚠',
	INFO = 'ℹ️',
}

enum EscapeSequences {
	RESET = '\x1b[0m',
	BOLD = '\x1b[1m',
	UNDERLINE = '\x1b[4m',

	FG_RED = '\x1b[31m',
	FG_GREEN = '\x1b[32m',
	FG_YELLOW = '\x1b[33m',
	FG_BLUE = '\x1b[34m',
	FG_MAGENTA = '\x1b[35m',
}

const log = (icon: Icon, colour: EscapeSequences, ...args: unknown[]) => {
	process.stdout.write(`${colour}${EscapeSequences.BOLD}${icon} ${args.join(' ')}${EscapeSequences.RESET}${EOL}`);

	return {
		info,
		warn,
		fatal,
		success,
	};
};

const info = (...args: unknown[]) => log(Icon.INFO, EscapeSequences.FG_BLUE, ...args);
const warn = (...args: unknown[]) => log(Icon.WARN, EscapeSequences.FG_YELLOW, ...args);
const fatal = (...args: unknown[]) => {
	log(Icon.FATAL, EscapeSequences.FG_RED, ...args);
	process.exit(1);
};
const success = (...args: unknown[]) => log(Icon.SUCCESS, EscapeSequences.FG_GREEN, ...args);

export { info, warn, fatal, success, EscapeSequences };
