import type { TDataPoint } from '@/lib/components/monitor-card/types';
import { monitors } from '@root/monitor.config';

export function load() {
	function generateData(): TDataPoint[] {
		const length = 30;
		return Array.from({ length: length }, (_, i) => {
			const isFail = Math.random() < 0.1;
			const checkPeriodInSeconds = 120;
			const dayInSeconds = 60 * 60 * 24;
			const totalRequestCount = Math.round(dayInSeconds / checkPeriodInSeconds);
			const failedRequestCount = Math.floor(Math.random() * 0.2 * totalRequestCount) + 1;
			const donwtimeInSeconds = failedRequestCount * checkPeriodInSeconds;

			return {
				id: i,
				type: isFail ? 'fail' : 'success',
				timestamp: Date.now() - (length - 1 - i) * 60 * 60 * 24 * 1000,
				total_request_count: totalRequestCount,
				failed_request_count: isFail ? failedRequestCount : 0,
				downtime_in_seconds: isFail ? donwtimeInSeconds : 0
			};
		});
	}

	const monitorsWithData = monitors.map((monitor) => ({
		title: monitor.title,
		id: monitor.id,
		data: generateData()
	}));

	return {
		monitors: monitorsWithData
	};
}
