'use client';

import { appLocale } from '@/lib/constants';
import { cn, timeAgo } from '@/lib/utils';
import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

export function LatestCheck({ latestDate, className }: { latestDate: Date; className?: string }) {
  const [now, setNow] = useState(new Date());
  useInterval(() => {
    setNow(new Date());
  }, 1000);
  return (
    <p className={cn('text-center text-sm text-foreground-muted', className)}>
      <span className="text-foreground-muted-more">Last check:</span>{' '}
      <span suppressHydrationWarning className="font-medium">
        {timeAgo({ date: latestDate, now, locale: appLocale })}
      </span>
    </p>
  );
}
