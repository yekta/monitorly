import { TDataPoint } from '@/components/monitor-card/monitor-card';
import { db } from '@/lib/db';
import { sql } from '@repo/server/db/utils';
import { monitors } from '../../monitor.config';

type TMonitorWithData = {
  id: string;
  title: string;
  data: TDataPoint[];
  latestTimestamp: number;
  earliestTimestamp: number;
  isDown: boolean;
};

type TDataPointFromDB = {
  monitor_id: string;
  interval: string;
  total_request_count: string;
  failed_request_count: string;
  downtime_seconds: string;
  is_down: string;
  latest_timestamp: string;
};

export async function getMonitors({
  intervalDuration,
  intervalUnit,
  limit
}: {
  intervalDuration: number;
  intervalUnit: 'hour' | 'day';
  limit: number;
}): Promise<{
  data: TMonitorWithData[];
}> {
  const start = Date.now();

  const interval = `${Math.round(intervalDuration)} ${intervalUnit}`;
  const dateRange = `${limit * intervalDuration} ${intervalUnit}`;
  const res: TDataPointFromDB[] = await db.execute(sql`
    WITH params AS (
        SELECT 
            ${interval}::interval AS interval_duration,
            ${dateRange}::interval AS date_range
    ),
    date_series_days AS (
        SELECT 
            generate_series(
                DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC' - (SELECT date_range FROM params)),
                DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC'),
                '1 day'::interval
            ) AT TIME ZONE 'UTC' AS interval
        WHERE (SELECT interval_duration FROM params) >= INTERVAL '1 day'
    ),
    date_series_hours AS (
        SELECT 
            generate_series(
                DATE_TRUNC('hour', NOW() AT TIME ZONE 'UTC' - (SELECT date_range FROM params)),
                NOW() AT TIME ZONE 'UTC',
                (SELECT interval_duration FROM params)
            ) AT TIME ZONE 'UTC' AS interval
        WHERE (SELECT interval_duration FROM params) < INTERVAL '1 day'
    ),
    date_series AS (
        SELECT interval FROM date_series_days
        UNION ALL
        SELECT interval FROM date_series_hours
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
            LAG(checked_at AT TIME ZONE 'UTC') OVER (PARTITION BY monitor_id ORDER BY checked_at) AS previous_checked_at,
            LAG(is_fail) OVER (PARTITION BY monitor_id ORDER BY checked_at) AS previous_is_fail,
            LEAD(checked_at AT TIME ZONE 'UTC') OVER (PARTITION BY monitor_id ORDER BY checked_at) AS next_checked_at
        FROM
            status_checks
        WHERE
            checked_at >= CASE 
                WHEN (SELECT interval_duration FROM params) >= INTERVAL '1 day' THEN
                    DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC' - (SELECT date_range FROM params))
                ELSE
                    DATE_TRUNC('hour', NOW() AT TIME ZONE 'UTC' - (SELECT date_range FROM params))
            END
    ),
    state_changes AS (
        SELECT
            monitor_id,
            checked_at AS change_time,
            is_fail AS new_state,
            previous_is_fail AS old_state,
            COALESCE(
                LEAD(checked_at) OVER (PARTITION BY monitor_id ORDER BY checked_at),
                NOW() AT TIME ZONE 'UTC'
            ) AS next_change_time
        FROM ranked_checks
        WHERE is_fail != COALESCE(previous_is_fail, NOT is_fail)
        OR previous_checked_at IS NULL
    ),
    interval_downtime AS (
        SELECT
            mdc.monitor_id,
            mdc.interval,
            SUM(
                CASE
                    WHEN sc.new_state = TRUE THEN
                        LEAST(
                            EXTRACT(EPOCH FROM (
                                LEAST(sc.next_change_time, mdc.interval + (SELECT interval_duration FROM params)) -
                                GREATEST(sc.change_time, mdc.interval)
                            )),
                            EXTRACT(EPOCH FROM (SELECT interval_duration FROM params))
                        )
                    ELSE 0
                END
            ) AS downtime_seconds
        FROM
            monitor_date_combinations mdc
        LEFT JOIN state_changes sc ON 
            mdc.monitor_id = sc.monitor_id AND
            sc.change_time < mdc.interval + (SELECT interval_duration FROM params) AND
            sc.next_change_time > mdc.interval
        GROUP BY
            mdc.monitor_id, mdc.interval
    ),
    interval_stats AS (
        SELECT
            mdc.monitor_id,
            mdc.interval,
            COUNT(rc.id) AS total_request_count,
            SUM(CASE WHEN rc.is_fail THEN 1 ELSE 0 END) AS failed_request_count
        FROM
            monitor_date_combinations mdc
        LEFT JOIN ranked_checks rc ON 
            rc.monitor_id = mdc.monitor_id AND
            rc.checked_at >= mdc.interval AND
            rc.checked_at < mdc.interval + (SELECT interval_duration FROM params)
        GROUP BY
            mdc.monitor_id, mdc.interval
    ),
    latest_status AS (
        SELECT DISTINCT ON (monitor_id)
            monitor_id,
            is_fail AS is_down,
            checked_at AS latest_timestamp
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
            GREATEST(COALESCE(ist.failed_request_count, 0), CASE WHEN id.downtime_seconds > 0 THEN 1 ELSE 0 END) AS failed_request_count,
            COALESCE(id.downtime_seconds, 0) AS downtime_seconds,
            COALESCE(ls.is_down, false) AS is_down,
            ls.latest_timestamp
        FROM
            monitor_date_combinations mdc
            LEFT JOIN interval_stats ist ON mdc.monitor_id = ist.monitor_id AND mdc.interval = ist.interval
            LEFT JOIN interval_downtime id ON mdc.monitor_id = id.monitor_id AND mdc.interval = id.interval
            LEFT JOIN latest_status ls ON mdc.monitor_id = ls.monitor_id
    )
    SELECT
        monitor_id,
        interval,
        total_request_count,
        failed_request_count,
        downtime_seconds,
        is_down,
        latest_timestamp
    FROM
        combined_results
    WHERE
        interval >= CASE 
            WHEN (SELECT interval_duration FROM params) >= INTERVAL '1 day' THEN
                DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC' - (SELECT date_range FROM params))
            ELSE
                DATE_TRUNC('hour', NOW() AT TIME ZONE 'UTC' - (SELECT date_range FROM params))
        END
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

  Object.entries(monitorsMap).forEach(([monitorId, monitorData]) => {
    const monitor: TMonitorWithData = {
      id: monitorId,
      isDown: monitorData.some((row) => row.is_down),
      title: monitors.find((m) => m.id === monitorId)?.title || 'Unknown Monitor',
      latestTimestamp: new Date(monitorData[0].latest_timestamp).getTime(),
      earliestTimestamp: new Date(monitorData[monitorData.length - 1].interval).getTime(),
      data: monitorData.map((row) => {
        const total_request_count = parseInt(row.total_request_count);
        return {
          id: `${row.monitor_id}-${row.interval}`,
          timestamp: new Date(row.interval).getTime(),
          total_request_count: total_request_count,
          failed_request_count: parseInt(row.failed_request_count),
          downtime_in_seconds: parseInt(row.downtime_seconds)
        };
      })
    };
    monitorsWithData.push(monitor);
  });

  console.log(`getMonitors() -> ${Date.now() - start} ms`);

  return {
    data: monitorsWithData
  };
}
