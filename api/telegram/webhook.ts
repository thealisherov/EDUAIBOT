import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleTelegramUpdate } from '../lib/bot.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: "EDUAIBOT Webhook Active" });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = req.body;
    await handleTelegramUpdate(update);
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
