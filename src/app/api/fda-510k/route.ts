import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processFda510kEngine } from '@/lib/engines/fda510kEngine';

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(user.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to process FDA 510(k) submissions.' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const technicalSpec = body.technicalSpec || body.specText || body.text || body.description || '';
    const deviceName = body.deviceName || body.title || 'Medical Device';
    const predicateDevice = body.predicateDevice || 'Cleared Predicate K-Number';

    if (!technicalSpec.trim()) {
      return NextResponse.json({ error: 'Device technical specification is required.' }, { status: 400 });
    }

    const result = await processFda510kEngine({
      deviceName,
      predicateDevice,
      technicalSpec,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('FDA 510k Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process FDA 510(k) analysis.' }, { status: 500 });
  }
}
