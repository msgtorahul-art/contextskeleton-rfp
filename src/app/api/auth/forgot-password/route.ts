import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: string } | undefined;

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

      db.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?')
        .run(resetToken, expiry, user.id);

      await sendPasswordResetEmail(email, resetToken);
    }

    return NextResponse.json({ 
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
