import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processGovGrantEngine } from '@/lib/engines/govGrantEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(session.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run GovWin & SBIR Grant pre-audits.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
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

    decrementCredits(session.userId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Gov Grant API Error:', error);
    return NextResponse.json({ error: 'Failed to process Federal Grant audit. Please try again.' }, { status: 500 });
  }
}
