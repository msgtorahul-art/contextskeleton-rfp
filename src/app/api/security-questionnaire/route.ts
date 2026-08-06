import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processSecurityEngine } from '@/lib/engines/securityEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(session.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to resolve security questionnaires.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const questionnaireText = body.questionnaireText || body.questionText || body.text || body.specText || body.description || '';

    if (!questionnaireText.trim()) {
      return NextResponse.json({ error: 'Security questionnaire text is required' }, { status: 400 });
    }

    const result = await processSecurityEngine({
      questionnaireText,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    decrementCredits(session.userId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Security Questionnaire Engine Error:', error);
    return NextResponse.json({ error: 'Failed to resolve security questionnaire.' }, { status: 500 });
  }
}
