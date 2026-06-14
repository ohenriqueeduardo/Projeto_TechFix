import { db } from './src/db/index.js';
import { services, orders, transactions } from './src/db/schema.js';

async function clearData() {
  try {
    console.log('Clearing transactions...');
    await db.delete(transactions);
    
    console.log('Clearing orders (client services)...');
    await db.delete(orders);
    
    console.log('Clearing catalog services (technician services)...');
    await db.delete(services);

    console.log('Successfully cleared all mock services and orders!');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing data:', err);
    process.exit(1);
  }
}

clearData();
