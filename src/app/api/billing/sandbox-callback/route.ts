import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  // 1. Disable sandbox bypass if live Stripe keys are configured in production
  if (process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Sandbox billing bypass is disabled in production mode.' }, { status: 403 });
  }

  // 2. Authenticate the caller session to prevent unauthorized account manipulation
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  // 3. Ensure the authenticated user can only upgrade their own account
  if (!userId || userId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden: User mismatch.' }, { status: 403 });
  }

  try {
    // In local sandbox development mode, mark user as active subscription
    db.prepare("UPDATE users SET subscription_status = 'active', credits = 9999 WHERE id = ?").run(session.userId);

    // Redirect back to dashboard
    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(`${baseUrl}/dashboard?payment=success`);
  } catch (error) {
    console.error('Sandbox billing callback error:', error);
    return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 });
  }
}
