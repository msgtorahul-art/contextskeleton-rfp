import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { processCreditDecrement, hasBillingAccess } from '@/lib/stripe';
import { processConsentEngine } from '@/lib/engines/consentEngine';

export async function POST(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Strict Per-Product Billing Access & Trial Credit Check
    if (!hasBillingAccess(session, 'consent')) {
      return NextResponse.json(
        { error: 'Product entitlement required. Your trial credits have expired. Please subscribe to NZ Building Consent Auditor to access this product.', code: 'PAYMENT_REQUIRED' },
        { status: 402 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const specText = (body.specText || body.specificationText || body.text || '').trim();
    const buildingType = body.buildingType || body.title || 'Residential / Commercial';
    const selectedClauses = body.selectedClauses;

    if (!specText || specText.length === 0) {
      return NextResponse.json({ error: 'Specification or drawing text is required' }, { status: 400 });
    }

    const result = await processConsentEngine({
      buildingType,
      specText,
      selectedClauses,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    const response = NextResponse.json(result);
    processCreditDecrement(session, response);
    return response;
  } catch (error) {
    console.error('Consent Audit Engine Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during consent audit.' }, { status: 500 });
  }
}
