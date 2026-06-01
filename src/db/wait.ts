import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not defined in the environment");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
});

async function waitForDb() {
  console.log("⏳ Aguardando banco de dados estar pronto para conexões...");
  while (true) {
    try {
      const client = await pool.connect();
      client.release();
      console.log("✅ Banco de dados está online e respondendo!");
      process.exit(0);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.log(`📡 Banco de dados inacessível: ${errMsg}. Tentando novamente em 1s...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

waitForDb();
