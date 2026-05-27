import { pgTable, text, integer, real, serial, primaryKey, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(), // 'client', 'professional', 'admin'
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userProfiles = pgTable('user_profiles', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  documentCpf: text('document_cpf'),
});

export const addresses = pgTable('addresses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  street: text('street').notNull(),
  number: text('number').notNull(),
  complement: text('complement'),
  neighborhood: text('neighborhood').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  isDefault: boolean('is_default').notNull().default(false),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  iconUrl: text('icon_url'),
  isActive: boolean('is_active').notNull().default(true),
});

export const professionals = pgTable('professionals', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
  bio: text('bio'),
  yearsExperience: integer('years_experience').notNull().default(0),
  rating: real('rating').notNull().default(0),
  jobsCompleted: integer('jobs_completed').notNull().default(0),
});

export const portfolioItems = pgTable('portfolio_items', {
  id: text('id').primaryKey(),
  professionalId: text('professional_id').notNull().references(() => professionals.userId, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  title: text('title'),
  description: text('description'),
});

export const availabilities = pgTable('availabilities', {
  id: text('id').primaryKey(),
  professionalId: text('professional_id').notNull().references(() => professionals.userId, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: text('start_time').notNull(), // '09:00'
  endTime: text('end_time').notNull(), // '18:00'
});

export const services = pgTable('services', {
  id: text('id').primaryKey(),
  professionalId: text('professional_id').notNull().references(() => professionals.userId, { onDelete: 'cascade' }),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  basePrice: real('base_price').notNull(),
  estimatedDuration: text('estimated_duration').notNull(), // '2 hours'
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
  clientId: text('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  professionalId: text('professional_id').notNull().references(() => professionals.userId, { onDelete: 'cascade' }),
  serviceId: text('service_id').references(() => services.id, { onDelete: 'set null' }),
  addressId: text('address_id').references(() => addresses.id, { onDelete: 'set null' }),
  scheduledDate: text('scheduled_date').notNull(),
  scheduledTime: text('scheduled_time').notNull(),
  status: text('status').notNull(), // 'pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'
  totalPrice: real('total_price').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'credit_card', 'pix'
  gatewayTransactionId: text('gateway_transaction_id'),
  status: text('status').notNull(), // 'pending', 'paid', 'failed', 'refunded'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // 'order_update', 'system'
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
