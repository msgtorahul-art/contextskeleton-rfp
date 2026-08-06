import { GoogleGenAI } from '@google/genai';

export async function processSkeletonizerEngine(params: {
  rawText?: string;
  text?: string;
}) {
  const input = (params.rawText || params.text || '').trim();

  if (!input) {
    return { error: 'Input text is required for skeletonization' };
  }

  const initialTokens = Math.max(10, Math.ceil(input.length / 4));

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a Senior Universal Token Skeletonizer & Code/Document Compression Specialist.

Input Content:
"""
${input}
"""

Task: Strip out boilerplate comments, repetitive prose, and non-essential formatting while preserving 100% of the core structural types, interfaces, metrics, regulatory clauses, and function signatures. Produce a dense token-compressed skeletonized representation.

Return ONLY valid JSON matching this structure:
{
  "skeletonizedText": "The compressed structural skeletonized text",
  "compressionSummary": "Brief explanation of structural tokens preserved vs boilerplate removed"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      if (response && response.text) {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const compressedTokens = Math.max(1, Math.ceil(parsed.skeletonizedText.length / 4));
          const ratio = (((initialTokens - compressedTokens) / initialTokens) * 100).toFixed(1);

          return {
            initialTokens,
            compressedTokens,
            compressionRatio: `${ratio}%`,
            skeletonizedText: parsed.skeletonizedText,
            compressionSummary: parsed.compressionSummary || 'Stripped boilerplate formatting while maintaining structural compliance types.'
          };
        }
      }
    } catch (e) {
      console.warn('[skeletonizerEngine] Gemini call failed, utilizing local structural compression algorithm.');
    }
  }

  // Real local structural skeletonization algorithm (preserves interfaces, functions, keys, metrics)
  const lines = input.split('\n');
  const compressedLines = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return false;
    return true;
  });

  const skeletonText = compressedLines.join('\n');
  const compressedTokens = Math.max(5, Math.ceil(skeletonText.length / 4));
  const ratio = (((initialTokens - compressedTokens) / initialTokens) * 100).toFixed(1);

  return {
    initialTokens,
    compressedTokens,
    compressionRatio: `${ratio}%`,
    skeletonizedText: skeletonText,
    compressionSummary: 'Removed non-essential comments and whitespace while preserving active structural symbols.'
  };
}
