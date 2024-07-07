import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const statusChecks = pgTable(
  'status_checks',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    monitorId: text('monitor_id').notNull(),
    checkedAt: timestamp('checked_at').notNull().defaultNow(),
    isFail: boolean('is_fail').notNull().default(false),
    durationMs: integer('duration_ms').notNull()
  },
  (table) => {
    return {
      monitorIdCheckedAtIdx: index('idx_status_checks_monitor_id_checked_at').on(
        table.monitorId,
        table.checkedAt
      ),
      monitorIdIdx: index('idx_status_checks_monitor_id').on(table.monitorId),
      monitorIdCheckAtIsFailIdx: index('idx_status_checks_monitor_id_checked_at_is_fail').on(
        table.monitorId,
        table.checkedAt.desc(),
        table.isFail
      )
    };
  }
);
