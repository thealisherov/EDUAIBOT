import { getDB, addOrUpdateSubscriber } from './db.js';
import { askGemini } from './gemini.js';
import { KNOWLEDGE_BASE } from './knowledge.js';

// Helper: Send Message to Telegram API
export async function sendTelegramMessage(
  chatId: number | string, 
  text: string, 
  replyMarkup?: any
): Promise<boolean> {
  const db = getDB();
  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

  try {
    const body: any = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
    };
    if (replyMarkup) {
      body.reply_markup = replyMarkup;
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    return Boolean(result.ok);
  } catch (err) {
    console.error("Failed to send Telegram message:", err);
    return false;
  }
}

// Helper: Send Photo to Telegram API
export async function sendTelegramPhoto(
  chatId: number | string, 
  photoUrl: string, 
  caption?: string, 
  replyMarkup?: any
): Promise<boolean> {
  const db = getDB();
  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

  try {
    const body: any = {
      chat_id: chatId,
      photo: photoUrl,
      caption: caption || '',
      parse_mode: 'HTML',
    };
    if (replyMarkup) {
      body.reply_markup = replyMarkup;
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    return Boolean(result.ok);
  } catch (err) {
    console.error("Failed to send Telegram photo:", err);
    return false;
  }
}

// Main Telegram Update Handler
export async function handleTelegramUpdate(update: any): Promise<void> {
  if (!update || !update.message) return;

  const msg = update.message;
  const chatId = msg.chat.id;
  const from = msg.from;
  const text = (msg.text || '').trim();

  // Save subscriber for broadcast targeting
  if (from) {
    addOrUpdateSubscriber(from);
  }

  const { center, courses, teachers } = KNOWLEDGE_BASE;

  const defaultKeyboard = {
    keyboard: [
      [{ text: "📚 Kurslar va Narxlar" }, { text: "👨‍🏫 O'qituvchilar" }],
      [{ text: "⏰ Ish vaqti" }, { text: "📍 Manzil va Mo'ljal" }],
      [{ text: "✍️ Ro'yxatdan o'tish" }, { text: "📞 Bog'lanish" }]
    ],
    resize_keyboard: true
  };

  // Quick Command Handling
  if (text === '/start' || text.toLowerCase() === 'start') {
    const welcome = `Assalomu alaykum, <b>${from?.first_name || 'aziz o\'quvchi'}</b>! 🎓\n\n<b>${center.name}</b> rasmiy intellektual botiga xush kelibsiz!\n\nBizning markazda:\n• Zamonaviy IT va Dasturlash kurslari\n• IELTS 7.5+ va Xorijiy tillar\n• UI/UX va Grafik dizayn\n\nQuyidagi tugmalardan birini tanlang yoki markazimiz bo'yicha o'zingizni qiziqtirgan savolni yozing!`;
    await sendTelegramMessage(chatId, welcome, defaultKeyboard);
    return;
  }

  if (text === '📚 Kurslar va Narxlar' || text === '/kurslar' || text === '/courses') {
    let msgText = `<b>🎓 ${center.name} Kurslari va Narxlari:</b>\n\n`;
    courses.forEach((c, idx) => {
      msgText += `<b>${idx + 1}. ${c.title}</b>\n💰 Narxi: <b>${c.priceFormatted}</b>\n⏱ Davomiyligi: ${c.duration} (${c.lessonDuration})\n🗓 Dars kunlari: ${c.schedule}\n\n`;
    });
    msgText += `👉 Qiziqqan kursingiz bo'yicha to'liq ma'lumot olish uchun erkin savol bering yoki «✍️ Ro'yxatdan o'tish» tugmasini bosing!`;
    await sendTelegramMessage(chatId, msgText, defaultKeyboard);
    return;
  }

  if (text === "👨‍🏫 O'qituvchilar" || text === '/oqituvchilar' || text === '/teachers') {
    let msgText = `<b>👨‍🏫 Bizning Professional Ustozlarimiz:</b>\n\n`;
    teachers.forEach((t, idx) => {
      msgText += `<b>${idx + 1}. ${t.name}</b>\n📌 Yo'nalish: ${t.subject}\n🎖 Malaka: ${t.degree}\n⏳ Tajriba: ${t.experience}\n⭐ Reyting: ${t.rating}/5.0 (${t.studentsCount}+ o'quvchi)\n\n`;
    });
    await sendTelegramMessage(chatId, msgText, defaultKeyboard);
    return;
  }

  if (text === '⏰ Ish vaqti' || text === '/ishvaqti' || text === '/time') {
    const timeMsg = `<b>⏰ ${center.name} Ish Vaqti:</b>\n\n• <b>Ochilish vaqti:</b> ertalab soat <b>${center.workingHours.openingTime}</b>\n• <b>Yopilish vaqti:</b> kechki soat <b>${center.workingHours.closingTime}</b>\n• <b>Ish kunlari:</b> ${center.workingHours.workDays}\n• <b>Dam olish kuni:</b> ${center.workingHours.daysOff}\n\nBiz har doim sizni kutib olishga tayyormiz!`;
    await sendTelegramMessage(chatId, timeMsg, defaultKeyboard);
    return;
  }

  if (text === "📍 Manzil va Mo'ljal" || text === '/manzil' || text === '/location') {
    const locMsg = `<b>📍 Bizning Manzilimiz:</b>\n\n🏢 <b>Manzil:</b> ${center.location.address}\n🎯 <b>Mo'ljal:</b> ${center.location.landmark}\n🚇 <b>Metro:</b> ${center.location.metro}\n📞 <b>Telefon:</b> ${center.contacts.primaryPhone}, ${center.contacts.secondaryPhone}\n✈️ <b>Telegram admin:</b> ${center.contacts.adminTelegram}`;
    await sendTelegramMessage(chatId, locMsg, defaultKeyboard);
    return;
  }

  if (text === "✍️ Ro'yxatdan o'tish" || text === '/royxatdan_otish' || text === '/register') {
    const regMsg = `<b>✍️ Kursga ro'yxatdan o'tish:</b>\n\nIltimos, quyidagi formatda ma'lumotlaringizni yozing:\n<i>Ism Familiya, Telefon raqamingiz, Qiziqqan kursingiz</i>\n\nMasalan: <code>Bobur Karimov, +998901234567, Frontend kursi</code>\n\nAdministratorimiz: ${center.contacts.primaryPhone} yoki ${center.contacts.adminTelegram}`;
    await sendTelegramMessage(chatId, regMsg, defaultKeyboard);
    return;
  }

  if (text === "📞 Bog'lanish" || text === '/contact') {
    const contactInfo = `<b>📞 Aloqa va Ma'muriyat:</b>\n\n• Asosiy telefon: <b>${center.contacts.primaryPhone}</b>\n• Qo'shimcha telefon: <b>${center.contacts.secondaryPhone}</b>\n• Telegram admin: <b>${center.contacts.adminTelegram}</b>\n• Rasmiy kanal: <b>${center.contacts.telegramChannel}</b>\n• Ish vaqti: <b>${center.workingHours.openingTime} - ${center.workingHours.closingTime}</b>`;
    await sendTelegramMessage(chatId, contactInfo, defaultKeyboard);
    return;
  }

  if (!text) return;

  // Free AI question answering strictly within learning center knowledge base
  const aiAnswer = await askGemini(text);
  await sendTelegramMessage(chatId, aiAnswer, defaultKeyboard);
}
