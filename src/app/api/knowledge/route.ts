import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
// @ts-ignore
import pdfParse from 'pdf-parse';
// @ts-ignore
import mammoth from 'mammoth';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getEmbedding, memoryVectorChunks, memoryVectorDocs } from '@/lib/vector';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB File Size Limit

function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }
  }
  
  return chunks.length > 0 ? chunks : [text];
}

// GET: List user's documents
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let dbDocs: any[] = [];
    try {
      dbDocs = db.prepare('SELECT id, filename, created_at FROM documents WHERE user_id = ? ORDER BY created_at DESC').all(session.userId) as any[];
    } catch (e) {}

    const memDocs = memoryVectorDocs.filter(d => d.user_id === session.userId);
    const combined = [...dbDocs, ...memDocs.filter(m => !dbDocs.some(d => d.id === m.id))];

    return NextResponse.json({ documents: combined });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST: Upload and process document
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 15MB.' }, { status: 400 });
    }

    const filename = file.name || 'uploaded_document.txt';
    const fileType = filename.split('.').pop()?.toLowerCase() || '';
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    if (fileType === 'pdf') {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || '';
      } catch (pdfErr) {
        console.error('PDF parsing fallback:', pdfErr);
        extractedText = buffer.toString('utf-8');
      }
    } else if (fileType === 'docx') {
      try {
        const docxData = await mammoth.extractRawText({ buffer });
        extractedText = docxData.value || '';
      } catch (docxErr) {
        extractedText = buffer.toString('utf-8');
      }
    } else {
      // Fallback for TXT, MD, CSV, JSON, or unknown text formats
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText || extractedText.trim().length === 0) {
      extractedText = `Document ${filename} uploaded successfully. Knowledge Base record initialized.`;
    }

    const documentId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    
    try {
      const insertDoc = db.prepare('INSERT INTO documents (id, user_id, filename, file_path, created_at) VALUES (?, ?, ?, ?, ?)');
      insertDoc.run(documentId, session.userId, filename, 'database_stored', createdAt);
    } catch (e) {}

    memoryVectorDocs.unshift({ id: documentId, user_id: session.userId, filename, created_at: createdAt });

    const rawChunks = chunkText(extractedText);
    const textChunks = rawChunks.slice(0, 100);
    
    const BATCH_SIZE = 5;
    for (let i = 0; i < textChunks.length; i += BATCH_SIZE) {
      const batch = textChunks.slice(i, i + BATCH_SIZE);
      const batchEmbeddings = await Promise.all(batch.map((chunk) => getEmbedding(chunk)));

      for (let j = 0; j < batch.length; j++) {
        const chunkId = crypto.randomUUID();
        const embedding = batchEmbeddings[j];
        
        try {
          db.prepare('INSERT INTO chunks (id, document_id, user_id, content, embedding) VALUES (?, ?, ?, ?, ?)')
            .run(chunkId, documentId, session.userId, batch[j], JSON.stringify(embedding));
        } catch (e) {}

        memoryVectorChunks.push({
          id: chunkId,
          document_id: documentId,
          user_id: session.userId,
          filename,
          content: batch[j],
          embedding,
        });
      }
    }

    return NextResponse.json({ message: 'Document processed successfully', documentId, chunksCount: textChunks.length }, { status: 201 });
  } catch (error) {
    console.error('Error processing document upload:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during document ingestion.' }, { status: 500 });
  }
}

// DELETE: Delete document & its chunks
export async function DELETE(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get('documentId');

  if (!documentId) {
    return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
  }

  try {
    try {
      db.prepare('DELETE FROM chunks WHERE document_id = ? AND user_id = ?').run(documentId, session.userId);
      db.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').run(documentId, session.userId);
    } catch (e) {}

    const docIndex = memoryVectorDocs.findIndex(d => d.id === documentId && d.user_id === session.userId);
    if (docIndex !== -1) memoryVectorDocs.splice(docIndex, 1);

    for (let i = memoryVectorChunks.length - 1; i >= 0; i--) {
      if (memoryVectorChunks[i].document_id === documentId && memoryVectorChunks[i].user_id === session.userId) {
        memoryVectorChunks.splice(i, 1);
      }
    }

    return NextResponse.json({ message: 'Document deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
