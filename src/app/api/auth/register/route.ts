import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

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
    
    // Hash password, generate 6-digit verification code
    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    db.prepare(`
      INSERT INTO users (id, email, password, subscription_status, credits, email_verified, verification_code) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, email, hashedPassword, 'inactive', 10, 0, verificationCode);
      
    // Trigger verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({ 
      message: 'Registration successful! Please check your email to verify your account.', 
      userId,
      verificationCode, // Included for seamless testing in sandbox
    }, { status: 201 });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during registration' }, { status: 500 });
  }
}
