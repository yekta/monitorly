import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const statusChecks = pgTable('status_checks', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  monitorId: text('monitor_id').notNull(),
  checkedAt: timestamp('checked_at').notNull().defaultNow(),
  isSuccess: boolean('is_success').notNull().default(true),
  durationMs: integer('duration_ms').notNull()
});
