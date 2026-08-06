import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processAiActEngine } from '@/lib/engines/aiActEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(session.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to generate EU AI Act Annex IV technical documentation.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const systemSpec = body.systemSpec || body.specText || body.text || body.description || '';
    const modelName = body.modelName || body.title || 'Enterprise AI Model';

    if (!systemSpec.trim()) {
      return NextResponse.json({ error: 'AI model technical specification is required' }, { status: 400 });
    }

    const result = await processAiActEngine({
      modelName,
      systemSpec,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(session.userId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Act Engine Error:', error);
    return NextResponse.json({ error: 'Failed to process EU AI Act technical documentation audit.' }, { status: 500 });
  }
}
