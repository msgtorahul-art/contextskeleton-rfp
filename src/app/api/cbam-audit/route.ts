import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processCbamEngine } from '@/lib/engines/cbamEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(session.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to calculate EU CBAM carbon certificates.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const shipmentData = body.shipmentData || body.text || body.specText || body.description || '';
    const goodsCategory = body.goodsCategory || body.title || 'Steel & Aluminum Imports';

    if (!shipmentData.trim()) {
      return NextResponse.json({ error: 'Bill of lading or supplier invoice data is required' }, { status: 400 });
    }

    const result = await processCbamEngine({
      goodsCategory,
      shipmentData,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(session.userId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('CBAM Audit Engine Error:', error);
    return NextResponse.json({ error: 'Failed to calculate CBAM carbon certificate values.' }, { status: 500 });
  }
}
