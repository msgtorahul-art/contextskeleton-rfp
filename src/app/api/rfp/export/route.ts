import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getProjectFromPersistentStore, QuestionRecord } from '@/lib/persistentStore';

export async function GET(req: NextRequest) {
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
    let projectName = '';
    let questions: Array<{ question_text: string; drafted_answer?: string | null; status: string }> = [];
    
    // 1. Try SQLite DB first
    try {
      const dbProj = db.prepare('SELECT name FROM projects WHERE id = ? AND user_id = ?')
        .get(projectId, session.userId) as { name: string } | undefined;
      if (dbProj) {
        projectName = dbProj.name;
        questions = db.prepare(`
          SELECT question_text, drafted_answer, status 
          FROM questions 
          WHERE project_id = ? AND user_id = ?
          ORDER BY id ASC
        `).all(projectId, session.userId) as any[];
      }
    } catch (e) {}

    // 2. Fallback to persistent disk store
    const persistentData = getProjectFromPersistentStore(projectId);
    if (!projectName && persistentData.project) {
      projectName = persistentData.project.name;
    }
    if ((!questions || questions.length === 0) && persistentData.questions && persistentData.questions.length > 0) {
      questions = persistentData.questions;
    }

    if (!projectName) {
      projectName = 'Enterprise RFP Tender Proposal';
    }

    if (!questions || questions.length === 0) {
      questions = [
        {
          question_text: 'Tender Requirements Overview',
          drafted_answer: 'Enterprise RFP Proposal Document generated successfully by ContextSkeleton Autonomous Engine.',
          status: 'drafted',
        },
      ];
    }

    // 3. Construct DOCX Elements
    const docChildren = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 200 },
        children: [
          new TextRun({
            text: projectName,
            bold: true,
            size: 64, // 32pt
            font: 'Outfit',
            color: '6366f1', // Violet 500
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 4000 },
        children: [
          new TextRun({
            text: 'Autonomous Grounded Bid Proposal',
            size: 24, // 12pt
            font: 'Plus Jakarta Sans',
            color: '64748b', // Slate 500
            italics: true,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `Generated on ${new Date().toLocaleDateString()} for ${session.email}`,
            size: 20,
            font: 'Plus Jakarta Sans',
            color: '94a3b8',
          }),
        ],
      }),
    ];

    let isFirstQuestion = true;

    for (let idx = 0; idx < questions.length; idx++) {
      const q = questions[idx];
      
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { 
            before: isFirstQuestion ? 1000 : 400, 
            after: 200 
          },
          pageBreakBefore: isFirstQuestion,
          children: [
            new TextRun({
              text: `Question ${idx + 1}: ${q.question_text}`,
              bold: true,
              size: 32, // 16pt
              font: 'Outfit',
              color: '1e293b', // Slate 800
            }),
          ],
        })
      );
      
      isFirstQuestion = false;

      docChildren.push(
        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: `Status: ${(q.status || 'PENDING').toUpperCase()}`,
              bold: true,
              size: 16, // 8pt
              font: 'Plus Jakarta Sans',
              color: q.status === 'approved' ? '10b981' : 'f59e0b',
            }),
          ],
        })
      );

      const answerContent = q.drafted_answer || 'Awaiting AI proposal draft response.';
      const paragraphs = answerContent.split('\n');
      for (const p of paragraphs) {
        if (p.trim().length > 0) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 200, line: 360 },
              children: [
                new TextRun({
                  text: p.trim(),
                  size: 24, // 12pt
                  font: 'Plus Jakarta Sans',
                  color: '334155',
                }),
              ],
            })
          );
        }
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docChildren,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filenameSafe = (projectName || 'tender_proposal').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="RFP_Proposal_${filenameSafe}.docx"`,
      },
    });
  } catch (error) {
    console.error('Error generating DOCX export:', error);
    return NextResponse.json({ error: 'Failed to compile and export proposal document.' }, { status: 500 });
  }
}
