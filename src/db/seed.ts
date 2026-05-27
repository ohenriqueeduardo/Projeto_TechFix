import { db } from './index.js';
import { users, userProfiles, addresses, categories, professionals, services, orders, payments, reviews, messages } from './schema.js';
import * as mockData from '../data/mockData.js';
import crypto from 'crypto';

// Helper to hash password
const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log('⚠️ O banco de dados já possui dados semeados. Pulando seed.');
      return;
    }

    const defaultPassword = hashPassword('12345678'); // Seed password for everyone is 12345678

    console.log('Inserting Users...');
    const usersToInsert = mockData.users.map(u => ({
      ...u,
      passwordHash: defaultPassword,
    }));
    await db.insert(users).values(usersToInsert).onConflictDoNothing();

    console.log('Inserting User Profiles...');
    await db.insert(userProfiles).values(mockData.userProfiles).onConflictDoNothing();

    console.log('Inserting Addresses...');
    await db.insert(addresses).values(mockData.addresses).onConflictDoNothing();

    console.log('Inserting Categories...');
    await db.insert(categories).values(mockData.categories).onConflictDoNothing();

    console.log('Inserting Professionals...');
    await db.insert(professionals).values(mockData.professionals).onConflictDoNothing();

    console.log('Inserting Services...');
    await db.insert(services).values(mockData.services).onConflictDoNothing();

    console.log('Inserting Orders...');
    await db.insert(orders).values(mockData.orders).onConflictDoNothing();

    console.log('Inserting Payments...');
    await db.insert(payments).values(mockData.payments).onConflictDoNothing();

    console.log('Inserting Reviews...');
    await db.insert(reviews).values(mockData.reviews).onConflictDoNothing();

    console.log('Inserting Messages...');
    await db.insert(messages).values(mockData.messages).onConflictDoNothing();

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
