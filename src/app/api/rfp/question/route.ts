import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { questionId, draftedAnswer, status } = await req.json();

    if (!questionId || draftedAnswer === undefined || !status) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (status !== 'approved' && status !== 'drafted' && status !== 'pending') {
      return NextResponse.json({ error: 'Invalid status parameter' }, { status: 400 });
    }

    // Update the question
    const result = db.prepare('UPDATE questions SET drafted_answer = ?, status = ? WHERE id = ? AND user_id = ?')
      .run(draftedAnswer, status, questionId, session.userId);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Question not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Question saved successfully' });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Failed to save question update' }, { status: 500 });
  }
}
