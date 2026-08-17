import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import type { 
  LearningCenterInfo, 
  Course, 
  Teacher, 
  BotUser, 
  BroadcastMessage, 
  BotMessageLog, 
  TelegramBotConfig, 
  CenterStats 
} from './src/types.ts';

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'data_store.json');

// Default initial learning center knowledge base & records
const defaultCenterInfo: LearningCenterInfo = {
  name: "EVEREST IT & Language Academy",
  tagline: "Zamonaviy IT va Xorijiy tillar bo'yicha yetakchi ta'lim markazi",
  description: "EVEREST Academy — 2019-yildan buyon minglab yoshlarga dasturlash, sun'iy intellekt, xorijiy tillar va dizayn sohalarida xalqaro darajadagi ta'lim berib kelayotgan innovatsion o'quv markazi.",
  openingTime: "08:00",
  closingTime: "20:00",
  workDays: "Dushanba - Shanba (Yakshanba - dam olish kuni)",
  address: "Toshkent shahri, Yunusobod tumani, Amir Temur shoh ko'chasi 45-uy",
  landmark: "Mega Planet savdo majmuasi ro'parasi, 3-qavat (Metro: Shahriston)",
  phone: "+998 71 200 45 45",
  phoneSecondary: "+998 90 999 88 77",
  telegramUsername: "@everest_admin",
  channelUrl: "https://t.me/everest_academy_uz",
  instagramUrl: "https://instagram.com/everest_academy_uz",
  websiteUrl: "https://everest-academy.uz",
  aiPromptContext: "Markazimizda bepul birinchi sinov darsi mavjud. Barcha o'quvchilarga bepul Wi-Fi, zamonaviy coworking zonasi va bepul kofe-choy taqdim etiladi. O'qishni muvaffaqiyatli bitirganlarga xalqaro sertifikat va IT kompaniyalarga ishga tavsiya beriladi. Agar kurs narxi so'ralsa oylik to'lovni aniq ayt.",
  welcomeMessageTemplate: "Assalomu alaykum! 🎓 EVEREST IT & Language Academy rasmiy botiga xush kelibsiz!\n\nBizning bot orqali barcha kurslar, narxlar, o'qituvchilar va markaz ma'lumotlari bilan tanishishingiz yoki istalgan savolingizni AI maslahatchimizga berishingiz mumkin."
};

