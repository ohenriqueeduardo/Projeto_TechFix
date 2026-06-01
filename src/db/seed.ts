import { db } from './index.js';
import { users, professionals, services, serviceTags, orders, transactions, messages } from './schema.js';
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

    const allUsersToInsert = [
      { id: 'u1', name: 'Sofia Spencer', email: 'sofia@example.com', password: defaultPassword, role: 'client', avatar: 'https://i.pravatar.cc/150?u=sofia', status: 'active' },
      { id: 'p1', name: 'Carlos Mendes', email: 'carlos@example.com', password: defaultPassword, role: 'professional', avatar: 'https://i.pravatar.cc/150?u=carlos', status: 'active' },
      { id: 'p2', name: 'Diego Faria', email: 'diego@example.com', password: defaultPassword, role: 'professional', avatar: 'https://i.pravatar.cc/150?u=diego', status: 'active' },
      { id: 'u3', name: 'Henrique Eduardo', email: 'admin@techfix.com', password: defaultPassword, role: 'admin', level: 'Adamantium', status: 'active' },
      { id: 'u_temp1', name: 'Mariana Silva', email: 'mariana@example.com', password: defaultPassword, role: 'client', avatar: 'https://i.pravatar.cc/150?u=mariana', status: 'active' },
      { id: 'u_temp2', name: 'Pedro Rocha', email: 'pedro@example.com', password: defaultPassword, role: 'client', avatar: 'https://i.pravatar.cc/150?u=pedro', status: 'active' },
      { id: 'u_temp3', name: 'Lucas Santos', email: 'lucas@example.com', password: defaultPassword, role: 'client', avatar: 'https://i.pravatar.cc/150?u=lucas', status: 'active' },
    ];

    console.log('Inserting Users...');
    await db.insert(users).values(allUsersToInsert).onConflictDoNothing();

    console.log('Inserting Professionals...');
    await db.insert(professionals).values(mockData.professionals.map(p => ({
      userId: p.id,
      specialty: p.specialty,
      city: p.city,
      rating: p.rating,
      reviewCount: p.reviewCount,
      jobs: p.jobs,
      yearsExperience: p.yearsExperience,
      satisfaction: p.satisfaction,
      bio: p.bio,
    }))).onConflictDoNothing();

    console.log('Inserting Services...');
    await db.insert(services).values(mockData.services.map(s => ({
      id: s.id,
      title: s.title,
      category: s.category,
      description: s.description,
      price: s.price,
      duration: s.duration,
      rating: s.rating,
      professionalId: s.professionalId,
      badge: s.badge || null,
      image: s.image || null,
    }))).onConflictDoNothing();

    console.log('Inserting Service Tags...');
    const tagsToInsert = mockData.services.flatMap(s => 
      s.tags.map(tag => ({ serviceId: s.id, tag }))
    );
    await db.insert(serviceTags).values(tagsToInsert).onConflictDoNothing();

    console.log('Inserting Orders...');
    await db.insert(orders).values(mockData.orders.map(o => ({
      id: o.id,
      code: o.code,
      serviceId: o.serviceId,
      serviceTitle: o.serviceTitle,
      clientId: o.clientId,
      professionalId: o.professionalId,
      date: o.date,
      time: o.time,
      status: o.status,
      price: o.price,
      paymentMethod: o.paymentMethod,
      address: o.address,
    }))).onConflictDoNothing();

    console.log('Inserting Transactions...');
    await db.insert(transactions).values(mockData.transactions.map(t => ({
      id: t.id,
      professionalId: 'p1', // Inferred from the mock scenario
      type: t.type,
      title: t.title,
      value: t.value,
      date: t.date,
      status: t.status,
    }))).onConflictDoNothing();

    console.log('Inserting Messages...');
    const chatMessages = [
      { senderId: 'p1', receiverId: 'u1', text: 'Olá Sofia! Recebi seu pedido de manutenção preventiva.', time: '10:30', date: '2024-05-20' },
      { senderId: 'u1', receiverId: 'p1', text: 'Oi Carlos! Que bom. Você consegue vir amanhã à tarde?', time: '10:32', date: '2024-05-20' },
      { senderId: 'p1', receiverId: 'u1', text: 'Consigo sim. Por volta das 14h está bom para você?', time: '10:35', date: '2024-05-20' },
      { senderId: 'u1', receiverId: 'p1', text: 'Perfeito! Já deixarei tudo pronto aqui.', time: '10:36', date: '2024-05-20' },
      { senderId: 'p1', receiverId: 'u1', text: 'Combinado. Até amanhã!', time: '10:40', date: '2024-05-20' },
    ];
    await db.insert(messages).values(chatMessages);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
