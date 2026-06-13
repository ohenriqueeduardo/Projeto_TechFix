ALTER TABLE "orders" ADD COLUMN "proposed_price" real;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "negotiation_message" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "last_negotiator" text;