import MonitorCard, { TDataPoint } from '@/components/monitor-card/monitor-card';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { monitors } from '../../monitor.config';

export default function Home() {
  const monitorsWithData = monitors.map((monitor) => ({
    title: monitor.title,
    id: monitor.id,
    data: generateData()
  }));

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-start px-5 pb-24 pt-12">
      <div className="my-auto flex w-full flex-col items-center">
        <div className="flex w-full flex-col items-center">
          <CheckCircleIcon className="size-10 text-success" />
          <h1 className="mt-2 text-balance text-center text-2xl font-bold">
            All Systems Operational
          </h1>
        </div>
        <div className="mt-10 flex w-full max-w-3xl flex-col items-center justify-start gap-10">
          {monitorsWithData.map((monitor, index) => (
            <MonitorCard key={monitor.id} data={monitor.data} title={monitor.title} />
          ))}
        </div>
      </div>
    </main>
  );
}

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
