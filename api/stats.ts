import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDB } from './lib/db';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = getDB();
    return res.status(200).json({
      success: true,
      totalSubscribers: db.subscribers.length,
      totalBroadcasts: db.broadcasts.length,
      botUsername: db.telegramConfig.botUsername,
      isWebhookSet: db.telegramConfig.isWebhookSet
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
