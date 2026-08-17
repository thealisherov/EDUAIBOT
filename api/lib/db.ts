import path from 'path';
import fs from 'fs';
import type { 
  LearningCenterInfo, 
  Course, 
  Teacher, 
  BotUser, 
  BroadcastMessage, 
  BotMessageLog, 
  TelegramBotConfig, 
  CenterStats 
} from '../../src/types.ts';

export const defaultCenterInfo: LearningCenterInfo = {
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

export const defaultCourses: Course[] = [
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

export const defaultTeachers: Teacher[] = [
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

export const defaultUsers: BotUser[] = [
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

export const defaultBroadcasts: BroadcastMessage[] = [
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

export const defaultLogs: BotMessageLog[] = [
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

export interface DBState {
  centerInfo: LearningCenterInfo;
  courses: Course[];
  teachers: Teacher[];
  users: BotUser[];
  broadcasts: BroadcastMessage[];
  logs: BotMessageLog[];
  telegramConfig: TelegramBotConfig;
}

let dbInstance: DBState = {
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

const getDBPaths = (): string[] => {
  const paths: string[] = [];
  try {
    // Vercel serverless writable path
    paths.push(path.join('/tmp', 'data_store.json'));
  } catch {}
  try {
    // Local workspace path
    paths.push(path.join(process.cwd(), 'data_store.json'));
  } catch {}
  return paths;
};

export function loadDB(): DBState {
  const envToken = process.env.TELEGRAM_BOT_TOKEN || "";
  for (const filePath of getDBPaths()) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        dbInstance = {
          ...dbInstance,
          ...parsed,
          telegramConfig: {
            ...dbInstance.telegramConfig,
            ...(parsed.telegramConfig || {}),
            token: envToken || parsed.telegramConfig?.token || dbInstance.telegramConfig.token || "",
            hasCustomToken: Boolean(envToken || parsed.telegramConfig?.token || dbInstance.telegramConfig.token)
          }
        };
        return dbInstance;
      }
    } catch {}
  }

  // If no file found, keep defaults and update token
  if (envToken) {
    dbInstance.telegramConfig.token = envToken;
    dbInstance.telegramConfig.hasCustomToken = true;
  }
  return dbInstance;
}

export function saveDB(): void {
  const data = JSON.stringify(dbInstance, null, 2);
  for (const filePath of getDBPaths()) {
    try {
      fs.writeFileSync(filePath, data, 'utf-8');
    } catch {}
  }
}

export function getDB(): DBState {
  return dbInstance;
}

export function saveLog(
  userId: string, 
  userName: string, 
  telegramId: number | string, 
  sender: 'user' | 'bot', 
  text: string, 
  isAiGenerated: boolean, 
  source: 'telegram' | 'simulator'
): void {
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
  dbInstance.logs.unshift(log);
  if (dbInstance.logs.length > 500) {
    dbInstance.logs = dbInstance.logs.slice(0, 500);
  }
}

// Initial load
loadDB();
