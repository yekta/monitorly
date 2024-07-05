import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function MonitorCard({ title, data }: { title: string; data: TDataPoint[] }) {
  const uptime = data.filter((item) => item.type === 'success').length / data.length;
  const uptimePercent = uptime * 100;

  const currentIsFail = data[data.length - 1]?.type === 'fail';

  function getDay(timestamp: number) {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric' });
  }

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
        {data.map((item, index) => (
          <Tooltip key={item.id + index} delayDuration={50} disableHoverableContent={true}>
            <TooltipTrigger
              data-fail={item.type === 'fail' ? true : undefined}
              data-last={index === data.length - 1 ? true : undefined}
              data-first={index === 0 ? true : undefined}
              className="group/bar relative flex h-12 w-full cursor-default px-px hover:brightness-90 hover:saturate-150 focus-visible:outline-none focus-visible:brightness-110 focus-visible:saturate-150 dark:hover:brightness-110"
            >
              <div className="h-full w-full rounded-[1px] bg-success transition duration-100 group-hover/bar:scale-y-125 group-focus-visible/bar:scale-y-125 group-data-[first]/bar:rounded-l-lg group-data-[last]/bar:rounded-r-lg group-data-[fail]/bar:bg-fail"></div>
            </TooltipTrigger>
            <TooltipContent sideOffset={14} className="p-0" asChild>
              <div
                data-fail={item.type === 'fail' ? true : undefined}
                className="group flex flex-col"
              >
                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
                  <div className="flex items-center pr-6">
                    {item.type === 'fail' ? (
                      <XCircleIcon className="-ml-0.5 mr-1 size-5 shrink-0 text-fail" />
                    ) : (
                      <CheckCircleIcon className="-ml-0.5 mr-1 size-5 shrink-0 text-success" />
                    )}
                    <p className="min-w-0 flex-shrink overflow-hidden overflow-ellipsis font-semibold">
                      {item.type === 'success' ? 'Operational' : 'Downtime'}
                    </p>
                  </div>
                  <p className="text-sm text-foreground-muted">{getDay(item.timestamp)}</p>
                </div>
                {item.downtime_in_seconds > 0 && (
                  <div className="-mt-0.5 flex items-center justify-between gap-2 px-3.5 pb-3 text-sm">
                    <p className="text-foreground-muted">
                      <span className="font-semibold text-fail">
                        {Math.round(item.downtime_in_seconds / 60).toLocaleString()} minutes
                      </span>{' '}
                      of downtime
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 border-t border-background-secondary px-3.5 py-2.5 text-sm">
                  <p className="text-foreground-muted">
                    <span className="font-semibold text-success">
                      {(item.total_request_count - item.failed_request_count).toLocaleString()}
                    </span>{' '}
                    successful
                    <span className="px-[0.5ch] text-background-tertiary">•</span>{' '}
                    <span className="font-semibold text-fail">
                      {item.failed_request_count.toLocaleString()}
                    </span>{' '}
                    failed
                  </p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
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
