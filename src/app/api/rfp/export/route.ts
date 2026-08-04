import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

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
    // 1. Fetch project name
    const project = db.prepare('SELECT name FROM projects WHERE id = ? AND user_id = ?')
      .get(projectId, session.userId) as { name: string } | undefined;

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 2. Fetch all completed/drafted questions
    const questions = db.prepare(`
      SELECT question_text, drafted_answer, status 
      FROM questions 
      WHERE project_id = ? AND user_id = ? AND status != 'pending'
      ORDER BY id ASC
    `).all(projectId, session.userId) as { question_text: string; drafted_answer: string | null; status: string }[];

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No drafted or approved answers found to export.' }, { status: 400 });
    }

    // 3. Construct DOCX Elements
    const docChildren = [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 200 },
        children: [
          new TextRun({
            text: project.name,
            bold: true,
            size: 64, // 32pt
            font: 'Outfit',
            color: '6366f1', // Violet 500
          }),
        ],
      }),
      // Subtitle
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
      // metadata footer page 1
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

    // Page break & content compilation
    // In docx package, we can append paragraphs with page break option on the first paragraph of page 2
    let isFirstQuestion = true;

    for (let idx = 0; idx < questions.length; idx++) {
      const q = questions[idx];
      
      // Question Title
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { 
            before: isFirstQuestion ? 1000 : 400, 
            after: 200 
          },
          pageBreakBefore: isFirstQuestion, // Insert page break before the first question starts (after cover page)
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

      // Status indicator tag
      docChildren.push(
        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: `Status: ${q.status.toUpperCase()}`,
              bold: true,
              size: 16, // 8pt
              font: 'Plus Jakarta Sans',
              color: q.status === 'approved' ? '10b981' : 'f59e0b', // Emerald or Amber
            }),
          ],
        })
      );

      // Answer body text
      const paragraphs = (q.drafted_answer || 'No response draft available.').split('\n');
      for (const p of paragraphs) {
        if (p.trim().length > 0) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 200, line: 360 }, // 1.5 line spacing
              children: [
                new TextRun({
                  text: p.trim(),
                  size: 24, // 12pt
                  font: 'Plus Jakarta Sans',
                  color: '334155', // Slate 700
                }),
              ],
            })
          );
        }
      }
    }

    // Initialize document with constructed pages
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docChildren,
        },
      ],
    });

    // 4. Generate docx binary buffer
    const buffer = await Packer.toBuffer(doc);

    // 5. Send file download response
    const filenameSafe = project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
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
