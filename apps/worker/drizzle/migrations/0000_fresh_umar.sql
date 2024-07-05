CREATE TABLE IF NOT EXISTS "status_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monitor_id" uuid NOT NULL,
	"checked_at" date DEFAULT now() NOT NULL,
	"is_success" boolean DEFAULT true NOT NULL,
	"duration_ms" integer NOT NULL
);
