import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
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

    for (const q of questions.slice(0, 20)) { // Cap batch to 20 questions per request
      const questionText = typeof q === 'string' ? q : q.question;
      if (!questionText || questionText.trim().length === 0) continue;

      // 1. Fetch relevant security policy chunks from Knowledge Base
      const similarChunks = await findSimilarChunks(session.userId, questionText, 3);
      
      let contextText = '';
      if (similarChunks.length > 0) {
        contextText = similarChunks
          .map((chunk) => `Policy Document [${chunk.filename}]:\n"${chunk.content}"`)
          .join('\n\n');
      } else {
        contextText = 'No specific security policy document matched in Knowledge Base.';
      }

      // 2. Build Security Compliance Prompt
      const systemPrompt = `You are a Chief Information Security Officer (CISO) and Lead SOC2/ISO 27001 Auditor.
Your task is to answer vendor risk security questionnaire items accurately based on provided security policy context.

Compliance Framework Focus: ${framework}

Instructions:
- Provide a direct, authoritative, compliance-ready response (1-3 paragraphs).
- Assign a Confidence Score: "HIGH", "MEDIUM", or "LOW".
- Identify the relevant Security Control (e.g. SOC2 CC6.1 Logical Access, ISO 27001 A.12.6, Encryption at Rest AES-256).
- If the context lacks exact policy details, state what standard practice is followed and mark confidence as "MEDIUM" or "LOW".

Output JSON format strictly:
{
  "answer": "Detailed compliance answer...",
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
      let parsed = { answer: '', confidence: 'MEDIUM', control: 'General Security', status: 'COMPLIANT' };
      
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        parsed.answer = responseText;
      }

      resolvedResults.push({
        id: crypto.randomUUID(),
        question: questionText,
        answer: parsed.answer || 'Standard security controls applied.',
        confidence: parsed.confidence || 'MEDIUM',
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
