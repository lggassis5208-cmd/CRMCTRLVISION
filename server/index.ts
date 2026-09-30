import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { leadsRouter } from './routes/leads.js';
import { interacoesRouter } from './routes/interacoes.js';
import { exportRouter } from './routes/export.js';
import { modelosRouter } from './routes/modelos.js';
import { insightsRouter } from './routes/insights.js';
import { authRouter, requireAuth, ensureDefaultUser } from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Auth Routes (Pública)
app.use('/api/auth', authRouter);

// Protected API Routes
app.use('/api/leads', requireAuth, leadsRouter);
app.use('/api/interacoes', requireAuth, interacoesRouter);
app.use('/api/export', requireAuth, exportRouter);
app.use('/api/modelos', requireAuth, modelosRouter);
app.use('/api/insights', requireAuth, insightsRouter);

// Healthcheck (Pública)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend in production mode if dist folder exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.listen(PORT, async () => {
  await ensureDefaultUser();
  console.log(`🚀 CRM CTRL Vision Backend rodando em http://localhost:${PORT}`);
});
