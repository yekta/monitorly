import ChartLine from '@/components/monitor-card/chart-line';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function MonitorCard({
  title,
  isDown,
  data
}: {
  title: string;
  isDown: boolean;
  data: TDataPoint[];
}) {
  const reversedData = data.sort((a, b) => a.timestamp - b.timestamp);
  const cleanedData = reversedData.slice(
    reversedData.findIndex((dataPoint) => dataPoint.type !== 'no-data'),
    reversedData.length
  );
  const startTimestamp: number | undefined =
    cleanedData.length > 0 ? cleanedData[0].timestamp : undefined;
  const endTimestamp: number | undefined =
    cleanedData.length > 0 ? cleanedData[cleanedData.length - 1].timestamp : undefined;
  const durationInSeconds =
    startTimestamp && endTimestamp ? (endTimestamp - startTimestamp) / 1000 : undefined;
  const downtimeInSeconds = cleanedData.reduce(
    (acc, dataPoint) => acc + dataPoint.downtime_in_seconds,
    0
  );

  const monitorUptime = durationInSeconds ? durationInSeconds - downtimeInSeconds : undefined;
  const uptimePercent =
    monitorUptime && durationInSeconds ? (monitorUptime / durationInSeconds) * 100 : 0;

  return (
    <div data-is-down={isDown ? true : undefined} className="group flex w-full max-w-lg flex-col">
      <div className="flex w-full flex-wrap items-center justify-start gap-0.5">
        <div className="flex flex-1 items-center pr-4">
          {isDown ? (
            <XCircleIcon className="-ml-0.5 mr-1 size-5 shrink-0 text-fail" />
          ) : (
            <CheckCircleIcon className="-ml-0.5 mr-1 size-5 shrink-0 text-success" />
          )}
          <h2 className="flex-1 text-lg font-bold">{title}</h2>
        </div>
        <p className="rounded-md bg-success/15 px-1.5 py-0.75 text-center text-xs font-semibold text-success">
          {uptimePercent.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
          %
        </p>
      </div>
      <div className="-ml-px mt-2 flex w-[calc(100%+2px)]">
        {reversedData.map((dataPoint, index) => (
          <ChartLine
            key={`${dataPoint.id}-${index}`}
            data={dataPoint}
            index={index}
            isLast={index === data.length - 1 ? true : false}
            isFirst={index === 0 ? true : false}
          />
        ))}
      </div>
      <div className="mt-2 flex w-full items-center justify-between gap-4 text-xs text-foreground-muted">
        <p className="pr-4">30d ago</p>
        <p className="pl-4">Today</p>
      </div>
    </div>
  );
}

export type TDataPoint = {
  id: string;
  type: 'success' | 'fail' | 'no-data';
  timestamp: number;
  total_request_count: number;
  failed_request_count: number;
  downtime_in_seconds: number;
};
