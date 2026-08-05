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
        { error: 'Subscription required. Please upgrade to R&D Tax Pro plan to run R&D tax credit audits.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { projectName, taxJurisdiction, projectDescription } = body;

    if (!projectName || !projectDescription) {
      return NextResponse.json({ error: 'Project name and technical description are required.' }, { status: 400 });
    }

    // Perform vector search over user uploaded project & technical files
    const similarChunks = await findSimilarChunks(user.userId, projectDescription, 5);
    const vectorContext = similarChunks.map(c => `[Source File: ${c.filename}]\n${c.content}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const prompt = `You are a Senior R&D Tax Credit Specialist evaluating a technical project for statutory R&D Tax Incentives.

Project Name: ${projectName}
Tax Jurisdiction: ${taxJurisdiction || 'NZ IRD (15% RDTI) / ATO / IRS Section 41'}
Technical Description & Sprint Logs: ${projectDescription}

Retrieved Project Grounding Context:
${vectorContext || 'No uploaded project files found. Relying on statutory R&D tax guidelines.'}

Evaluate the technical activities to determine eligibility under tax law definitions of "systematic investigation attempting to resolve scientific/technological uncertainty."
Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level R&D tax credit audit summary and total estimated claim viability.",
  "technicalJustification": "Formal R&D technical justification narrative formatted for tax authority audit defense.",
  "items": [
    {
      "activityName": "Algorithm Optimization & Parallel Processing",
      "classification": "ELIGIBLE_CORE_RD" | "SUPPORTING_RD" | "INELIGIBLE_OPERATIONAL",
      "uncertaintyType": "Technological Uncertainty regarding memory constraints",
      "auditRisk": "LOW" | "MEDIUM" | "HIGH",
      "taxRationale": "Detailed tax law rationale referencing IRD/ATO/IRS guidelines.",
      "documentationRecommendation": "Specific logs/git commits to archive for tax audit defense."
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
    console.error('R&D Tax Resolver Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process R&D tax analysis' }, { status: 500 });
  }
}
