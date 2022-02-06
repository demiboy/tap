import type { ICommand } from './';

export default <ICommand>{
	help: 'install a tap template',
	example: {
		withoutArgs: 'install <template>',
		withArgs: 'install @pinkcig/tap-template-typescript',
	},
	run: async (args: string[], commands: Map<string, ICommand>) => {
		console.log('Placeholder');
	},
};
