import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, processCreditDecrement } from '@/lib/stripe';
import { processAiActEngine } from '@/lib/engines/aiActEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Strict Product-Level Access Check
  if (!hasBillingAccess(session, 'ai-act')) {
    return NextResponse.json(
      { error: 'Product entitlement required. Your trial credits have expired. Please subscribe to EU AI Act Annex IV Engine to access this product.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const systemSpec = body.technicalSpec || body.systemSpec || body.text || body.specText || body.description || '';
    const modelName = body.systemName || body.modelName || body.title || 'Enterprise AI Solution';

    if (!systemSpec.trim()) {
      return NextResponse.json({ error: 'Technical specification text is required' }, { status: 400 });
    }

    const result = await processAiActEngine({
      modelName,
      systemSpec,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    const response = NextResponse.json(result);
    processCreditDecrement(session, response);
    return response;
  } catch (error: any) {
    console.error('EU AI Act Engine Error:', error);
    return NextResponse.json({ error: 'Failed to process AI Act Annex IV audit.' }, { status: 500 });
  }
}
