import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processEsgEngine } from '@/lib/engines/esgEngine';

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(user.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run ESG & CSRD Climate Audits.' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const esgData = body.esgData || body.text || body.specText || body.description || '';
    const companyName = body.companyName || body.title || 'Enterprise Entity';
    const framework = body.framework || 'EU CSRD / ESRS & SEC Climate Rules';

    if (!esgData.trim()) {
      return NextResponse.json({ error: 'ESG metric data is required.' }, { status: 400 });
    }

    const result = await processEsgEngine({
      companyName,
      framework,
      esgData,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('ESG Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process ESG climate audit.' }, { status: 500 });
  }
}
