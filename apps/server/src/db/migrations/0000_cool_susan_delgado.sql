CREATE TABLE IF NOT EXISTS "status_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monitor_id" text NOT NULL,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"is_fail" boolean DEFAULT false NOT NULL,
	"duration_ms" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_status_checks_monitor_id_checked_at" ON "status_checks" USING btree ("monitor_id","checked_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_status_checks_monitor_id" ON "status_checks" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_status_checks_monitor_id_checked_at_is_fail" ON "status_checks" USING btree ("monitor_id","checked_at" DESC NULLS LAST,"is_fail");