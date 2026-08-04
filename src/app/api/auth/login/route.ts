import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    // Retrieve user from DB
    const user = db.prepare('SELECT id, email, password FROM users WHERE email = ?').get(email) as {
      id: string;
      email: string;
      password: string;
    } | undefined;
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Sign JWT token
    const token = signToken({ userId: user.id, email: user.email });
    
    const response = NextResponse.json({
      message: 'Login successful',
      userId: user.id,
      email: user.email
    });
    
    // Set cookie valid for 7 days
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during login' }, { status: 500 });
  }
}
