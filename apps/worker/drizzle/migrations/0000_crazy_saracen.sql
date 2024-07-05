CREATE TABLE IF NOT EXISTS "status_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monitor_id" text NOT NULL,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"is_success" boolean DEFAULT true NOT NULL,
	"duration_ms" integer NOT NULL
);
