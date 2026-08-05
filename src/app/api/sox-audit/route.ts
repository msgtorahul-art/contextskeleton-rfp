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
        { error: 'Subscription required. Please upgrade to SOX Financial Controls Pro plan to run audit evaluations.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { companyName, auditStandard, controlManifest } = body;

    if (!companyName || !controlManifest) {
      return NextResponse.json({ error: 'Company name and financial control manifest are required.' }, { status: 400 });
    }

    // Perform vector search over user uploaded SOX policy docs
    const similarChunks = await findSimilarChunks(user.userId, controlManifest, 5);
    const vectorContext = similarChunks.map(c => `[Source Control Policy: ${c.filename}]\n${c.content}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const prompt = `You are a Senior Internal Audit Director evaluating Sarbanes-Oxley (SOX) Section 404 financial reporting controls and SSAE 18 SOC 1 Type II IT General Controls (ITGC).

Company Name: ${companyName}
Audit Standard: ${auditStandard || 'SOX Section 404 / SSAE 18 SOC 1 Type II'}
Financial Controls & ITGC Manifest: ${controlManifest}

Retrieved Grounding Control Policy Context:
${vectorContext || 'No custom control policy uploaded. Relying on PCAOB auditing standards and COSO framework.'}

Evaluate Segregation of Duties (SoD), Financial Close Journal Entry Approvals, ITGC Change Management, User Access Reviews, and Automated Application Controls.
Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level SOX 404 audit executive summary, material weakness exposure, and internal control effectiveness.",
  "controlDeficiencyLevel": "EFFECTIVE" | "SIGNIFICANT_DEFICIENCY" | "MATERIAL_WEAKNESS",
  "items": [
    {
      "controlCategory": "ITGC — User Access & Segregation of Duties (SoD)",
      "controlActivity": "Quarterly user access review for SAP ERP financial ledger.",
      "status": "EFFECTIVE" | "DEFICIENCY" | "MATERIAL_WEAKNESS",
      "soxRationale": "Specific rationale referencing COSO framework & PCAOB standards.",
      "remediationAction": "Actionable step for audit remediation."
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
    console.error('SOX Audit Resolver Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process SOX financial controls analysis' }, { status: 500 });
  }
}
