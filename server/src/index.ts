import './lib/env.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import analyzeTitleRouter from './routes/analyzeTitle.js';
import analyzeThumbnailRouter from './routes/analyzeThumbnail.js';
import authRouter from './routes/auth.js';
import historyRouter from './routes/history.js';
import billingRouter from './routes/billing.js';
import adminRouter from './routes/admin.js';
import analyzeRouter from './routes/analyze.js';
import keywordRouter from './routes/keywords.js';
import simulatorRouter from './routes/simulate.js';
import { authenticate } from './middleware/authenticate.js';
import type { HealthResponse } from '@titleiq/shared';

const app = express();
app.set('trust proxy', 1);

const PORT = Number(process.env.PORT) || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// JSON body parser and auth middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(authenticate);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

app.use('/api/analyze-title', analyzeTitleRouter);
app.use('/api/analyze-thumbnail', analyzeThumbnailRouter);
app.use('/api/auth', authRouter);
app.use('/api/history', historyRouter);
app.use('/api/admin', adminRouter);
app.use('/api/billing', billingRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/analyze/keywords', keywordRouter);
app.use('/api/analyze/simulate', simulatorRouter);

// ─── Error handler (must be last) ────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TitleIQ server running on http://0.0.0.0:${PORT}`);
});

export default app;
