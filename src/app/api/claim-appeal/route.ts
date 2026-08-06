import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, processCreditDecrement } from '@/lib/stripe';
import { processClaimAppealEngine } from '@/lib/engines/claimAppealEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Allow trial credit generations across Medical Claim Appeal
  if (!hasBillingAccess(session, 'claim-appeal')) {
    return NextResponse.json(
      { error: 'Product entitlement required. Your trial credits have expired. Please subscribe to Medical Claim Appeal Architect to generate medical claim appeal letters.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const patientNotes = (
      body.patientClinicalNotes || 
      body.patientNotes || 
      body.text || 
      body.specText || 
      body.description || ''
    ).trim();

    const denialReason = body.denialReason || 'Lack of Medical Necessity';
    const cptCode = body.cptCodes || body.cptCode || body.title || 'CPT 27447';

    if (!patientNotes) {
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

    const response = NextResponse.json(result);
    processCreditDecrement(session, response);
    return response;
  } catch (error: any) {
    console.error('Claim Appeal Engine Error:', error);
    return NextResponse.json({ error: 'Failed to process claim appeal letter.' }, { status: 500 });
  }
}
