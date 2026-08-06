import { GoogleGenAI } from '@google/genai';
import { checkComplianceClause } from '../evaluator';

export async function processAiActEngine(params: {
  modelName?: string;
  systemSpec?: string;
  specText?: string;
  text?: string;
}) {
  const systemSpec = (params.systemSpec || params.specText || params.text || '').trim();
  const modelName = params.modelName || 'Enterprise AI Model';

  if (!systemSpec) {
    return { error: 'AI model technical specification is required' };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an objective EU AI Act Compliance Auditor for Regulation (EU) 2024/1689.

Model Name: "${modelName}"
Technical Specification:
"""
${systemSpec}
"""

Instructions:
Evaluate the AI system strictly against Annex IV Technical Documentation, Article 9 Risk Management, Article 10 Data Governance, and Article 14 Human Oversight.
Check for explicit negations (e.g., "no human oversight", "lacks review controls"). If human oversight or data governance is missing or negated, assign REJECTED or NEEDS_REVISION.
Assign overallScore (0-100) and status ("APPROVED" | "NEEDS_REVISION" | "REJECTED") objectively.

Return ONLY valid JSON matching this exact structure:
{
  "summary": "Objective EU AI Act pre-audit summary for ${modelName}.",
  "overallScore": 80,
  "status": "NEEDS_REVISION",
  "items": [
    {
      "article": "Annex IV / Article Section",
      "topic": "Audit Topic",
      "status": "PASS",
      "riskRating": "LOW",
      "findings": "Actual finding from text.",
      "recommendation": "Required remediation action."
    }
  ]
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
      console.warn('[aiActEngine] Gemini call failed, utilizing objective local evaluator.');
    }
  }

  // Negation-Aware Local Rule Evaluator
  const humanCheck = checkComplianceClause(systemSpec, ['human', 'oversight', 'review', 'control']);
  const dataCheck = checkComplianceClause(systemSpec, ['data', 'dataset', 'provenance', 'bias']);

  const passesHuman = humanCheck.present && !humanCheck.negated;
  const passesData = dataCheck.present && !dataCheck.negated;

  const score = (passesHuman ? 45 : 15) + (passesData ? 45 : 15);
  const status = score >= 80 ? 'APPROVED' : score >= 50 ? 'NEEDS_REVISION' : 'REJECTED';

  return {
    summary: `EU AI Act Regulation (EU) 2024/1689 Annex IV Audit complete for "${modelName}".`,
    overallScore: score,
    status,
    items: [
      {
        article: 'Article 14 - Human Oversight Protocols',
        topic: 'Human-in-the-loop Safeguards',
        status: passesHuman ? 'PASS' : 'FAIL',
        riskRating: passesHuman ? 'LOW' : 'HIGH',
        findings: passesHuman 
          ? 'Human oversight mechanisms defined prior to high-stakes output dispatch.' 
          : 'CRITICAL AUDIT FAILURE: System specification explicitly lacks or negates mandatory Article 14 human oversight controls.',
        recommendation: passesHuman ? 'Maintain versioned audit logs.' : 'Implement mandatory human-in-the-loop override dashboard.'
      },
      {
        article: 'Article 10 - Data Governance & Bias Mitigation',
        topic: 'Training Dataset Provenance',
        status: passesData ? 'PASS' : 'FAIL',
        riskRating: passesData ? 'LOW' : 'HIGH',
        findings: passesData 
          ? 'Training dataset provenance and vector retrieval pipeline documented.' 
          : 'Specification lacks documented training data provenance or bias mitigation datasets.',
        recommendation: 'Document data collection protocols per Article 10(2).'
      }
    ]
  };
}
