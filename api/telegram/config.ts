import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDB, saveDB } from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getDB();

  if (req.method === 'GET') {
    const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN || "";
    
    if (token && (!db.telegramConfig.botName || db.telegramConfig.botName === "EVEREST Academy Bot")) {
      try {
        const getMeRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
        const getMeData = await getMeRes.json();
        if (getMeData.ok && getMeData.result) {
          db.telegramConfig.botUsername = `@${getMeData.result.username}`;
          db.telegramConfig.botName = getMeData.result.first_name;
          saveDB();
        }
      } catch {}
    }

    const maskedToken = token ? (token.slice(0, 8) + '...' + token.slice(-5)) : '';
    return res.status(200).json({
      success: true,
      data: {
        ...db.telegramConfig,
        token: maskedToken,
        rawTokenProvided: Boolean(token),
        appUrl: process.env.APP_URL || ""
      }
    });
  }

  if (req.method === 'POST') {
    const { token } = req.body || {};
    if (token !== undefined) {
      db.telegramConfig.token = token.trim();
    }

    if (db.telegramConfig.token) {
      try {
        const getMeRes = await fetch(`https://api.telegram.org/bot${db.telegramConfig.token}/getMe`);
        const getMeData = await getMeRes.json();
        if (getMeData.ok && getMeData.result) {
          db.telegramConfig.botUsername = `@${getMeData.result.username}`;
          db.telegramConfig.botName = getMeData.result.first_name;
        }
      } catch {}
    }

    saveDB();
    return res.status(200).json({ success: true, data: db.telegramConfig });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
