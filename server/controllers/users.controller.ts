import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { users } from '../../src/db/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Helper to hash password
const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

// GET /api/users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/users
export const createUser = async (req: Request, res: Response) => {
  try {
    const { id, name, email, password, role, avatar, level, status } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required' });
    }

    if (!['client', 'professional', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be client, professional, or admin' });
    }

    const userId = id || `u_${crypto.randomBytes(4).toString('hex')}`;
    const userPassword = password ? hashPassword(password) : hashPassword('techfix123');

    const newUser = await db.insert(users).values({
      id: userId,
      name,
      email,
      password: userPassword,
      role,
      avatar: avatar || null,
      level: level || null,
      status: status || 'active',
      createdAt: new Date()
    }).returning();

    res.status(201).json(newUser[0]);
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    const err = error as { code?: string; message?: string };
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === '23505' || err.message?.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/users/:id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, email, password, avatar, level, status } = req.body;

    const existingUser = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await db.update(users)
      .set({
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(password !== undefined && { password: hashPassword(password) }),
        ...(avatar !== undefined && { avatar }),
        ...(level !== undefined && { level }),
        ...(status !== undefined && { status })
      })
      .where(eq(users.id, id))
      .returning();

    res.json(updatedUser[0]);
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    const err = error as { code?: string; message?: string };
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === '23505' || err.message?.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existingUser = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await db.delete(users).where(eq(users.id, id));
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
