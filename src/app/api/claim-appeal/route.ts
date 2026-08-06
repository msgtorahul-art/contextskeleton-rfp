import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processClaimAppealEngine } from '@/lib/engines/claimAppealEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(session.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to generate medical claim appeal letters.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const patientNotes = body.patientNotes || body.text || body.specText || body.description || '';
    const denialReason = body.denialReason || 'Lack of Medical Necessity';
    const cptCode = body.cptCode || body.title || 'CPT 27447';

    if (!patientNotes.trim()) {
      return NextResponse.json({ error: 'Clinical chart notes or denial details are required' }, { status: 400 });
    }

    const result = await processClaimAppealEngine({
      patientNotes,
      denialReason,
      cptCode,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(session.userId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Claim Appeal Engine Error:', error);
    return NextResponse.json({ error: 'Failed to process claim appeal letter.' }, { status: 500 });
  }
}
