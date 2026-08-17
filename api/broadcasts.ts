import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDB, saveDB, BroadcastRecord } from './lib/db.js';
import { sendTelegramMessage, sendTelegramPhoto } from './lib/bot.js';
import { KNOWLEDGE_BASE } from './lib/knowledge.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getDB();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: db.broadcasts,
      broadcasts: db.broadcasts,
      totalSubscribers: db.subscribers.length
    });
  }

  if (req.method === 'POST') {
    try {
      const { title, message, imageUrl, buttonText, buttonUrl } = req.body || {};
      if (!message) {
        return res.status(400).json({ success: false, error: "Xabar matni kiritilishi shart" });
      }

      const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
      const targetSubscribers = db.subscribers;

      let successCount = 0;
      let failedCount = 0;

      const formattedMessage = `<b>📢 ${title ? title : KNOWLEDGE_BASE.center.name}</b>\n\n${message}`;
      const replyMarkup = buttonText && buttonUrl ? {
        inline_keyboard: [[{ text: buttonText, url: buttonUrl }]]
      } : undefined;

      if (token && targetSubscribers.length > 0) {
        for (const sub of targetSubscribers) {
          try {
            let sent = false;
            if (imageUrl) {
              sent = await sendTelegramPhoto(sub.telegramId, imageUrl, formattedMessage, replyMarkup);
            } else {
              sent = await sendTelegramMessage(sub.telegramId, formattedMessage, replyMarkup);
            }
            if (sent) successCount++;
            else failedCount++;
          } catch {
            failedCount++;
          }
        }
      } else {
        successCount = 1;
      }

      const broadcastRecord: BroadcastRecord = {
        id: `b_${Date.now()}`,
        title: title || "Ommaviy Xabarnoma",
        message,
        imageUrl,
        buttonText,
        buttonUrl,
        sentAt: new Date().toISOString(),
        targetCount: targetSubscribers.length || 1,
        successCount,
        failedCount,
        status: "sent"
      };

      db.broadcasts.unshift(broadcastRecord);
      saveDB();

      return res.status(200).json({ success: true, data: db.broadcasts, broadcast: broadcastRecord });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
