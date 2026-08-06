import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processCreLeaseEngine } from '@/lib/engines/creLeaseEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(session.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to abstract commercial real estate leases.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const leaseText = body.leaseText || body.text || body.specText || body.description || '';
    const propertyAddress = body.propertyAddress || body.title || 'Commercial Property Lease';

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

    decrementCredits(session.userId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('CRE Lease Engine Error:', error);
    return NextResponse.json({ error: 'Failed to abstract CRE lease agreement.' }, { status: 500 });
  }
}
