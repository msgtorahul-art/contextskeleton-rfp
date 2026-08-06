import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, processCreditDecrement } from '@/lib/stripe';
import { processRfpEngine } from '@/lib/engines/rfpEngine';
import { getAllProjectsFromPersistentStore, saveProjectToPersistentStore } from '@/lib/persistentStore';

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userProjects = getAllProjectsFromPersistentStore(session.userId);
    return NextResponse.json({ projects: userProjects });
  } catch (err: any) {
    console.error('RFP Projects GET Error:', err);
    return NextResponse.json({ projects: [] });
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

      const questionsList = (body.questions || []).map((qText: string, idx: number) => ({
        id: `q-${projectId}-${idx}`,
        project_id: projectId,
        user_id: session.userId,
        question_text: qText,
        status: 'pending'
      }));

      saveProjectToPersistentStore(newProj, questionsList);

      const response = NextResponse.json({ projectId, message: 'Project created successfully.' });
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
