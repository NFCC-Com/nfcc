ALTER TABLE "gallery_items" ALTER COLUMN "tag" SET DEFAULT 'Umum';--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "author" SET DEFAULT 'Tim NFCC';--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "division" SET DEFAULT 'Tim Inti';--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "logo_philosophy" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "periode" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "instagram" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "linkedin" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "github" text DEFAULT '' NOT NULL;