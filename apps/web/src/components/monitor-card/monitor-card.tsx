import ChartLine from '@/components/monitor-card/chart-line';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function MonitorCard({ title, data }: { title: string; data: TDataPoint[] }) {
  const uptime = data.filter((dataPoint) => dataPoint.type === 'success').length / data.length;
  const uptimePercent = uptime * 100;

  const currentIsFail = data[data.length - 1]?.type === 'fail';

  return (
    <div
      data-current-is-fail={currentIsFail ? true : undefined}
      className="group flex w-full max-w-lg flex-col"
    >
      <div className="flex w-full flex-wrap items-center justify-start gap-0.5">
        <div className="flex flex-1 items-center pr-4">
          {currentIsFail ? (
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
        {data.map((dataPoint, index) => (
          <ChartLine
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
  id: number;
  type: 'success' | 'fail';
  timestamp: number;
  total_request_count: number;
  failed_request_count: number;
  downtime_in_seconds: number;
};
