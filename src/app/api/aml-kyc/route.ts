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
        { error: 'Subscription required. Please upgrade to AML/KYC Pro plan to run anti-money laundering risk audits.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { entityName, amlFramework, transactionData } = body;

    if (!entityName || !transactionData) {
      return NextResponse.json({ error: 'Entity name and transaction/onboarding data are required.' }, { status: 400 });
    }

    // Perform vector search over user uploaded AML policy docs
    const similarChunks = await findSimilarChunks(user.userId, transactionData, 5);
    const vectorContext = similarChunks.map(c => `[Source Policy: ${c.filename}]\n${c.content}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const prompt = `You are a Senior Anti-Money Laundering Compliance Officer evaluating customer onboarding logs and transaction manifests against Financial Action Task Force (FATF) standards, US Bank Secrecy Act (BSA), and EU 6th Anti-Money Laundering Directive (6AMLD).

Entity / Customer Name: ${entityName}
AML Regulatory Framework: ${amlFramework || 'FATF Recommendations / BSA / EU 6AMLD'}
Transaction & KYC Manifest: ${transactionData}

Retrieved Grounding AML Policy Context:
${vectorContext || 'No custom AML policy files uploaded. Relying on FATF standards.'}

Evaluate Politically Exposed Persons (PEP) risk, OFAC sanctions exposure, rapid velocity transfers, shell company indicators, and structured structuring/smurfing patterns.
Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level AML risk executive summary, customer risk score, and statutory compliance status.",
  "riskRating": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "items": [
    {
      "riskCategory": "Beneficial Ownership & Shell Company Screening",
      "flaggedIndicator": "Layered offshore entity holding 75% equity without verified UBO documentation.",
      "status": "PASS" | "SUSPICIOUS_PATTERN" | "SANCTION_FLAG",
      "amlRationale": "Specific rationale referencing FATF Recommendation 24.",
      "complianceAction": "Actionable step for compliance officer."
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
    console.error('AML/KYC Resolver Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process AML/KYC risk analysis' }, { status: 500 });
  }
}
