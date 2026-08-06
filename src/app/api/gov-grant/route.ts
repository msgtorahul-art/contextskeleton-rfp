import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, processCreditDecrement } from '@/lib/stripe';
import { processGovGrantEngine } from '@/lib/engines/govGrantEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(session, 'gov-grant')) {
    return NextResponse.json(
      { error: 'Product entitlement required. Your trial credits have expired. Please subscribe to GovWin & SBIR Grant Architect to access this product.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const proposalNarrative = body.proposalNarrative || body.text || body.specText || body.description || '';
    const grantTitle = body.grantTitle || body.title || 'Federal Grant Submission';
    const grantType = body.grantType || 'SBIR Phase I / Federal Procurement';

    if (!proposalNarrative.trim()) {
      return NextResponse.json({ error: 'Proposal narrative text or grant specification is required' }, { status: 400 });
    }

    const result = await processGovGrantEngine({
      grantTitle,
      grantType,
      proposalNarrative,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    const response = NextResponse.json(result);
    processCreditDecrement(session, response);
    return response;
  } catch (error: any) {
    console.error('Gov Grant API Error:', error);
    return NextResponse.json({ error: 'Failed to process Federal Grant audit. Please try again.' }, { status: 500 });
  }
}
