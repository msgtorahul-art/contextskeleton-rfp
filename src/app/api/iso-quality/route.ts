import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processIsoQualityEngine } from '@/lib/engines/isoQualityEngine';

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(user.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run ISO 9001 & AS9100 Quality Audits.' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const qmsNotes = body.qmsNotes || body.text || body.specText || body.description || '';
    const organizationName = body.organizationName || body.title || 'Manufacturing Enterprise';
    const standard = body.standard || 'ISO 9001:2015 / AS9100D Aerospace';

    if (!qmsNotes.trim()) {
      return NextResponse.json({ error: 'QMS process notes or audit logs are required.' }, { status: 400 });
    }

    const result = await processIsoQualityEngine({
      organizationName,
      standard,
      qmsNotes,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('ISO Quality Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process ISO quality audit.' }, { status: 500 });
  }
}
