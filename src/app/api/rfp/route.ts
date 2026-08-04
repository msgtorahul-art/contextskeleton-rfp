import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { findSimilarChunks } from '@/lib/vector';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// GET: retrieve projects or questions
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  try {
    if (projectId) {
      // Return details of a specific project and its questions
      const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(projectId, session.userId);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      const questions = db.prepare('SELECT * FROM questions WHERE project_id = ? AND user_id = ?').all(projectId, session.userId);
      return NextResponse.json({ project, questions });
    } else {
      // Return list of all projects
      const projects = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC').all(session.userId);
      return NextResponse.json({ projects });
    }
  } catch (error) {
    console.error('Error fetching RFP data:', error);
    return NextResponse.json({ error: 'Failed to retrieve RFP data' }, { status: 500 });
  }
}

// POST: create a new project OR generate response for a question
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body; // 'create_project' or 'generate_answer'

    if (action === 'create_project') {
      const { name, questions } = body; // questions is an array of strings
      
      if (!name || !questions || !Array.isArray(questions)) {
        return NextResponse.json({ error: 'Project name and questions array are required' }, { status: 400 });
      }

      const projectId = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      // Database transaction to insert project and questions
      const insertProject = db.prepare('INSERT INTO projects (id, user_id, name, created_at) VALUES (?, ?, ?, ?)');
      const insertQuestion = db.prepare('INSERT INTO questions (id, project_id, user_id, question_text, status) VALUES (?, ?, ?, ?, ?)');

      insertProject.run(projectId, session.userId, name, createdAt);

      for (const questionText of questions) {
        if (questionText.trim().length > 0) {
          const questionId = crypto.randomUUID();
          insertQuestion.run(questionId, projectId, session.userId, questionText, 'pending');
        }
      }

      return NextResponse.json({ message: 'Project created successfully', projectId }, { status: 201 });
    }
    
    if (action === 'generate_answer') {
      const { questionId } = body;

      if (!questionId) {
        return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
      }

      // Check user's billing/paywall access status
      if (!hasBillingAccess(session.userId)) {
        return NextResponse.json(
          { error: 'Subscription required. Please upgrade to write drafts.', code: 'PAYMENT_REQUIRED' },
          { status: 402 }
        );
      }

      // Retrieve question details
      const question = db.prepare('SELECT * FROM questions WHERE id = ? AND user_id = ?').get(questionId, session.userId) as {
        id: string;
        project_id: string;
        question_text: string;
      } | undefined;

      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }

      // 1. Local Vector Search: find top matching chunks from knowledge base
      const similarChunks = await findSimilarChunks(session.userId, question.question_text, 3);
      
      let contextText = '';
      if (similarChunks.length > 0) {
        contextText = similarChunks
          .map((chunk, index) => `Source Document [${chunk.filename}]:\n"${chunk.content}"`)
          .join('\n\n');
      } else {
        contextText = 'No contextual matches found in the knowledge base.';
      }

      // 2. Build the LLM RAG Prompt
      const systemPrompt = `You are an expert bid proposal assistant. Your job is to draft a professional response to the tender question using ONLY the provided context from the company's knowledge base. 

Instructions:
- Keep the tone professional, authoritative, and direct.
- Ground your answers strictly in the provided sources. Do not make up or hallucinate details.
- Cite the source files (e.g. "[Source: company_policy.pdf]") where appropriate.
- If the context does not contain enough information to answer, explain clearly what information is missing. Do not invent answers.`;

      const userPrompt = `Context from Knowledge Base:
${contextText}

Question:
"${question.question_text}"

Drafted Response:`;

      // 3. Call Gemini Model to generate drafted answer
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
        ]
      });

      const answerText = response.text || 'Unable to generate response.';

      // 4. Save response to SQLite and update status to 'drafted'
      db.prepare('UPDATE questions SET drafted_answer = ?, status = ? WHERE id = ? AND user_id = ?')
        .run(answerText, 'drafted', questionId, session.userId);

      // 5. Decrement credits/track consumption
      decrementCredits(session.userId);

      return NextResponse.json({ draftedAnswer: answerText, sourcesUsed: similarChunks });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('RFP API Processing error:', error);
    return NextResponse.json({ error: 'Failed to process RFP operation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    db.prepare('DELETE FROM questions WHERE project_id = ? AND user_id = ?').run(projectId, session.userId);
    const result = db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(projectId, session.userId);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Project not found or forbidden.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
