import { LatestCheck } from '@/components/latest-check';
import MonitorCard from '@/components/monitor-card/monitor-card';
import { getMonitors } from '@/lib/queries';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export const revalidate = 60;

export default async function Home() {
  const renderTime = new Date().toISOString();
  const { data } = await getMonitors();
  const latestDate = new Date(Math.max(...data.map((m) => m.latestTimestamp)));
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-start px-5 pb-24 pt-12">
      <p className="absolute left-4 top-3 text-xs text-foreground-muted">{renderTime}</p>
      <div className="my-auto flex w-full flex-col items-center">
        <div className="flex w-full flex-col items-center">
          <CheckCircleIcon className="size-10 text-success" />
          <h1 className="mt-2 text-balance text-center text-2xl font-bold">
            All Systems Operational
          </h1>
          <LatestCheck latestDate={latestDate} className="mt-2" />
        </div>
        <div className="mt-10 flex w-full max-w-3xl flex-col items-center justify-start gap-10">
          {data.map((monitor) => (
            <MonitorCard
              isDown={monitor.isDown}
              key={monitor.id}
              data={monitor.data}
              title={monitor.title}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
