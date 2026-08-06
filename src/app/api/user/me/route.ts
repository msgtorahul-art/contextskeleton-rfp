import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = db.prepare('SELECT email, subscription_status, credits FROM users WHERE id = ?').get(session.userId) as {
      email: string;
      subscription_status: string;
      credits: number;
    } | undefined;

    if (!user) {
      // Fallback for new dynamic session (free trial status, 10 credits)
      return NextResponse.json({
        user: {
          id: session.userId,
          email: session.email,
          subscription_status: 'inactive',
          credits: 10
        }
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        subscription_status: 'inactive',
        credits: 10
      }
    });
  }
}
