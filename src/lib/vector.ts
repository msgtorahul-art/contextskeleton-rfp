import { GoogleGenAI } from '@google/genai';
import { db } from './db';

// Instantiate the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Get embedding for a given text using text-embedding-004
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-2',
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
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Compute cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < a.length; i++) {
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

// Perform local RAG search by calculating cosine similarity over SQLite database
export async function findSimilarChunks(
  userId: string,
  queryText: string,
  limit = 5
): Promise<SearchResult[]> {
  try {
    const queryVector = await getEmbedding(queryText);
    
    // Fetch all chunks for this user from SQLite database
    const rows = db.prepare(`
      SELECT chunks.content, chunks.embedding, documents.filename 
      FROM chunks 
      JOIN documents ON chunks.document_id = documents.id 
      WHERE chunks.user_id = ?
    `).all(userId) as { content: string; embedding: string; filename: string }[];
    
    const results: SearchResult[] = [];
    
    for (const row of rows) {
      const chunkVector = JSON.parse(row.embedding) as number[];
      const similarity = cosineSimilarity(queryVector, chunkVector);
      results.push({
        content: row.content,
        filename: row.filename,
        similarity
      });
    }
    
    // Sort descending by similarity score
    results.sort((a, b) => b.similarity - a.similarity);
    
    // Return top matching chunks
    return results.slice(0, limit);
  } catch (error) {
    console.error('Error in vector similarity search:', error);
    return [];
  }
}
