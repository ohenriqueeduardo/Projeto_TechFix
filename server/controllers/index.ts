import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { users } from '../../src/db/schema.js';
import crypto from 'crypto';

// Helper to hash password
const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const userId = `u_${crypto.randomBytes(4).toString('hex')}`;
    const userRole = role === 'admin' || role === 'professional' ? role : 'client';
    const userPassword = password ? hashPassword(password) : hashPassword('techfix123');

    const newUser = await db.insert(users).values({
      id: userId,
      name,
      email,
      password: userPassword,
      role: userRole,
      status: 'active',
      createdAt: new Date()
    }).returning();

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
