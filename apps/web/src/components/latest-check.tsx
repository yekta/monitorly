'use client';

import { appLocale } from '@/lib/constants';
import { cn, timeAgo } from '@/lib/utils';
import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

export function LatestCheck({ timestamp, className }: { timestamp: number; className?: string }) {
  const [now, setNow] = useState(Date.now());
  useInterval(() => {
    setNow(Date.now());
  }, 1000);

  console.log('timestamp', timestamp);
  console.log('now', now);
  return (
    <p className={cn('text-center text-sm text-foreground-muted', className)}>
      <span className="text-foreground-muted-more">Last check:</span>{' '}
      <span suppressHydrationWarning className="font-medium">
        {timeAgo({ timestamp, now, locale: appLocale })}
      </span>
    </p>
  );
}
