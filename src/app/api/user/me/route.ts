import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let dbUser: any = null;
  try {
    dbUser = db.prepare('SELECT email, subscription_status, credits FROM users WHERE id = ?').get(session.userId);
  } catch (e) {}

  const credits = dbUser && typeof dbUser.credits === 'number' 
    ? dbUser.credits 
    : (session.credits !== undefined ? session.credits : 10);

  const subscriptionStatus = dbUser && dbUser.subscription_status 
    ? dbUser.subscription_status 
    : (session.subscription_status || 'inactive');

  return NextResponse.json({
    user: {
      id: session.userId,
      email: session.email,
      subscription_status: subscriptionStatus,
      credits
    }
  });
}
