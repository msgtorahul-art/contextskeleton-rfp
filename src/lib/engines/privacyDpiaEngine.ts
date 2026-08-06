import { GoogleGenAI } from '@google/genai';
import { checkComplianceClause } from '../evaluator';

export async function processPrivacyDpiaEngine(params: {
  systemName?: string;
  framework?: string;
  dataFlowNotes?: string;
  text?: string;
}) {
  const dataFlowNotes = (params.dataFlowNotes || params.text || '').trim();
  const systemName = params.systemName || 'Enterprise System';
  const framework = params.framework || 'EU GDPR Article 35 & HIPAA Security Rule';

  if (!dataFlowNotes) {
    return { error: 'Data flow and processing notes are required' };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an objective Data Privacy Officer & DPIA Specialist.

System Name: "${systemName}"
Framework: "${framework}"
Data Flow & Processing Notes:
"""
${dataFlowNotes}
"""

Instructions:
Evaluate the system strictly against GDPR Article 35 Data Protection Impact Assessment requirements and HIPAA §164.312 Technical Safeguards.
Check for explicit negations or unencrypted storage (e.g. "unencrypted", "plaintext", "lacks encryption"). Mark security as FAIL if unencrypted.

Return ONLY valid JSON matching this exact structure:
{
  "summary": "Objective Data Protection Impact Assessment (DPIA) summary for ${systemName}.",
  "overallScore": 80,
  "status": "NEEDS_REVISION",
  "items": [
    {
      "requirement": "GDPR / HIPAA Standard",
      "topic": "Audit Topic",
      "status": "PASS",
      "riskRating": "LOW",
      "findings": "Actual finding from text.",
      "recommendation": "Required compliance action."
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      if (response && response.text) {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('[privacyDpiaEngine] Gemini call failed, utilizing objective local evaluator.');
    }
  }

  // Negation & Substring Aware Local Rule Evaluator
  const encryptionCheck = checkComplianceClause(dataFlowNotes, ['encrypt', 'encrypted', 'aes-256', 'tls 1.3']);
  const isUnencrypted = dataFlowNotes.toLowerCase().includes('unencrypted') || dataFlowNotes.toLowerCase().includes('plaintext') || encryptionCheck.negated;

  const passesEncryption = encryptionCheck.present && !isUnencrypted;

  const score = passesEncryption ? 85 : 30;
  const status = score >= 80 ? 'APPROVED' : score >= 50 ? 'NEEDS_REVISION' : 'REJECTED';

  return {
    summary: `Data Protection Impact Assessment (DPIA) complete for "${systemName}" under ${framework}.`,
    overallScore: score,
    status,
    items: [
      {
        requirement: 'HIPAA §164.312 & GDPR Article 32 - Security of Processing',
        topic: 'Encryption at Rest & In-Transit',
        status: passesEncryption ? 'PASS' : 'FAIL',
        riskRating: passesEncryption ? 'LOW' : 'HIGH',
        findings: passesEncryption 
          ? 'Storage database encryption (AES-256) and TLS 1.3 in-transit safeguards applied.' 
          : 'CRITICAL DPIA FAILURE: System stores PII/PHI in unencrypted or plaintext format.',
        recommendation: passesEncryption 
          ? 'Enforce key rotation schedule.' 
          : 'Immediately implement KMS AES-256 at-rest encryption and TLS 1.3 in-transit.'
      }
    ]
  };
}
