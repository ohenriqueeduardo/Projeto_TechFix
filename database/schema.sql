-- Users (Auth)
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- User Profiles
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"user_id" text PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"avatar_url" text,
	"phone" text,
	"document_cpf" text
);

-- Addresses
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"street" text NOT NULL,
	"number" text NOT NULL,
	"complement" text,
	"neighborhood" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL
);

-- Categories
CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"icon_url" text,
	"is_active" boolean DEFAULT true NOT NULL
);

-- Professionals
CREATE TABLE IF NOT EXISTS "professionals" (
	"user_id" text PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"category_id" text REFERENCES "categories"("id") ON DELETE set null,
	"bio" text,
	"years_experience" integer DEFAULT 0 NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"jobs_completed" integer DEFAULT 0 NOT NULL
);

-- Portfolio Items
CREATE TABLE IF NOT EXISTS "portfolio_items" (
	"id" text PRIMARY KEY NOT NULL,
	"professional_id" text NOT NULL REFERENCES "professionals"("user_id") ON DELETE cascade,
	"image_url" text NOT NULL,
	"title" text,
	"description" text
);

-- Availabilities
CREATE TABLE IF NOT EXISTS "availabilities" (
	"id" text PRIMARY KEY NOT NULL,
	"professional_id" text NOT NULL REFERENCES "professionals"("user_id") ON DELETE cascade,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL
);

-- Services
CREATE TABLE IF NOT EXISTS "services" (
	"id" text PRIMARY KEY NOT NULL,
	"professional_id" text NOT NULL REFERENCES "professionals"("user_id") ON DELETE cascade,
	"category_id" text REFERENCES "categories"("id") ON DELETE set null,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"base_price" real NOT NULL,
	"estimated_duration" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Service Tags
CREATE TABLE IF NOT EXISTS "service_tags" (
	"service_id" text NOT NULL REFERENCES "services"("id") ON DELETE cascade,
	"tag" text NOT NULL,
	PRIMARY KEY("service_id", "tag")
);

-- Orders
CREATE TABLE IF NOT EXISTS "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"professional_id" text NOT NULL REFERENCES "professionals"("user_id") ON DELETE cascade,
	"service_id" text REFERENCES "services"("id") ON DELETE set null,
	"address_id" text REFERENCES "addresses"("id") ON DELETE set null,
	"scheduled_date" text NOT NULL,
	"scheduled_time" text NOT NULL,
	"status" text NOT NULL,
	"total_price" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Payments
CREATE TABLE IF NOT EXISTS "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL REFERENCES "orders"("id") ON DELETE cascade,
	"amount" real NOT NULL,
	"payment_method" text NOT NULL,
	"gateway_transaction_id" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Reviews
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL REFERENCES "orders"("id") ON DELETE cascade,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Messages
CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL REFERENCES "orders"("id") ON DELETE cascade,
	"sender_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"text" text NOT NULL,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Notifications
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