const defaultCourses: Course[] = [
  {
    id: "c1",
    title: "Frontend Dasturlash (React, Next.js & TypeScript)",
    category: "it",
    price: 900000,
    priceFormatted: "900,000 so'm/oy",
    duration: "6 oy",
    lessonDuration: "1.5 soat (Haftada 3 kun)",
    schedule: "Dush-Chor-Juma: 14:00 - 15:30 / 18:30 - 20:00",
    description: "HTML5, CSS3, Tailwind CSS, JavaScript ES6+, TypeScript, React.js, Next.js 15 va amaliy loyihalar yaratish. Bitiruvda portfolio va ishga tayyorgarlik.",
    topics: ["HTML & Modern CSS", "JavaScript & TypeScript", "React.js & State Management", "Next.js App Router", "Tailwind CSS", "Git & Deployment"],
    level: "Boshlang'ichdan Junior/Middle darajagacha",
    teacherId: "t1",
    isActive: true,
    icon: "code"
  },
  {
    id: "c2",
    title: "Python Backend & AI (Django, FastAPI & Gemini AI)",
    category: "it",
    price: 950000,
    priceFormatted: "950,000 so'm/oy",
    duration: "7 oy",
    lessonDuration: "1.5 soat (Haftada 3 kun)",
    schedule: "Sesh-Pay-Shanba: 15:00 - 16:30 / 18:30 - 20:00",
    description: "Python asoslari, OOP, Algoritmlar, PostgreSQL, Django REST Framework, FastAPI, Telegram botlar yaratish va Gemini AI integratsiyasi.",
    topics: ["Python Core & OOP", "PostgreSQL & SQLite", "Django & Django REST", "FastAPI & Async", "Telegram Bot Development", "Gemini & LLM Integrations"],
    level: "Boshlang'ichdan Junior+ gacha",
    teacherId: "t3",
    isActive: true,
    icon: "terminal"
  },
  {
    id: "c3",
    title: "IELTS 7.5+ & Academic English",
    category: "languages",
    price: 800000,
    priceFormatted: "800,000 so'm/oy",
    duration: "4-6 oy",
    lessonDuration: "2 soat (Haftada 3 kun)",
    schedule: "Dush-Chor-Juma: 10:00 - 12:00 / 16:00 - 18:00",
    description: "IELTS Reading, Listening, Writing (Task 1 & 2) va Speaking bo'yicha intensiv tayyorgarlik. Har hafta bepul Real Mock Exam va Speaking club.",
    topics: ["IELTS Reading Strategies", "Listening Masterclass", "Academic Writing Task 1 & 2", "Fluent Speaking Techniques", "Weekly Mock Tests"],
    level: "Intermediate (B1+) darajadagilar uchun",
    teacherId: "t2",
    isActive: true,
    icon: "languages"
  },
  {
    id: "c4",
    title: "UI/UX & Grafik Dizayn (Figma, Photoshop, Illustrator)",
    category: "design",
    price: 850000,
    priceFormatted: "850,000 so'm/oy",
    duration: "4 oy",
    lessonDuration: "1.5 soat (Haftada 3 kun)",
    schedule: "Sesh-Pay-Shanba: 10:00 - 11:30 / 16:30 - 18:00",
    description: "Veb va mobil ilovalar dizayni, UX tadqiqotlar, Wireframing, Figma prototiplash, Branding, Adobe Photoshop va Illustrator bilan ishlash.",
    topics: ["Dizayn asoslari va ranglar nazariyasi", "Figma & Auto-layout", "UX Research & Wireframing", "Mobile & Web UI Design", "Adobe Photoshop & Illustrator", "Dribbble/Behance Portfolio"],
    level: "Barcha qiziquvchilar uchun",
    teacherId: "t4",
    isActive: true,
    icon: "palette"
  },
  {
    id: "c5",
    title: "Foundation: Dasturlash Asoslari & C++",
    category: "it",
    price: 700000,
    priceFormatted: "700,000 so'm/oy",
    duration: "3 oy",
    lessonDuration: "1.5 soat (Haftada 3 kun)",
    schedule: "Dush-Chor-Juma: 09:00 - 10:30",
    description: "Dasturlash olamiga ilk qadam. Mantiqiy fikrlash, algoritmlar, ma'lumotlar tuzilmasi, C++ tili asoslari.",
    topics: ["Algoritmlar va Mantiq", "C++ sintaksisi", "Funksiyalar va Massivlar", "Ko'rsatkichlar (Pointers)", "Olimpiada masalalari"],
    level: "Maktab o'quvchilari va boshlovchilar",
    teacherId: "t1",
    isActive: true,
    icon: "cpu"
  },
  {
    id: "c6",
    title: "General English (Beginner to Advanced)",
    category: "languages",
    price: 650000,
    priceFormatted: "650,000 so'm/oy",
    duration: "6 oy",
    lessonDuration: "1.5 soat (Haftada 3 kun)",
    schedule: "Dush-Chor-Juma: 14:00 - 15:30",
    description: "Ingliz tilida erkin so'zlashuv, grammatika, so'z boyligini oshirish va kundalik muloqot ko'nikmalari.",
    topics: ["Grammar in Use", "Speaking Practice", "Vocabulary Boost", "Audio & Video Comprehension"],
    level: "0 dan boshlovchilar uchun",
    teacherId: "t2",
    isActive: true,
    icon: "book-open"
  }
];

const defaultTeachers: Teacher[] = [
  {
    id: "t1",
    name: "Sanjarbek Aliyev",
    subject: "Frontend & Full-stack Dasturlash",
    experience: "6+ yil IT tajriba",
    degree: "Senior Software Engineer (EPAM & IT Park bitiruvchisi)",
    bio: "React, Next.js va zamonaviy web texnologiyalar bo'yicha 500+ dan ortiq shogirdlar tayyorlagan. Xalqaro loyihalarda faoliyat yuritadi.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    phone: "+998 90 111 22 33",
    rating: 4.9,
    studentsCount: 320
  },
  {
    id: "t2",
    name: "Madina Karimova",
    subject: "IELTS & General English",
    experience: "5+ yil xalqaro ta'lim tajribasi",
    degree: "IELTS 8.5 / CELTA Sertifikati sohibasi",
    bio: "O'quvchilarining o'rtacha IELTS natijasi 7.5+. Kembrij metodikasi asosida interaktiv darslar olib boradi.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    phone: "+998 91 222 33 44",
    rating: 5.0,
    studentsCount: 450
  },
  {
    id: "t3",
    name: "Jasur Toshmatov",
    subject: "Python, AI & Data Science",
    experience: "4+ yil Backend & AI tajriba",
    degree: "TUIT Magistr / Python & ML Engineer",
    bio: "Python, Django, FastAPI, Telegram botlar va Gemini / OpenAI modellarini biznesga tatbiq qilish bo'yicha mutaxassis.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    phone: "+998 93 333 44 55",
    rating: 4.8,
    studentsCount: 280
  },
  {
    id: "t4",
    name: "Nozima Rustamova",
    subject: "UI/UX & Grafik Dizayn",
    experience: "5+ yil Dizayn studiyalari yetakchisi",
    degree: "Lead Product Designer (Behance Featured)",
    bio: "Figma, Design Systems va mobil ilovalar ergonomikasi bo'yicha ekspert. 30+ yirik startaplar dizaynini yaratgan.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    phone: "+998 97 444 55 66",
    rating: 4.9,
    studentsCount: 210
  }
];

