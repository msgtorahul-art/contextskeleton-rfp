import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processPrivacyDpiaEngine } from '@/lib/engines/privacyDpiaEngine';

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(user.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run GDPR & HIPAA Privacy DPIA Audits.' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const dataFlowNotes = body.dataFlowNotes || body.text || body.specText || body.description || '';
    const systemName = body.systemName || body.title || 'Enterprise System';
    const framework = body.framework || 'EU GDPR Article 35 & HIPAA Security Rule';

    if (!dataFlowNotes.trim()) {
      return NextResponse.json({ error: 'Data flow and processing notes are required.' }, { status: 400 });
    }

    const result = await processPrivacyDpiaEngine({
      systemName,
      framework,
      dataFlowNotes,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Privacy DPIA Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process Privacy DPIA audit.' }, { status: 500 });
  }
}
