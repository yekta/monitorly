'use client';

import { TDataPoint } from '@/components/monitor-card/monitor-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ExclamationTriangleIcon, HandThumbUpIcon, NoSymbolIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { appLocale } from '@/lib/constants';
import { timeAgo } from '@/lib/utils';

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

  const isFail = data.failed_request_count > 0;
  const isSuccess = data.total_request_count > 0 && data.failed_request_count === 0;
  const hasNoData = data.total_request_count === 0;

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
        data-fail={isFail === true ? true : undefined}
        data-no-data={hasNoData ? true : undefined}
        data-last={isLast ? true : undefined}
        data-first={isFirst ? true : undefined}
        className="group/bar relative flex h-12 w-full cursor-default px-px hover:brightness-90 hover:saturate-150 focus-visible:outline-none focus-visible:brightness-110 focus-visible:saturate-150 dark:hover:brightness-110"
      >
        <div className="h-full w-full rounded-[1px] group-data-[fail]/bar:bg-fail group-data-[no-data]/bar:bg-background-secondary bg-success transition duration-100 group-hover/bar:scale-y-125 group-focus-visible/bar:scale-y-125 group-data-[first]/bar:rounded-l-lg group-data-[last]/bar:rounded-r-lg"></div>
      </TooltipTrigger>
      <TooltipContent collisionPadding={16} sideOffset={12} className="p-0" asChild>
        <div data-fail={isFail ? true : undefined} className="group flex flex-col">
          <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
            <div className="flex items-center pr-6">
              {isFail && (
                <ExclamationTriangleIcon className="-ml-0.5 mr-1.5 size-5 shrink-0 text-fail" />
              )}
              {isSuccess && (
                <HandThumbUpIcon className="-ml-0.5 mr-1.5 size-5 shrink-0 text-success" />
              )}
              {hasNoData && (
                <NoSymbolIcon className="-ml-0.5 mr-1.5 size-5 shrink-0 text-foreground" />
              )}
              <p className="min-w-0 flex-shrink overflow-hidden overflow-ellipsis font-semibold">
                {hasNoData ? 'No data' : isSuccess ? 'No incidents' : 'Incident'}
              </p>
            </div>
            <p className="text-sm text-foreground-muted">{data.timestamp}</p>
          </div>
          {data.downtime_in_seconds > 0 && (
            <div className="flex items-center justify-between gap-2 px-3.5 pb-3 text-sm">
              <p className="text-foreground-muted">
                <span className="font-semibold text-fail">
                  {getDowntimeStr({
                    downtimeInSeconds: data.downtime_in_seconds,
                    locale: appLocale
                  })}
                </span>{' '}
                of downtime
              </p>
            </div>
          )}
          {!hasNoData && (
            <div className="flex items-center justify-between gap-2 border-t border-background-secondary px-3.5 py-2.5 text-sm">
              <p className="text-foreground-muted">
                <span
                  data-has-success={
                    data.total_request_count - data.failed_request_count > 0 ? true : undefined
                  }
                  className="data-[has-success]:font-semibold data-[has-success]:text-success"
                >
                  {(data.total_request_count - data.failed_request_count).toLocaleString(appLocale)}
                </span>{' '}
                successful
                <span className="px-[1ch] text-background-tertiary">•</span>
                <span
                  data-has-fail={data.failed_request_count > 0 ? true : undefined}
                  className="data-[has-fail]:font-semibold data-[has-fail]:text-fail"
                >
                  {data.failed_request_count.toLocaleString(appLocale)}
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

function getDateString({
  timestamp,
  intervalInSeconds,
  locale
}: {
  timestamp: number;
  intervalInSeconds: number | undefined;
  locale?: string;
}) {
  const date = new Date(timestamp);
  const timeZone = 'UTC';
  if (!intervalInSeconds)
    return date.toLocaleString(locale, { month: 'short', day: 'numeric', hour12: false, timeZone });
  if (intervalInSeconds >= 86400) {
    return date.toLocaleString(locale, { month: 'short', day: 'numeric', hour12: false, timeZone });
  }

  return date.toLocaleString(locale, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone
  });
}

function getDowntimeStr({
  downtimeInSeconds,
  locale
}: {
  downtimeInSeconds: number;
  locale?: string;
}) {
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
      return `${diff.toLocaleString(locale, {
        maximumFractionDigits: interval.maxFractionDigits
      })} ${interval.label}`;
    }
  }
}
