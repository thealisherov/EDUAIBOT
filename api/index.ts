import express, { Request, Response } from 'express';
import { getDB, saveDB, saveLog, loadDB } from './lib/db.ts';
import { askGemini } from './lib/gemini.ts';
import { handleTelegramUpdate, sendTelegramMessage, sendTelegramPhoto } from './lib/bot.ts';
import type { Course, Teacher, BotUser, BroadcastMessage, CenterStats } from '../src/types.ts';

const app = express();
app.use(express.json());

// Enable CORS for development & cross-domain access if needed
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
    center: db.centerInfo.name, 
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    telegramConfigured: Boolean(db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN)
  });
});

// Admin Stats
app.get('/api/stats', (req: Request, res: Response) => {
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];
  const todayMessages = db.logs.filter(l => l.timestamp.startsWith(today)).length;
  const enrolledUsers = db.users.filter(u => u.status === 'enrolled').length;

  const stats: CenterStats = {
    totalUsers: db.users.length,
    totalMessages: db.logs.length,
    totalBroadcasts: db.broadcasts.length,
    totalCourses: db.courses.length,
    totalTeachers: db.teachers.length,
    enrolledUsers,
    todayMessages
  };

  res.json({
    success: true,
    stats: stats,
    ...stats
  });
});

// Learning Center Info (GET, POST, PUT)
app.get('/api/center-info', (req: Request, res: Response) => {
  const db = getDB();
  res.json({
    success: true,
    data: db.centerInfo,
    ...db.centerInfo
  });
});

const updateCenterInfo = (req: Request, res: Response) => {
  const db = getDB();
  db.centerInfo = { ...db.centerInfo, ...req.body };
  saveDB();
  res.json({ 
    success: true, 
    data: db.centerInfo,
    centerInfo: db.centerInfo 
  });
};

app.post('/api/center-info', updateCenterInfo);
app.put('/api/center-info', updateCenterInfo);

// Courses API (GET, POST, PUT, DELETE)
app.get('/api/courses', (req: Request, res: Response) => {
  const db = getDB();
  res.json({
    success: true,
    data: db.courses,
    courses: db.courses
  });
});

app.post('/api/courses', (req: Request, res: Response) => {
  const db = getDB();
  const price = Number(req.body.price) || 0;
  const newCourse: Course = {
    id: `c_${Date.now()}`,
    title: req.body.title || "Yangi Kurs",
    category: req.body.category || "it",
    price: price,
    priceFormatted: req.body.priceFormatted || `${price.toLocaleString()} so'm/oy`,
    duration: req.body.duration || "3 oy",
    lessonDuration: req.body.lessonDuration || "1.5 soat",
    schedule: req.body.schedule || "Dush-Chor-Juma 14:00",
    description: req.body.description || "",
    topics: Array.isArray(req.body.topics) ? req.body.topics : (req.body.topics || "").split(',').map((s: string) => s.trim()).filter(Boolean),
    level: req.body.level || "Boshlang'ich",
    teacherId: req.body.teacherId || "",
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    icon: req.body.icon || "book"
  };
  db.courses.push(newCourse);
  saveDB();
  res.json({ success: true, data: db.courses, course: newCourse });
});

app.put('/api/courses/:id', (req: Request, res: Response) => {
  const db = getDB();
  const idx = db.courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: "Course not found" });

  const price = Number(req.body.price ?? db.courses[idx].price);
  db.courses[idx] = {
    ...db.courses[idx],
    ...req.body,
    price,
    priceFormatted: req.body.priceFormatted || `${price.toLocaleString()} so'm/oy`,
    topics: Array.isArray(req.body.topics) ? req.body.topics : (typeof req.body.topics === 'string' ? req.body.topics.split(',').map((s: string) => s.trim()).filter(Boolean) : db.courses[idx].topics)
  };
  saveDB();
  res.json({ success: true, data: db.courses, course: db.courses[idx] });
});

app.delete('/api/courses/:id', (req: Request, res: Response) => {
  const db = getDB();
  db.courses = db.courses.filter(c => c.id !== req.params.id);
  saveDB();
  res.json({ success: true, data: db.courses });
});

// Teachers API (GET, POST, PUT, DELETE)
app.get('/api/teachers', (req: Request, res: Response) => {
  const db = getDB();
  res.json({
    success: true,
    data: db.teachers,
    teachers: db.teachers
  });
});

