import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { users, verificationCodes } from '../../src/db/schema.js';
import { eq, and, desc, gt } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendWelcomeEmail, sendVerificationEmail } from '../utils/email.js';

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
    const { name, email, password, code, role, avatar, phone, dateOfBirth, cep, street, number, complement, neighborhood, city, state } = req.body;

    const userRole = role || 'client';

    // Verify verification code
    const latestCodes = await db.select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.email, email),
          gt(verificationCodes.expiresAt, new Date())
        )
      )
      .orderBy(desc(verificationCodes.createdAt))
      .limit(1);

    if (latestCodes.length === 0 || latestCodes[0].code !== code) {
      return res.status(400).json({ error: 'Código de verificação inválido ou expirado.' });
    }

    // Delete used code(s) for this email
    await db.delete(verificationCodes).where(eq(verificationCodes.email, email));

    // Check if user already exists
    const existingUserList = await db.select().from(users).where(eq(users.email, email)).limit(1);
    let finalUser;

    if (existingUserList.length > 0) {
      const existingUser = existingUserList[0];
      const currentRoles = existingUser.role.split(',');
      if (currentRoles.includes(userRole)) {
        return res.status(400).json({ error: 'Este e-mail já possui uma conta com esse perfil.' });
      }

      // Upgrade Account
      const newRoleString = `${existingUser.role},${userRole}`;
      const updatedUser = await db.update(users)
        .set({ role: newRoleString })
        .where(eq(users.id, existingUser.id))
        .returning();
      
      finalUser = updatedUser[0];
    } else {
      const userId = `u_${crypto.randomBytes(4).toString('hex')}`;
      const hashedPassword = hashPassword(password);

      const newUser = await db.insert(users).values({
        id: userId,
        name,
        email,
        password: hashedPassword,
        role: userRole,
        avatar: avatar || null,
        status: 'active',
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        cep: cep || null,
        street: street || null,
        number: number || null,
        complement: complement || null,
        neighborhood: neighborhood || null,
        city: city || null,
        state: state || null,
        createdAt: new Date(),
      }).returning();
      
      finalUser = newUser[0];
    }

    // Generate JWT Token (1 hour session duration limit)
    const token = jwt.sign(
      { id: finalUser.id, email: finalUser.email, role: finalUser.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const { password: _, ...userWithoutPassword } = finalUser;

    // Send welcome email asynchronously
    sendWelcomeEmail(email, name).catch(console.error);

    res.status(201).json({
      message: 'User registered/upgraded successfully',
      user: userWithoutPassword,
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
    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Your account has been deactivated.' });
    }

    // Generate JWT Token (Limited session to 2 hours)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' } // Session strictly limited to 2h for enhanced security
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
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
    const userPayload = (req as Request & { user?: { id: string } }).user;
    if (!userPayload) {
      return res.status(401).json({ error: 'Session expired or invalid.' });
    }

    const userList = await db.select().from(users).where(eq(users.id, userPayload.id)).limit(1);
    if (userList.length === 0) {
      return res.status(404).json({ error: 'User session not found.' });
    }

    const { password: _, ...userWithoutPassword } = userList[0];
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Verify Session Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/auth/social
export const socialLogin = async (req: Request, res: Response) => {
  try {
    const { email, name, provider, avatar, phone, dateOfBirth, cep, street, number, complement, neighborhood, city, state } = req.body;

    // Check if user already exists
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    let user;

    if (userList.length > 0) {
      user = userList[0];
      
      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Your account has been deactivated.' });
      }
    } else {
      // User doesn't exist, create a new one
      const userId = `u_${crypto.randomBytes(4).toString('hex')}`;
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = hashPassword(randomPassword);

      const newUser = await db.insert(users).values({
        id: userId,
        name: name || `User from ${provider}`,
        email,
        password: hashedPassword,
        role: 'client',
        avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
        status: 'active',
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        cep: cep || null,
        street: street || null,
        number: number || null,
        complement: complement || null,
        neighborhood: neighborhood || null,
        city: city || null,
        state: state || null,
        createdAt: new Date(),
      }).returning();

      user = newUser[0];
    }

    // Generate JWT Token (Limited session to 2 hours)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    const isNewUser = userList.length === 0;

    // Send welcome email if it's a new user
    if (isNewUser) {
      sendWelcomeEmail(email, name || `User from ${provider}`).catch(console.error);
    }

    res.json({
      message: 'Social Login successful',
      user: userWithoutPassword,
      token,
      isNewUser
    });
  } catch (error) {
    console.error('Social Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/auth/complete-profile
export const completeProfile = async (req: Request, res: Response) => {
  try {
    const userPayload = (req as Request & { user?: { id: string } }).user;
    if (!userPayload) {
      return res.status(401).json({ error: 'Session expired or invalid.' });
    }

    const { phone, dateOfBirth, cep, street, number, complement, neighborhood, city, state } = req.body;

    const updatedUser = await db.update(users)
      .set({
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        cep: cep || null,
        street: street || null,
        number: number || null,
        complement: complement || null,
        neighborhood: neighborhood || null,
        city: city || null,
        state: state || null,
      })
      .where(eq(users.id, userPayload.id))
      .returning();

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password: _, ...userWithoutPassword } = updatedUser[0];
    res.json({ message: 'Profile completed successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Complete Profile Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/auth/google
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token, role } = req.body;
    const userRole = role || 'client';

    // Fetch user profile from Google using the access token
    const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    if (!googleRes.ok) {
      return res.status(401).json({ error: 'Falha ao autenticar com o Google. Token inválido.' });
    }

    const googleUser = (await googleRes.json()) as {
      email: string;
      name: string;
      picture?: string;
    };

    const { email, name, picture } = googleUser;

    if (!email) {
      return res.status(400).json({ error: 'E-mail do Google não foi retornado.' });
    }

    // Check if user already exists
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);

    let user;
    let isNewUser = false;

    if (userList.length > 0) {
      user = userList[0];
      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Sua conta foi desativada.' });
      }

      // Account Upgrade
      const currentRoles = user.role.split(',');
      if (!currentRoles.includes(userRole)) {
        const newRoleString = `${user.role},${userRole}`;
        const updatedUser = await db.update(users)
          .set({ role: newRoleString })
          .where(eq(users.id, user.id))
          .returning();
        user = updatedUser[0];
      }
    } else {
      isNewUser = true;
      const userId = `u_${crypto.randomBytes(4).toString('hex')}`;
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = hashPassword(randomPassword);

      const newUser = await db.insert(users).values({
        id: userId,
        name: name || 'Usuário Google',
        email,
        password: hashedPassword,
        role: userRole,
        avatar: picture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
        status: 'active',
        createdAt: new Date(),
      }).returning();

      user = newUser[0];
    }

    // Generate JWT Token (Limited session to 2 hours)
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    if (isNewUser) {
      sendWelcomeEmail(email, name || 'Usuário Google').catch(console.error);
    }

    res.json({
      message: 'Login com Google realizado com sucesso',
      user: userWithoutPassword,
      token: jwtToken,
      isNewUser
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/auth/send-verification-code
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;

    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      if (!role) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado no sistema.' });
      }
      const currentRoles = existingUser[0].role.split(',');
      if (currentRoles.includes(role)) {
        return res.status(400).json({ error: 'Este e-mail já possui uma conta com esse perfil.' });
      }
    }

    // Generate random 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store in DB
    await db.insert(verificationCodes).values({
      email,
      code,
      expiresAt,
    });

    // Send email using SMTP
    const emailSent = await sendVerificationEmail(email, code);

    if (!emailSent) {
      return res.status(500).json({ error: 'Falha ao enviar o e-mail de verificação.' });
    }

    res.json({ message: 'Código de verificação enviado com sucesso.' });
  } catch (error) {
    console.error('Send Verification Code Error:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao enviar o código de verificação.' });
  }
};
