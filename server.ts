import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { TOOLS_REGISTRY } from './src/lib/tools/registry.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      ok: true,
      service: 'translator-kit',
      version: '2.4.0',
      timestamp: new Date().toISOString(),
      productionTools: TOOLS_REGISTRY.filter((t) => t.status === 'production').length,
    });
  });

  app.get('/api/tools', (req, res) => {
    res.json(TOOLS_REGISTRY);
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }
    res.json({ success: true, message: 'Feedback received successfully.' });
  });

  // Vite middleware setup for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Translator Kit server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
