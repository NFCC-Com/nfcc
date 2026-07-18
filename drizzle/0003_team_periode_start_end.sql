ALTER TABLE "team_members" ADD COLUMN "periode_start" integer;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "periode_end" integer;--> statement-breakpoint
UPDATE "team_members" SET "periode_start" = substring("periode" from '\d{4}')::int;--> statement-breakpoint
UPDATE "team_members" SET "periode_end" = (regexp_match("periode", '\d{4}.*(\d{4})'))[1]::int WHERE "periode" ~ '\d{4}.*\d{4}';--> statement-breakpoint
ALTER TABLE "team_members" DROP COLUMN "periode";
