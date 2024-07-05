export type TDataPoint = {
	id: number;
	type: 'success' | 'fail';
	timestamp: number;
	total_request_count: number;
	failed_request_count: number;
	downtime_in_seconds: number;
};
