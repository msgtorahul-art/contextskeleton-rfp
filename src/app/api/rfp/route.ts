import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasBillingAccess, decrementCredits } from '@/lib/stripe';
import { processRfpEngine } from '@/lib/engines/rfpEngine';
import { getAllProjectsFromPersistentStore, saveProjectToPersistentStore } from '@/lib/persistentStore';

export async function GET(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userProjects = getAllProjectsFromPersistentStore(user.userId);
    return NextResponse.json({ projects: userProjects });
  } catch (err: any) {
    console.error('RFP Projects GET Error:', err);
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(req: NextRequest) {
  const user = getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Strict Product-Level Access Check
  if (!hasBillingAccess(user.userId, 'rfp')) {
    return NextResponse.json(
      { error: 'Product entitlement required. Please subscribe to the RFP & Tender Engine to access this product.', code: 'PAYMENT_REQUIRED' },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();

    if (body.action === 'create_project') {
      const name = body.name || 'New RFP Project';
      const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const createdAt = new Date().toISOString();

      const newProj = {
        id: projectId,
        user_id: user.userId,
        name,
        created_at: createdAt
      };

      const questionsList = (body.questions || []).map((qText: string, idx: number) => ({
        id: `q-${projectId}-${idx}`,
        project_id: projectId,
        user_id: user.userId,
        question_text: qText,
        status: 'pending'
      }));

      saveProjectToPersistentStore(newProj, questionsList);
      decrementCredits(user.userId);
      return NextResponse.json({ projectId, message: 'Project created successfully.' });
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

    decrementCredits(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('RFP Engine Error:', err);
    return NextResponse.json({ error: 'Failed to process RFP proposal.' }, { status: 500 });
  }
}
