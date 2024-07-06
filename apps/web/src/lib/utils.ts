import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo({
  date,
  now = new Date(),
  locale
}: {
  date: Date;
  now?: Date;
  locale?: string;
}): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always', style: 'short' });
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const diff = Math.floor(seconds / interval.seconds);
    if (diff >= 1) {
      return rtf.format(-diff, interval.unit);
    }
  }

  return rtf.format(0, 'second');
}
