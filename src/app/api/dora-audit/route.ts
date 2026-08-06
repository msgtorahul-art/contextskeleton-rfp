import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getSession } from '@/lib/auth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { vendorName, systemSpec } = await req.json();

    const systemPrompt = `You are an EU Digital Operational Resilience Act (DORA) and NIS2 Technical Auditor.
Audit the submitted ICT vendor architecture against DORA Article 9 (Risk Framework), Article 28 (ICT Third-Party Risk), and NIS2 Supply Chain Security controls.

Return JSON matching:
{
  "summary": "High-level DORA Article 9/28 resilience compliance summary.",
  "items": [
    { "article": "DORA Article #", "status": "PASS" or "FAIL", "findings": "Finding text", "recommendation": "Fix recommendation" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nVendor: ' + vendorName + '\nSpec:\n' + systemSpec }] }]
    });

    const jsonMatch = (response.text || '').match(/\{[\s\S]*\}/);
    return NextResponse.json(JSON.parse(jsonMatch ? jsonMatch[0] : response.text || '{}'));
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to run DORA audit.' }, { status: 500 });
  }
}
