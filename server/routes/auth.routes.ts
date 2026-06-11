import { Router } from 'express';
import { z } from 'zod';
import { register, login, getMe, socialLogin, completeProfile, googleLogin, sendVerificationCode } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Zod validation schemas
const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    code: z.string({ required_error: 'Verification code is required' }).length(6, 'Verification code must be 6 digits'),
    role: z.enum(['client', 'professional', 'admin']).optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    cep: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const socialLoginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    name: z.string().optional(),
    provider: z.enum(['Google', 'Apple'], { required_error: 'Provider is required' }),
    avatar: z.string().url('Invalid avatar URL').optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    cep: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }),
});

const googleLoginSchema = z.object({
  body: z.object({
    token: z.string({ required_error: 'Token is required' }),
  }),
});

const sendVerificationCodeSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  }),
});

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/social', validateRequest(socialLoginSchema), socialLogin);
router.post('/google', validateRequest(googleLoginSchema), googleLogin);
router.post('/send-verification-code', validateRequest(sendVerificationCodeSchema), sendVerificationCode);
router.put('/complete-profile', authenticateJWT, completeProfile);
router.get('/me', authenticateJWT, getMe); // Validates active session

export default router;