app.post('/api/teachers', (req: Request, res: Response) => {
  const db = getDB();
  const newTeacher: Teacher = {
    id: `t_${Date.now()}`,
    name: req.body.name || "Yangi Ustoz",
    subject: req.body.subject || "Fan",
    experience: req.body.experience || "1+ yil",
    degree: req.body.degree || "Mutaxassis",
    bio: req.body.bio || "",
    photoUrl: req.body.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    phone: req.body.phone || "+998 90 000 00 00",
    rating: Number(req.body.rating) || 5.0,
    studentsCount: Number(req.body.studentsCount) || 50
  };
  db.teachers.push(newTeacher);
  saveDB();
  res.json({ success: true, data: db.teachers, teacher: newTeacher });
});

app.put('/api/teachers/:id', (req: Request, res: Response) => {
  const db = getDB();
  const idx = db.teachers.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: "Teacher not found" });

  db.teachers[idx] = { ...db.teachers[idx], ...req.body };
  saveDB();
  res.json({ success: true, data: db.teachers, teacher: db.teachers[idx] });
});

app.delete('/api/teachers/:id', (req: Request, res: Response) => {
  const db = getDB();
  db.teachers = db.teachers.filter(t => t.id !== req.params.id);
  saveDB();
  res.json({ success: true, data: db.teachers });
});

// Users / Leads API (GET, POST, PUT, DELETE)
app.get('/api/users', (req: Request, res: Response) => {
  const db = getDB();
  res.json({
    success: true,
    data: db.users,
    users: db.users
  });
});

app.post('/api/users', (req: Request, res: Response) => {
  const db = getDB();
  const newUser: BotUser = {
    id: `u_${Date.now()}`,
    telegramId: req.body.telegramId || Math.floor(Math.random() * 900000000 + 100000000),
    firstName: req.body.firstName || "Foydalanuvchi",
    lastName: req.body.lastName || "",
    username: req.body.username || "",
    phoneNumber: req.body.phoneNumber || "",
    status: req.body.status || "new",
    registeredAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    interestedCourseId: req.body.interestedCourseId,
    interestedCourseTitle: req.body.interestedCourseTitle,
    notes: req.body.notes,
    source: "manual",
    messagesCount: 0
  };
  db.users.unshift(newUser);
  saveDB();
  res.json({ success: true, data: db.users, user: newUser });
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const db = getDB();
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: "User not found" });

  db.users[idx] = { ...db.users[idx], ...req.body };
  saveDB();
  res.json({ success: true, data: db.users, user: db.users[idx] });
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const db = getDB();
  db.users = db.users.filter(u => u.id !== req.params.id);
  saveDB();
  res.json({ success: true, data: db.users });
});

// Broadcasts API
const getBroadcasts = (req: Request, res: Response) => {
  const db = getDB();
  res.json({
    success: true,
    data: db.broadcasts,
    broadcasts: db.broadcasts
  });
};
app.get('/api/broadcasts', getBroadcasts);
app.get('/api/broadcast', getBroadcasts);

const sendBroadcastHandler = async (req: Request, res: Response) => {
  const db = getDB();
  const { title, message, imageUrl, buttonText, buttonUrl, targetFilter } = req.body;
  if (!message) return res.status(400).json({ success: false, error: "Xabar matni kiritilishi shart" });

  let targetUsers = db.users;
  if (targetFilter && targetFilter !== 'all') {
    targetUsers = db.users.filter(u => u.status === targetFilter);
  }

  let successCount = 0;
  let failedCount = 0;

  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
  const formattedMessage = `<b>📢 ${title ? title : db.centerInfo.name}</b>\n\n${message}`;
  const replyMarkup = buttonText && buttonUrl ? {
    inline_keyboard: [[{ text: buttonText, url: buttonUrl }]]
  } : undefined;

  for (const u of targetUsers) {
    if (token && u.source === 'telegram_bot' && u.telegramId) {
      try {
        let sent = false;
        if (imageUrl) {
          sent = await sendTelegramPhoto(u.telegramId, imageUrl, formattedMessage, replyMarkup);
        } else {
          sent = await sendTelegramMessage(u.telegramId, formattedMessage, replyMarkup);
        }
        if (sent) successCount++;
        else failedCount++;
      } catch {
        failedCount++;
      }
    } else {
      successCount++;
    }

    saveLog(u.id, "EduBot Broadcast", u.telegramId, 'bot', formattedMessage, false, u.source === 'telegram_bot' ? 'telegram' : 'simulator');
  }

  const broadcastRecord: BroadcastMessage = {
    id: `b_${Date.now()}`,
    title: title || "Ommaviy Xabarnoma",
    message,
    imageUrl,
    buttonText,
    buttonUrl,
    sentAt: new Date().toISOString(),
    targetCount: targetUsers.length,
    successCount,
    failedCount,
    status: "sent",
    targetFilter: targetFilter || 'all'
  };

  db.broadcasts.unshift(broadcastRecord);
  saveDB();

  res.json({ success: true, data: db.broadcasts, broadcast: broadcastRecord });
};

