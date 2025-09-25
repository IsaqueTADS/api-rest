CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"session_id" uuid,
	"title" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_session_id" ON "transactions" USING btree ("session_id");