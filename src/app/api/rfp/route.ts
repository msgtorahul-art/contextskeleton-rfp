import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, processCreditDecrement } from '@/lib/stripe';
import { processRfpEngine } from '@/lib/engines/rfpEngine';
import { getAllProjectsFromPersistentStore, getProjectFromPersistentStore, saveProjectToPersistentStore } from '@/lib/persistentStore';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  try {
    if (projectId) {
      const details = getProjectFromPersistentStore(projectId);
      return NextResponse.json({
        project: details.project || null,
        questions: details.questions || []
      });
    }

    const userProjects = getAllProjectsFromPersistentStore(session.userId);
    return NextResponse.json({ projects: userProjects });
  } catch (err: any) {
    console.error('RFP Projects GET Error:', err);
    return NextResponse.json({ projects: [], project: null, questions: [] });
  }
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Strict Product-Level Access Check
  if (!hasBillingAccess(session, 'rfp')) {
    return NextResponse.json(
      { error: 'Product entitlement required. Your trial credits have expired. Please subscribe to the RFP & Tender Engine to access this product.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));

    if (body.action === 'create_project') {
      const name = body.name || 'New RFP Project';
      const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const createdAt = new Date().toISOString();

      const newProj = {
        id: projectId,
        user_id: session.userId,
        name,
        created_at: createdAt
      };

      const questionsInput = Array.isArray(body.questions) 
        ? body.questions 
        : (typeof body.questions === 'string' ? body.questions.split('\n') : ['Describe your data security standards.', 'What is your customer support SLA?']);

      const questionsList = questionsInput
        .map((qText: string) => (typeof qText === 'string' ? qText.trim() : ''))
        .filter((qText: string) => qText.length > 0)
        .map((qText: string, idx: number) => ({
          id: `q-${projectId}-${idx}`,
          project_id: projectId,
          user_id: session.userId,
          question_text: qText,
          status: 'pending'
        }));

      saveProjectToPersistentStore(newProj, questionsList);

      const response = NextResponse.json({ projectId, message: 'Project created successfully.', questions: questionsList });
      processCreditDecrement(session, response);
      return response;
    }

    if (body.action === 'generate_answer') {
      const questionId = body.questionId;
      let questionText = body.rfpText || body.questionText || body.text || '';

      if (!questionText && questionId) {
        try {
          const qRow = db.prepare('SELECT question_text FROM questions WHERE id = ?').get(questionId) as any;
          if (qRow && qRow.question_text) {
            questionText = qRow.question_text;
          }
        } catch (e) {}
      }

      if (!questionText) {
        questionText = 'Please describe your compliance, data security, and service level agreements.';
      }

      const result = await processRfpEngine({
        title: 'RFP Proposal Draft',
        clientName: 'Enterprise Client',
        rfpText: questionText
      });

      const generatedAnswer = result.executiveSummary || result.fullResponse || 'Compliance response grounded in organizational knowledge base.';

      if (questionId) {
        try {
          db.prepare("UPDATE questions SET drafted_answer = ?, status = 'drafted' WHERE id = ?").run(generatedAnswer, questionId);
        } catch (e) {}
      }

      const response = NextResponse.json({
        draftedAnswer: generatedAnswer,
        executiveSummary: generatedAnswer,
        sourcesUsed: result.sourcesUsed || [],
        fullResponse: result.fullResponse || generatedAnswer
      });

      processCreditDecrement(session, response);
      return response;
    }

    const rfpText = body.rfpText || body.text || body.specText || body.description || '';
    const title = body.title || 'Enterprise Proposal';
    const clientName = body.clientName || 'Valued Enterprise Client';

    if (!rfpText.trim()) {
      return NextResponse.json({ error: 'RFP specification text is required.' }, { status: 400 });
    }

    const result = await processRfpEngine({
      title,
      clientName,
      rfpText,
    });

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    const response = NextResponse.json(result);
    processCreditDecrement(session, response);
    return response;
  } catch (err: any) {
    console.error('RFP Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process RFP proposal.' }, { status: 500 });
  }
}
