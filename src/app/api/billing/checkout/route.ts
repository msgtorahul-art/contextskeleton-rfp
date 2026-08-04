import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const baseUrl = new URL(req.url).origin;
    const checkoutUrl = await createCheckoutSession(session.userId, session.email, baseUrl);
    
    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Error initiating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
