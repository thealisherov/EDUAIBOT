# 🚀 EDUAIBOT — Vercel 100% Deployment Qo'llanmasi

Ushbu qo'llanma orqali siz **EDUAIBOT** (Admin Panel + Telegram Bot Webhook + Gemini AI Maslahatchisi) tizimini Vercel platformasiga 100% to'liq va bepul joylashtirishingiz (deploy) mumkin.

---

## 📋 1. Tayyorgarlik (Kerakli Kalitlar)

Loyihangiz uchun barcha kalitlar `.env` fayliga kiritildi:
- **GEMINI_API_KEY**: Sizning Gemini API kalitingiz
- **TELEGRAM_BOT_TOKEN**: Sizning Telegram Bot Tokeningiz

---

## 🌐 2. Vercel-ga Joylashtirish (Deploy) Bosqichlari

### 1-usul: GitHub orqali (Tavsiya etiladi)

1. **Loyihani GitHub-ga yuklang**:
   ```bash
   git add .
   git commit -m "100% Vercel deployment ready"
   git push origin main
   ```

2. **Vercel Dashboard-ga kiring**:
   - [vercel.com](https://vercel.com) saytiga kiring.
   - **"Add New..."** -> **"Project"** tugmasini bosing.
   - O'zingizning GitHub repositoryingizni tanlang (**Import**).

3. **Environment Variables (Muhit O'zgaruvchilari) ni kiriting**:
   Vercel loyiha sozlamalarida **"Environment Variables"** bo'limiga quyidagi 3 ta o'zgaruvchini qo'shing:

   | Name | Value | Izoh |
   | :--- | :--- | :--- |
   | `GEMINI_API_KEY` | `Sizning Gemini API Kalitingiz` | Gemini AI uchun kalit |
   | `TELEGRAM_BOT_TOKEN` | `Sizning Telegram Bot Tokeningiz` | Telegram Bot Token |
   | `APP_URL` | `https://sizning-loyihangiz.vercel.app` | Vercel beradigan domen (keyinchalik yangilashingiz mumkin) |

4. **"Deploy"** tugmasini bosing:
   - Vercel avtomatik ravishda `npm run build` bajaradi va serverless funksiyalarni ishga tushiradi.
   - 1-2 daqiqada sizga jonli domen taqdim etiladi (masalan: `https://eduaibot.vercel.app`).

---

### 2-usul: Vercel CLI orqali (Tezkor)

Agar kompyuteringizda Vercel CLI o'rnatilgan bo'lsa:
```bash
npm i -g vercel
vercel --prod
```
Ko'rsatmalarga javob bering va deploy yakunlangach, Environment Variables-ni Vercel Dashboard-ga qo'shing.

---

## ⚡ 3. Telegram Webhook-ni Faollashtirish (1-Bosqich)

Deploy bo'lgach, Telegram botingiz xabarlarni qabul qilishi uchun Webhookni ulab qo'yish kerak:

### Eng Oson Usul (Admin Panel orqali):
1. Vercel bergan URL manzilida (masalan: `https://eduaibot.vercel.app`) Admin Panelni oching.
2. Chap/yuqori menyudan **"Telegram Sozlamalari"** bo'limiga o'ting.
3. **"Webhookni Bog'lash"** tugmasini bosing.
4. Tizim avtomatik ravishda Vercel serverless manzilini (`/api/telegram/webhook`) Telegram serveriga ulaydi! ✅

### Qo'lda Brauzer orqali:
Brauzeringizda quyidagi havolani oching (URL manzilingizni qo'ying):
```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://SIZNING-DOMENINGIZ.vercel.app/api/telegram/webhook
```

---

## 🤖 4. Bot Imkoniyatlari & Tekshirish

Telegramda botingizga kiring va quyidagilarni sinab ko'ring:
- `/start` — Chiroyli tabrik va interaktiv tugmalar (Kurslar, O'qituvchilar, Ish vaqti, Manzil, Ro'yxatdan o'tish).
- **«⏰ Ish vaqti»** yoki *«Markaz nechchida ochiladi?»* — ertalab 08:00 dan kechki 20:00 gacha ekanligini aytadi.
- **«📚 Kurslar va Narxlar»** yoki *«Python kursi narxi qancha?»* — barcha narxlar va jadvallarni taqdim etadi.
- **«📲 Telefon raqamni ulashish»** — Foydalanuvchi telefonini avtomatik Admin Panel CRM bazasiga Lid sifatida yozadi.
- **Istalgan erkin savol** — Google Gemini AI o'quv markazi ma'lumotlari asosida to'liq o'zbek tilida professional maslahat beradi.

---

## 💻 5. Mahalliy Ishga Tushirish (Local Development)

Mahalliy kompyuterda sinab ko'rish uchun:
```bash
npm run dev
```
Brauzerda: `http://localhost:3000`
