ALTER TABLE "groups" ADD COLUMN "assist_team_id" integer;--> statement-breakpoint
ALTER TABLE "assist_settings" ADD COLUMN "assist_synced_team_ids" jsonb DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_assist_team_id_unique" UNIQUE("assist_team_id");