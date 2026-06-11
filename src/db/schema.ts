import { pgTable, text, integer, real, serial, primaryKey, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Added password column for secure login hashing
  role: text('role').notNull(), // 'client', 'professional', 'admin'
  avatar: text('avatar'),
  level: text('level'),
  status: text('status').notNull().default('active'),
  phone: text('phone'),
  dateOfBirth: text('date_of_birth'),
  cep: text('cep'),
  street: text('street'),
  number: text('number'),
  complement: text('complement'),
  neighborhood: text('neighborhood'),
  city: text('city'),
  state: text('state'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const professionals = pgTable('professionals', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  specialty: text('specialty').notNull(),
  city: text('city').notNull(),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  jobs: integer('jobs').notNull().default(0),
  yearsExperience: integer('years_experience').notNull().default(0),
  satisfaction: integer('satisfaction').notNull().default(100),
  bio: text('bio'),
  availableDays: text('available_days').array().default(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']),
  availableTimes: text('available_times').array().default(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']),
});

export const professionalPortfolioItems = pgTable('professional_portfolio_items', {
  id: serial('id').primaryKey(),
  professionalId: text('professional_id').notNull().references(() => professionals.userId, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
});

export const services = pgTable('services', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  duration: text('duration').notNull(),
  rating: real('rating').notNull().default(0),
  professionalId: text('professional_id').references(() => professionals.userId, { onDelete: 'cascade' }),
  badge: text('badge'),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const serviceTags = pgTable('service_tags', {
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.serviceId, table.tag] }),
  };
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  serviceId: text('service_id').references(() => services.id, { onDelete: 'restrict' }),
  serviceTitle: text('service_title').notNull(),
  clientId: text('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  professionalId: text('professional_id').notNull().references(() => professionals.userId, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  time: text('time').notNull(),
  status: text('status').notNull(), // 'pending', 'scheduled', 'in_progress', 'completed', 'cancelled'
  price: real('price').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'pix', 'debit', 'credit'
  address: text('address').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  professionalId: text('professional_id').references(() => professionals.userId, { onDelete: 'set null' }),
  orderId: text('order_id').references(() => orders.id, { onDelete: 'set null' }),
  type: text('type').notNull(), // 'income', 'expense'
  title: text('title').notNull(),
  value: real('value').notNull(),
  date: text('date').notNull(),
  status: text('status').notNull(), // 'completed', 'pending', 'failed'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  professionalId: text('professional_id').notNull().references(() => professionals.userId, { onDelete: 'cascade' }),
  clientId: text('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  date: text('date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reviewTags = pgTable('review_tags', {
  reviewId: text('review_id').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.reviewId, table.tag] }),
  };
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  time: text('time').notNull(),
  date: text('date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const verificationCodes = pgTable('verification_codes', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
