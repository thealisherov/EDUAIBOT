import { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'data_store.json');

// Load or initialize database
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error("Failed to load DB:", err);
  }
  return { telegramConfig: { token: process.env.TELEGRAM_BOT_TOKEN || "", isWebhookSet: false } };
}

// Telegram webhook handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = req.body;
    const db = loadDB();
    const token = db.telegramConfig?.token || process.env.TELEGRAM_BOT_TOKEN;

    console.log('Telegram update received:', update);

    // Process the update (message, callback_query, etc.)
    if (update.message) {
      const { chat, from, text, contact } = update.message;
      const chatId = chat.id;

      // Handle phone number contact
      if (contact) {
        const reply = `Rahmat! Telefon raqamingiz qabul qilindi: ${contact.phone_number}\n\nAdministrator tez orada siz bilan bog'lanadi.`;
        
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: reply })
        });
      }
      // Handle /start
      else if (text === '/start') {
        const welcome = `Assalomu alaykum, <b>${from.first_name || 'aziz o\'quvchi'}</b>! 🎓\n\nEVEREST Academy rasmiy botiga xush kelibsiz!\n\n/help - yordam`;
        
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chat_id: chatId, 
            text: welcome,
            parse_mode: 'HTML'
          })
        });
      }
      // Handle /help
      else if (text === '/help') {
        const help = `<b>Mavjud buyruqlar:</b>\n/start - Boshlash\n/courses - Kurslar\n/teachers - O'qituvchilar\n/time - Ish vaqti\n/location - Manzil\n/register - Ro'yxatdan o'tish`;
        
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chat_id: chatId, 
            text: help,
            parse_mode: 'HTML'
          })
        });
      }
      // Handle text messages with AI
      else if (text) {
        const aiReply = `Siz yoztingiz: "${text}"\n\nTez orada AI javob beriladi...`;
        
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: aiReply })
        });
      }
    }

    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: err.message });
  }
}
