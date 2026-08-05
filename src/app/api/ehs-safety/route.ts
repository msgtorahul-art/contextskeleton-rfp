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
        { error: 'Subscription required. Please upgrade to EHS Safety Pro plan to run OSHA workplace safety audits.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { facilityName, safetyStandard, incidentData } = body;

    if (!facilityName || !incidentData) {
      return NextResponse.json({ error: 'Facility name and workplace incident/safety data are required.' }, { status: 400 });
    }

    const similarChunks = await findSimilarChunks(user.userId, incidentData, 5);
    const vectorContext = similarChunks.map(c => `[Source Safety Doc: ${c.filename}]\n${c.content}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const prompt = `You are a Senior Environmental Health & Safety (EHS) Director auditing a manufacturing or construction facility against OSHA 1910 General Industry Standards, OSHA 1926 Construction Standards, and ISO 45001 Occupational Health and Safety.

Facility / Site Name: ${facilityName}
Workplace Safety Standard: ${safetyStandard || 'OSHA 1910 / ISO 45001'}
Safety Incident & Machinery Hazard Manifest: ${incidentData}

Retrieved Grounding Safety Manual Context:
${vectorContext || 'No custom safety manual uploaded. Relying on OSHA 1910 and ISO 45001 standards.'}

STRICT ZERO-FABRICATION RULE:
You must ONLY evaluate the exact hazards, machinery, equipment, and incidents explicitly described in the input or grounding context.
DO NOT INVENT OR FABRICATE unmentioned equipment or activities (e.g. DO NOT invent cranes, concrete pumps, equipment servicing, or LOTO violations if they were not explicitly mentioned in the user input).
If a compliance domain (such as LOTO or GHS MSDS) is not described in the user input, set hazardObserved to "No details provided in input for this domain." and status to "DOCUMENTATION_GAP".

Evaluate ONLY provided details against OSHA 1910.147 (LOTO), 1910.1200 (GHS MSDS), 1910.132 (PPE), Fall Protection, and Machine Guarding.
Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level EHS safety risk executive summary, workplace hazard rating, and OSHA compliance status.",
  "hazardRating": "LOW" | "MEDIUM" | "HIGH" | "IMMINENT_DANGER",
  "items": [
    {
      "safetyCategory": "OSHA 1910 Standard Category",
      "hazardObserved": "Exact hazard described in input.",
      "status": "COMPLIANT" | "VIOLATION_HAZARD" | "DOCUMENTATION_GAP",
      "oshaRationale": "Specific rationale referencing OSHA 1910 standards.",
      "correctiveAction": "Actionable step for workplace safety remediation."
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
    console.error('EHS Safety Resolver Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process EHS safety risk analysis' }, { status: 500 });
  }
}
