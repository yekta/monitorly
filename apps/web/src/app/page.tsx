import { LatestCheck } from '@/components/latest-check';
import MonitorCard from '@/components/monitor-card/monitor-card';
import { getMonitors } from '@/lib/queries';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data } = await getMonitors({ intervalDuration: 2, intervalUnit: 'hour', limit: 30 });
  const latestTimestamp = Math.max(...data.map((m) => m.latestTimestamp));
  const partialOutage = data.some((m) => m.isDown);
  const completeOutage = data.every((m) => m.isDown);
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-start px-5 pb-24 pt-12">
      <div className="my-auto flex w-full flex-col items-center">
        <div className="flex w-full flex-col items-center">
          {completeOutage ? (
            <XCircleIcon className="size-10 text-fail" />
          ) : partialOutage ? (
            <ExclamationTriangleIcon className="size-10 text-warning" />
          ) : (
            <CheckCircleIcon className="size-10 text-success" />
          )}
          <h1 className="mt-1.5 text-balance text-center text-2xl font-bold">
            {completeOutage
              ? 'Complete outage'
              : partialOutage
                ? 'Partial outage'
                : 'All systems operational'}
          </h1>
          <LatestCheck timestamp={latestTimestamp} className="mt-2.5" />
        </div>
        <div className="mt-6 flex w-full max-w-3xl flex-col items-center justify-start gap-6">
          {data.map((monitor) => (
            <MonitorCard
              isDown={monitor.isDown}
              key={monitor.id}
              data={monitor.data}
              title={monitor.title}
              latestTimestamp={monitor.latestTimestamp}
              earliestTimestamp={monitor.earliestTimestamp}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
