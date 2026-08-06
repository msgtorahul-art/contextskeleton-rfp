import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, processCreditDecrement } from '@/lib/stripe';
import { processSecIncidentEngine } from '@/lib/engines/secIncidentEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Strict Product-Level Access Check
  if (!hasBillingAccess(session, 'sec-incident')) {
    return NextResponse.json(
      { error: 'Product entitlement required. Your trial credits have expired. Please subscribe to SEC 4-Day Incident War Room to access this product.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const incidentNotes = body.incidentNotes || body.text || body.specText || body.description || '';
    const companyName = body.companyName || body.title || 'Public Enterprise Entity';

    if (!incidentNotes.trim()) {
      return NextResponse.json({ error: 'Breach incident triage notes are required' }, { status: 400 });
    }

    const result = await processSecIncidentEngine({
      companyName,
      incidentNotes,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    const response = NextResponse.json(result);
    processCreditDecrement(session, response);
    return response;
  } catch (error: any) {
    console.error('SEC Incident Engine Error:', error);
    return NextResponse.json({ error: 'Failed to evaluate breach materiality.' }, { status: 500 });
  }
}
