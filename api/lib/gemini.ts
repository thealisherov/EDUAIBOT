import { GoogleGenAI } from '@google/genai';
import { KNOWLEDGE_BASE, IRRELEVANT_RESPONSE } from './knowledge.ts';

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

// Formulate System Instruction strictly from hardcoded Knowledge Base
export function buildStrictSystemInstruction(): string {
  const { center, courses, teachers, faqs } = KNOWLEDGE_BASE;

  const coursesList = courses.map(c => `- Kurs: ${c.title}
  * Narxi: ${c.priceFormatted} (${c.price} UZS/oy)
  * Davomiyligi: ${c.duration} (${c.lessonDuration})
  * Dars jadvallari: ${c.schedule}
  * Darajasi: ${c.level}
  * O'qituvchisi: ${c.teacher}
  * Tavsif: ${c.description}
  * Mavzular: ${c.topics.join(', ')}`).join('\n\n');

  const teachersList = teachers.map(t => `- O'qituvchi: ${t.name}
  * Yo'nalish: ${t.subject}
  * Tajriba: ${t.experience}
  * Malakasi/Darajasi: ${t.degree}
  * Bio: ${t.bio}
  * Reyting: ${t.rating}/5.0 (O'quvchilar: ${t.studentsCount}+)`).join('\n\n');

  const faqsList = faqs.map(f => `Savol: ${f.question}\nJavob: ${f.answer}`).join('\n\n');

  return `Siz "${center.name}" o'quv markazining rasmiy aqlli Telegram bot maslahatchisisiz.

QUYIDAGI QAT'IY CHEKLOV VA QOIDALARGA 100% AMAL QILING:

1. ASOSIY VAZIFANGIZ:
Faqat va faqat quyida keltirilgan "${center.name}" o'quv markazi ma'lumotlari (kurslar, narxlar, dars jadvallari, o'qituvchilar, manzil, ish vaqti, sinov darslari, ro'yxatdan o'tish) bo'yicha berilgan savollarga aniq, muloyim va lo'nda javob berish.

2. QAT'IY CHEKLOV (ENG MUHIM QOIDA):
Agar foydalanuvchi o'quv markaziga yoki uning kurslariga, o'qituvchilariga, narxlariga, manziliga, ta'limiga ALOQASI BO'LMAGAN istalgan mavzuda savol bersa (masalan: ob-havo, siyosat, boshqa sohalar, umumiy dasturlash masalalari, kod yozib berish, she'r/ertak yozish, matematika/fizika misollari, salomatlik, shaxsiy suhbat va h.k.), BOSHQA HECH QANDAY JAVOB BERMANG va FAQAT AYNAN SHU JAVOBNI QAYTARING:
"${IRRELEVANT_RESPONSE}"

3. O'QUV MARKAZI HAQIDA RASMIY MA'LUMOTLAR:
- Markaz nomi: ${center.name}
- Shiori: ${center.tagline}
- Ochilish vaqti: ertalab soat ${center.workingHours.openingTime}
- Yopilish vaqti: kechki soat ${center.workingHours.closingTime}
- Ish kunlari: ${center.workingHours.workDays} (${center.workingHours.daysOff})
- Manzil: ${center.location.city}, ${center.location.district}, ${center.location.address}
- Mo'ljal: ${center.location.landmark}
- Metro: ${center.location.metro}
- Telefonlar: ${center.contacts.primaryPhone}, ${center.contacts.secondaryPhone}
- Telegram admin: ${center.contacts.adminTelegram}
- Telegram kanal: ${center.contacts.telegramChannel}
- Imtiyozlar: ${center.facilities.join('; ')}
- To'lov turlari: ${center.paymentMethods.join(', ')}

4. KURSLAR VA NARXLAR:
${coursesList}

5. O'QITUVCHILAR:
${teachersList}

6. TEZ-TEZ BERILADIGAN SAVOLLAR VA JAVOBLAR (FAQ):
${faqsList}

7. JAVOB BERISH USLUBI:
- O'zbek tilida, xushmuomala, lo'nda va chiroyli emojilar bilan Telegram HTML formatida javob bering.
- Hech qachon o'zingizdan ma'lumot to'qimang. Faqat yuqoridagi faktlarga tayaning.`;
}

// Generate strict AI response using Gemini with offline fallback
export async function askGemini(
  userQuery: string, 
  chatHistory: { sender: 'user' | 'bot'; text: string }[] = []
): Promise<string> {
  const query = userQuery.trim();
  const qLower = query.toLowerCase();
  const { center, courses, faqs } = KNOWLEDGE_BASE;

  // Direct fast matching for standard queries
  if (qLower.includes("ochil") || qLower.includes("vaqt") || qLower.includes("ish vaqti") || qLower.includes("nechchida") || qLower.includes("yopil")) {
    return `⏰ <b>${center.name}</b> har kuni ertalab soat <b>${center.workingHours.openingTime}</b> da ochiladi va kechki <b>${center.workingHours.closingTime}</b> gacha faoliyat yuritadi (${center.workingHours.workDays}).\n\n${center.workingHours.daysOff}.`;
  }
  if (qLower.includes("manzil") || qLower.includes("qayerda") || qLower.includes("lokatsiya") || qLower.includes("mo'ljal") || qLower.includes("adres")) {
    return `📍 <b>Bizning Manzil:</b> ${center.location.address}\n🎯 <b>Mo'ljal:</b> ${center.location.landmark}\n🚇 <b>Metro:</b> ${center.location.metro}\n📞 <b>Telefon:</b> ${center.contacts.primaryPhone}`;
  }
  if (qLower.includes("kurs") || qLower.includes("narx") || qLower.includes("qancha") || qLower.includes("to'lov") || qLower.includes("qanaqa kurs")) {
    const list = courses.map(c => `• <b>${c.title}</b> — ${c.priceFormatted} (${c.duration})`).join('\n');
    return `📚 <b>${center.name} Kurslari va Oylik Narxlari:</b>\n\n${list}\n\nBatafsil ma'lumot olish uchun kurs nomini yozing yoki «✍️ Ro'yxatdan o'tish» tugmasini bosing!`;
  }

  const ai = getGeminiClient();

  if (!ai) {
    // If Gemini key is not provided, check relevance offline
    const isRelevant = courses.some(c => qLower.includes(c.title.toLowerCase().split(' ')[0])) ||
                       faqs.some(f => f.keywords.some(k => qLower.includes(k))) ||
                       qLower.includes("ustoz") || qLower.includes("o'qituvchi") || qLower.includes("sertifikat") || qLower.includes("sinov");
    if (!isRelevant) {
      return IRRELEVANT_RESPONSE;
    }
    return `Assalomu alaykum! 🎓 <b>${center.name}</b> rasmiy botiga xush kelibsiz. Biz ertalab soat ${center.workingHours.openingTime} dan kechki ${center.workingHours.closingTime} gacha ishlaymiz. Qo'shimcha savollaringiz bo'lsa marhamat!`;
  }

  try {
    const systemInstruction = buildStrictSystemInstruction();
    
    let prompt = "";
    if (chatHistory.length > 0) {
      prompt += "Oldingi suhbat:\n";
      chatHistory.slice(-4).forEach(h => {
        prompt += `${h.sender === 'user' ? 'Foydalanuvchi' : 'Bot'}: ${h.text}\n`;
      });
      prompt += "\nYangi savol:\n";
    }
    prompt += query;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1, // Low temperature for strict factual adherence
        topP: 0.8,
      }
    });

    return response.text || IRRELEVANT_RESPONSE;
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return IRRELEVANT_RESPONSE;
  }
}
