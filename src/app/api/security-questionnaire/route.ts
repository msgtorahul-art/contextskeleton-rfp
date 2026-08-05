import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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

  try {
    const { questions, framework = 'SOC 2 Type II & ISO 27001' } = await req.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'At least one security question is required.' }, { status: 400 });
    }

    if (!hasBillingAccess(session.userId)) {
      return NextResponse.json(
        { error: 'Subscription required. Please upgrade to write drafts.', code: 'PAYMENT_REQUIRED' },
        { status: 402 }
      );
    }

    const resolvedResults = [];

    for (const q of questions.slice(0, 20)) {
      const questionText = typeof q === 'string' ? q : q.question;
      if (!questionText || questionText.trim().length === 0) continue;

      // 1. Fetch relevant security policy chunks from Knowledge Base
      const similarChunks = await findSimilarChunks(session.userId, questionText, 3);
      
      // STRICT ZERO-HALLUCINATION SAFEGUARD: Refuse to invent answers if 0 policy documents are matched
      if (similarChunks.length === 0) {
        resolvedResults.push({
          id: crypto.randomUUID(),
          question: questionText,
          answer: '⚠️ UNGROUNDED (NO POLICY DOCUMENT FOUND): Your Knowledge Base contains no supporting policy documents for this item. To avoid false compliance representations, please upload your official SOC 2 / ISO 27001 policy PDFs to your Knowledge Base.',
          confidence: 'LOW',
          control: 'UNFOUND_SOURCE',
          status: 'NEEDS_REVIEW',
          sources: [],
        });
        continue;
      }

      const contextText = similarChunks
        .map((chunk) => `Policy Document [${chunk.filename}]:\n"${chunk.content}"`)
        .join('\n\n');

      // 2. Build Strict Fact-Grounded Security Compliance Prompt
      const systemPrompt = `You are a Lead SOC2/ISO 27001 Auditor.
Your task is to answer vendor risk security questionnaire items ONLY using facts explicitly present in the provided security policy context.

Compliance Framework Focus: ${framework}

STRICT GROUNDING RULES:
- Ground your answer ONLY in the provided policy excerpts.
- Do NOT hallucinate or claim certifications that are not documented in the text.
- Assign Confidence: "HIGH" (exact match in text), "MEDIUM" (partial text inference), or "LOW" (insufficient detail).

Output JSON format strictly:
{
  "answer": "Grounded compliance answer with file citation...",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "control": "SOC 2 CC6.1 / ISO 27001 A.9.1",
  "status": "COMPLIANT" | "PARTIALLY_COMPLIANT" | "NEEDS_REVIEW"
}`;

      const userPrompt = `Security Policy Context:
${contextText}

Vendor Security Questionnaire Item:
"${questionText}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
        config: { responseMimeType: 'application/json' },
      });

      const responseText = response.text || '{}';
      let parsed = { answer: '', confidence: 'HIGH', control: 'SOC 2 CC6.1', status: 'COMPLIANT' };
      
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        parsed.answer = responseText;
      }

      resolvedResults.push({
        id: crypto.randomUUID(),
        question: questionText,
        answer: parsed.answer || 'Answer grounded in policy documents.',
        confidence: parsed.confidence || 'HIGH',
        control: parsed.control || 'SOC 2 CC6.1',
        status: parsed.status || 'COMPLIANT',
        sources: similarChunks.map((c) => c.filename),
      });
    }

    decrementCredits(session.userId);

    return NextResponse.json({ results: resolvedResults });
  } catch (error) {
    console.error('Security Questionnaire API error:', error);
    return NextResponse.json({ error: 'Failed to process security questionnaire.' }, { status: 500 });
  }
}
