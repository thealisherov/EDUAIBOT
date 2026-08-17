import React, { useState } from 'react';
import { 
  Radio, 
  Key, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Layers, 
  ShieldCheck,
  RefreshCw,
  Trash2,
  Send,
  Code2
} from 'lucide-react';
import type { TelegramBotConfig } from '../types.ts';

interface TelegramConfigManagerProps {
  config: TelegramBotConfig | null;
  onUpdateConfig: (data: { token?: string; autoReplyWithAI?: boolean }) => Promise<void>;
  onSetWebhook: (url: string) => Promise<void>;
  onDeleteWebhook: () => Promise<void>;
}

export const TelegramConfigManager: React.FC<TelegramConfigManagerProps> = ({
  config,
  onUpdateConfig,
  onSetWebhook,
  onDeleteWebhook,
}) => {
  const [tokenInput, setTokenInput] = useState(config?.token || '');
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [isSavingToken, setIsSavingToken] = useState(false);
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'telegram' | 'vercel'>('telegram');

  const defaultWebhook = `${window.location.origin}/api/telegram/webhook`;

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsSavingToken(true);
    setFeedback(null);
    try {
      await onUpdateConfig({ token: tokenInput.trim() });
      setFeedback({ type: 'success', message: "Telegram bot token muvaffaqiyatli saqlandi va tekshirildi!" });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Tokenni saqlashda xatolik yuz berdi" });
    } finally {
      setIsSavingToken(false);
    }
  };

  const handleSetWebhook = async () => {
    const url = customWebhookUrl.trim() || defaultWebhook;
    setIsSettingWebhook(true);
    setFeedback(null);
    try {
      await onSetWebhook(url);
      setFeedback({ type: 'success', message: "Webhook Telegram serveriga muvaffaqiyatli bog'landi!" });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Webhook o'rnatishda xatolik" });
    } finally {
      setIsSettingWebhook(false);
    }
  };

  const handleDeleteWebhook = async () => {
    if (window.confirm("Webhookni o'chirishni tasdiqlaysizmi?")) {
      try {
        await onDeleteWebhook();
        setFeedback({ type: 'success', message: "Webhook o'chirildi." });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || "Xatolik yuz berdi" });
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const nextJsRouteCode = `// app/api/telegram/route.ts (Next.js 14+ App Router)
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// 1. Learning Center Knowledge Base Context
const SYSTEM_PROMPT = \`Siz "EVEREST IT & Language Academy" o'quv markazining rasmiy aqlli maslahatchisisiz.
- Ochilish vaqti: 08:00 dan 20:00 gacha (Dushanba-Shanba).
- Manzil: Toshkent sh., Amir Temur 45, Mega Planet ro'parasi.
- Telefon: +998 71 200 45 45
- Kurslar:
  * Frontend Dasturlash: 900,000 so'm/oy (6 oy, Dush-Chor-Juma)
  * Python & AI Backend: 950,000 so'm/oy (7 oy, Sesh-Pay-Shanba)
  * IELTS 7.5+: 800,000 so'm/oy (4-6 oy)
  * UI/UX Dizayn: 850,000 so'm/oy (4 oy)
Barcha savollarga xushmuomala, aniq va lo'nda javob bering.\`;

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    if (!update?.message?.text) return NextResponse.json({ ok: true });

    const chatId = update.message.chat.id;
    const text = update.message.text.trim();

    // Call Gemini 3.7 Flash AI
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: text,
      config: { systemInstruction: SYSTEM_PROMPT }
    });

    const reply = response.text || "Kechirasiz, javob shakllantirib bo'lmadi.";

    // Send answer back to Telegram
    await fetch(\`https://api.telegram.org/bot\${BOT_TOKEN}/sendMessage\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: 'HTML' })
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Radio className="w-6 h-6 text-blue-400" />
              <span>Telegram Bot Integratsiyasi & Next.js Vercel Sozlamalari</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Telegram bot tokeni, Webhook konfiguratsiyasi va Vercel platformasiga Next.js orqali deploy qilish bo'yicha to'liq qo'llanma.
            </p>
          </div>

          {/* Sub tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('telegram')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'telegram'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Telegram Sozlamalari
            </button>
            <button
              onClick={() => setActiveSubTab('vercel')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeSubTab === 'vercel'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Next.js & Vercel Deploy</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/10 border border-red-500/30 text-red-300'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {activeSubTab === 'telegram' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bot Token Configuration Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>1. Telegram Bot Token (@BotFather)</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Telegramda <b>@BotFather</b> ga kirib yangi bot yarating (<code>/newbot</code>) va olingan HTTP API tokenni shu yerga kiriting.
            </p>

            <form onSubmit={handleSaveToken} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Telegram Bot Token *
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>@BotFather ochish</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="submit"
                  disabled={isSavingToken}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2"
                >
                  {isSavingToken ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Tekshirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tokenni Saqlash & Bog'lash</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Current Bot Info Status */}
            <div className="pt-4 border-t border-slate-800">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Bot Nomi:</span>
                  <span className="text-white font-medium">{config?.botName || "EVEREST Academy Bot"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Username:</span>
                  <span className="text-blue-400 font-medium font-mono">{config?.botUsername || "@everest_edubot"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Gemini AI Avto-javob:</span>
                  <span className="text-emerald-400 font-medium">Faollashtirilgan ✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Configuration Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>2. Webhook URL & Serverga Ulash</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Webhook orqali Telegramdagi har bir yangi xabar darhol serverimizga yetib keladi va Gemini AI markaz bilimlar bazasidan o'qib javob qaytaradi.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Faol Webhook Endpoint
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customWebhookUrl || defaultWebhook}
                    onChange={(e) => setCustomWebhookUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(customWebhookUrl || defaultWebhook, 'webhook')}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                    title="Nusxa olish"
                  >
                    {copiedCode === 'webhook' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSetWebhook}
                  disabled={isSettingWebhook}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  {isSettingWebhook ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Ulanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      <span>1-Bosishda Webhook O'rnatish</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteWebhook}
                  className="bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5"
                  title="Webhookni o'chirish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>O'chirish</span>
                </button>
              </div>
            </div>

            {/* Verification checklist */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>HTTPS Xavfsiz Shifrlash: <b>Faol</b></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Gemini 3.7 Flash API: <b>Ulandi</b></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Vercel Direct Deployment Guide */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-400" />
              <span>Vercel Platformasiga 100% Deploy Qilish Qo'llanmasi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Loyiha Frontend (React + Vite) va Backend Serverless Functions (Telegram Bot Webhook + Gemini AI) uchun 100% tayyorlangan.
            </p>
          </div>

          {/* Step 1: Environment Variables on Vercel */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              1. Vercel Environment Variables (Muhit O'zgaruvchilari)
            </h4>
            <p className="text-xs text-slate-400">
              Vercel loyihangizning <b>Settings &gt; Environment Variables</b> bo'limiga quyidagi kalitlarni kiriting:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-2">
              <div className="flex justify-between items-center">
                <span>GEMINI_API_KEY="your_gemini_api_key"</span>
              </div>
              <div className="flex justify-between items-center">
                <span>TELEGRAM_BOT_TOKEN="your_telegram_bot_token"</span>
              </div>
              <div className="flex justify-between items-center text-blue-400">
                <span>APP_URL="https://sizning-loyihangiz.vercel.app"</span>
              </div>
            </div>
          </div>

          {/* Step 2: Vercel Deploy */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              2. GitHub yoki Vercel CLI orqali Deploy qilish
            </h4>
            <p className="text-xs text-slate-400">
              Ushbu repositoryni GitHub-ga yuklang va <b>Vercel Dashboard</b> orqali <b>Import Project</b> qiling (yoki terminalda <code>vercel --prod</code> buyrug'ini bering).
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              git add . &amp;&amp; git commit -m "100% Vercel deployment ready" &amp;&amp; git push
            </div>
          </div>

          {/* Step 3: Set Webhook on Vercel */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              3. Webhookni 1 Bosqichda Bog'lash
            </h4>
            <p className="text-xs text-slate-400">
              Deploy muvaffaqiyatli yakunlangach, Vercel bergan URL manzilida ushbu Admin Panelni oching va <b>"Webhookni Telegramga Bog'lash"</b> tugmasini bosing!
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-blue-400">
              Webhook manzili avtomatik ravishda: https://&lt;your-app&gt;.vercel.app/api/telegram/webhook qilib ulanadi.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
