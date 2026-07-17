CREATE TABLE "shortlinks" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"url" text NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"last_clicked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "shortlinks_code_idx" ON "shortlinks" USING btree ("code");