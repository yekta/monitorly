import ChartLine from '@/components/monitor-card/chart-line';
import { appLocale } from '@/lib/constants';
import { timeAgo } from '@/lib/utils';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function MonitorCard({
  title,
  isDown,
  data,
  latestTimestamp,
  earliestTimestamp
}: {
  title: string;
  isDown: boolean;
  data: TDataPoint[];
  latestTimestamp: number;
  earliestTimestamp: number;
}) {
  const reversedData = [...data].reverse();
  const cleanedData = reversedData.slice(
    reversedData.findIndex((dataPoint) => dataPoint.total_request_count > 0),
    reversedData.length
  );
  const startTimestamp: number | undefined =
    cleanedData.length > 0 ? cleanedData[0].timestamp : undefined;
  const durationInSeconds =
    startTimestamp && latestTimestamp ? (latestTimestamp - startTimestamp) / 1000 : undefined;
  const downtimeInSeconds = cleanedData.reduce(
    (acc, dataPoint) => acc + dataPoint.downtime_in_seconds,
    0
  );

  const monitorUptime = durationInSeconds ? durationInSeconds - downtimeInSeconds : undefined;
  const uptimePercent =
    monitorUptime && durationInSeconds ? (monitorUptime / durationInSeconds) * 100 : 0;

  const intervalInSeconds =
    data.length > 1 ? Math.round((data[0].timestamp - data[1].timestamp) / 1000) : undefined;

  return (
    <div data-is-down={isDown ? true : undefined} className="group flex w-full max-w-lg flex-col">
      <div className="flex w-full items-end justify-start gap-0.5">
        <div className="flex flex-1 items-center pr-6 min-w-0 overflow-hidden">
          {isDown ? (
            <XCircleIcon className="-ml-0.25 mr-1.5 size-5 shrink-0 text-fail" />
          ) : (
            <CheckCircleIcon className="-ml-0.25 mr-1.5 size-5 shrink-0 text-success" />
          )}
          <h2 className="shrink text-lg font-bold overflow-hidden overflow-ellipsis whitespace-nowrap">
            {title}
          </h2>
        </div>
        <p className="text-center text-xs text-foreground-muted pb-0.5">
          {uptimePercent.toLocaleString(appLocale, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
          %
        </p>
      </div>
      <div className="-ml-px mt-1.5 flex w-[calc(100%+2px)]">
        {reversedData.map((dataPoint, index) => (
          <ChartLine
            key={`${dataPoint.id}-${index}`}
            data={dataPoint}
            index={index}
            intervalInSeconds={intervalInSeconds}
            isLast={index === data.length - 1 ? true : false}
            isFirst={index === 0 ? true : false}
          />
        ))}
      </div>
      <div className="mt-2 flex w-full items-center justify-between gap-2 text-xs text-foreground-muted">
        <p className="pr-3 shrink overflow-hidden overflow-ellipsis whitespace-nowrap">
          {timeAgo({ timestamp: earliestTimestamp, locale: appLocale })}
        </p>
        <p className="pl-3 shrink overflow-hidden overflow-ellipsis whitespace-nowrap">
          {timeAgo({ timestamp: Date.now(), locale: appLocale })}
        </p>
      </div>
    </div>
  );
}

export type TDataPoint = {
  id: string;
  timestamp: number;
  total_request_count: number;
  failed_request_count: number;
  downtime_in_seconds: number;
};