app.post('/api/broadcast', sendBroadcastHandler);
app.post('/api/broadcasts', sendBroadcastHandler);
app.post('/api/broadcasts/send', sendBroadcastHandler);

// Logs API
app.get('/api/logs', (req: Request, res: Response) => {
  const db = getDB();
  res.json({
    success: true,
    data: db.logs,
    logs: db.logs
  });
});

const clearLogsHandler = (req: Request, res: Response) => {
  const db = getDB();
  db.logs = [];
  saveDB();
  res.json({ success: true, data: [] });
};
app.delete('/api/logs', clearLogsHandler);
app.post('/api/logs/clear', clearLogsHandler);

// Telegram Config & Webhook API
app.get('/api/telegram/config', async (req: Request, res: Response) => {
  const db = getDB();
  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN || "";
  
  // Try to fetch bot details from Telegram API if token exists
  if (token && (!db.telegramConfig.botName || db.telegramConfig.botName === "EVEREST Academy Bot")) {
    try {
      const getMeRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const getMeData = await getMeRes.json();
      if (getMeData.ok && getMeData.result) {
        db.telegramConfig.botUsername = `@${getMeData.result.username}`;
        db.telegramConfig.botName = getMeData.result.first_name;
        db.telegramConfig.hasCustomToken = true;
        saveDB();
      }
    } catch {}
  }

  const maskedToken = token ? (token.slice(0, 8) + '...' + token.slice(-5)) : '';
  const responseData = {
    ...db.telegramConfig,
    token: maskedToken,
    rawTokenProvided: Boolean(token),
    appUrl: process.env.APP_URL || ""
  };

  res.json({
    success: true,
    data: responseData,
    ...responseData
  });
});

app.post('/api/telegram/config', async (req: Request, res: Response) => {
  const db = getDB();
  const { token, autoReplyWithAI } = req.body;
  if (token !== undefined) {
    db.telegramConfig.token = token.trim();
  }
  if (autoReplyWithAI !== undefined) {
    db.telegramConfig.autoReplyWithAI = Boolean(autoReplyWithAI);
  }

  if (db.telegramConfig.token) {
    try {
      const getMeRes = await fetch(`https://api.telegram.org/bot${db.telegramConfig.token}/getMe`);
      const getMeData = await getMeRes.json();
      if (getMeData.ok && getMeData.result) {
        db.telegramConfig.botUsername = `@${getMeData.result.username}`;
        db.telegramConfig.botName = getMeData.result.first_name;
        db.telegramConfig.hasCustomToken = true;
      }
    } catch (err) {
      console.error("Failed to verify telegram token:", err);
    }
  }

  saveDB();
  res.json({ success: true, data: db.telegramConfig, config: db.telegramConfig });
});

