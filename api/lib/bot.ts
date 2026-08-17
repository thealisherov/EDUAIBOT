import { getDB, saveDB, saveLog } from './db.ts';
import { askGemini } from './gemini.ts';
import type { BotUser } from '../../src/types.ts';

// Helper: Send Message to Telegram API
export async function sendTelegramMessage(
  chatId: number | string, 
  text: string, 
  replyMarkup?: any
): Promise<boolean> {
  const db = getDB();
  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log(`[Telegram Mock] Token yo'q. Message to ${chatId}: ${text}`);
    return false;
  }

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
  if (!update) return;

  const db = getDB();

  // Handle standard message
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const from = msg.from;
    const text = (msg.text || '').trim();
    const contact = msg.contact;

    // Check or register user
    let user = db.users.find(u => String(u.telegramId) === String(from.id));
    if (!user) {
      user = {
        id: `u_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        telegramId: from.id,
        firstName: from.first_name || "Foydalanuvchi",
        lastName: from.last_name || "",
        username: from.username || "",
        phoneNumber: contact ? contact.phone_number : undefined,
        status: "new",
        registeredAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        source: "telegram_bot",
        messagesCount: 1
      };
      db.users.unshift(user);
    } else {
      user.lastActiveAt = new Date().toISOString();
      user.messagesCount = (user.messagesCount || 0) + 1;
      if (contact && contact.phone_number) {
        user.phoneNumber = contact.phone_number;
        user.status = "enrolled";
      }
    }

    const defaultKeyboard = {
      keyboard: [
        [{ text: "📚 Kurslar va Narxlar" }, { text: "👨‍🏫 O'qituvchilar" }],
        [{ text: "⏰ Ish vaqti" }, { text: "📍 Manzil va Mo'ljal" }],
        [{ text: "✍️ Ro'yxatdan o'tish" }, { text: "📞 Bog'lanish" }]
      ],
      resize_keyboard: true
    };

    // If user shared phone contact
    if (contact) {
      const reply = `Rahmat, <b>${user.firstName}</b>! 📲 Telefon raqamingiz muvaffaqiyatli qabul qilindi: <b>${contact.phone_number}</b>\n\nTez orada administratorlarimiz siz bilan bog'lanib, barcha savollaringizga batafsil javob berishadi!`;
      await sendTelegramMessage(chatId, reply, defaultKeyboard);
      saveLog(user.id, `${user.firstName} ${user.lastName || ''}`.trim(), chatId, 'user', `[Telefon yubordi]: ${contact.phone_number}`, false, 'telegram');
      saveLog(user.id, "EduBot AI", chatId, 'bot', reply, false, 'telegram');
      saveDB();
      return;
    }

    if (!text) return;

    // Save incoming user message log
    saveLog(user.id, `${user.firstName} ${user.lastName || ''}`.trim(), chatId, 'user', text, false, 'telegram');

    // Handle Commands
    if (text === '/start' || text.toLowerCase() === 'start') {
      const welcome = `Assalomu alaykum, <b>${from.first_name || 'aziz o\'quvchi'}</b>! 🎓\n\n<b>${db.centerInfo.name}</b> rasmiy intellektual botiga xush kelibsiz!\n\nBizning markazda:\n• Zamonaviy IT va Dasturlash kurslari\n• IELTS 7.5+ va Xorijiy tillar\n• UI/UX va Grafik dizayn\n\nQuyidagi tugmalardan birini tanlang yoki o'zingizni qiziqtirgan savolni erkin yozing (masalan: <i>"Markaz nechchida ochiladi?"</i> yoki <i>"Python kursi narxi qancha?"</i>).`;
      await sendTelegramMessage(chatId, welcome, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', welcome, false, 'telegram');
      saveDB();
      return;
    }

    if (text === '📚 Kurslar va Narxlar' || text === '/kurslar' || text === '/courses') {
      let coursesMsg = `<b>🎓 ${db.centerInfo.name} Kurslari va Oylik Narxlari:</b>\n\n`;
      db.courses.filter(c => c.isActive).forEach((c, idx) => {
        coursesMsg += `<b>${idx + 1}. ${c.title}</b>\n💰 Narxi: <b>${c.priceFormatted}</b>\n⏱ Davomiyligi: ${c.duration} (${c.lessonDuration})\n🗓 Jadval: ${c.schedule}\n\n`;
      });
      coursesMsg += `👉 Biror kurs haqida to'liq bilmoqchi bo'lsangiz, masalan <i>"${db.courses[0]?.title} haqida ma'lumot bering"</i> deb yozishingiz mumkin.`;
      await sendTelegramMessage(chatId, coursesMsg, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', coursesMsg, false, 'telegram');
      saveDB();
      return;
    }

    if (text === "👨‍🏫 O'qituvchilar" || text === '/oqituvchilar' || text === '/teachers') {
      let teachersMsg = `<b>👨‍🏫 Bizning Professional O'qituvchilarimiz:</b>\n\n`;
      db.teachers.forEach((t, idx) => {
        teachersMsg += `<b>${idx + 1}. ${t.name}</b>\n📌 Yo'nalish: ${t.subject}\n🎖 Malaka: ${t.degree}\n⏳ Tajriba: ${t.experience}\n⭐ Reyting: ${t.rating}/5.0 (${t.studentsCount}+ o'quvchi)\n\n`;
      });
      await sendTelegramMessage(chatId, teachersMsg, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', teachersMsg, false, 'telegram');
      saveDB();
      return;
    }

    if (text === '⏰ Ish vaqti' || text === '/ishvaqti' || text === '/time') {
      const timeMsg = `<b>⏰ ${db.centerInfo.name} Ish Vaqti:</b>\n\n• <b>Ochilish vaqti:</b> ertalab soat <b>${db.centerInfo.openingTime}</b>\n• <b>Yopilish vaqti:</b> kechki soat <b>${db.centerInfo.closingTime}</b>\n• <b>Ish kunlari:</b> ${db.centerInfo.workDays}\n\nBiz har doim sizni kutib olishga tayyormiz!`;
      await sendTelegramMessage(chatId, timeMsg, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', timeMsg, false, 'telegram');
      saveDB();
      return;
    }

    if (text === "📍 Manzil va Mo'ljal" || text === '/manzil' || text === '/location') {
      const locMsg = `<b>📍 Bizning Manzilimiz:</b>\n\n🏢 <b>Manzil:</b> ${db.centerInfo.address}\n🎯 <b>Mo'ljal:</b> ${db.centerInfo.landmark}\n📞 <b>Telefon:</b> ${db.centerInfo.phone}, ${db.centerInfo.phoneSecondary}\n✈️ <b>Telegram admin:</b> ${db.centerInfo.telegramUsername}`;
      await sendTelegramMessage(chatId, locMsg, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', locMsg, false, 'telegram');
      saveDB();
      return;
    }

    if (text === "✍️ Ro'yxatdan o'tish" || text === '/royxatdan_otish' || text === '/register') {
      const regMsg = `<b>✍️ Kursga ro'yxatdan o'tish:</b>\n\nIltimos, pastdagi <b>«📲 Telefon raqamni ulashish»</b> tugmasini bosing yoki quyidagi formatda yozing:\n<i>Ism Familiya, +998901234567, Frontend kursi</i>`;
      const contactKeyboard = {
        keyboard: [
          [{ text: "📲 Telefon raqamni ulashish", request_contact: true }],
          [{ text: "🔙 Asosiy menyu" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      };
      await sendTelegramMessage(chatId, regMsg, contactKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', regMsg, false, 'telegram');
      saveDB();
      return;
    }

    if (text === "📞 Bog'lanish" || text === "🔙 Asosiy menyu" || text === '/contact') {
      const contactInfo = `<b>📞 Administrator bilan bog'lanish:</b>\n\n• Telefon: <b>${db.centerInfo.phone}</b>\n• Qo'shimcha tel: <b>${db.centerInfo.phoneSecondary}</b>\n• Telegram admin: <b>${db.centerInfo.telegramUsername}</b>\n• Ish vaqti: <b>${db.centerInfo.openingTime} - ${db.centerInfo.closingTime}</b>`;
      await sendTelegramMessage(chatId, contactInfo, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', contactInfo, false, 'telegram');
      saveDB();
      return;
    }

    // Gemini AI Reasoning Response for free questions
    const history = db.logs
      .filter(l => String(l.telegramId) === String(chatId))
      .slice(-6);

    const aiAnswer = await askGemini(text, history);
    await sendTelegramMessage(chatId, aiAnswer, defaultKeyboard);
    saveLog(user.id, "EduBot AI", chatId, 'bot', aiAnswer, true, 'telegram');
    saveDB();
  }
}
