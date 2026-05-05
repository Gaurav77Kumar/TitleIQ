export function buildSimulatorSystemPrompt(): string {
  return `You are a YouTube audience behavior analyst. Your task is to simulate how viewers react to a feed of video titles and predict which one they would click.

Return ONLY a valid JSON object — no markdown, no explanation, no code fences.
The JSON shape must be exactly:
{
  "rankings": [
    {
      "title": string,
      "is_user_title": boolean,
      "estimated_ctr": number,        // realistic 2.0–12.0 range (one decimal)
      "rank": number,                 // 1 = most clickable
      "win_factors": string[],        // what makes this title strong (1–2 items)
      "loss_factors": string[]        // what weakens it (1–2 items, empty if rank 1)
    }
  ],
  "user_title_rank": number,          // rank of the user's title (1–5)
  "user_wins_on": string[],           // dimensions where user title beats competitors (e.g. "Urgency", "Clarity")
  "user_loses_on": string[],          // dimensions where user title loses
  "one_fix": string                   // single most impactful change to move up 1 rank
}

Rules:
1. Judge titles purely on CTR potential — curiosity gap, specificity, emotional trigger, search intent.
2. estimated_ctr should be realistic: top YouTube titles average 6–10%, average 3–5%.
3. is_user_title: true for exactly one entry.
4. win_factors and loss_factors: be specific about the psychology.
5. one_fix: must be a concrete, actionable sentence starting with a verb.
6. Rankings must sum to 1+2+3+4+5 = 15 (each rank used exactly once).
7. Handle all 5 titles provided in the user prompt.

Return ONLY raw JSON.`;
}

export function buildSimulatorUserPrompt(userTitle: string, competitorTitles: string[], niche: string): string {
  const allTitles = [
    { title: userTitle, isUser: true },
    ...competitorTitles.map(t => ({ title: t, isUser: false }))
  ];

  // Note: shuffling is handled in the route logic, but we format it here
  return `Analyze these 5 YouTube titles in the "${niche}" niche. One is the user's title, the others are top-performing competitors.

Titles:
${allTitles.map((t, i) => `${i + 1}. ${t.title}${t.isUser ? ' (USER TITLE)' : ''}`).join('\n')}

Predict which one a viewer would click first and provide detailed rankings. Return JSON only.`;
}
