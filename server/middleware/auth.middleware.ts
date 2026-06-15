import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'techfix-ultra-secure-and-private-jwt-token-signing-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as AuthenticatedRequest).user;
      if (!user) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }
      
      const userRoles = user.role.split(',').map(r => r.trim());
      const hasPermission = userRoles.some(r => roles.includes(r));
      
      if (!hasPermission) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }
      next();
  };
};
