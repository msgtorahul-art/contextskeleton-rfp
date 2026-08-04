import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-local-secret-key-12345';

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
export function signToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token and extract payload
export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch (error) {
    return null;
  }
}

// Extract authenticated user session from HTTP requests
export function getSession(req: NextRequest): { userId: string; email: string } | null {
  // Check Authorization header or cookies
  const authHeader = req.headers.get('Authorization');
  let token: string | null = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Try to get token from cookies
    const cookieToken = req.cookies.get('token');
    if (cookieToken) {
      token = cookieToken.value;
    }
  }
  
  if (!token) return null;
  return verifyToken(token);
}
