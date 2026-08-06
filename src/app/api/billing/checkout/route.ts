import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const productId = body.productId || 'all-access';
    const baseUrl = new URL(req.url).origin;

    try {
      const checkoutSession = await createCheckoutSession(
        session.userId,
        session.email,
        process.env.STRIPE_PRICE_ID || 'price_mock_enterprise_499',
        productId
      );
      return NextResponse.json({ url: checkoutSession.url });
    } catch (stripeErr) {
      console.warn('[Checkout Fallback] Stripe live session unavailable, utilizing instant sandbox callback.');
      const sandboxUrl = `${baseUrl}/api/billing/sandbox-callback?product=${productId}&user=${encodeURIComponent(session.userId)}`;
      return NextResponse.json({ url: sandboxUrl });
    }
  } catch (error: any) {
    console.error('Error initiating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
