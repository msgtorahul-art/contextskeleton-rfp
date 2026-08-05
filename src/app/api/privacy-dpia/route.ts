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
        { error: 'Subscription required. Please upgrade to Privacy DPIA Pro plan to run data protection audits.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { systemName, privacyStandard, dataFlowSummary } = body;

    if (!systemName || !dataFlowSummary) {
      return NextResponse.json({ error: 'System name and data flow summary are required.' }, { status: 400 });
    }

    // Perform vector search over user uploaded privacy/DPA policies
    const similarChunks = await findSimilarChunks(user.userId, dataFlowSummary, 5);
    const vectorContext = similarChunks.map(c => `[Source Policy: ${c.filename}]\n${c.content}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const prompt = `You are a Senior Data Protection Officer (DPO) evaluating a system architecture for EU GDPR Article 35 (Data Protection Impact Assessment) and HIPAA Security Rule (§ 164.308) compliance.

System / Product Name: ${systemName}
Privacy Standard: ${privacyStandard || 'EU GDPR Article 35 & HIPAA Security Rule'}
Data Flow & Subprocessor Manifest: ${dataFlowSummary}

Retrieved Grounding Privacy Policy Context:
${vectorContext || 'No custom DPA files uploaded. Relying on GDPR Article 35 and HIPAA guidelines.'}

Evaluate PII/PHI data processing, cross-border transfer mechanisms (SCCs), subprocessor DPAs, encryption-at-rest/transit, and data subject access rights (DSAR).
Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level DPIA executive summary, privacy risk score, and regulatory compliance status.",
  "riskRating": "LOW" | "MEDIUM" | "HIGH",
  "items": [
    {
      "privacyArea": "EU GDPR Article 35(3)(a) — Automated Decision Making & Profiling",
      "requirement": "Explicit DPIA required for automated processing producing legal effects.",
      "status": "COMPLIANT" | "REMEDIATION_REQUIRED" | "HIGH_RISK_TRIGGER",
      "dpoRationale": "Specific rationale referencing GDPR / HIPAA regulations.",
      "remediationAction": "Actionable step for privacy compliance remediation."
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
    console.error('Privacy DPIA Resolver Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process privacy impact assessment' }, { status: 500 });
  }
}
