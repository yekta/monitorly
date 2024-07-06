import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo({
  timestamp,
  now = Date.now(),
  locale
}: {
  timestamp: number;
  now?: number;
  locale?: string;
}): string {
  const seconds = Math.floor((now - timestamp) / 1000);

  const intervals: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 }
  ];

  let diff = 0;
  let unit: Intl.RelativeTimeFormatUnit = 'second';

  for (const interval of intervals) {
    const _diff = Math.floor(seconds / interval.seconds);
    if (_diff >= 1) {
      unit = interval.unit;
      diff = _diff;
      break;
    }
  }

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: diff === 0 && unit === 'second' ? 'auto' : 'always',
    style: 'short'
  });

  return rtf.format(-diff, unit);
}
