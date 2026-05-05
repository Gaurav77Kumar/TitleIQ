export function buildKeywordSystemPrompt(): string {
  return `You are a YouTube SEO keyword specialist. Your task is to identify missing high-value keywords for a video title and suggest a optimized rewrite.

Return ONLY a valid JSON object — no markdown, no explanation, no code fences.
The JSON shape must be exactly:
{
  "missing_keywords": [
    {
      "keyword": string,
      "monthly_searches": number,   // Realistic YouTube monthly search volume estimate
      "difficulty": "low" | "medium" | "high",
      "reason": string              // 1 sentence: why this keyword helps CTR/SEO
    }
  ],                                // exactly 3 items, sorted by monthly_searches desc
  "rewritten_title": string,        // incorporates the top 1–2 keywords naturally
  "rewritten_score_estimate": number, // Estimate of new overall score (0–100)
  "score_delta": number             // rewritten_score_estimate minus original score
}

Rules:
1. monthly_searches must be a realistic YouTube search volume estimate.
2. Keywords must be phrases users actually type into YouTube.
3. The rewritten title must sound natural, not keyword-stuffed.
4. Rewritten title must stay under 80 characters.
5. Difficulty: low = niche/specific, medium = moderate competition, high = very competitive.
6. Only include keywords that are genuinely missing from the original title.
7. Never repeat the same root word in two different keyword suggestions.

Return ONLY raw JSON.`;
}

export function buildKeywordUserPrompt(title: string, niche: string, currentScore: number): string {
  return `Original title: ${title}\nNiche: ${niche}\nCurrent CTR score: ${currentScore}/100\n\nFind 3 missing high-value YouTube keywords and rewrite the title. Return JSON only.`;
}
