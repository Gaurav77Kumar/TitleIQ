import Groq from 'groq-sdk';
import type { ScoreResult, ThumbnailScoreResult } from '@titleiq/shared';

let _client: Groq | null = null;
function getClient() {
  if (!_client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is missing');
    }
    _client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return _client;
}

export const groq: Groq = new Proxy({} as Groq, {
  get(target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  }
});

const TEXT_MODEL = 'llama-3.3-70b-versatile';
const VISION_MODEL = 'llama-3.2-11b-vision-preview';

// ─── Prompt ─────────────────────────────────────────────────────────────────

function buildPrompt(title: string, niche?: string): string {
  const nicheContext = niche ? `The video is in the "${niche}" niche.` : '';

  return `You are an expert YouTube growth strategist who specializes in CTR optimization.

Analyze the following YouTube video title and return ONLY a valid JSON object — no markdown, no explanation, no code fences.

Title: "${title}"
${nicheContext}

Return exactly this JSON shape:
{
  "overall_score": <number 0-100>,
  "sub_scores": {
    "curiosity_gap": <number 0-100>,
    "keyword_strength": <number 0-100>,
    "emotional_pull": <number 0-100>,
    "length_score": <number 0-100>
  },
  "strengths": [<2-3 concise strings about what the title does well>],
  "improvements": [<2-3 specific, actionable fixes to increase CTR>],
  "alternative_titles": [<exactly 5 alternative title strings, optimized for high CTR>]
}

Scoring guide:
- overall_score: Weighted CTR likelihood (curiosity_gap 35%, keyword_strength 25%, emotional_pull 25%, length_score 15%)
- curiosity_gap: Does it create an information gap that compels clicking?
- keyword_strength: Are high-search-volume keywords used naturally?
- emotional_pull: Does it trigger emotion (excitement, fear, curiosity, aspiration)?
- length_score: Ideal is 40-60 chars. Penalize under 20 or over 70.
- alternative_titles: Make these genuinely better — not just cosmetic rewrites.

Return ONLY the JSON. No other text.`;
}

function buildThumbnailPrompt(): string {
  return `You are an expert YouTube growth strategist who specializes in thumbnail CTR optimization.

Analyze the provided thumbnail image and return ONLY a valid JSON object — no markdown, no explanation, no code fences.

Return exactly this JSON shape:
{
  "overall_score": <number 0-100>,
  "sub_scores": {
    "text_readability": <number 0-100>,
    "face_impact": <number 0-100>,
    "color_contrast": <number 0-100>,
    "clutter_score": <number 0-100>
  },
  "improvements": [<exactly 3 specific, actionable improvement tips>]
}

Scoring guide:
- overall_score: Weighted CTR likelihood.
- text_readability: Is the text legible even at small sizes?
- face_impact: Is there a clear, expressive face? (Score 0 if no face).
- color_contrast: Does it stand out against YouTube's light/dark modes?
- clutter_score: Is the composition clean (100) or too busy (0)?

Return ONLY the JSON. No other text.`;
}

// ─── Raw response validation ─────────────────────────────────────────────────

function isValidScoreResult(obj: unknown): obj is ScoreResult {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;

  if (typeof o.overall_score !== 'number') return false;
  if (typeof o.sub_scores !== 'object' || o.sub_scores === null) return false;

  const ss = o.sub_scores as Record<string, unknown>;
  if (
    typeof ss.curiosity_gap !== 'number' ||
    typeof ss.keyword_strength !== 'number' ||
    typeof ss.emotional_pull !== 'number' ||
    typeof ss.length_score !== 'number'
  )
    return false;

  if (!Array.isArray(o.strengths)) return false;
  if (!Array.isArray(o.improvements)) return false;
  if (!Array.isArray(o.alternative_titles)) return false;

  return true;
}

function isValidThumbnailResult(obj: unknown): obj is ThumbnailScoreResult {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;

  if (typeof o.overall_score !== 'number') return false;
  if (typeof o.sub_scores !== 'object' || o.sub_scores === null) return false;

  const ss = o.sub_scores as Record<string, unknown>;
  if (
    typeof ss.text_readability !== 'number' ||
    typeof ss.face_impact !== 'number' ||
    typeof ss.color_contrast !== 'number' ||
    typeof ss.clutter_score !== 'number'
  ) return false;

  if (!Array.isArray(o.improvements)) return false;

  return true;
}

// ─── Clamp helper ────────────────────────────────────────────────────────────

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function sanitize(raw: ScoreResult): ScoreResult {
  return {
    overall_score: clamp(raw.overall_score),
    sub_scores: {
      curiosity_gap: clamp(raw.sub_scores.curiosity_gap),
      keyword_strength: clamp(raw.sub_scores.keyword_strength),
      emotional_pull: clamp(raw.sub_scores.emotional_pull),
      length_score: clamp(raw.sub_scores.length_score),
    },
    strengths: raw.strengths.slice(0, 3).map(String),
    improvements: raw.improvements.slice(0, 3).map(String),
    alternative_titles: raw.alternative_titles.slice(0, 5).map(String),
  };
}

function sanitizeThumbnail(raw: any): ThumbnailScoreResult {
  return {
    overall_score: clamp(raw.overall_score),
    sub_scores: {
      text_readability: clamp(raw.sub_scores.text_readability),
      face_impact: clamp(raw.sub_scores.face_impact),
      color_contrast: clamp(raw.sub_scores.color_contrast),
      clutter_score: clamp(raw.sub_scores.clutter_score),
    },
    improvements: raw.improvements.slice(0, 3).map(String),
  };
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function analyzeTitle(
  title: string,
  niche?: string
): Promise<ScoreResult> {
  const completion = await getClient().chat.completions.create({
    model: TEXT_MODEL,
    messages: [
      {
        role: 'user',
        content: buildPrompt(title, niche),
      },
    ],
    response_format: { type: 'json_object' },
  });

  const rawText = completion.choices[0]?.message?.content?.trim();
  if (!rawText) {
    throw new Error('AI returned no text content');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error('AI raw response (failed to parse):', rawText);
    throw new Error('AI returned invalid JSON. Please try again.');
  }

  if (!isValidScoreResult(parsed)) {
    console.error('AI JSON shape mismatch:', parsed);
    throw new Error('AI response did not match expected schema.');
  }

  return sanitize(parsed);
}

export async function analyzeThumbnail(
  imageBase64: string,
  mimeType: string
): Promise<ThumbnailScoreResult> {
  const completion = await getClient().chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: buildThumbnailPrompt(),
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
  });

  const rawText = completion.choices[0]?.message?.content?.trim();
  if (!rawText) {
    throw new Error('AI returned no text content');
  }

  const jsonText = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    console.error('AI raw response (failed to parse):', rawText);
    throw new Error('AI returned invalid JSON. Please try again.');
  }

  if (!isValidThumbnailResult(parsed)) {
    console.error('AI JSON shape mismatch:', parsed);
    throw new Error('AI response did not match expected schema.');
  }

  return sanitizeThumbnail(parsed);
}
