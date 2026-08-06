import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { grantProductEntitlement } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  const session = getSession(req);
  const { searchParams } = new URL(req.url);
  const userId = session?.userId || searchParams.get('user');
  const product = searchParams.get('product') || 'all-access';

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized user context' }, { status: 401 });
  }

  try {
    // Upgrade user account status in database
    db.prepare("UPDATE users SET subscription_status = 'active_all_access', credits = 99999 WHERE id = ?").run(userId);
    
    if (product && product !== 'all-access') {
      grantProductEntitlement(userId, product);
    }

    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(`${baseUrl}/dashboard?payment=success&product=${encodeURIComponent(product)}`);
  } catch (err: any) {
    console.error('Sandbox billing callback error:', err);
    return NextResponse.json({ error: 'Failed to process upgrade' }, { status: 500 });
  }
}
