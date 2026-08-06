import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processDoraEngine } from '@/lib/engines/doraEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(session.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run DORA ICT resilience audits.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const systemSpec = body.systemSpec || body.specText || body.text || body.description || '';
    const vendorName = body.vendorName || body.title || 'ICT Vendor / Subcontractor';

    if (!systemSpec.trim()) {
      return NextResponse.json({ error: 'ICT vendor infrastructure description is required' }, { status: 400 });
    }

    const result = await processDoraEngine({
      vendorName,
      systemSpec,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(session.userId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('DORA Audit Engine Error:', error);
    return NextResponse.json({ error: 'Failed to process DORA ICT resilience audit.' }, { status: 500 });
  }
}
