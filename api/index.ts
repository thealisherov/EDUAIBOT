import express, { Request, Response } from 'express';
import { getDB, saveDB, BroadcastRecord } from '../lib/db';
import { handleTelegramUpdate, sendTelegramMessage, sendTelegramPhoto } from '../lib/bot';
import { KNOWLEDGE_BASE } from '../lib/knowledge';

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  const db = getDB();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    center: KNOWLEDGE_BASE.center.name, 
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    telegramConfigured: Boolean(db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN)
  });
});

// Broadcast Admin Stats
app.get('/api/stats', (req: Request, res: Response) => {
  const db = getDB();
  res.json({
    success: true,
    totalSubscribers: db.subscribers.length,
    totalBroadcasts: db.broadcasts.length,
    botUsername: db.telegramConfig.botUsername,
    isWebhookSet: db.telegramConfig.isWebhookSet
  });
});

// Broadcasts API (GET list, POST send)
const getBroadcasts = (req: Request, res: Response) => {
  const db = getDB();
  res.json({
    success: true,
    data: db.broadcasts,
    broadcasts: db.broadcasts,
    totalSubscribers: db.subscribers.length
  });
};
app.get('/api/broadcasts', getBroadcasts);
app.get('/api/broadcast', getBroadcasts);

const sendBroadcastHandler = async (req: Request, res: Response) => {
  const db = getDB();
  const { title, message, imageUrl, buttonText, buttonUrl } = req.body;
  if (!message) return res.status(400).json({ success: false, error: "Xabar matni kiritilishi shart" });

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
    // If no subscribers registered yet, mark 1 for simulation/testing
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

  res.json({ success: true, data: db.broadcasts, broadcast: broadcastRecord });
};

app.post('/api/broadcast', sendBroadcastHandler);
app.post('/api/broadcasts', sendBroadcastHandler);
app.post('/api/broadcasts/send', sendBroadcastHandler);

// Telegram Config & Webhook API
app.get('/api/telegram/config', async (req: Request, res: Response) => {
  const db = getDB();
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
  res.json({
    success: true,
    data: {
      ...db.telegramConfig,
      token: maskedToken,
      rawTokenProvided: Boolean(token),
      appUrl: process.env.APP_URL || ""
    }
  });
});

app.post('/api/telegram/config', async (req: Request, res: Response) => {
  const db = getDB();
  const { token } = req.body;
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
  res.json({ success: true, data: db.telegramConfig });
});

app.post('/api/telegram/set-webhook', async (req: Request, res: Response) => {
  const db = getDB();
  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(400).json({ success: false, error: "Telegram bot token kiritilmagan" });

  const webhookUrl = req.body.url || req.body.webhookUrl || `${process.env.APP_URL || ''}/api/telegram/webhook`;
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
      res.json({ success: true, message: "Webhook muvaffaqiyatli ulandi!", data: db.telegramConfig });
    } else {
      res.status(400).json({ success: false, error: tgData.description || "Webhook o'rnatishda xatolik" });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Telegram serveriga ulanishda xatolik" });
  }
});

app.post('/api/telegram/delete-webhook', async (req: Request, res: Response) => {
  const db = getDB();
  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(400).json({ success: false, error: "Token topilmadi" });

  try {
    await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);
    db.telegramConfig.isWebhookSet = false;
    db.telegramConfig.webhookUrl = "";
    saveDB();
    res.json({ success: true, data: db.telegramConfig });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Webhook Endpoints
const webhookHandler = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    return res.json({ ok: true, status: "Telegram Webhook Active" });
  }
  try {
    await handleTelegramUpdate(req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.json({ ok: false });
  }
};

app.post('/api/telegram/webhook', webhookHandler);
app.get('/api/telegram/webhook', webhookHandler);
app.post('/api/telegram', webhookHandler);
app.get('/api/telegram', webhookHandler);

export default app;
