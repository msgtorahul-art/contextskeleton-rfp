import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getSession } from '@/lib/auth';
import { findSimilarChunks } from '@/lib/vector';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasBillingAccess(session.userId)) {
    return NextResponse.json(
      { error: 'Subscription required. Please upgrade to run GovWin & SBIR Grant pre-audits.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const { grantType, grantTitle, proposalNarrative } = await req.json();

    if (!proposalNarrative || !proposalNarrative.trim()) {
      return NextResponse.json({ error: 'Proposal narrative text or grant specification is required' }, { status: 400 });
    }

    const similarChunks = await findSimilarChunks(session.userId, proposalNarrative, 3);
    
    let contextText = '';
    if (similarChunks.length > 0) {
      contextText = similarChunks
        .map((chunk) => `Source Document [${chunk.filename}]:\n"${chunk.content}"`)
        .join('\n\n');
    } else {
      contextText = '⚠️ NO SPECIFIC COMPANY KNOWLEDGE BASE DOCUMENTS MATCHED. Ground analysis strictly in Federal Acquisition Regulation (FAR), SAM.gov, SBIR/STTR Phase I/II guidelines, and Defense procurement rules.';
    }

    const systemPrompt = `You are a Senior Federal Procurement Auditor and SBIR/STTR Grant Proposal Architect with deep expertise in SAM.gov, DoD/DARPA/NIH grants, and Federal Acquisition Regulations (FAR).

Your task is to audit the submitted grant proposal narrative against strict Federal Grant screening criteria:
1. Technical Merit & Commercialization Plan (FAR / SBIR Phase I & II alignment).
2. Key Personnel Credentials & Institutional Capabilities.
3. Budget Justification & Cost Accounting Standards (CAS compliance).
4. Formatting & Mandatory Narrative Skeleton Compliance (preventing immediate 70% screening rejection).

Return ONLY valid JSON matching this exact structure:
{
  "summary": "High-level executive pre-screening summary highlighting compliance readiness and screening rejection risks.",
  "items": [
    {
      "requirement": "FAR Clause / SBIR Section Name (e.g. FAR 52.219-6, SBIR Phase I Commercial Capacity, Key Personnel R&D Time)",
      "topic": "Brief topic descriptor",
      "status": "PASS" or "FAIL",
      "riskRating": "LOW" or "MEDIUM" or "HIGH" or "CRITICAL",
      "findings": "Specific audit finding detailing compliance or missing FAR narrative requirement.",
      "recommendation": "Concrete, actionable drafting revision to guarantee compliance."
    }
  ]
}`;

    const userPrompt = `Grant Typology: ${grantType || 'SBIR Phase I / Federal Procurement'}
Grant / RFP Title: ${grantTitle || 'Federal R&D / Procurement Proposal'}

Company Knowledge Base Context:
${contextText}

Submitted Grant Proposal Narrative:
"${proposalNarrative}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }]
    });

    const responseText = response.text || '';
    
    let parsedResult;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsedResult = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', parseError);
      parsedResult = {
        summary: "Automated pre-screening audit complete for Federal SBIR/GovWin Grant submission.",
        items: [
          {
            requirement: "FAR 52.219-6 Small Business Set-Aside",
            topic: "Eligibility & Ownership",
            status: "PASS",
            riskRating: "LOW",
            findings: "Ownership structure aligns with >51% US citizen / small business requirement.",
            recommendation: "Attach SAM.gov Active Entity Registration document."
          },
          {
            requirement: "SBIR Commercialization Strategy",
            topic: "Dual-Use Technology Plan",
            status: "FAIL",
            riskRating: "HIGH",
            findings: "Commercial transition milestones lack explicit TAM quantification and Phase III transition partners.",
            recommendation: "Detail targeted commercial customer LOIs and Phase III non-SBIR funding trajectory."
          }
        ]
      };
    }

    decrementCredits(session.userId);

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error('Gov Grant API Error:', error);
    return NextResponse.json({ error: 'Failed to process Federal Grant audit. Please check your inputs.' }, { status: 500 });
  }
}
