CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"text" text NOT NULL,
	"time" text NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"service_id" text,
	"service_title" text NOT NULL,
	"client_id" text NOT NULL,
	"professional_id" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"status" text NOT NULL,
	"price" real NOT NULL,
	"payment_method" text NOT NULL,
	"address" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "professional_portfolio_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"professional_id" text NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professionals" (
	"user_id" text PRIMARY KEY NOT NULL,
	"specialty" text NOT NULL,
	"city" text NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"jobs" integer DEFAULT 0 NOT NULL,
	"years_experience" integer DEFAULT 0 NOT NULL,
	"satisfaction" integer DEFAULT 100 NOT NULL,
	"bio" text
);
--> statement-breakpoint
CREATE TABLE "review_tags" (
	"review_id" text NOT NULL,
	"tag" text NOT NULL,
	CONSTRAINT "review_tags_review_id_tag_pk" PRIMARY KEY("review_id","tag")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"professional_id" text NOT NULL,
	"client_id" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"date" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_tags" (
	"service_id" text NOT NULL,
	"tag" text NOT NULL,
	CONSTRAINT "service_tags_service_id_tag_pk" PRIMARY KEY("service_id","tag")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"price" real NOT NULL,
	"duration" text NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"professional_id" text NOT NULL,
	"badge" text,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"professional_id" text,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"value" real NOT NULL,
	"date" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"avatar" text,
	"level" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_professional_id_professionals_user_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_portfolio_items" ADD CONSTRAINT "professional_portfolio_items_professional_id_professionals_user_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tags" ADD CONSTRAINT "review_tags_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_professional_id_professionals_user_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_tags" ADD CONSTRAINT "service_tags_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_professional_id_professionals_user_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_professional_id_professionals_user_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("user_id") ON DELETE set null ON UPDATE no action;