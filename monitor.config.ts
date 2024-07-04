import type { TMonitor } from './monitor.types';

export const monitors: TMonitor[] = [
	{
		id: 'website',
		title: 'Website',
		functionToRun: async () => {
			return true;
		}
	},
	{
		id: 'api',
		title: 'API',
		functionToRun: async () => {
			return true;
		}
	},
	{
		id: 'docs',
		title: 'Docs',
		functionToRun: async () => {
			return true;
		}
	}
];
