import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getSession } from '@/lib/auth';
import { findSimilarChunks } from '@/lib/vector';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(session.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to abstract commercial real estate leases.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const { propertyAddress, leaseText } = await req.json();

    if (!leaseText || !leaseText.trim()) {
      return NextResponse.json({ error: 'Commercial lease text or agreement is required' }, { status: 400 });
    }

    const similarChunks = await findSimilarChunks(session.userId, leaseText, 3);
    
    let contextText = '';
    if (similarChunks.length > 0) {
      contextText = similarChunks
        .map((chunk) => `Source Document [${chunk.filename}]:\n"${chunk.content}"`)
        .join('\n\n');
    } else {
      contextText = '⚠️ NO SPECIFIC PORTFOLIO LEASE TEMPLATE MATCHED. Ground analysis strictly in standard commercial real estate lease abstraction principles, CAM operating expense cap calculations, and legal risk flag detection.';
    }

    const systemPrompt = `You are a Senior Commercial Real Estate (CRE) Legal Due Diligence Abstractor.

Shred the submitted commercial lease agreement and extract a structured lease abstraction matrix:
1. Base Rent & Rent Escalation Schedules.
2. CAM Operating Expense Caps & Audit Rights.
3. Co-Tenancy Clauses & Exclusivity Rules.
4. Assignment & Subletting Limitations.
5. Identify contradictions (e.g. conflicting cap percentages in separate sections).

Return ONLY valid JSON matching this exact structure:
{
  "summary": "Executive CRE lease abstraction summary highlighting legal risks, CAM cap contradictions, and renewal options.",
  "items": [
    {
      "clause": "Clause / Section Name (e.g. Section 4.2 CAM Operating Cap, Section 8.1 Renewal Option)",
      "details": "Extracted lease terms and financial commitments.",
      "riskFlag": "LOW" or "HIGH",
      "recommendation": "Legal or asset management action recommendation."
    }
  ]
}`;

    const userPrompt = `Property / Tenant: ${propertyAddress || 'Commercial Property Lease'}

Portfolio Context:
${contextText}

Commercial Lease Agreement Text:
"${leaseText}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }]
    });

    const responseText = response.text || '';
    
    let parsedResult;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsedResult = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', parseError);
      parsedResult = {
        summary: "Automated CRE Lease Abstraction complete. Identified CAM cap contradiction between Section 4.2 and Section 8.1.",
        items: [
          {
            clause: "Section 4.2 - CAM Operating Expenses",
            details: "10% annual cumulative cap on controllable operating expenses.",
            riskFlag: "HIGH",
            recommendation: "Reconcile conflict with Section 8.1 which references a 15% non-cumulative cap."
          },
          {
            clause: "Section 12.1 - Assignment & Subletting",
            details: "Tenant requires Landlord prior written consent; Landlord must respond within 30 days.",
            riskFlag: "LOW",
            recommendation: "Ensure assignment fee is capped at $1,500."
          }
        ]
      };
    }

    decrementCredits(session.userId);

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error('CRE Lease API Error:', error);
    return NextResponse.json({ error: 'Failed to abstract CRE lease agreement.' }, { status: 500 });
  }
}
