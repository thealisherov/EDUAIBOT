import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDB } from './lib/db.js';
import { KNOWLEDGE_BASE } from './lib/knowledge.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = getDB();
    return res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      center: KNOWLEDGE_BASE.center.name, 
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      telegramConfigured: Boolean(db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN)
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
