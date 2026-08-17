import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './api/index';
import { loadDB } from './lib/db';

// Initial DB setup
loadDB();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  // Setup Vite development middleware or serve static production build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EDUAIBOT Server running on http://localhost:${PORT}`);
    console.log(`📡 Local Webhook endpoint: http://localhost:${PORT}/api/telegram/webhook`);
    console.log(`🤖 Telegram Bot configured: ${Boolean(process.env.TELEGRAM_BOT_TOKEN)}`);
    console.log(`✨ Gemini AI configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
  });
}

startServer();
