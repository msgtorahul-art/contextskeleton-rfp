import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }
    
    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }
    
    // Hash password and save user
    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();
    
    db.prepare('INSERT INTO users (id, email, password, subscription_status, credits) VALUES (?, ?, ?, ?, ?)')
      .run(userId, email, hashedPassword, 'inactive', 10);
      
    return NextResponse.json({ message: 'User registered successfully', userId }, { status: 201 });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during registration' }, { status: 500 });
  }
}