const defaultUsers: BotUser[] = [
  {
    id: "u1",
    telegramId: 108492019,
    firstName: "Bobur",
    lastName: "Karimov",
    username: "bobur_dev",
    phoneNumber: "+998 90 123 45 67",
    status: "enrolled",
    registeredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    interestedCourseId: "c1",
    interestedCourseTitle: "Frontend Dasturlash (React, Next.js & TypeScript)",
    notes: "Sinov darsiga qatnashdi, guruhga yozildi. To'lov qabul qilingan.",
    source: "telegram_bot",
    messagesCount: 14
  },
  {
    id: "u2",
    telegramId: 294810294,
    firstName: "Dilnoza",
    lastName: "Saidova",
    username: "dilnoza_s",
    phoneNumber: "+998 93 987 65 43",
    status: "contacted",
    registeredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    interestedCourseId: "c3",
    interestedCourseTitle: "IELTS 7.5+ & Academic English",
    notes: "IELTS darajasi B2. Mock testga taklif qilindi.",
    source: "telegram_bot",
    messagesCount: 8
  },
  {
    id: "u3",
    telegramId: 385920194,
    firstName: "Otabek",
    lastName: "Qodirov",
    username: "otabek_q",
    phoneNumber: "+998 97 555 44 33",
    status: "new",
    registeredAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - 30 * 60000).toISOString(),
    interestedCourseId: "c2",
    interestedCourseTitle: "Python Backend & AI (Django, FastAPI & Gemini AI)",
    notes: "Markaz ochilish vaqti va dars jadvallarini so'radi.",
    source: "telegram_bot",
    messagesCount: 5
  },
  {
    id: "u4",
    telegramId: 492019482,
    firstName: "Shahzoda",
    lastName: "Yoqubova",
    username: "shahzoda_y",
    phoneNumber: "+998 94 333 22 11",
    status: "new",
    registeredAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    lastActiveAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    interestedCourseId: "c4",
    interestedCourseTitle: "UI/UX & Grafik Dizayn (Figma, Photoshop, Illustrator)",
    notes: "Figma kurslari narxini so'radi.",
    source: "simulator",
    messagesCount: 6
  }
];

const defaultBroadcasts: BroadcastMessage[] = [
  {
    id: "b1",
    title: "Yangi guruhlarga qabul boshlandi! 🚀 20% Chegirma",
    message: "Hurmatli talabgorlar! Yangi oy uchun Frontend, Python AI va IELTS guruhlariga ro'yxatga olish boshlandi. 25-sanagacha ro'yxatdan o'tganlarga ilk oy uchun 20% maxsus chegirma taqdim etiladi! 🎁 Joylar soni cheklangan.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
    buttonText: "✍️ Ro'yxatdan o'tish",
    buttonUrl: "https://t.me/everest_admin",
    sentAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    targetCount: 4,
    successCount: 4,
    failedCount: 0,
    status: "sent",
    targetFilter: "all"
  }
];

const defaultLogs: BotMessageLog[] = [
  {
    id: "l1",
    userId: "u3",
    userName: "Otabek Qodirov",
    telegramId: 385920194,
    sender: "user",
    text: "Markaz ochilish vaqti nechchida?",
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    isAiGenerated: false,
    source: "telegram"
  },
  {
    id: "l2",
    userId: "u3",
    userName: "EduBot AI",
    telegramId: 385920194,
    sender: "bot",
    text: "EVEREST IT & Language Academy har kuni ertalab soat 08:00 da ochiladi va kechki 20:00 gacha faoliyat yuritadi (Dushanba - Shanba kunlari). Yakshanba - dam olish kuni.\n\nSizni markazimizda kutib qolamiz! Qaysi kursimiz sizni qiziqtiryapti?",
    timestamp: new Date(Date.now() - 34 * 60000).toISOString(),
    isAiGenerated: true,
    source: "telegram"
  },
  {
    id: "l3",
    userId: "u4",
    userName: "Shahzoda Yoqubova",
    telegramId: 492019482,
    sender: "user",
    text: "UI/UX kursi narxi qancha va kim dars beradi?",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    isAiGenerated: false,
    source: "simulator"
  },
  {
    id: "l4",
    userId: "u4",
    userName: "EduBot AI",
    telegramId: 492019482,
    sender: "bot",
    text: "UI/UX & Grafik Dizayn kursi narxi oyiga 850,000 so'm. Kurs davomiyligi 4 oy bo'lib, haftada 3 kun 1.5 soatdan o'tiladi.\n\nUshbu kursni 5+ yillik xalqaro dizayn studiyalari yetakchisi, Behance featured dizayner Nozima Rustamova olib boradi. Kurs davomida Figma, UX tadqiqotlar, web/mobil ilovalar dizayni va Adobe dasturlari o'rgatiladi.",
    timestamp: new Date(Date.now() - 14 * 60000).toISOString(),
    isAiGenerated: true,
    source: "simulator"
  }
];

// Persistent Database State
interface DBState {
  centerInfo: LearningCenterInfo;
  courses: Course[];
  teachers: Teacher[];
  users: BotUser[];
  broadcasts: BroadcastMessage[];
  logs: BotMessageLog[];
  telegramConfig: TelegramBotConfig;
}

