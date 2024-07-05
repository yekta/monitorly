import { TDataPoint } from '@/components/monitor-card/monitor-card';
import { sql } from '@statusly/worker/db-web';
import { monitors } from '../../monitor.config';
import { db } from '@/lib/db';

type TMonitorWithData = {
  id: string;
  title: string;
  data: TDataPoint[];
  isDown: boolean;
};

type TDataPointFromDB = {
  monitor_id: string;
  interval: string;
  total_request_count: string;
  failed_request_count: string;
  downtime_seconds: string;
  is_down: string;
};

export async function getMonitors(): Promise<TMonitorWithData[]> {
  const res: TDataPointFromDB[] = await db.execute(sql`
WITH date_series AS (
    SELECT generate_series(
        DATE_TRUNC('hour', NOW() - INTERVAL '30 days'),
        NOW(),
        '30 minutes'::interval
    ) AS interval
),
monitor_date_combinations AS (
    SELECT
        m.monitor_id,
        d.interval
    FROM
        (SELECT DISTINCT monitor_id FROM status_checks) m
        CROSS JOIN date_series d
),
ranked_checks AS (
    SELECT
        id,
        monitor_id,
        checked_at AT TIME ZONE 'UTC' AS checked_at,
        is_fail,
        duration_ms,
        LAG(checked_at) OVER (PARTITION BY monitor_id ORDER BY checked_at) AS previous_checked_at,
        LAG(is_fail) OVER (PARTITION BY monitor_id ORDER BY checked_at) AS previous_is_fail,
        LEAD(checked_at) OVER (PARTITION BY monitor_id ORDER BY checked_at) AS next_checked_at
    FROM
        status_checks
    WHERE
        checked_at >= NOW() - INTERVAL '30 days'
),
interval_stats AS (
    SELECT
        monitor_id,
        DATE_TRUNC('hour', checked_at) + 
         (EXTRACT(MINUTE FROM checked_at)::int / 30 * INTERVAL '30 minutes') AS interval,
        COUNT(*) AS total_request_count,
        SUM(CASE WHEN is_fail THEN 1 ELSE 0 END) AS failed_request_count,
        SUM(CASE WHEN is_fail THEN 
            EXTRACT(EPOCH FROM (COALESCE(next_checked_at, NOW() AT TIME ZONE 'UTC') - checked_at))
        ELSE 0 END) AS downtime_seconds
    FROM
        ranked_checks
    GROUP BY
        monitor_id,
        DATE_TRUNC('hour', checked_at) + 
         (EXTRACT(MINUTE FROM checked_at)::int / 30 * INTERVAL '30 minutes')
),
latest_status AS (
    SELECT DISTINCT ON (monitor_id)
        monitor_id,
        is_fail AS is_down
    FROM
        ranked_checks
    ORDER BY
        monitor_id, checked_at DESC
),
combined_results AS (
    SELECT
        mdc.monitor_id,
        mdc.interval,
        COALESCE(ist.total_request_count, 0) AS total_request_count,
        COALESCE(ist.failed_request_count, 0) AS failed_request_count,
        COALESCE(ist.downtime_seconds, 0) AS downtime_seconds,
        COALESCE(ls.is_down, false) AS is_down
    FROM
        monitor_date_combinations mdc
        LEFT JOIN interval_stats ist ON mdc.monitor_id = ist.monitor_id AND mdc.interval = ist.interval
        LEFT JOIN latest_status ls ON mdc.monitor_id = ls.monitor_id
)
SELECT
    monitor_id,
    interval,
    total_request_count,
    failed_request_count,
    downtime_seconds,
    is_down
FROM (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY monitor_id ORDER BY interval DESC) AS rn
    FROM
        combined_results
) subquery
WHERE
    rn <= 30
ORDER BY
    monitor_id, interval DESC;
 `);

  const monitorsMap: Record<string, TDataPointFromDB[]> = {};

  res.forEach((row) => {
    const key = row.monitor_id;
    if (!(key in monitorsMap)) {
      monitorsMap[key] = [];
    }
    monitorsMap[key].push(row);
  });

  let monitorsWithData: TMonitorWithData[] = [];

  Object.entries(monitorsMap).forEach(([monitorId, data]) => {
    const monitor: TMonitorWithData = {
      id: monitorId,
      isDown: data.some((row) => row.is_down),
      title: monitors.find((m) => m.id === monitorId)?.title || 'Unknown Monitor',
      data: data.map((row) => {
        const total_request_count = parseInt(row.total_request_count);
        return {
          id: `${row.monitor_id}-${row.interval}`,
          type:
            total_request_count === 0
              ? 'no-data'
              : row.failed_request_count === '0'
                ? 'success'
                : 'fail',
          timestamp: new Date(row.interval).getTime(),
          total_request_count: total_request_count,
          failed_request_count: parseInt(row.failed_request_count),
          downtime_in_seconds: parseInt(row.downtime_seconds)
        };
      })
    };
    monitorsWithData.push(monitor);
  });

  return monitorsWithData;
}
