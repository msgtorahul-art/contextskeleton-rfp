import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processSoxAuditEngine } from '@/lib/engines/soxAuditEngine';

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(user.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run SOX 404 & SOC 1 Financial Audits.' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const controlNotes = body.controlNotes || body.text || body.specText || body.description || '';
    const companyName = body.companyName || body.title || 'Public Entity';
    const scope = body.scope || 'SOX Section 404 IT General Controls (ITGC)';

    if (!controlNotes.trim()) {
      return NextResponse.json({ error: 'Internal financial control notes are required.' }, { status: 400 });
    }

    const result = await processSoxAuditEngine({
      companyName,
      scope,
      controlNotes,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('SOX Audit Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process SOX 404 financial audit.' }, { status: 500 });
  }
}
