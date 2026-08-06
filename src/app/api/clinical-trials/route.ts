import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processClinicalTrialsEngine } from '@/lib/engines/clinicalTrialsEngine';

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(user.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run Clinical Trial Protocol Audits.' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const protocolText = body.protocolText || body.text || body.specText || body.description || '';
    const trialTitle = body.trialTitle || body.title || 'Clinical Study Protocol';
    const phase = body.phase || 'Phase II / III';

    if (!protocolText.trim()) {
      return NextResponse.json({ error: 'Clinical trial protocol text is required.' }, { status: 400 });
    }

    const result = await processClinicalTrialsEngine({
      trialTitle,
      phase,
      protocolText,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Clinical Trials Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process Clinical Trial Protocol audit.' }, { status: 500 });
  }
}
