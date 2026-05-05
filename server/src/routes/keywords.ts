import { Router } from 'express';
import { z } from 'zod';
import { groq as client } from '../services/llm.js';
import { buildKeywordSystemPrompt, buildKeywordUserPrompt } from '../prompts/keywordPrompt.js';
import { sql } from '../db/index.js';
import { authenticate, type AuthenticatedRequest } from '../middleware/authenticate.js';
import { requirePro } from '../middleware/requirePro.js';
import type { KeywordResult } from '@titleiq/shared';

const router = Router();

const MODEL = 'llama-3.3-70b-versatile';

const KeywordAnalysisSchema = z.object({
  analysisId: z.string().uuid(),
  title: z.string().min(5).max(150),
  niche: z.string().min(1),
  currentScore: z.number().min(0).max(100),
});

/**
 * POST /api/analyze/keywords
 */
router.post('/', authenticate, requirePro, async (req: AuthenticatedRequest, res) => {
  // 1. Validate request body
  const validation = KeywordAnalysisSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.issues[0].message
    });
  }

  const { analysisId, title, niche, currentScore } = validation.data;

  try {
    // 2. Verify ownership
    const [analysis] = await sql`
      SELECT id, user_id FROM analyses 
      WHERE id = ${analysisId} AND user_id = ${req.user?.id}
    `;

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found or not owned'
      });
    }

    // 3. Call AI
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: buildKeywordSystemPrompt() },
        { role: 'user', content: buildKeywordUserPrompt(title, niche, currentScore) },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 600,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) throw new Error('AI returned empty response');

    let keywordResult: KeywordResult;
    try {
      keywordResult = JSON.parse(rawContent);
    } catch (err) {
      // Retry once
      const retryCompletion = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: buildKeywordSystemPrompt() + "\nIMPORTANT: RETURN ONLY RAW JSON." },
          { role: 'user', content: buildKeywordUserPrompt(title, niche, currentScore) },
        ],
        response_format: { type: 'json_object' },
      });
      keywordResult = JSON.parse(retryCompletion.choices[0]?.message?.content || '{}');
    }

    // 4. Update database
    await sql`
      UPDATE analyses 
      SET keyword_data = ${JSON.stringify(keywordResult)}::jsonb
      WHERE id = ${analysisId}
    `;

    // 5. Return result
    res.json({
      success: true,
      data: keywordResult
    });

  } catch (err: any) {
    console.error('Keyword analysis error:', err);
    res.status(500).json({
      success: false,
      error: 'Analysis failed. Please try again.'
    });
  }
});

export default router;
