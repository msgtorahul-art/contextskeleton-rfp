import { GoogleGenAI } from '@google/genai';
import { db } from './db';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Global serverless in-memory vector chunk store
export interface StoredChunk {
  id: string;
  document_id: string;
  user_id: string;
  filename: string;
  content: string;
  embedding: number[];
}

export const memoryVectorChunks: StoredChunk[] = [];
export const memoryVectorDocs: Array<{ id: string; user_id: string; filename: string; created_at: string }> = [];

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    });
    
    if (!response.embeddings || response.embeddings.length === 0) {
      throw new Error('No embeddings returned from Gemini API');
    }
    
    const values = response.embeddings[0].values;
    if (!values) {
      throw new Error('Embedding values are undefined');
    }
    return values;
  } catch (error) {
    console.error('Error generating embedding (falling back to simple bag-of-words vector):', error);
    // Simple 64-dim pseudo-embedding fallback so vector search never breaks if Gemini embedding API rate limits
    const fallbackVector = new Array(64).fill(0);
    for (let i = 0; i < text.length; i++) {
      fallbackVector[i % 64] += text.charCodeAt(i) / 255;
    }
    return fallbackVector;
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export interface SearchResult {
  content: string;
  filename: string;
  similarity: number;
}

export async function findSimilarChunks(
  userId: string,
  queryText: string,
  limit = 5
): Promise<SearchResult[]> {
  try {
    const queryVector = await getEmbedding(queryText);
    
    const allChunks: Array<{ content: string; embedding: number[]; filename: string }> = [];

    // 1. Fetch from SQLite DB
    try {
      const rows = db.prepare(`
        SELECT chunks.content, chunks.embedding, documents.filename 
        FROM chunks 
        JOIN documents ON chunks.document_id = documents.id 
        WHERE chunks.user_id = ?
      `).all(userId) as { content: string; embedding: string; filename: string }[];

      for (const row of rows) {
        allChunks.push({
          content: row.content,
          embedding: JSON.parse(row.embedding),
          filename: row.filename
        });
      }
    } catch (e) {}

    // 2. Fetch from memory store
    const memChunks = memoryVectorChunks.filter(c => c.user_id === userId);
    for (const mc of memChunks) {
      if (!allChunks.some(c => c.content === mc.content)) {
        allChunks.push({
          content: mc.content,
          embedding: mc.embedding,
          filename: mc.filename
        });
      }
    }
    
    const results: SearchResult[] = [];
    for (const chunk of allChunks) {
      const similarity = cosineSimilarity(queryVector, chunk.embedding);
      results.push({
        content: chunk.content,
        filename: chunk.filename,
        similarity
      });
    }
    
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  } catch (error) {
    console.error('Error in vector similarity search:', error);
    return [];
  }
}
