import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, processCreditDecrement } from '@/lib/stripe';
import { processSecurityEngine } from '@/lib/engines/securityEngine';

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Strict Product-Level Access Check
  if (!hasBillingAccess(session, 'security-questionnaire')) {
    return NextResponse.json(
      { error: 'Product entitlement required. Your trial credits have expired. Please subscribe to SOC 2 & ISO 27001 Security Resolver to access this product.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    
    let questionnaireText = '';

    if (Array.isArray(body.questions) && body.questions.length > 0) {
      questionnaireText = body.questions.join('\n');
    } else if (typeof body.questionnaireText === 'string') {
      questionnaireText = body.questionnaireText;
    } else if (typeof body.questionText === 'string') {
      questionnaireText = body.questionText;
    } else if (typeof body.text === 'string') {
      questionnaireText = body.text;
    } else if (typeof body.specText === 'string') {
      questionnaireText = body.specText;
    } else if (typeof body.description === 'string') {
      questionnaireText = body.description;
    }

    if (!questionnaireText.trim()) {
      return NextResponse.json({ error: 'Security questionnaire text is required' }, { status: 400 });
    }

    const result = await processSecurityEngine({
      questionnaireText,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    const response = NextResponse.json(result);
    processCreditDecrement(session, response);
    return response;
  } catch (error: any) {
    console.error('Security Questionnaire Engine Error:', error);
    return NextResponse.json({ error: 'Failed to resolve security questionnaire.' }, { status: 500 });
  }
}
