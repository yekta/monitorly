import { pgTable, uuid, date, boolean, integer } from 'drizzle-orm/pg-core';

export const statusChecks = pgTable('status_checks', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  monitorId: uuid('monitor_id').notNull(),
  checkedAt: date('checked_at').notNull().defaultNow(),
  isSuccess: boolean('is_success').notNull().default(true),
  durationMs: integer('duration_ms').notNull()
});
