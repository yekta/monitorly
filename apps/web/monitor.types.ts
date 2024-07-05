export type TMonitor = {
	id: string;
	title: string;
	functionToRun: () => Promise<boolean>;
};

export type TPageConfig = {
	title: string;
};
