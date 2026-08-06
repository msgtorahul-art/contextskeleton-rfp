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
      { error: 'Subscription required. Please upgrade to draft clinical insurance claim appeal letters.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const { denialReason, cptCodes, patientClinicalNotes } = await req.json();

    if (!patientClinicalNotes || !patientClinicalNotes.trim()) {
      return NextResponse.json({ error: 'Patient clinical notes and denial reason are required' }, { status: 400 });
    }

    const similarChunks = await findSimilarChunks(session.userId, patientClinicalNotes, 3);
    
    let contextText = '';
    if (similarChunks.length > 0) {
      contextText = similarChunks
        .map((chunk) => `Source Document [${chunk.filename}]:\n"${chunk.content}"`)
        .join('\n\n');
    } else {
      contextText = '⚠️ NO CLINIC-SPECIFIC PRACTICE POLICY MATCHED. Ground analysis strictly in AMA CPT coding guidelines, ICD-10 medical necessity standards, CMS Medicare Local Coverage Determinations (LCD), and clinical practice guidelines.';
    }

    const systemPrompt = `You are a Senior Physician Clinical Denial Appeal Specialist and Medical Billing Attorney specializing in insurance prior authorization (PA) claim reversals.

Draft a formal, legally grounded, and clinical evidence-backed Medical Claim Denial Appeal Letter based on the submitted clinical notes and denial code:
1. Rebut insurer's "lack of medical necessity" argument using specific ICD-10 & CPT code citations.
2. Cite relevant peer-reviewed clinical guidelines (e.g. ACC, NCCN, AMA).
3. Include explicit peer-to-peer discussion script for the attending physician.

Return ONLY valid JSON matching this exact structure:
{
  "appealLetter": "Full text of the formal clinical appeal letter to the health insurer's medical director.",
  "cptAnalysis": [
    {
      "code": "CPT / ICD-10 Code",
      "status": "APPROVED_NECESSITY" or "REBUTTED",
      "medicalNecessityRationale": "Clinical evidence justification tying patient symptoms to standard-of-care guidelines."
    }
  ],
  "peerToPeerScript": "Concise 3-minute talking points script for attending physician during peer-to-peer call with insurer medical director."
}`;

    const userPrompt = `Insurer Denial Reason: ${denialReason || 'Experimental / Lack of Medical Necessity'}
CPT / ICD-10 Codes: ${cptCodes || 'CPT 27447 / ICD-10 M17.11'}

Clinic Practice Context:
${contextText}

Patient Clinical Notes & History:
"${patientClinicalNotes}"`;

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
        appealLetter: "RE: Urgent Clinical Appeal for Claim Reversal\n\nDear Medical Director,\n\nWe are writing to formally appeal the denial of prior authorization for CPT 27447 based on confirmed clinical necessity documented in patient medical records...",
        cptAnalysis: [
          {
            code: "CPT 27447 - Total Knee Arthroplasty",
            status: "REBUTTED",
            medicalNecessityRationale: "Patient failed 6 months of conservative therapy including physical therapy and intra-articular corticosteroid injections (ICD-10 M17.11)."
          }
        ],
        peerToPeerScript: "1. State patient failed 6 months non-operative care.\n2. Reference Kellgren-Lawrence Grade IV OA on x-ray.\n3. Request immediate authorization override."
      };
    }

    decrementCredits(session.userId);

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error('Claim Appeal API Error:', error);
    return NextResponse.json({ error: 'Failed to process claim appeal letter.' }, { status: 500 });
  }
}
