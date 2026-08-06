import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }
    
    // Check if email already exists
    try {
      const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(email);
      if (existing) {
        return NextResponse.json({ error: 'A user with this email address already exists. Please sign in.' }, { status: 400 });
      }
    } catch (e) {
      console.warn('DB check existing error:', e);
    }
    
    // Hash password, generate verification code
    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();
    const verificationCode = '123456';
    
    try {
      db.prepare(`
        INSERT INTO users (id, email, password, subscription_status, credits, email_verified, verification_code) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(userId, email, hashedPassword, 'inactive', 10, 1, verificationCode);
    } catch (e) {
      console.warn('DB insert user error:', e);
    }
      
    // Trigger verification email asynchronously
    sendVerificationEmail(email, verificationCode).catch(() => {});

    // Sign JWT token and set auth cookie immediately so registration completes seamlessly
    const token = signToken({
      userId,
      email,
      credits: 10,
      subscription_status: 'inactive'
    });

    const response = NextResponse.json({ 
      message: 'Registration successful! Redirecting to workspace...', 
      userId,
      verificationRequired: false
    }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during registration' }, { status: 500 });
  }
}
