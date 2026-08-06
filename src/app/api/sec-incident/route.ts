import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getSession } from '@/lib/auth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { companyName, incidentNotes } = await req.json();

    const systemPrompt = `You are a Senior Securities Counsel and Enterprise Breach Incident Response Attorney.
Evaluate cybersecurity incident responder notes against SEC Form 8-K Item 1.05 Materiality rules (4-day disclosure requirement).

Return JSON matching:
{
  "materialityAssessment": "Formal materiality determination (MATERIAL vs NON-MATERIAL).",
  "item105Draft": "Draft text for Form 8-K Item 1.05 disclosure.",
  "recommendedActions": ["Immediate forensic step 1", "Law enforcement notification step 2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nCompany: ' + companyName + '\nIncident Notes:\n' + incidentNotes }] }]
    });

    const jsonMatch = (response.text || '').match(/\{[\s\S]*\}/);
    return NextResponse.json(JSON.parse(jsonMatch ? jsonMatch[0] : response.text || '{}'));
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to evaluate incident materiality.' }, { status: 500 });
  }
}
