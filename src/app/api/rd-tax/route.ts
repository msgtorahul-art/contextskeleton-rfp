import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processRdTaxEngine } from '@/lib/engines/rdTaxEngine';

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(user.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run R&D Tax credit audits.' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    // Accept all frontend payload key aliases
    const projectDescription = body.projectDescription || body.description || body.specText || body.text || '';
    const projectName = body.projectName || body.title || 'R&D Technical Project';
    const taxJurisdiction = body.taxJurisdiction || 'NZ IRD (15% RDTI)';

    if (!projectDescription.trim()) {
      return NextResponse.json({ error: 'Project name and technical description are required.' }, { status: 400 });
    }

    const result = await processRdTaxEngine({
      projectName,
      taxJurisdiction,
      projectDescription,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('R&D Tax Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process R&D tax analysis.' }, { status: 500 });
  }
}
