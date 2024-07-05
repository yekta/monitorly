import { LatestCheck } from '@/components/latest-check';
import MonitorCard from '@/components/monitor-card/monitor-card';
import { getMonitors } from '@/lib/queries';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { headers } from 'next/headers';

export default async function Home() {
  headers();
  const { data } = await getMonitors();
  const latestDate = new Date(Math.max(...data.map((m) => m.latestTimestamp)));
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-start px-5 pb-24 pt-12">
      <div className="my-auto flex w-full flex-col items-center">
        <div className="flex w-full flex-col items-center">
          <CheckCircleIcon className="size-10 text-success" />
          <h1 className="mt-2 text-balance text-center text-2xl font-bold">
            All Systems Operationall
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
              latestTimestamp={monitor.latestTimestamp}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
