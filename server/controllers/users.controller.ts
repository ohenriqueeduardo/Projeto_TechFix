import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { users, userProfiles } from '../../src/db/schema.js';
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
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      firstName: userProfiles.firstName,
      lastName: userProfiles.lastName,
      avatarUrl: userProfiles.avatarUrl,
      phone: userProfiles.phone,
      documentCpf: userProfiles.documentCpf
    })
    .from(users)
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId));

    const formattedUsers = allUsers.map(u => ({
      id: u.id,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      avatar: u.avatarUrl,
      phone: u.phone,
      documentCpf: u.documentCpf
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userList = await db.select({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      firstName: userProfiles.firstName,
      lastName: userProfiles.lastName,
      avatarUrl: userProfiles.avatarUrl,
      phone: userProfiles.phone,
      documentCpf: userProfiles.documentCpf
    })
    .from(users)
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(eq(users.id, id)).limit(1);
    
    if (userList.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const u = userList[0];
    res.json({
      id: u.id,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      avatar: u.avatarUrl,
      phone: u.phone,
      documentCpf: u.documentCpf
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/users
export const createUser = async (req: Request, res: Response) => {
  try {
    const { id, name, email, password, role, avatar, status } = req.body;
    
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
      email,
      passwordHash: userPassword,
      role,
      status: status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    const nameParts = (name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const newProfile = await db.insert(userProfiles).values({
      userId: userId,
      firstName,
      lastName,
      avatarUrl: avatar || null,
    }).returning();

    res.status(201).json({
      id: newUser[0].id,
      email: newUser[0].email,
      role: newUser[0].role,
      status: newUser[0].status,
      name: `${newProfile[0].firstName} ${newProfile[0].lastName}`.trim(),
      avatar: newProfile[0].avatarUrl,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message?.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/users/:id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, email, password, avatar, status } = req.body;

    const existingUser = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await db.update(users)
      .set({
        ...(email !== undefined && { email }),
        ...(password !== undefined && { passwordHash: hashPassword(password) }),
        ...(status !== undefined && { status }),
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();

    if (name !== undefined || avatar !== undefined) {
      const nameParts = name ? name.split(' ') : undefined;
      const firstName = nameParts ? nameParts[0] : undefined;
      const lastName = nameParts ? nameParts.slice(1).join(' ') : undefined;

      await db.update(userProfiles)
        .set({
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(avatar !== undefined && { avatarUrl: avatar }),
        })
        .where(eq(userProfiles.userId, id));
    }

    res.json({ message: 'User updated successfully' });
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message?.includes('UNIQUE')) {
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
