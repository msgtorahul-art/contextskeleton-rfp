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
        { error: 'Subscription required. Please upgrade to MedTech Regulatory Pro plan to run 510(k) audits.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { deviceName, deviceClass, predicateDevice, specifications } = body;

    if (!deviceName || !specifications) {
      return NextResponse.json({ error: 'Device name and technical specifications are required.' }, { status: 400 });
    }

    // Perform vector search over user uploaded regulatory files
    const similarChunks = await findSimilarChunks(user.userId, specifications, 5);
    const vectorContext = similarChunks.map(c => `[Source Document: ${c.filename}]\n${c.content}`).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const prompt = `You are an expert FDA Regulatory Affairs Specialist analyzing a medical device pre-market notification (510k) and ISO 13485 quality system submission.

Device Name: ${deviceName}
Device Classification: ${deviceClass || 'Class II'}
Predicate Device: ${predicateDevice || 'K190000 Equivalent'}
Technical Specs & Intended Use: ${specifications}

Retrieved Regulatory Grounding Context:
${vectorContext || 'No custom regulatory whitepapers uploaded. Relying on FDA 21 CFR Part 820 & ISO 13485 standards.'}

Evaluate the medical device for FDA 510(k) Substantial Equivalence, ISO 13485 Design Controls, and ISO 14971 Risk Management.
Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level regulatory summary of 510(k) substantial equivalence and risk profile.",
  "predicateComparison": "Detailed evaluation comparing subject device to predicate device.",
  "items": [
    {
      "clause": "21 CFR 820.30(c) / ISO 13485",
      "topic": "Design Inputs & Intended Use",
      "status": "PASS",
      "riskRating": "LOW",
      "regulatoryRationale": "Specific rationale referencing FDA guidelines.",
      "recommendedRemediation": "Step-by-step action for regulatory team."
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
    console.error('FDA 510k Resolver Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process FDA 510k regulatory analysis' }, { status: 500 });
  }
}
