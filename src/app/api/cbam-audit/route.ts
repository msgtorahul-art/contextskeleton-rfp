import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getSession } from '@/lib/auth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { goodsCategory, shipmentData } = await req.json();

    const systemPrompt = `You are an EU Carbon Border Adjustment Mechanism (CBAM) Customs Auditor.
Calculate embedded emissions and format customs declaration skeletons for steel, aluminum, fertilizers, or electronics imports under Regulation (EU) 2023/956.

Return JSON matching:
{
  "summary": "CBAM customs compliance summary & carbon certificate estimate.",
  "items": [
    { "parameter": "Metric Name", "value": "Calculated value", "status": "COMPLIANT" or "DEFICIT", "recommendation": "Fix recommendation" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nCategory: ' + goodsCategory + '\nShipment Data:\n' + shipmentData }] }]
    });

    const jsonMatch = (response.text || '').match(/\{[\s\S]*\}/);
    return NextResponse.json(JSON.parse(jsonMatch ? jsonMatch[0] : response.text || '{}'));
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to run CBAM audit.' }, { status: 500 });
  }
}
