import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processEhsSafetyEngine } from '@/lib/engines/ehsSafetyEngine';

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(user.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run OSHA & EHS Safety Audits.' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const hazardNotes = body.hazardNotes || body.text || body.specText || body.description || '';
    const facilityName = body.facilityName || body.title || 'Industrial Facility';
    const standards = body.standards || 'OSHA 1910 General Industry & ISO 45001';

    if (!hazardNotes.trim()) {
      return NextResponse.json({ error: 'Hazard notes or safety logs are required.' }, { status: 400 });
    }

    const result = await processEhsSafetyEngine({
      facilityName,
      standards,
      hazardNotes,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('EHS Safety Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process EHS safety audit.' }, { status: 500 });
  }
}
