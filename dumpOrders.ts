import { db } from './src/db/index';
import { orders } from './src/db/schema';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  const allOrders = await db.select().from(orders);
  console.log(JSON.stringify(allOrders, null, 2));
  process.exit(0);
}
test();
