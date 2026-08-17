import { GoogleGenAI } from '@google/genai';
import { getDB } from './db.ts';

// Initialize Gemini Client
export const getGeminiClient = () => {
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
export function buildSystemInstruction(): string {
  const { centerInfo, courses, teachers } = getDB();
  
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

2. QO'SHIMCHA MA'LUMOTLAR VA IMTIYOZLAR:
${centerInfo.aiPromptContext}

3. MAVJUD KURSLAR VA NARXLAR:
${coursesText}

4. O'QITUVCHILAR (USTOZLAR) RO'YXATI:
${teachersText}

JAVOB BERISH QOIDALARI:
- O'zbek tilida (yoki foydalanuvchi qaysi tilda yozgan bo'lsa: rus, ingliz) juda xushmuomala, aniq, lo'nda va chiroyli emojilar bilan Telegram formati talablariga mos holda javob bering.
- Agar foydalanuvchi "Markaz ochilish vaqti", "Markaz nechchida ochiladi?", "Ertalab nechchida kelasiz?", "Ish vaqti qachon?" deb so'rasa, aniq "Markazimiz har kuni soat ${centerInfo.openingTime} da ochiladi va ${centerInfo.closingTime} gacha ishlaydi (${centerInfo.workDays})" deb ma'lum qiling.
- Agar kurs narxi so'ralsa, oylik to'lovini, davomiyligini va dars kunlarini aniq ko'rsating.
- Agar o'qituvchilar haqida so'ralsa, ularning tajribasi va unvonlarini taqdim eting.
- Agar foydalanuvchi ro'yxatdan o'tishni yoki darsga yozilishni xohlasa, ism-familiyasi va telefon raqamini qoldirishini yoki administratorga (${centerInfo.phone} yoki ${centerInfo.telegramUsername}) murojaat qilishini taklif qiling.
- Faqat yuqoridagi bazada bor faktlardan foydalaning, mavjud bo'lmagan ma'lumotlarni to'qimang.`;
}

// Generate AI response using Gemini with graceful fallback
export async function askGemini(
  userQuery: string, 
  chatHistory: { sender: 'user' | 'bot'; text: string }[] = []
): Promise<string> {
  const { centerInfo, courses } = getDB();
  const ai = getGeminiClient();

  // Keyword-based fallback check if API key is not ready or fails
  const getOfflineFallback = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("ochil") || q.includes("vaqt") || q.includes("ish vaqti") || q.includes("nechchida")) {
      return `⏰ <b>${centerInfo.name}</b> har kuni soat <b>${centerInfo.openingTime}</b> da ochiladi va <b>${centerInfo.closingTime}</b> gacha faoliyat yuritadi (${centerInfo.workDays}).`;
    }
    if (q.includes("manzil") || q.includes("qayerda") || q.includes("lokatsiya") || q.includes("mo'ljal")) {
      return `📍 <b>Bizning manzil:</b> ${centerInfo.address}\n🎯 <b>Mo'ljal:</b> ${centerInfo.landmark}\n📞 <b>Tel:</b> ${centerInfo.phone}`;
    }
    if (q.includes("kurs") || q.includes("narx") || q.includes("qancha") || q.includes("to'lov")) {
      const coursesSummary = courses.filter(c => c.isActive).map(c => `• <b>${c.title}</b> — ${c.priceFormatted}`).join('\n');
      return `📚 <b>Bizning kurslar va oylik to'lovlar:</b>\n\n${coursesSummary}\n\nBatafsil ma'lumot olish uchun kurs nomini yozing!`;
    }
    return `Assalomu alaykum! 🎓 <b>${centerInfo.name}</b> rasmiy botiga xush kelibsiz.\n\nBiz ertalab soat ${centerInfo.openingTime} dan kechki ${centerInfo.closingTime} gacha ishlaymiz. Qo'shimcha savollaringiz bo'lsa marhamat, yozing!`;
  };

  if (!ai) {
    return getOfflineFallback(userQuery);
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

    // Try Gemini model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
        topP: 0.9,
      }
    });

    return response.text || getOfflineFallback(userQuery);
  } catch (error: any) {
    console.error("Gemini API error:", error);
    // Return smart fallback so user always receives a valid response
    return getOfflineFallback(userQuery);
  }
}
