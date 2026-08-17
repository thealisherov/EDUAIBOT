import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDB, saveDB } from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const db = getDB();
  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return res.status(400).json({ success: false, error: "Telegram bot token kiritilmagan" });
  }

  const webhookUrl = req.body?.url || req.body?.webhookUrl || `${process.env.APP_URL || ''}/api/telegram/webhook`;
  if (!webhookUrl || !webhookUrl.startsWith('https://')) {
    return res.status(400).json({ success: false, error: "Webhook URL HTTPS bilan boshlanishi shart" });
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}&allowed_updates=${encodeURIComponent(JSON.stringify(['message', 'callback_query']))}`);
    const tgData = await tgRes.json();

    if (tgData.ok) {
      db.telegramConfig.isWebhookSet = true;
      db.telegramConfig.webhookUrl = webhookUrl;
      saveDB();
      return res.status(200).json({ success: true, message: "Webhook muvaffaqiyatli ulandi!", data: db.telegramConfig });
    } else {
      return res.status(400).json({ success: false, error: tgData.description || "Webhook o'rnatishda xatolik", data: tgData });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Telegram serveriga ulanishda xatolik" });
  }
}
