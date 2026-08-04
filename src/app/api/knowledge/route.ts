import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
// @ts-ignore
import mammoth from 'mammoth';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getEmbedding } from '@/lib/vector';
import { PDFParse } from 'pdf-parse';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB File Size Limit

// Helper to chunk text
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
    const documents = db.prepare('SELECT id, filename, created_at FROM documents WHERE user_id = ? ORDER BY created_at DESC').all(session.userId);
    return NextResponse.json({ documents });
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

    // 1. File Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 10MB.' }, { status: 400 });
    }

    const filename = file.name;
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    // 2. Parse text content
    if (fileType === 'pdf') {
      const parser = new PDFParse({ data: buffer });
      const pdfData = await parser.getText();
      extractedText = pdfData.text;
    } else if (fileType === 'docx') {
      const docxData = await mammoth.extractRawText({ buffer });
      extractedText = docxData.value;
    } else if (fileType === 'txt') {
      extractedText = buffer.toString('utf-8');
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload PDF, Docx, or TXT.' }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: 'Failed to extract text or file is empty.' }, { status: 400 });
    }

    // 3. Insert document record
    const documentId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    
    const insertDoc = db.prepare('INSERT INTO documents (id, user_id, filename, file_path, created_at) VALUES (?, ?, ?, ?, ?)');
    const insertChunk = db.prepare('INSERT INTO chunks (id, document_id, user_id, content, embedding) VALUES (?, ?, ?, ?, ?)');

    insertDoc.run(documentId, session.userId, filename, 'database_stored', createdAt);

    // 4. Chunk text and generate vector embeddings with rate-limit throttling
    const rawChunks = chunkText(extractedText);
    const textChunks = rawChunks.slice(0, 100); // Cap max 100 chunks per doc
    
    for (let i = 0; i < textChunks.length; i++) {
      const textChunk = textChunks[i];
      const embedding = await getEmbedding(textChunk);
      const chunkId = crypto.randomUUID();
      insertChunk.run(chunkId, documentId, session.userId, textChunk, JSON.stringify(embedding));
      
      // Throttle slightly every 5 chunks to remain safely under API limits
      if (i > 0 && i % 5 === 0) {
        await new Promise((res) => setTimeout(res, 250));
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
    // Delete chunks and document belonging to this user
    db.prepare('DELETE FROM chunks WHERE document_id = ? AND user_id = ?').run(documentId, session.userId);
    const result = db.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').run(documentId, session.userId);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Document not found or forbidden.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Document deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
