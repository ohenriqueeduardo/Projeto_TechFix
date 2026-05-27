import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { users, userProfiles } from '../../src/db/schema.js';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'techfix-ultra-secure-and-private-jwt-token-signing-key-2026';

// Helper to hash password
const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

// Helper to verify password
const verifyPassword = (password: string, stored: string): boolean => {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, avatar } = req.body;

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const userId = `u_${crypto.randomBytes(4).toString('hex')}`;
    const hashedPassword = hashPassword(password);
    const userRole = role || 'client';

    const newUser = await db.insert(users).values({
      id: userId,
      email,
      passwordHash: hashedPassword,
      role: userRole,
      status: 'active',
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

    // Generate JWT Token (1 hour session duration limit)
    const token = jwt.sign(
      { id: newUser[0].id, email: newUser[0].email, role: newUser[0].role },
      JWT_SECRET,
      { expiresIn: '2h' } // Limited session duration
    );

    const { passwordHash, ...userWithoutPassword } = newUser[0];
    const userWithProfile = { ...userWithoutPassword, name: `${newProfile[0].firstName} ${newProfile[0].lastName}`.trim(), avatar: newProfile[0].avatarUrl };

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithProfile,
      token,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Fetch user
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userList.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = userList[0];

    // Verify Password
    const isPasswordValid = verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Your account has been deactivated.' });
    }

    const profileList = await db.select().from(userProfiles).where(eq(userProfiles.userId, user.id)).limit(1);
    const profile = profileList.length > 0 ? profileList[0] : null;

    // Generate JWT Token (Limited session to 2 hours)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const { passwordHash, ...userWithoutPassword } = user;
    const userWithProfile = { 
      ...userWithoutPassword, 
      name: profile ? `${profile.firstName} ${profile.lastName}`.trim() : '', 
      avatar: profile?.avatarUrl || null 
    };

    res.json({
      message: 'Login successful',
      user: userWithProfile,
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response) => {
  try {
    const userPayload = (req as any).user;
    if (!userPayload) {
      return res.status(401).json({ error: 'Session expired or invalid.' });
    }

    const userList = await db.select().from(users).where(eq(users.id, userPayload.id)).limit(1);
    if (userList.length === 0) {
      return res.status(404).json({ error: 'User session not found.' });
    }

    const user = userList[0];
    const profileList = await db.select().from(userProfiles).where(eq(userProfiles.userId, user.id)).limit(1);
    const profile = profileList.length > 0 ? profileList[0] : null;

    const { passwordHash, ...userWithoutPassword } = user;
    const userWithProfile = { 
      ...userWithoutPassword, 
      name: profile ? `${profile.firstName} ${profile.lastName}`.trim() : '', 
      avatar: profile?.avatarUrl || null 
    };

    res.json({ user: userWithProfile });
  } catch (error) {
    console.error('Verify Session Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
