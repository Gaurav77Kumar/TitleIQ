import { Router } from 'express';
import { z } from 'zod';
import { groq as client } from '../services/llm.js';
import { buildSimulatorSystemPrompt, buildSimulatorUserPrompt } from '../prompts/simulatorPrompt.js';
import { COMPETITOR_TITLES } from '../data/competitorTitles.js';
import { sql } from '../db/index.js';
import { authenticate, type AuthenticatedRequest } from '../middleware/authenticate.js';
import { requirePro } from '../middleware/requirePro.js';
import type { SimulationResult } from '@titleiq/shared';

const router = Router();

const MODEL = 'llama-3.3-70b-versatile';

const SimulationSchema = z.object({
  title: z.string().min(5).max(150),
  niche: z.string().min(1),
  analysisId: z.string().uuid().optional(),
});

/**
 * POST /api/analyze/simulate
 */
router.post('/', authenticate, requirePro, async (req: AuthenticatedRequest, res) => {
  const validation = SimulationSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ 
      success: false, 
      error: validation.error.issues[0].message 
    });
  }

  const { title, niche } = validation.data;

  try {
    // 1. Pick 4 random competitors
    const competitors = COMPETITOR_TITLES[niche] || COMPETITOR_TITLES['Other'];
    const shuffledCompetitors = [...competitors].sort(() => 0.5 - Math.random());
    const selectedCompetitors = shuffledCompetitors.slice(0, 4);

    // 2. Call AI
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: buildSimulatorSystemPrompt() },
        { role: 'user', content: buildSimulatorUserPrompt(title, selectedCompetitors, niche) },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 900,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) throw new Error('AI returned empty response');

    let simulationResult: SimulationResult;
    try {
      simulationResult = JSON.parse(rawContent);
    } catch (err) {
      // Retry once
      const retryCompletion = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: buildSimulatorSystemPrompt() + "\nIMPORTANT: RETURN ONLY RAW JSON." },
          { role: 'user', content: buildSimulatorUserPrompt(title, selectedCompetitors, niche) },
        ],
        response_format: { type: 'json_object' },
      });
      simulationResult = JSON.parse(retryCompletion.choices[0]?.message?.content || '{}');
    }

    // 3. Save to database
    const [row] = await sql`
      INSERT INTO simulations (user_id, title, niche, result_json)
      VALUES (${req.user?.id}, ${title}, ${niche}, ${JSON.stringify(simulationResult)}::jsonb)
      RETURNING id
    `;

    // 4. Return result
    res.json({
      success: true,
      data: simulationResult,
      simulationId: row.id
    });

  } catch (err: any) {
    console.error('Simulation error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Simulation failed. Please try again.' 
    });
  }
});

/**
 * GET /api/analyze/simulate/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const [sim] = await sql`
      SELECT result_json FROM simulations WHERE id = ${req.params.id}
    `;

    if (!sim) {
      return res.status(404).json({ success: false, error: 'Simulation not found' });
    }

    res.json({
      success: true,
      data: sim.result_json
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
