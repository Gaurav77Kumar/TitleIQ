import { Router, type Request } from 'express';
import { z } from 'zod';
import { groq as client } from '../services/llm.js';
import { buildScoreSystemPrompt, buildScoreUserPrompt } from '../prompts/scorePrompt.js';
import { sql } from '../db/index.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { authenticate, type AuthenticatedRequest } from '../middleware/authenticate.js';
import type { ScoreResult } from '@titleiq/shared';

const router = Router();

const MODEL = 'llama-3.3-70b-versatile';

const AnalyzeSchema = z.object({
  title: z.string().min(5).max(150),
  niche: z.string().min(1),
});

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

/**
 * POST /api/analyze/title
 */
router.post('/title', authenticate, rateLimiter, async (req: AuthenticatedRequest, res) => {
  const ip = getClientIp(req);

  // 1. Validate request body
  const validation = AnalyzeSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.issues[0].message
    });
  }

  const { title, niche } = validation.data;

  try {
    // 2. Call AI
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: buildScoreSystemPrompt() },
        { role: 'user', content: buildScoreUserPrompt(title, niche) },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 800,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) throw new Error('AI returned empty response');

    let scoreResult: ScoreResult;
    try {
      scoreResult = JSON.parse(rawContent);
    } catch (err) {
      // Retry once if JSON parse fails
      console.warn('JSON parse failed, retrying with stricter prompt...');
      const retryCompletion = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: buildScoreSystemPrompt() + "\nIMPORTANT: RETURN ONLY RAW JSON." },
          { role: 'user', content: buildScoreUserPrompt(title, niche) },
        ],
        response_format: { type: 'json_object' },
      });
      scoreResult = JSON.parse(retryCompletion.choices[0]?.message?.content || '{}');
    }

    // 3. Save to database
    let analysisId = crypto.randomUUID();
    try {
      const [row] = await sql`
        INSERT INTO analyses (user_id, title_input, niche, score_json)
        VALUES (${req.user?.id || null}, ${title}, ${niche}, ${JSON.stringify(scoreResult)}::jsonb)
        RETURNING id
      `;
      if (row?.id) analysisId = row.id;

      // Log usage
      await sql`
        INSERT INTO usage_logs (ip_address, user_id)
        VALUES (${ip}, ${req.user?.id || null})
      `;
    } catch (dbErr) {
      console.error('Database save failed:', dbErr);
    }

    // 4. Return result
    res.json({
      success: true,
      data: scoreResult,
      analysisId,
      remainingToday: 5,
    });

  } catch (err: any) {
    console.error('Analysis endpoint error:', err);
    res.status(502).json({
      success: false,
      error: 'Analysis failed. Please try again.'
    });
  }
});

/**
 * GET /api/niches
 */
router.get('/niches', (_req, res) => {
  const niches = [
    'Gaming', 'Finance', 'Fitness', 'Cooking', 'Tech', 'Education', 'Lifestyle',
    'Travel', 'Beauty', 'Business', 'Music', 'Sports', 'Entertainment', 'Health', 'Other'
  ];
  res.json({ success: true, niches });
});

export default router;
