import { db } from './index.js';
import { users, professionals, services, serviceTags, orders, transactions, reviews } from './schema.js';

async function main() {
  console.log("Cleaning database for real testing...");

  // Delete all data (cascading will help, but deleting in order is safer)
  await db.delete(transactions);
  await db.delete(reviews);
  await db.delete(orders);
  await db.delete(serviceTags);
  await db.delete(services);
  await db.delete(professionals);
  await db.delete(users);

  console.log("Database is completely clean!");
  process.exit(0);
}

main().catch(err => {
  console.error("Failed to clean database:", err);
  process.exit(1);
});