let db: DBState = {
  centerInfo: defaultCenterInfo,
  courses: defaultCourses,
  teachers: defaultTeachers,
  users: defaultUsers,
  broadcasts: defaultBroadcasts,
  logs: defaultLogs,
  telegramConfig: {
    token: process.env.TELEGRAM_BOT_TOKEN || "",
    botUsername: "@everest_edubot",
    botName: "EVEREST Academy Bot",
    isWebhookSet: false,
    webhookUrl: "",
    autoReplyWithAI: true,
    hasCustomToken: Boolean(process.env.TELEGRAM_BOT_TOKEN)
  }
};

// Load or persist
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      db = {
        ...db,
        ...parsed,
        telegramConfig: {
          ...db.telegramConfig,
          ...(parsed.telegramConfig || {}),
          token: process.env.TELEGRAM_BOT_TOKEN || parsed.telegramConfig?.token || ""
        }
      };
    }
  } catch (err) {
    console.error("Error reading database:", err);
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving database:", err);
  }
}

loadDB();

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Formulate AI Knowledge Base Context for Gemini
function buildSystemInstruction(): string {
  const { centerInfo, courses, teachers } = db;
  
  const coursesText = courses
    .filter(c => c.isActive)
    .map(c => {
      const teacher = teachers.find(t => t.id === c.teacherId);
      return `- Kurs: ${c.title}
  * Narxi: ${c.priceFormatted} (${c.price} UZS/oy)
  * Davomiyligi: ${c.duration} (${c.lessonDuration})
  * Dars vaqtlari / Jadvali: ${c.schedule}
  * Darajasi: ${c.level}
  * Tavsif: ${c.description}
  * O'qituvchisi: ${teacher ? `${teacher.name} (${teacher.degree}, ${teacher.experience})` : "Yetakchi mutaxassis"}
  * Mavzular: ${c.topics.join(', ')}`;
    })
    .join('\n\n');

  const teachersText = teachers
    .map(t => `- O'qituvchi: ${t.name}
  * Fan/Yo'nalish: ${t.subject}
  * Tajriba: ${t.experience}
  * Malakasi/Unvoni: ${t.degree}
  * Ma'lumot: ${t.bio}
  * Reyting: ${t.rating}/5.0 (O'quvchilar: ${t.studentsCount}+)`)
    .join('\n\n');

  return `Siz "${centerInfo.name}" o'quv markazining rasmiy aqlli Telegram boti va professional sun'iy intellekt maslahatchisisiz.

QUYIDAGI RASMIY MA'LUMOTLARGA QAT'IY ASOSLANIB JAVOB BERING:

1. O'QUV MARKAZI HAQIDA ASOSIY MA'LUMOTLAR:
- Nomi: ${centerInfo.name}
- Shiori: ${centerInfo.tagline}
- Ochilish vaqti: ${centerInfo.openingTime} (ertalab soat ${centerInfo.openingTime} da ochiladi)
- Yopilish vaqti: ${centerInfo.closingTime} (kechki soat ${centerInfo.closingTime} da yopiladi)
- Ish kunlari: ${centerInfo.workDays}
- To'liq manzil: ${centerInfo.address}
- Mo'ljal (Landmark): ${centerInfo.landmark}
- Aloqa telefonlari: ${centerInfo.phone}, ${centerInfo.phoneSecondary}
- Rasmiy Telegram: ${centerInfo.telegramUsername}
- Telegram kanal: ${centerInfo.channelUrl}
- Instagram: ${centerInfo.instagramUrl}
- Veb-sayt: ${centerInfo.websiteUrl}

2. QO'SHIMCHA MA'LUMOTLAR VA QOIDALAR:
${centerInfo.aiPromptContext}

3. MAVJUD KURSLAR VA NARXLAR:
${coursesText}

4. O'QITUVCHILAR (USTOZLAR) RO'YXATI:
${teachersText}

JAVOB BERISH QOIDALARI:
- O'zbek tilida (yoki foydalanuvchi qaysi tilda yozgan bo'lsa: rus, ingliz) juda xushmuomala, aniq, lo'nda va chiroyli emojilar bilan Telegram formati talablariga mos holda javob bering.
- Agar foydalanuvchi "Markaz ochilish vaqti", "Markaz nechchida ochiladi?", "Ertalab nechchida kelasiz?", "Ish vaqti qachon?" deb so'rasa, aniq "Markazimiz har kuni soat ${centerInfo.openingTime} da ochiladi va ${centerInfo.closingTime} gacha ishlaydi (${centerInfo.workDays})" deb ma'lum qiling.
- Agar kurs narxi so'ralsa, oylik to'lovini, davomiyligini va dars kunlarini aniq ko'rsating.
- Agar o'qituvchilar haqida so'ralsa, ularning tajribasi va unvonlarini faxr bilan taqdim eting.
- Agar foydalanuvchi ro'yxatdan o'tishni yoki darsga yozilishni xohlasa, ism-familiyasi va telefon raqamini qoldirishini yoki administratorga (${centerInfo.phone} yoki ${centerInfo.telegramUsername}) murojaat qilishini taklif qiling.
- Hech qachon o'zingizdan mavjud bo'lmagan ma'lumot to'qib chiqarmang. Faqat yuqoridagi bazada bor faktlardan foydalaning.`;
}

