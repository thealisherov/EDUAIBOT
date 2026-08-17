import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDB, saveDB } from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const db = getDB();
  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return res.status(400).json({ success: false, error: "Token topilmadi" });
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);
    db.telegramConfig.isWebhookSet = false;
    db.telegramConfig.webhookUrl = "";
    saveDB();
    return res.status(200).json({ success: true, data: db.telegramConfig });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
