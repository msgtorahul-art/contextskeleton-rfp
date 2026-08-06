import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production environment.');
    }
    return 'dev-only-local-secret-key-do-not-use-in-prod-998877';
  }
  return secret;
}

const JWT_SECRET = getJwtSecret();

export interface UserSessionPayload {
  userId: string;
  email: string;
  credits?: number;
  subscription_status?: string;
}

// Hash a password securely
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password with hashed value
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

// Sign JWT token
export function signToken(payload: UserSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token and extract payload
export function verifyToken(token: string): UserSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

// Extract authenticated user session from HTTP requests
export function getSession(req: NextRequest): UserSessionPayload | null {
  const authHeader = req.headers.get('Authorization');
  let token: string | null = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    const cookieToken = req.cookies.get('token');
    if (cookieToken) {
      token = cookieToken.value;
    }
  }
  
  if (!token) return null;
  return verifyToken(token);
}
