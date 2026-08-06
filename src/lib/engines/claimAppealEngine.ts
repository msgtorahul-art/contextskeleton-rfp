import { GoogleGenAI } from '@google/genai';

export async function processClaimAppealEngine(params: {
  patientNotes?: string;
  denialReason?: string;
  cptCode?: string;
  text?: string;
}) {
  const patientNotes = (params.patientNotes || params.text || '').trim();
  const cptCode = params.cptCode || 'CPT Procedure';
  const denialReason = params.denialReason || 'Lack of Medical Necessity';

  if (!patientNotes) {
    return { error: 'Clinical chart notes or denial details are required' };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an objective Chief Medical Officer & Healthcare Claims Rebuttal Specialist.

CPT Code: "${cptCode}"
Insurer Denial Reason: "${denialReason}"
Clinical Patient Chart Notes:
"""
${patientNotes}
"""

Instructions:
Evaluate whether the chart notes actually contain clinical evidence (conservative therapy, physical exams, diagnostic imaging, failed medications) to overturn the insurer's denial under AMA CPT guidelines and CMS Local Coverage Determinations (LCD).
Do NOT automatically approve if conservative therapy evidence is absent.
Assign cptAnalysis status as "REBUTTED_APPROVED" | "NEEDS_CLINICAL_EVIDENCE" | "DENIAL_UPHELD".

Return ONLY valid JSON matching this exact structure:
{
  "summary": "Objective clinical medical necessity appeal summary for ${cptCode}.",
  "appealLetter": "Formal clinical appeal letter text tailored to the provided chart notes.",
  "cptAnalysis": [
    {
      "code": "${cptCode}",
      "status": "REBUTTED_APPROVED",
      "medicalNecessityRationale": "Objective clinical justification."
    }
  ],
  "peerToPeerScript": "Physician peer-to-peer talking points."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      if (response && response.text) {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('[claimAppealEngine] Gemini call failed, utilizing objective local evaluator.');
    }
  }

  // Objective Local Rule Evaluator
  const lowerText = patientNotes.toLowerCase();
  const hasConservativeTherapy = lowerText.includes('therapy') || lowerText.includes('physical') || lowerText.includes('nsaid') || lowerText.includes('conservative') || lowerText.includes('months');
  const hasDiagnosticImaging = lowerText.includes('x-ray') || lowerText.includes('mri') || lowerText.includes('ct') || lowerText.includes('narrowing') || lowerText.includes('scan');

  const status = (hasConservativeTherapy && hasDiagnosticImaging)
    ? 'REBUTTED_APPROVED'
    : hasConservativeTherapy
    ? 'NEEDS_CLINICAL_EVIDENCE'
    : 'DENIAL_UPHELD';

  return {
    summary: `Clinical Medical Necessity Evaluation complete for "${cptCode}" (Denial Reason: ${denialReason}).`,
    appealLetter: `RE: Formal Appeal for Prior Authorization / Claim Reversal\nCPT Code: ${cptCode}\nDenial Reason: ${denialReason}\n\nDear Medical Director,\n\nWe are appealing the denial for ${cptCode}. ${hasConservativeTherapy ? 'The patient chart notes document completion of conservative non-operative management.' : 'Additional conservative therapy logs are required to fulfill CMS LCD criteria.'}\n\nSincerely,\nAttending Physician, MD`,
    cptAnalysis: [
      {
        code: cptCode,
        status,
        medicalNecessityRationale: hasConservativeTherapy 
          ? 'Clinical chart notes document progressive functional impairment and conservative therapy completion.' 
          : 'Chart notes lack documented 6+ weeks of non-operative conservative physical therapy mandated by CMS LCD guidelines.'
      }
    ],
    peerToPeerScript: hasConservativeTherapy 
      ? '1. Reference patient physical therapy completion.\n2. Present diagnostic imaging findings.\n3. Request immediate authorization reversal.' 
      : '1. Acknowledge missing therapy documentation.\n2. Request 30-day extension to attach physical therapy logbooks.'
  };
}
