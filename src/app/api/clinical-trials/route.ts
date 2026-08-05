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

    const userDb = db.prepare('SELECT credits, subscription_status FROM users WHERE id = ?').get(user.userId) as any;
    if (userDb && userDb.subscription_status !== 'ACTIVE' && userDb.credits <= 0) {
      return NextResponse.json(
        { error: 'Subscription required. Please upgrade to Clinical Trial Pro plan to run patient eligibility audits.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { protocolTitle, phase, patientRecord } = body;

    if (!protocolTitle || !patientRecord) {
      return NextResponse.json({ error: 'Protocol title and patient clinical record are required.' }, { status: 400 });
    }

    const similarChunks = await findSimilarChunks(user.userId, patientRecord, 5);
    const vectorContext = similarChunks.map(c => `[Source Protocol: ${c.filename}]\n${c.content}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const prompt = `You are a Senior Clinical Research Investigator evaluating patient eligibility for an FDA / EMA clinical trial protocol.

Protocol Title: ${protocolTitle}
Trial Phase: ${phase || 'Phase II / III'}
Patient Clinical Summary & Lab History: ${patientRecord}

Retrieved Protocol Grounding Context:
${vectorContext || 'No custom trial protocol files uploaded. Relying on Good Clinical Practice (GCP) guidelines.'}

STRICT ZERO-FABRICATION RULE:
Evaluate inclusion/exclusion criteria strictly against the patient details provided.
DO NOT invent unmentioned lab values or medical conditions.

Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level patient eligibility summary, overall match score, and trial protocol compliance status.",
  "eligibilityStatus": "ELIGIBLE" | "EXCLUDED" | "FURTHER_TESTING_REQUIRED",
  "items": [
    {
      "criteriaType": "Inclusion Criteria — Biomarker Status",
      "requirement": "PD-L1 expression >= 50% by IHC 22C3 pharmDx",
      "status": "PASS" | "FAIL" | "DATA_MISSING",
      "clinicalRationale": "Specific rationale referencing patient lab values.",
      "investigatorAction": "Recommended next step for clinical trial coordinator."
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
    
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const resultJson = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(resultJson.items)) {
      resultJson.items = [];
    }

    if (userDb && userDb.subscription_status !== 'ACTIVE') {
      db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ?').run(user.userId);
    }

    return NextResponse.json(resultJson);
  } catch (err: any) {
    console.error('Clinical Trial Resolver Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process clinical trial eligibility analysis' }, { status: 500 });
  }
}
