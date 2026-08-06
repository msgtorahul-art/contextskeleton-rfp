import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processAmlKycEngine } from '@/lib/engines/amlKycEngine';

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(user.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run AML & KYC Risk Audits.' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const transactionNotes = body.transactionNotes || body.text || body.specText || body.description || '';
    const entityName = body.entityName || body.title || 'Corporate Entity';
    const jurisdiction = body.jurisdiction || 'FATF / FinCEN / EU 6AMLD';

    if (!transactionNotes.trim()) {
      return NextResponse.json({ error: 'Transaction or KYC notes are required.' }, { status: 400 });
    }

    const result = await processAmlKycEngine({
      entityName,
      jurisdiction,
      transactionNotes,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('AML KYC Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process AML & KYC risk audit.' }, { status: 500 });
  }
}
