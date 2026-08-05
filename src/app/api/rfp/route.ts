import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { findSimilarChunks } from '@/lib/vector';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { 
  saveProjectToPersistentStore, 
  getProjectFromPersistentStore, 
  getAllProjectsFromPersistentStore, 
  updateQuestionInPersistentStore,
  deleteProjectFromPersistentStore,
  ProjectRecord,
  QuestionRecord
} from '@/lib/persistentStore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  try {
    if (projectId) {
      let project: any = null;
      let questions: any[] = [];
      
      // 1. Try SQLite first
      try {
        project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(projectId, session.userId);
        if (project) {
          questions = db.prepare('SELECT * FROM questions WHERE project_id = ? AND user_id = ?').all(projectId, session.userId) as any[];
        }
      } catch (e) {}

      // 2. Fallback to persistent disk store if empty or not found
      const persistentData = getProjectFromPersistentStore(projectId);
      if (!project && persistentData.project) {
        project = persistentData.project;
      }
      if ((!questions || questions.length === 0) && persistentData.questions && persistentData.questions.length > 0) {
        questions = persistentData.questions;
      }

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      return NextResponse.json({ project, questions: questions || [] });
    } else {
      let dbProjects: any[] = [];
      try {
        dbProjects = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC').all(session.userId) as any[];
      } catch (e) {}

      const persistentProjects = getAllProjectsFromPersistentStore(session.userId);
      const combinedMap = new Map<string, ProjectRecord>();

      for (const p of dbProjects) {
        combinedMap.set(p.id, p);
      }
      for (const p of persistentProjects) {
        if (!combinedMap.has(p.id)) {
          combinedMap.set(p.id, p);
        }
      }

      const projectsList = Array.from(combinedMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return NextResponse.json({ projects: projectsList });
    }
  } catch (error) {
    console.error('Error fetching RFP data:', error);
    return NextResponse.json({ error: 'Failed to retrieve RFP data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = body.action || (body.name && body.questions ? 'create_project' : '');

    if (action === 'create_project') {
      const { name, questions } = body;
      
      let parsedQuestions: string[] = [];
      if (typeof questions === 'string') {
        parsedQuestions = questions.split(/\r?\n/).map(q => q.trim()).filter(Boolean);
      } else if (Array.isArray(questions)) {
        parsedQuestions = questions.map(q => String(q).trim()).filter(Boolean);
      }

      if (!name || !name.trim() || parsedQuestions.length === 0) {
        return NextResponse.json({ error: 'Tender name and at least one questionnaire item are required.' }, { status: 400 });
      }

      const projectId = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      const newProject: ProjectRecord = { id: projectId, user_id: session.userId, name: name.trim(), created_at: createdAt };
      const newQuestionsList: QuestionRecord[] = [];

      for (const questionText of parsedQuestions) {
        const questionId = crypto.randomUUID();
        newQuestionsList.push({ id: questionId, project_id: projectId, user_id: session.userId, question_text: questionText, status: 'pending' });
      }

      // Try DB insertion
      try {
        const insertProject = db.prepare('INSERT INTO projects (id, user_id, name, created_at) VALUES (?, ?, ?, ?)');
        insertProject.run(projectId, session.userId, name.trim(), createdAt);

        const insertQuestion = db.prepare('INSERT INTO questions (id, project_id, user_id, question_text, status) VALUES (?, ?, ?, ?, ?)');
        for (const qObj of newQuestionsList) {
          insertQuestion.run(qObj.id, projectId, session.userId, qObj.question_text, 'pending');
        }
      } catch (dbErr) {
        console.error('DB project insert warning, relying on persistent store:', dbErr);
      }

      // Guarantee cross-lambda persistence via disk-backed store
      saveProjectToPersistentStore(newProject, newQuestionsList);

      return NextResponse.json({ message: 'Project created successfully', projectId }, { status: 201 });
    }
    
    if (action === 'generate_answer') {
      const { questionId } = body;

      if (!questionId) {
        return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
      }

      if (!hasBillingAccess(session.userId)) {
        return NextResponse.json(
          { error: 'Subscription required. Please upgrade to write drafts.', code: 'PAYMENT_REQUIRED' },
          { status: 402 }
        );
      }

      let questionText = '';
      try {
        const q = db.prepare('SELECT question_text FROM questions WHERE id = ? AND user_id = ?').get(questionId, session.userId) as any;
        if (q) questionText = q.question_text;
      } catch (e) {}

      if (!questionText) {
        const persistentProjects = getAllProjectsFromPersistentStore(session.userId);
        for (const proj of persistentProjects) {
          const data = getProjectFromPersistentStore(proj.id);
          const found = data.questions?.find(q => q.id === questionId);
          if (found) {
            questionText = found.question_text;
            break;
          }
        }
      }

      if (!questionText) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }

      const similarChunks = await findSimilarChunks(session.userId, questionText, 3);
      
      let contextText = '';
      if (similarChunks.length > 0) {
        contextText = similarChunks
          .map((chunk) => `Source Document [${chunk.filename}]:\n"${chunk.content}"`)
          .join('\n\n');
      } else {
        contextText = '⚠️ NO SPECIFIC COMPANY KNOWLEDGE BASE DOCUMENTS MATCHED. Ground answers strictly in general industry standards while explicitly noting missing company policy specifications.';
      }

      const systemPrompt = `You are a Senior RFP & Bid Proposal Engineer drafting a formal tender response.
Provide a clear, highly professional, direct answer to the tender question.

STRICT ZERO-FABRICATION RULE:
Ground your answer strictly in facts explicitly stated in the Knowledge Base context or verified industry standards.
DO NOT invent unmentioned company metrics, SLA guarantees, or software certifications.
If Knowledge Base sources are provided, cite exact filenames [Source: filename].`;

      const userPrompt = `Company Knowledge Base Context:
${contextText}

Tender Question:
"${questionText}"

Drafted Tender Answer:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }]
      });

      const answerText = response.text || 'Drafted response generated successfully.';

      try {
        db.prepare('UPDATE questions SET drafted_answer = ?, status = ? WHERE id = ? AND user_id = ?')
          .run(answerText, 'drafted', questionId, session.userId);
      } catch (e) {}

      updateQuestionInPersistentStore(questionId, answerText, 'drafted');
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
    try {
      db.prepare('DELETE FROM questions WHERE project_id = ? AND user_id = ?').run(projectId, session.userId);
      db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(projectId, session.userId);
    } catch (e) {}

    deleteProjectFromPersistentStore(projectId);

    return NextResponse.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
