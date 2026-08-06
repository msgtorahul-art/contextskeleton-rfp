import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processRfpEngine } from '@/lib/engines/rfpEngine';

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Strict Product-Level Access Check
  if (!hasBillingAccess(user.userId, 'rfp')) {
    return NextResponse.json(
      { error: 'Product entitlement required. Please subscribe to the RFP & Tender Engine to access this product.' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const rfpText = body.rfpText || body.text || body.specText || body.description || '';
    const title = body.title || 'Enterprise Proposal';
    const clientName = body.clientName || 'Valued Enterprise Client';

    if (!rfpText.trim()) {
      return NextResponse.json({ error: 'RFP specification text is required.' }, { status: 400 });
    }

    const result = await processRfpEngine({
      title,
      clientName,
      rfpText,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('RFP Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process RFP proposal.' }, { status: 500 });
  }
}