app.post('/api/telegram/set-webhook', async (req: Request, res: Response) => {
  const db = getDB();
  const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(400).json({ success: false, error: "Telegram bot token kiritilmagan" });

  const webhookUrl = req.body.url || req.body.webhookUrl || `${process.env.APP_URL || ''}/api/telegram/webhook`;
  if (!webhookUrl || !webhookUrl.startsWith('https://')) {
    return res.status(400).json({ success: false, error: "Webhook URL HTTPS bilan boshlanishi shart (masalan: https://my-edubot.vercel.app/api/telegram/webhook)" });
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}&allowed_updates=${encodeURIComponent(JSON.stringify(['message', 'callback_query', 'contact']))}`);
    const tgData = await tgRes.json();

    if (tgData.ok) {
      db.telegramConfig.isWebhookSet = true;
      db.telegramConfig.webhookUrl = webhookUrl;
      saveDB();
      res.json({ success: true, message: "Webhook muvaffaqiyatli ulandi!", data: db.telegramConfig });
    } else {
      res.status(400).json({ success: false, error: tgData.description || "Webhook o'rnatishda xatolik", data: tgData });
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
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);
    const tgData = await tgRes.json();
    db.telegramConfig.isWebhookSet = false;
    db.telegramConfig.webhookUrl = "";
    saveDB();
    res.json({ success: true, data: db.telegramConfig });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Telegram Incoming Webhook Handler (Supports /api/telegram/webhook and /api/telegram)
const telegramWebhookHandler = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    return res.json({ ok: true, status: "Telegram Webhook Endpoint Ready" });
  }
  try {
    await handleTelegramUpdate(req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.json({ ok: false });
  }
};

app.post('/api/telegram/webhook', telegramWebhookHandler);
app.get('/api/telegram/webhook', telegramWebhookHandler);
app.post('/api/telegram', telegramWebhookHandler);
app.get('/api/telegram', telegramWebhookHandler);

// Live Telegram Simulator API Endpoint
app.post('/api/simulator/chat', async (req: Request, res: Response) => {
  const db = getDB();
  const { text, userId, userName } = req.body;
  if (!text) return res.status(400).json({ success: false, error: "Text is required" });

  const simUserId = userId || "sim_user_1";
  const simUserName = userName || "Test Foydalanuvchi";
  const simTgId = 999111222;

  let user = db.users.find(u => u.id === simUserId || String(u.telegramId) === String(simTgId));
  if (!user) {
    user = {
      id: simUserId,
      telegramId: simTgId,
      firstName: simUserName,
      status: "new",
      registeredAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      source: "simulator",
      messagesCount: 1
    };
    db.users.unshift(user);
  } else {
    user.lastActiveAt = new Date().toISOString();
    user.messagesCount = (user.messagesCount || 0) + 1;
  }

  saveLog(user.id, simUserName, simTgId, 'user', text, false, 'simulator');

  let reply = "";
  if (text === '/start' || text.toLowerCase() === 'start') {
    reply = `Assalomu alaykum, <b>${simUserName}</b>! 🎓\n\n<b>${db.centerInfo.name}</b> rasmiy intellektual botiga xush kelibsiz!\n\nBizning markazda:\n• Zamonaviy IT va Dasturlash kurslari\n• IELTS 7.5+ va Xorijiy tillar\n• UI/UX va Grafik dizayn\n\nIstalgan savolingizni yozing (masalan: <i>"Markaz ochilish vaqti"</i>, <i>"Frontend kursi qancha?"</i>)!`;
  } else if (text === '📚 Kurslar va Narxlar' || text === '/kurslar' || text === '/courses') {
    reply = `<b>🎓 ${db.centerInfo.name} Kurslari va Oylik Narxlari:</b>\n\n` +
      db.courses.filter(c => c.isActive).map((c, i) => `<b>${i+1}. ${c.title}</b>\n💰 Narxi: <b>${c.priceFormatted}</b>\n⏱ Davomiyligi: ${c.duration} (${c.lessonDuration})\n🗓 Jadval: ${c.schedule}`).join('\n\n');
  } else if (text === '⏰ Ish vaqti' || text === '/ishvaqti' || text === '/time') {
    reply = `<b>⏰ ${db.centerInfo.name} Ish Vaqti:</b>\n\n• <b>Ochilish vaqti:</b> ertalab soat <b>${db.centerInfo.openingTime}</b>\n• <b>Yopilish vaqti:</b> kechki soat <b>${db.centerInfo.closingTime}</b>\n• <b>Ish kunlari:</b> ${db.centerInfo.workDays}\n\nSizni markazimizda kutib qolamiz!`;
  } else if (text === "👨‍🏫 O'qituvchilar" || text === '/oqituvchilar' || text === '/teachers') {
    reply = `<b>👨‍🏫 Bizning Professional O'qituvchilarimiz:</b>\n\n` +
      db.teachers.map((t, i) => `<b>${i+1}. ${t.name}</b>\n📌 Fan: ${t.subject}\n🎖 Malaka: ${t.degree}\n⏳ Tajriba: ${t.experience}\n⭐ Reyting: ${t.rating}/5.0`).join('\n\n');
  } else if (text === "📍 Manzil va Mo'ljal" || text === '/manzil' || text === '/location') {
    reply = `<b>📍 Bizning Manzilimiz:</b>\n\n🏢 <b>Manzil:</b> ${db.centerInfo.address}\n🎯 <b>Mo'ljal:</b> ${db.centerInfo.landmark}\n📞 <b>Telefon:</b> ${db.centerInfo.phone}, ${db.centerInfo.phoneSecondary}`;
  } else if (text === "✍️ Ro'yxatdan o'tish" || text === '/royxatdan_otish' || text === '/register') {
    reply = `<b>✍️ Kursga ro'yxatdan o'tish:</b>\n\nIltimos, telefon raqamingiz va qiziqqan kursingizni yozing (masalan: <i>Bobur Karimov, +998901234567, Frontend kursi</i>).`;
  } else if (text === "📞 Bog'lanish" || text === '/contact') {
    reply = `<b>📞 Administrator bilan bog'lanish:</b>\n\n• Telefon: <b>${db.centerInfo.phone}</b>\n• Telegram admin: <b>${db.centerInfo.telegramUsername}</b>\n• Ish vaqti: <b>${db.centerInfo.openingTime} - ${db.centerInfo.closingTime}</b>`;
  } else {
    const history = db.logs.filter(l => l.userId === user.id).slice(-6);
    reply = await askGemini(text, history);
  }

  saveLog(user.id, "EduBot AI", simTgId, 'bot', reply, true, 'simulator');
  saveDB();

  res.json({
    success: true,
    reply: reply,
    isAi: true,
    timestamp: new Date().toISOString()
  });
});

export default app;
