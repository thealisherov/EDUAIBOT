// Hardcoded Knowledge Base for EVEREST IT & Language Academy
export interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
}

export const KNOWLEDGE_BASE = {
  center: {
    name: "EVEREST IT & Language Academy",
    tagline: "Zamonaviy IT va Xorijiy tillar bo'yicha yetakchi innovatsion ta'lim markazi",
    foundedYear: 2019,
    description: "EVEREST Academy — 2019-yildan buyon minglab yoshlarga dasturlash, sun'iy intellekt, xorijiy tillar va dizayn sohalarida xalqaro darajadagi ta'lim berib kelayotgan innovatsion o'quv markazi.",
    workingHours: {
      openingTime: "08:00",
      closingTime: "20:00",
      workDays: "Dushanba - Shanba",
      daysOff: "Yakshanba - dam olish kuni"
    },
    location: {
      city: "Toshkent shahri",
      district: "Yunusobod tumani",
      address: "Amir Temur shoh ko'chasi 45-uy",
      landmark: "Mega Planet savdo majmuasi ro'parasi, 3-qavat",
      metro: "Shahriston metro bekati (2 daqiqalik piyoda yo'l)"
    },
    contacts: {
      primaryPhone: "+998 71 200 45 45",
      secondaryPhone: "+998 90 999 88 77",
      adminTelegram: "@everest_admin",
      telegramChannel: "https://t.me/everest_academy_uz",
      instagram: "https://instagram.com/everest_academy_uz",
      website: "https://everest-academy.uz"
    },
    facilities: [
      "Bepul birinchi sinov darsi",
      "Zamonaviy kompyuter xonalari va yuqori tezlikdagi Wi-Fi",
      "Bepul Coworking zonasi (darsdan tashqari kelib mustaqil o'rganish uchun)",
      "Bepul kofe-choy va qulay dam olish burchagi",
      "O'qishni muvaffaqiyatli bitirganlarga xalqaro sertifikat",
      "Top IT kompaniyalarga ishga tavsiya va rezyume tayyorlashda yordam",
      "Har oy yakunida amaliy real loyihalar taqdimoti (Demo Day)"
    ],
    paymentMethods: [
      "Click",
      "Payme",
      "Uzum Bank",
      "Bank orqali o'tkazma",
      "Naqd pul yoki terminal"
    ]
  },

  courses: [
    {
      id: "frontend",
      title: "Frontend Dasturlash (React, Next.js & TypeScript)",
      category: "Dasturlash / IT",
      price: 900000,
      priceFormatted: "900,000 so'm/oy",
      duration: "6 oy",
      lessonDuration: "1.5 soat (Haftada 3 kun)",
      schedule: "Dushanba - Chorshanba - Juma: 14:00 - 15:30 yoki 18:30 - 20:00",
      level: "Boshlang'ichdan Junior/Middle darajagacha",
      teacher: "Sanjarbek Aliyev (Senior Frontend Engineer, 6+ yil tajriba)",
      description: "HTML5, CSS3, Tailwind CSS, JavaScript ES6+, TypeScript, React.js, Next.js 15, REST API, Git & GitHub. Bitiruvda 3 ta real portfolio loyihasi tayyorlanadi.",
      topics: ["HTML & Zamonaviy CSS", "JavaScript & TypeScript", "React.js & State Management", "Next.js App Router", "Tailwind CSS", "Git & Deployment"]
    },
    {
      id: "python",
      title: "Python Backend & AI (Django, FastAPI & Gemini AI)",
      category: "Dasturlash / IT",
      price: 950000,
      priceFormatted: "950,000 so'm/oy",
      duration: "7 oy",
      lessonDuration: "1.5 soat (Haftada 3 kun)",
      schedule: "Seshanba - Payshanba - Shanba: 15:00 - 16:30 yoki 18:30 - 20:00",
      level: "Boshlang'ichdan Junior+ gacha",
      teacher: "Jasur Toshmatov (Backend & AI Engineer, 4+ yil tajriba)",
      description: "Python asoslari, OOP, Algoritmlar, PostgreSQL, Django REST Framework, FastAPI, Telegram botlar yaratish, Gemini AI va LLM modellarini ulash.",
      topics: ["Python Core & OOP", "PostgreSQL & SQLite", "Django REST Framework", "FastAPI & Async", "Telegram Bot Development", "Gemini & LLM Integrations"]
    },
    {
      id: "ielts",
      title: "IELTS 7.5+ & Academic English",
      category: "Xorijiy Tillar",
      price: 800000,
      priceFormatted: "800,000 so'm/oy",
      duration: "4-6 oy",
      lessonDuration: "2 soat (Haftada 3 kun)",
      schedule: "Dushanba - Chorshanba - Juma: 10:00 - 12:00 yoki 16:00 - 18:00",
      level: "Intermediate (B1+) darajadan boshlab",
      teacher: "Madina Karimova (IELTS 8.5 / CELTA Sertifikati, 5+ yil tajriba)",
      description: "IELTS Reading, Listening, Writing (Task 1 & 2) va Speaking bo'yicha intensiv tayyorgarlik. Har hafta bepul Real Mock Exam va Speaking club.",
      topics: ["IELTS Reading Strategies", "Listening Masterclass", "Academic Writing Task 1 & 2", "Fluent Speaking Techniques", "Weekly Real Mock Tests"]
    },
    {
      id: "general_english",
      title: "General English (Beginner to Advanced)",
      category: "Xorijiy Tillar",
      price: 650000,
      priceFormatted: "650,000 so'm/oy",
      duration: "6 oy",
      lessonDuration: "1.5 soat (Haftada 3 kun)",
      schedule: "Dushanba - Chorshanba - Juma: 14:00 - 15:30",
      level: "0 dan boshlovchilar uchun",
      teacher: "Madina Karimova va xalqaro metodistlar",
      description: "Ingliz tilida erkin so'zlashuv, grammatika, so'z boyligini oshirish va kundalik jonli muloqot ko'nikmalari.",
      topics: ["Grammar in Use", "Speaking Practice", "Vocabulary Boost", "Audio & Video Comprehension"]
    },
    {
      id: "design",
      title: "UI/UX & Grafik Dizayn (Figma, Photoshop, Illustrator)",
      category: "Dizayn",
      price: 850000,
      priceFormatted: "850,000 so'm/oy",
      duration: "4 oy",
      lessonDuration: "1.5 soat (Haftada 3 kun)",
      schedule: "Seshanba - Payshanba - Shanba: 10:00 - 11:30 yoki 16:30 - 18:00",
      level: "Barcha qiziquvchilar uchun",
      teacher: "Nozima Rustamova (Lead Product Designer, 5+ yil tajriba)",
      description: "Veb va mobil ilovalar dizayni, UX tadqiqotlar, Wireframing, Figma prototiplash, Branding, Adobe Photoshop va Illustrator.",
      topics: ["Dizayn asoslari va ranglar nazariyasi", "Figma & Auto-layout", "UX Research & Wireframing", "Mobile & Web UI Design", "Adobe Photoshop & Illustrator", "Dribbble/Behance Portfolio"]
    },
    {
      id: "foundation",
      title: "Foundation: Dasturlash Asoslari & C++",
      category: "Dasturlash / IT",
      price: 700000,
      priceFormatted: "700,000 so'm/oy",
      duration: "3 oy",
      lessonDuration: "1.5 soat (Haftada 3 kun)",
      schedule: "Dushanba - Chorshanba - Juma: 09:00 - 10:30",
      level: "Maktab o'quvchilari va boshlovchilar",
      teacher: "Sanjarbek Aliyev",
      description: "Dasturlash olamiga ilk qadam. Mantiqiy fikrlash, algoritmlar, ma'lumotlar tuzilmasi, C++ tili asoslari.",
      topics: ["Algoritmlar va Mantiq", "C++ sintaksisi", "Funksiyalar va Massivlar", "Ko'rsatkichlar (Pointers)", "Olimpiada masalalari"]
    }
  ],

  teachers: [
    {
      name: "Sanjarbek Aliyev",
      subject: "Frontend & Full-stack Dasturlash",
      experience: "6+ yil IT tajriba",
      degree: "Senior Software Engineer (EPAM & IT Park bitiruvchisi)",
      bio: "React, Next.js va zamonaviy web texnologiyalar bo'yicha 500+ dan ortiq shogirdlar tayyorlagan. Xalqaro loyihalarda faoliyat yuritadi.",
      rating: 4.9,
      studentsCount: 320
    },
    {
      name: "Madina Karimova",
      subject: "IELTS & General English",
      experience: "5+ yil xalqaro ta'lim tajribasi",
      degree: "IELTS 8.5 / CELTA Sertifikati sohibasi",
      bio: "O'quvchilarining o'rtacha IELTS natijasi 7.5+. Kembrij metodikasi asosida interaktiv darslar olib boradi.",
      rating: 5.0,
      studentsCount: 450
    },
    {
      name: "Jasur Toshmatov",
      subject: "Python, AI & Data Science",
      experience: "4+ yil Backend & AI tajriba",
      degree: "TUIT Magistr / Python & ML Engineer",
      bio: "Python, Django, FastAPI, Telegram botlar va Gemini / OpenAI modellarini biznesga tatbiq qilish bo'yicha mutaxassis.",
      rating: 4.8,
      studentsCount: 280
    },
    {
      name: "Nozima Rustamova",
      subject: "UI/UX & Grafik Dizayn",
      experience: "5+ yil Dizayn studiyalari yetakchisi",
      degree: "Lead Product Designer (Behance Featured)",
      bio: "Figma, Design Systems va mobil ilovalar ergonomikasi bo'yicha ekspert. 30+ yirik startaplar dizaynini yaratgan.",
      rating: 4.9,
      studentsCount: 210
    }
  ],

  faqs: [
    {
      question: "Markaz ertalab nechchida ochiladi va qachon yopiladi?",
      answer: "EVEREST Academy har kuni ertalab soat 08:00 da ochiladi va kechki 20:00 gacha ishlaydi (Dushanba - Shanba). Yakshanba — dam olish kuni.",
      keywords: ["ochilish", "vaqt", "ish vaqti", "nechchida", "yopilish", "ertalab", "kechki"]
    },
    {
      question: "Manzilingiz qayerda? Mo'ljal nima?",
      answer: "Bizning manzil: Toshkent shahri, Yunusobod tumani, Amir Temur shoh ko'chasi 45-uy. Mo'ljal: Mega Planet savdo majmuasi ro'parasi, 3-qavat (Shahriston metro bekati yaqinida). Tel: +998 71 200 45 45.",
      keywords: ["manzil", "qayerda", "lokatsiya", "mo'ljal", "metro", "qanday boriladi", "adres"]
    },
    {
      question: "Sinov darsi bormi? Sinov darsi bepulmi?",
      answer: "Ha, markazimizda barcha kurslar uchun 1-sinov darsi mutlaqo BEPUL! Sinov darsiga qatnashib, dars sifati va ustozimiz bilan shaxsan tanishishingiz mumkin.",
      keywords: ["sinov darsi", "bepul", "birinchi dars", "trial"]
    },
    {
      question: "Kurslarga qanday ro'yxatdan o'tsa bo'ladi?",
      answer: "Kursga ro'yxatdan o'tish uchun botdagi «✍️ Ro'yxatdan o'tish» tugmasini bosing yoki ism-familiyangiz, telefon raqamingiz va qiziqqan kursingizni yozib qoldiring. Administratorimiz: +998 71 200 45 45 yoki @everest_admin.",
      keywords: ["ro'yxatdan o'tish", "yozilish", "kursga yozilish", "qabul", "ariza"]
    },
    {
      question: "O'qish yakunida sertifikat beriladimi?",
      answer: "Ha, kurslarni muvaffaqiyatli tamomlagan va imtihonlarni topshirgan barcha o'quvchilarga xalqaro standartdagi QR-kodli rasmiy sertifikat beriladi.",
      keywords: ["sertifikat", "diplom", "bitiruv"]
    },
    {
      question: "Ishga joylashishga yordam berasizlarmi?",
      answer: "Ha! Eng yaxshi bitiruvchilarimizga hamkor IT kompaniyalarimizda amaliyot o'tash va ishga joylashish bo'yicha rezyume tayyorlash, texnik intervyuga tayyorgarlik hamda ishga tavsiya taqdim etiladi.",
      keywords: ["ish", "ishga joylashish", "vakansiya", "amaliyot", "internship"]
    }
  ]
};

export const IRRELEVANT_RESPONSE = "Kechirasiz, bu savol bizning o'quv markazimiz faoliyatiga taalluqli emas. Men faqat EVEREST IT & Language Academy kurslari, narxlari, dars jadvallari, o'qituvchilari, manzili va markazimiz haqidagi savollarga javob bera olaman.";
