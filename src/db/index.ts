import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is missing');
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.VERCEL ? 1 : undefined,
});

export const db = drizzle(pool);
