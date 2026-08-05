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
        { error: 'Subscription required. Please upgrade to ESG Climate Pro plan to run CSRD audits.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { companyName, esgStandard, supplyChainData } = body;

    if (!companyName || !supplyChainData) {
      return NextResponse.json({ error: 'Company name and supply chain data are required.' }, { status: 400 });
    }

    // Perform vector search over user uploaded ESG manifests
    const similarChunks = await findSimilarChunks(user.userId, supplyChainData, 5);
    const vectorContext = similarChunks.map(c => `[Source Manifest: ${c.filename}]\n${c.content}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const prompt = `You are a Senior ESG & Climate Sustainability Auditor evaluating a corporate supply chain for EU CSRD and ISSB IFRS S2 disclosures.

Company Name: ${companyName}
Reporting Framework: ${esgStandard || 'EU CSRD / ISSB IFRS S2 / GRI'}
Supply Chain & Utility Data: ${supplyChainData}

Retrieved Sustainability Grounding Context:
${vectorContext || 'No uploaded supplier manifests found. Relying on GHG Protocol & CSRD standards.'}

Evaluate Scope 1 (Direct), Scope 2 (Purchased Energy), and Scope 3 (Supply Chain & Business Travel) carbon emissions and climate risk exposure.
Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level climate audit summary, total GHG emissions estimate, and CSRD compliance status.",
  "scopeBreakdown": "Detailed breakdown comparing Scope 1, Scope 2, and Scope 3 supplier carbon footprints.",
  "items": [
    {
      "scopeCategory": "Scope 3 — Upstream Freight & Procurement",
      "metric": "Logistics Carbon Intensity (tCO2e)",
      "status": "PASS" | "ACTION_REQUIRED" | "DATA_GAP",
      "riskRating": "LOW" | "MEDIUM" | "HIGH",
      "esgRationale": "Specific rationale referencing EU CSRD / ISSB guidelines.",
      "decarbonizationAction": "Actionable step for decarbonization."
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
    console.error('ESG Resolver Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process ESG climate analysis' }, { status: 500 });
  }
}
