import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, processCreditDecrement } from '@/lib/stripe';
import { processCreLeaseEngine } from '@/lib/engines/creLeaseEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Strict Product-Level Access Check
  if (!hasBillingAccess(session, 'cre-lease')) {
    return NextResponse.json(
      { error: 'Product entitlement required. Your trial credits have expired. Please subscribe to CRE Lease Abstractor to access this product.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const leaseText = body.leaseText || body.text || body.specText || body.description || '';
    const propertyAddress = body.propertyAddress || body.title || 'Commercial Property';

    if (!leaseText.trim()) {
      return NextResponse.json({ error: 'Commercial lease text or agreement is required' }, { status: 400 });
    }

    const result = await processCreLeaseEngine({
      propertyAddress,
      leaseText,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    const response = NextResponse.json(result);
    processCreditDecrement(session, response);
    return response;
  } catch (error: any) {
    console.error('CRE Lease Engine Error:', error);
    return NextResponse.json({ error: 'Failed to abstract commercial lease.' }, { status: 500 });
  }
}