// Generate AI response using Gemini
async function askGemini(userQuery: string, chatHistory: { sender: 'user' | 'bot'; text: string }[] = []): Promise<string> {
  const ai = getGeminiClient();
  if (!ai) {
    // Fallback response if API key is not yet set
    const q = userQuery.toLowerCase();
    const { centerInfo } = db;
    if (q.includes("ochil") || q.includes("vaqt") || q.includes("ish vaqti") || q.includes("nechchida")) {
      return `⏰ ${centerInfo.name} har kuni soat ${centerInfo.openingTime} da ochiladi va ${centerInfo.closingTime} gacha faoliyat yuritadi (${centerInfo.workDays}).`;
    }
    if (q.includes("manzil") || q.includes("qayerda") || q.includes("lokatsiya")) {
      return `📍 Bizning manzil: ${centerInfo.address}\nMo'ljal: ${centerInfo.landmark}\n📞 Tel: ${centerInfo.phone}`;
    }
    if (q.includes("kurs") || q.includes("narx") || q.includes("qancha")) {
      const coursesSummary = db.courses.map(c => `• ${c.title} — ${c.priceFormatted}`).join('\n');
      return `📚 Bizning kurslar va narxlar:\n\n${coursesSummary}\n\nBatafsil ma'lumot olish uchun kurs nomini yozing!`;
    }
    return `Assalomu alaykum! "${centerInfo.name}" botiga xush kelibsiz. Biz ertalab soat ${centerInfo.openingTime} dan kechki ${centerInfo.closingTime} gacha ishlaymiz. Qo'shimcha savollaringiz bo'lsa marhamat!`;
  }

  try {
    const systemInstruction = buildSystemInstruction();
    
    // Construct prompt with recent history if available
    let prompt = "";
    if (chatHistory.length > 0) {
      prompt += "Oldingi suhbat konteksti:\n";
      chatHistory.slice(-4).forEach(h => {
        prompt += `${h.sender === 'user' ? 'Foydalanuvchi' : 'Bot'}: ${h.text}\n`;
      });
      prompt += "\nYangi foydalanuvchi savoli:\n";
    }
    prompt += userQuery;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
        topP: 0.9,
      }
    });

    return response.text || "Kechirasiz, javob shakllantirishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.";
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return `Kechirasiz, texnik xatolik: ${error.message || "Tizim vaqtincha band"}. Administrator: ${db.centerInfo.phone}`;
  }
}

// Telegram Bot Helper Functions
async function sendTelegramMessage(chatId: number | string, text: string, replyMarkup?: any) {
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
    return result.ok;
  } catch (err) {
    console.error("Failed to send Telegram message:", err);
    return false;
  }
}

async function sendTelegramPhoto(chatId: number | string, photoUrl: string, caption?: string, replyMarkup?: any) {
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
    return result.ok;
  } catch (err) {
    console.error("Failed to send Telegram photo:", err);
    return false;
  }
}

