import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Reset token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    const user = db.prepare(`
      SELECT id, reset_token_expiry FROM users WHERE reset_token = ?
    `).get(token) as { id: string; reset_token_expiry: string } | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired password reset token' }, { status: 400 });
    }

    if (new Date(user.reset_token_expiry) < new Date()) {
      return NextResponse.json({ error: 'Password reset token has expired' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);
    db.prepare(`
      UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?
    `).run(hashedPassword, user.id);

    return NextResponse.json({ message: 'Password reset successful! You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during password reset' }, { status: 500 });
  }
}
