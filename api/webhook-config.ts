import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDB, saveDB } from './lib/db.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getDB();
  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return res.status(400).json({ success: false, error: "TELEGRAM_BOT_TOKEN not configured" });
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
      const data = await response.json();
      return res.status(200).json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    const webhookUrl = req.body.url || req.body.webhookUrl;

    if (!webhookUrl) {
      return res.status(400).json({ success: false, error: "webhookUrl is required" });
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query', 'contact']
        })
      });

      const data = await response.json();

      if (data.ok) {
        db.telegramConfig.isWebhookSet = true;
        db.telegramConfig.webhookUrl = webhookUrl;
        saveDB();
        return res.status(200).json({ 
          success: true, 
          message: "Webhook set successfully",
          data 
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          error: data.description || "Failed to set webhook",
          data 
        });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
