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
        { error: 'Subscription required. Please upgrade to SOX Controls Pro plan to run ICFR financial audits.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { companyName, auditStandard, controlManifest } = body;

    if (!companyName || !controlManifest) {
      return NextResponse.json({ error: 'Company name and financial control manifest are required.' }, { status: 400 });
    }

    const similarChunks = await findSimilarChunks(user.userId, controlManifest, 5);
    const vectorContext = similarChunks.map(c => `[Source SOX Doc: ${c.filename}]\n${c.content}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const prompt = `You are a Senior Internal Audit Director evaluating financial controls under SOX Section 404, PCAOB Auditing Standards (AS 2201), and SSAE 18 SOC 1 Type II ITGC standards.

Company / Enterprise Name: ${companyName}
Audit Framework Standard: ${auditStandard || 'SOX Section 404 / SSAE 18 SOC 1'}
Financial Control Audit Log & ITGC Manifest: ${controlManifest}

Retrieved Grounding Financial Control Context:
${vectorContext || 'No custom SOX policy uploaded. Relying on PCAOB ICFR and COSO framework guidelines.'}

STRICT ZERO-FABRICATION RULE:
Evaluate controls strictly against the details provided in the user input.
DO NOT invent unmentioned financial transactions or IT system access logs.

Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level financial control audit executive summary, deficiency level, and PCAOB compliance rating.",
  "controlDeficiencyLevel": "EFFECTIVE" | "CONTROL_DEFICIENCY" | "SIGNIFICANT_DEFICIENCY" | "MATERIAL_WEAKNESS",
  "items": [
    {
      "controlCategory": "SOX FIN-201 — Journal Entry Approvals",
      "controlActivity": "Manual journal entry exceeding $500,000 posted without secondary sign-off.",
      "status": "EFFECTIVE" | "DEFICIENT" | "MATERIAL_WEAKNESS",
      "soxRationale": "Specific rationale referencing PCAOB standards.",
      "remediationAction": "Actionable step for internal audit remediation."
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
    console.error('SOX Audit Resolver Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process financial controls audit' }, { status: 500 });
  }
}
