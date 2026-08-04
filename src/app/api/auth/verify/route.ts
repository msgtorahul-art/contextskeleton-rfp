import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    const user = db.prepare('SELECT id, email, verification_code FROM users WHERE email = ?').get(email) as {
      id: string;
      email: string;
      verification_code: string;
    } | undefined;

    if (!user) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    if (user.verification_code !== code.trim()) {
      return NextResponse.json({ error: 'Invalid verification code. Please check your email.' }, { status: 400 });
    }

    // Mark email as verified
    db.prepare('UPDATE users SET email_verified = 1, verification_code = NULL WHERE id = ?').run(user.id);

    // Send welcome email
    sendWelcomeEmail(email).catch((e) => console.error('Welcome email error:', e));

    // Sign JWT token
    const token = signToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({ message: 'Email verified successfully!' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during email verification' }, { status: 500 });
  }
}
