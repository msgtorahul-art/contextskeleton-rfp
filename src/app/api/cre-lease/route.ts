import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getSession } from '@/lib/auth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { propertyAddress, leaseText } = await req.json();

    const systemPrompt = `You are a Commercial Real Estate (CRE) Lease Attorney & Due Diligence Abstractor.
Shred the submitted commercial lease agreement and extract a structured lease abstraction matrix:
1. Base Rent & Rent Escalation Schedules.
2. CAM Operating Expense Caps & Audit Rights.
3. Co-Tenancy Clauses & Exclusivity Rules.
4. Assignment & Subletting Limitations.

Return JSON matching:
{
  "summary": "Executive CRE lease abstraction summary.",
  "items": [
    { "clause": "Clause Name", "details": "Extracted terms", "riskFlag": "LOW" or "HIGH", "recommendation": "Recommendation" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nProperty: ' + propertyAddress + '\nLease Text:\n' + leaseText }] }]
    });

    const jsonMatch = (response.text || '').match(/\{[\s\S]*\}/);
    return NextResponse.json(JSON.parse(jsonMatch ? jsonMatch[0] : response.text || '{}'));
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to abstract CRE lease.' }, { status: 500 });
  }
}