// Main Telegram Update Handler
async function handleTelegramUpdate(update: any) {
  if (!update) return;

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

    // If user sent contact
    if (contact) {
      const reply = `Rahmat, ${user.firstName}! 📲 Sizning telefon raqamingiz qabul qilindi: ${contact.phone_number}.\n\nTez orada ma'muriyatimiz siz bilan bog'lanadi va barcha savollaringizga batafsil javob beradi!`;
      await sendTelegramMessage(chatId, reply);
      saveLog(user.id, `${user.firstName} ${user.lastName || ''}`.trim(), chatId, 'user', `[Telefon yubordi]: ${contact.phone_number}`, false, 'telegram');
      saveLog(user.id, "EduBot AI", chatId, 'bot', reply, false, 'telegram');
      saveDB();
      return;
    }

    if (!text) return;

    // Save incoming user message log
    saveLog(user.id, `${user.firstName} ${user.lastName || ''}`.trim(), chatId, 'user', text, false, 'telegram');

    const defaultKeyboard = {
      keyboard: [
        [{ text: "📚 Kurslar va Narxlar" }, { text: "👨‍🏫 O'qituvchilar" }],
        [{ text: "⏰ Ish vaqti" }, { text: "📍 Manzil va Mo'ljal" }],
        [{ text: "✍️ Ro'yxatdan o'tish" }, { text: "📞 Bog'lanish" }]
      ],
      resize_keyboard: true
    };

    // Commands handling
    if (text === '/start' || text.toLowerCase() === 'start') {
      const welcome = `Assalomu alaykum, <b>${from.first_name || 'aziz o\'quvchi'}</b>! 🎓\n\n<b>${db.centerInfo.name}</b> rasmiy intellektual botiga xush kelibsiz!\n\nBizning markazda:\n• Zamonaviy IT va Dasturlash kurslari\n• IELTS 7.5+ va Xorijiy tillar\n• UI/UX va Grafik dizayn\n\nQuyidagi tugmalardan birini tanlang yoki o'zingizni qiziqtirgan savolni erkin yozing (masalan: <i>"Markaz nechchida ochiladi?"</i> yoki <i>"Python kursi narxi qancha?"</i>).`;
      await sendTelegramMessage(chatId, welcome, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', welcome, false, 'telegram');
      saveDB();
      return;
    }

    if (text === '📚 Kurslar va Narxlar' || text === '/kurslar') {
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

    if (text === "👨‍🏫 O'qituvchilar" || text === '/oqituvchilar') {
      let teachersMsg = `<b>👨‍🏫 Bizning Professional O'qituvchilarimiz:</b>\n\n`;
      db.teachers.forEach((t, idx) => {
        teachersMsg += `<b>${idx + 1}. ${t.name}</b>\n📌 Yo'nalish: ${t.subject}\n🎖 Malaka: ${t.degree}\n⏳ Tajriba: ${t.experience}\n⭐ Reyting: ${t.rating}/5.0 (${t.studentsCount}+ o'quvchi)\n\n`;
      });
      await sendTelegramMessage(chatId, teachersMsg, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', teachersMsg, false, 'telegram');
      saveDB();
      return;
    }

    if (text === '⏰ Ish vaqti' || text === '/ishvaqti') {
      const timeMsg = `<b>⏰ ${db.centerInfo.name} Ish Vaqti:</b>\n\n• <b>Ochilish vaqti:</b> ${db.centerInfo.openingTime} (Ertalab)\n• <b>Yopilish vaqti:</b> ${db.centerInfo.closingTime} (Kechqurun)\n• <b>Ish kunlari:</b> ${db.centerInfo.workDays}\n\nBiz har doim sizni kutib olishga tayyormiz!`;
      await sendTelegramMessage(chatId, timeMsg, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', timeMsg, false, 'telegram');
      saveDB();
      return;
    }

    if (text === "📍 Manzil va Mo'ljal" || text === '/manzil') {
      const locMsg = `<b>📍 Bizning Manzilimiz:</b>\n\n🏢 <b>Manzil:</b> ${db.centerInfo.address}\n🎯 <b>Mo'ljal:</b> ${db.centerInfo.landmark}\n📞 <b>Telefon:</b> ${db.centerInfo.phone}, ${db.centerInfo.phoneSecondary}\n✈️ <b>Telegram:</b> ${db.centerInfo.telegramUsername}`;
      await sendTelegramMessage(chatId, locMsg, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', locMsg, false, 'telegram');
      saveDB();
      return;
    }

    if (text === "✍️ Ro'yxatdan o'tish" || text === '/royxatdan_otish') {
      const regMsg = `<b>✍️ Kursga ro'yxatdan o'tish:</b>\n\nIltimos, pastdagi tugma orqali telefon raqamingizni yuboring yoki quyidagi formatda yozing:\n<i>Ism Familiya, +998901234567, Frontend kursi</i>`;
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

    if (text === "📞 Bog'lanish" || text === "🔙 Asosiy menyu") {
      const contactInfo = `<b>📞 Administrator bilan bog'lanish:</b>\n\n• Telefon: ${db.centerInfo.phone}\n• Qo'shimcha tel: ${db.centerInfo.phoneSecondary}\n• Telegram admin: ${db.centerInfo.telegramUsername}\n• Ish vaqti: ${db.centerInfo.openingTime} - ${db.centerInfo.closingTime}`;
      await sendTelegramMessage(chatId, contactInfo, defaultKeyboard);
      saveLog(user.id, "EduBot AI", chatId, 'bot', contactInfo, false, 'telegram');
      saveDB();
      return;
    }

    // Free Text / Gemini AI reasoning response
    const history = db.logs
      .filter(l => String(l.telegramId) === String(chatId))
      .slice(-6);

    const aiAnswer = await askGemini(text, history);
    await sendTelegramMessage(chatId, aiAnswer, defaultKeyboard);
    saveLog(user.id, "EduBot AI", chatId, 'bot', aiAnswer, true, 'telegram');
    saveDB();
  }
}

function saveLog(userId: string, userName: string, telegramId: number | string, sender: 'user' | 'bot', text: string, isAiGenerated: boolean, source: 'telegram' | 'simulator') {
  const log: BotMessageLog = {
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    userId,
    userName,
    telegramId,
    sender,
    text,
    timestamp: new Date().toISOString(),
    isAiGenerated,
    source
  };
  db.logs.unshift(log);
  if (db.logs.length > 500) {
    db.logs = db.logs.slice(0, 500);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      center: db.centerInfo.name, 
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      telegramConfigured: Boolean(db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN)
    });
  });

  // GET stats for admin dashboard
  app.get('/api/stats', (req: Request, res: Response) => {
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

    res.json(stats);
  });

  // GET / PUT Learning Center Info
  app.get('/api/center-info', (req: Request, res: Response) => {
    res.json(db.centerInfo);
  });

  app.put('/api/center-info', (req: Request, res: Response) => {
    db.centerInfo = { ...db.centerInfo, ...req.body };
    saveDB();
    res.json({ success: true, centerInfo: db.centerInfo });
  });

  // GET / POST / PUT / DELETE Courses
  app.get('/api/courses', (req: Request, res: Response) => {
    res.json(db.courses);
  });

  app.post('/api/courses', (req: Request, res: Response) => {
    const newCourse: Course = {
      id: `c_${Date.now()}`,
      title: req.body.title || "Yangi Kurs",
      category: req.body.category || "it",
      price: Number(req.body.price) || 0,
      priceFormatted: `${Number(req.body.price || 0).toLocaleString()} so'm/oy`,
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
    res.json({ success: true, course: newCourse });
  });

  app.put('/api/courses/:id', (req: Request, res: Response) => {
    const idx = db.courses.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Course not found" });

    const price = Number(req.body.price ?? db.courses[idx].price);
    db.courses[idx] = {
      ...db.courses[idx],
      ...req.body,
      price,
      priceFormatted: `${price.toLocaleString()} so'm/oy`,
      topics: Array.isArray(req.body.topics) ? req.body.topics : (typeof req.body.topics === 'string' ? req.body.topics.split(',').map((s: string) => s.trim()).filter(Boolean) : db.courses[idx].topics)
    };
    saveDB();
    res.json({ success: true, course: db.courses[idx] });
  });

  app.delete('/api/courses/:id', (req: Request, res: Response) => {
    db.courses = db.courses.filter(c => c.id !== req.params.id);
    saveDB();
    res.json({ success: true });
  });

  // GET / POST / PUT / DELETE Teachers
  app.get('/api/teachers', (req: Request, res: Response) => {
    res.json(db.teachers);
  });

  app.post('/api/teachers', (req: Request, res: Response) => {
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
    res.json({ success: true, teacher: newTeacher });
  });

  app.put('/api/teachers/:id', (req: Request, res: Response) => {
    const idx = db.teachers.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Teacher not found" });

    db.teachers[idx] = {
      ...db.teachers[idx],
      ...req.body
    };
    saveDB();
    res.json({ success: true, teacher: db.teachers[idx] });
  });

  app.delete('/api/teachers/:id', (req: Request, res: Response) => {
    db.teachers = db.teachers.filter(t => t.id !== req.params.id);
    saveDB();
    res.json({ success: true });
  });

  // Users / Leads API
  app.get('/api/users', (req: Request, res: Response) => {
    res.json(db.users);
  });

  app.post('/api/users', (req: Request, res: Response) => {
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
    res.json({ success: true, user: newUser });
  });

  app.put('/api/users/:id', (req: Request, res: Response) => {
    const idx = db.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "User not found" });

    db.users[idx] = { ...db.users[idx], ...req.body };
    saveDB();
    res.json({ success: true, user: db.users[idx] });
  });

  app.delete('/api/users/:id', (req: Request, res: Response) => {
    db.users = db.users.filter(u => u.id !== req.params.id);
    saveDB();
    res.json({ success: true });
  });

  // Broadcasts API
  app.get('/api/broadcasts', (req: Request, res: Response) => {
    res.json(db.broadcasts);
  });

  app.post('/api/broadcasts/send', async (req: Request, res: Response) => {
    const { title, message, imageUrl, buttonText, buttonUrl, targetFilter } = req.body;
    if (!message) return res.status(400).json({ error: "Xabar matni kiritilishi shart" });

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

    // Send to actual telegram users if token exists
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
        // Simulator or local registered user
        successCount++;
      }

      // Record in logs
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

    res.json({ success: true, broadcast: broadcastRecord });
  });

  // Logs API
  app.get('/api/logs', (req: Request, res: Response) => {
    res.json(db.logs);
  });

  app.delete('/api/logs', (req: Request, res: Response) => {
    db.logs = [];
    saveDB();
    res.json({ success: true });
  });

  // Telegram Config & Webhook Setup API
  app.get('/api/telegram/config', (req: Request, res: Response) => {
    const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN || "";
    res.json({
      ...db.telegramConfig,
      token: token ? (token.slice(0, 8) + '...' + token.slice(-5)) : '',
      rawTokenProvided: Boolean(token),
      appUrl: process.env.APP_URL || ""
    });
  });

  app.post('/api/telegram/config', async (req: Request, res: Response) => {
    const { token, autoReplyWithAI } = req.body;
    if (token !== undefined) {
      db.telegramConfig.token = token.trim();
    }
    if (autoReplyWithAI !== undefined) {
      db.telegramConfig.autoReplyWithAI = Boolean(autoReplyWithAI);
    }

    // Verify token with Telegram API if provided
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
    res.json({ success: true, config: db.telegramConfig });
  });

  app.post('/api/telegram/set-webhook', async (req: Request, res: Response) => {
    const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return res.status(400).json({ error: "Telegram bot token kiritilmagan" });

    const webhookUrl = req.body.webhookUrl || `${process.env.APP_URL || ''}/api/telegram/webhook`;
    if (!webhookUrl || !webhookUrl.startsWith('https://')) {
      return res.status(400).json({ error: "Webhook URL HTTPS bilan boshlanishi kerak" });
    }

    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
      const tgData = await tgRes.json();

      if (tgData.ok) {
        db.telegramConfig.isWebhookSet = true;
        db.telegramConfig.webhookUrl = webhookUrl;
        saveDB();
        res.json({ success: true, message: "Webhook muvaffaqiyatli ulandi!", data: tgData });
      } else {
        res.status(400).json({ success: false, error: tgData.description || "Webhook o'rnatishda xatolik", data: tgData });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Telegram serveriga ulanishda xatolik" });
    }
  });

  app.post('/api/telegram/delete-webhook', async (req: Request, res: Response) => {
    const token = db.telegramConfig.token || process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return res.status(400).json({ error: "Token topilmadi" });

    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);
      const tgData = await tgRes.json();
      db.telegramConfig.isWebhookSet = false;
      saveDB();
      res.json({ success: true, data: tgData });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Telegram Incoming Webhook
  app.post('/api/telegram/webhook', async (req: Request, res: Response) => {
    try {
      await handleTelegramUpdate(req.body);
      res.json({ ok: true });
    } catch (err) {
      console.error("Webhook processing error:", err);
      res.json({ ok: false });
    }
  });

  // Live Telegram Simulator API Endpoint (Direct AI Chat for testing in admin panel)
  app.post('/api/simulator/chat', async (req: Request, res: Response) => {
    const { text, userId, userName } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const simUserId = userId || "sim_user_1";
    const simUserName = userName || "Test Foydalanuvchi";
    const simTgId = 999111222;

    // Check or create user
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

    // Save user message log
    saveLog(user.id, simUserName, simTgId, 'user', text, false, 'simulator');

    // Handle standard quick commands
    let reply = "";
    if (text === '/start' || text.toLowerCase() === 'start') {
      reply = `Assalomu alaykum, <b>${simUserName}</b>! 🎓\n\n<b>${db.centerInfo.name}</b> rasmiy intellektual botiga xush kelibsiz!\n\nBizning markazda:\n• Zamonaviy IT va Dasturlash kurslari\n• IELTS 7.5+ va Xorijiy tillar\n• UI/UX va Grafik dizayn\n\nIstalgan savolingizni yozing (masalan: <i>"Markaz ochilish vaqti"</i>, <i>"Frontend kursi qancha?"</i>)!`;
    } else if (text === '📚 Kurslar va Narxlar' || text === '/kurslar') {
      reply = `<b>🎓 ${db.centerInfo.name} Kurslari va Oylik Narxlari:</b>\n\n` +
        db.courses.filter(c => c.isActive).map((c, i) => `<b>${i+1}. ${c.title}</b>\n💰 Narxi: <b>${c.priceFormatted}</b>\n⏱ Davomiyligi: ${c.duration} (${c.lessonDuration})\n🗓 Jadval: ${c.schedule}`).join('\n\n');
    } else if (text === '⏰ Ish vaqti' || text === '/ishvaqti') {
      reply = `<b>⏰ ${db.centerInfo.name} Ish Vaqti:</b>\n\n• <b>Ochilish vaqti:</b> ${db.centerInfo.openingTime} (Ertalab)\n• <b>Yopilish vaqti:</b> ${db.centerInfo.closingTime} (Kechqurun)\n• <b>Ish kunlari:</b> ${db.centerInfo.workDays}\n\nSizni markazimizda kutib qolamiz!`;
    } else if (text === "👨‍🏫 O'qituvchilar" || text === '/oqituvchilar') {
      reply = `<b>👨‍🏫 Bizning Professional O'qituvchilarimiz:</b>\n\n` +
        db.teachers.map((t, i) => `<b>${i+1}. ${t.name}</b>\n📌 Fan: ${t.subject}\n🎖 Malaka: ${t.degree}\n⏳ Tajriba: ${t.experience}\n⭐ Reyting: ${t.rating}/5.0`).join('\n\n');
    } else if (text === "📍 Manzil va Mo'ljal" || text === '/manzil') {
      reply = `<b>📍 Bizning Manzilimiz:</b>\n\n🏢 <b>Manzil:</b> ${db.centerInfo.address}\n🎯 <b>Mo'ljal:</b> ${db.centerInfo.landmark}\n📞 <b>Telefon:</b> ${db.centerInfo.phone}, ${db.centerInfo.phoneSecondary}`;
    } else {
      // Free Gemini AI Call
      const history = db.logs
        .filter(l => l.userId === user.id)
        .slice(-6);
      reply = await askGemini(text, history);
    }

    // Save bot reply log
    saveLog(user.id, "EduBot AI", simTgId, 'bot', reply, true, 'simulator');
    saveDB();

    res.json({
      success: true,
      reply: reply,
      isAi: true,
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduBot AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
