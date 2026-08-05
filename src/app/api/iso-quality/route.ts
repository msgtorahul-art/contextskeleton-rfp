import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { findSimilarChunks } from '@/lib/vector';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = getSession(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check credits/subscription
    const userDb = db.prepare('SELECT credits, subscription_status FROM users WHERE id = ?').get(user.userId) as any;
    if (userDb && userDb.subscription_status !== 'ACTIVE' && userDb.credits <= 0) {
      return NextResponse.json(
        { error: 'Subscription required. Please upgrade to ISO Quality Pro plan to run quality system audits.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { plantName, qualityStandard, auditData } = body;

    if (!plantName || !auditData) {
      return NextResponse.json({ error: 'Plant name and quality audit data are required.' }, { status: 400 });
    }

    // Perform vector search over user uploaded Quality Manuals
    const similarChunks = await findSimilarChunks(user.userId, auditData, 5);
    const vectorContext = similarChunks.map(c => `[Source Quality Manual: ${c.filename}]\n${c.content}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const prompt = `You are a Lead ISO 9001 / AS9100 Quality Systems Auditor evaluating manufacturing operations, supplier non-conformance reports (NCR), and Corrective Action (CAPA) logs.

Facility / Plant Name: ${plantName}
Quality Standard: ${qualityStandard || 'ISO 9001:2015 / AS9100D Aerospace'}
Audit Inspection & CAPA Data: ${auditData}

Retrieved Quality Manual Context:
${vectorContext || 'No custom quality manual uploaded. Relying on ISO 9001:2015 & AS9100D standards.'}

Evaluate Clause 8.5 Production & Service Provision, Clause 8.7 Non-Conforming Outputs, Clause 10.2 Non-conformity and Corrective Action, and Calibration Traceability.
Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level quality audit executive summary, overall non-conformance risk, and ISO certification status.",
  "auditRating": "PASS_CONFORMANT" | "MINOR_NON_CONFORMANCE" | "MAJOR_NON_CONFORMANCE",
  "items": [
    {
      "clauseSection": "ISO 9001:2015 Clause 8.7 — Control of Non-Conforming Outputs",
      "nonConformance": "Out-of-spec titanium aerospace forgings quarantined without documented disposition root-cause analysis.",
      "status": "CONFORMANT" | "MINOR_NC" | "MAJOR_NC",
      "isoRationale": "Specific rationale referencing ISO 9001 / AS9100 clauses.",
      "capaAction": "Recommended corrective and preventive action (CAPA)."
    }
  ]
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON block
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const resultJson = JSON.parse(jsonMatch[0]);

    // Decrement credits if not pro
    if (userDb && userDb.subscription_status !== 'ACTIVE') {
      db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ?').run(user.userId);
    }

    return NextResponse.json(resultJson);
  } catch (err: any) {
    console.error('ISO Quality Resolver Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process ISO quality system audit' }, { status: 500 });
  }
}
