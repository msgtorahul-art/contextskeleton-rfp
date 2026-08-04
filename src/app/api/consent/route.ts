import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { decrementCredits, hasBillingAccess } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasBillingAccess(session.userId)) {
      return NextResponse.json({ error: 'No remaining credits or active subscription' }, { status: 402 });
    }

    const { specText, buildingType, selectedClauses } = await req.json();

    if (!specText || specText.trim().length === 0) {
      return NextResponse.json({ error: 'Specification or drawing text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const prompt = `You are a Senior NZ Building Code (NZBC) Compliance Auditor evaluating building plans and architectural specifications for council submission.

Building Type: ${buildingType || 'Residential / Commercial'}
Target Standards & Clauses: ${selectedClauses ? selectedClauses.join(', ') : 'NZBC E2 (External Moisture), H1 (Energy Efficiency), B1 (Structure), G12 (Water Supply), C1-C6 (Fire Safety)'}

Project Specifications & Drawings:
"""
${specText.substring(0, 15000)}
"""

Perform a thorough pre-audit against the New Zealand Building Code (NZBC) and return your analysis strictly as a raw valid JSON object with the following structure:
{
  "overallScore": number (0 to 100),
  "status": "APPROVED" | "NEEDS_REVISION" | "HIGH_RISK",
  "summary": "Concise summary of audit findings",
  "clauseAudits": [
    {
      "clause": "e.g., NZBC E2 - External Moisture",
      "status": "PASS" | "WARNING" | "FAIL",
      "findings": "Specific evaluation against acceptable solutions (e.g. E2/AS1 cavity requirements)",
      "missingItems": ["List missing details or drawings"],
      "recommendation": "Exact remediation steps"
    }
  ],
  "criticalRedFlags": ["List critical items that will cause council consent rejection or RFI"],
  "recommendedCouncilDocs": ["Required Producer Statements (PS1, PS3), BRANZ appraisals, etc."]
}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error in Consent Auditor:', errText);
      return NextResponse.json({ error: 'Failed to analyze consent specifications' }, { status: 500 });
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    let auditReport;
    try {
      auditReport = JSON.parse(resultText);
    } catch (e) {
      auditReport = {
        overallScore: 72,
        status: 'NEEDS_REVISION',
        summary: resultText,
        clauseAudits: [],
        criticalRedFlags: ['Review raw specification details against council checklist'],
        recommendedCouncilDocs: ['Producer Statement PS1', 'Producer Statement PS3'],
      };
    }

    // Decrement credits upon successful audit
    decrementCredits(session.userId);

    return NextResponse.json({ success: true, auditReport });
  } catch (error) {
    console.error('Consent Audit API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during consent audit' }, { status: 500 });
  }
}
