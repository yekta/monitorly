'use client';

import { TDataPoint } from '@/components/monitor-card/monitor-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function ChartLine({
  data,
  index,
  isFirst,
  isLast,
  intervalInSeconds
}: {
  data: TDataPoint;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  intervalInSeconds: number | undefined;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip
      open={open}
      onOpenChange={setOpen}
      key={data.id + index}
      delayDuration={50}
      disableHoverableContent={true}
    >
      <TooltipTrigger
        onFocus={() => setOpen(true)}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        data-fail={data.type === 'fail' ? true : undefined}
        data-no-data={data.type === 'no-data' ? true : undefined}
        data-last={isLast ? true : undefined}
        data-first={isFirst ? true : undefined}
        className="group/bar relative flex h-12 w-full cursor-default px-px hover:brightness-90 hover:saturate-150 focus-visible:outline-none focus-visible:brightness-110 focus-visible:saturate-150 dark:hover:brightness-110"
      >
        <div className="h-full w-full rounded-[1px] group-data-[fail]/bar:bg-fail group-data-[no-data]/bar:bg-background-secondary bg-success transition duration-100 group-hover/bar:scale-y-125 group-focus-visible/bar:scale-y-125 group-data-[first]/bar:rounded-l-lg group-data-[last]/bar:rounded-r-lg"></div>
      </TooltipTrigger>
      <TooltipContent collisionPadding={16} sideOffset={14} className="p-0" asChild>
        <div data-fail={data.type === 'fail' ? true : undefined} className="group flex flex-col">
          <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
            <div className="flex items-center pr-6">
              {data.type === 'fail' && (
                <XCircleIcon className="-ml-0.5 mr-1 size-5 shrink-0 text-fail" />
              )}
              {data.type === 'success' && (
                <CheckCircleIcon className="-ml-0.5 mr-1 size-5 shrink-0 text-success" />
              )}
              <p className="min-w-0 flex-shrink overflow-hidden overflow-ellipsis font-semibold">
                {data.type === 'no-data'
                  ? 'No data'
                  : data.type === 'success'
                    ? 'Operational'
                    : 'Downtime'}
              </p>
            </div>
            <p className="text-sm text-foreground-muted">
              {getDateString(data.timestamp, intervalInSeconds)}
            </p>
          </div>
          {data.downtime_in_seconds > 0 && (
            <div className="flex items-center justify-between gap-2 px-3.5 pb-3 text-sm">
              <p className="text-foreground-muted">
                <span className="font-semibold text-fail">
                  {getDowntimeStr(data.downtime_in_seconds)}
                </span>{' '}
                of downtime
              </p>
            </div>
          )}
          {data.type !== 'no-data' && (
            <div className="flex items-center justify-between gap-2 border-t border-background-secondary px-3.5 py-2.5 text-sm">
              <p className="text-foreground-muted">
                <span className="font-semibold text-success">
                  {(data.total_request_count - data.failed_request_count).toLocaleString()}
                </span>{' '}
                successful
                <span className="px-[1ch] text-background-tertiary">•</span>
                <span className="font-semibold text-fail">
                  {data.failed_request_count.toLocaleString()}
                </span>{' '}
                failed
              </p>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function getDateString(timestamp: number, intervalInSeconds: number | undefined) {
  const date = new Date(timestamp);
  if (!intervalInSeconds)
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour12: false });
  if (intervalInSeconds >= 86400) {
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour12: false });
  }

  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });
}

function getDowntimeStr(downtimeInSeconds: number) {
  const intervals = [
    { label: 'days', seconds: 86400, maxFractionDigits: 1 },
    { label: 'hrs.', seconds: 3600, maxFractionDigits: 1 },
    { label: 'min.', seconds: 60, maxFractionDigits: 0 },
    { label: 'sec.', seconds: 1, maxFractionDigits: 0 }
  ];
  for (const interval of intervals) {
    const diff = downtimeInSeconds / interval.seconds;
    const diffRounded = Math.floor(diff);
    if (diffRounded >= 1) {
      return `${diff.toLocaleString(undefined, {
        maximumFractionDigits: interval.maxFractionDigits
      })} ${interval.label}`;
    }
  }
}
