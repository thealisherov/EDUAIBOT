import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  Users, 
  Radio, 
  Sparkles, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import type { BroadcastMessage, TelegramBotConfig, BroadcastStats } from './types';

export default function App() {
  const [stats, setStats] = useState<BroadcastStats | null>(null);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [botConfig, setBotConfig] = useState<TelegramBotConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states for broadcasting
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Webhook settings modal
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);

  const fetchAllData = async () => {
    try {
      setError(null);
      const [statsRes, broadcastsRes, configRes] = await Promise.all([
        fetch('/api/stats').then(r => r.json()).catch(() => null),
        fetch('/api/broadcasts').then(r => r.json()).catch(() => null),
        fetch('/api/telegram/config').then(r => r.json()).catch(() => null),
      ]);

      if (statsRes) setStats(statsRes);
      if (broadcastsRes) setBroadcasts(broadcastsRes.broadcasts || broadcastsRes.data || []);
      if (configRes) setBotConfig(configRes.data || configRes);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Server bilan aloqa o'rnatishda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setFeedback({ type: 'error', message: "Xabar matnini kiritish majburiy!" });
      return;
    }

    setIsSending(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || undefined,
          message: message.trim(),
          imageUrl: imageUrl.trim() || undefined,
          buttonText: buttonText.trim() || undefined,
          buttonUrl: buttonUrl.trim() || undefined,
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Xabar yuborishda xatolik");

      setFeedback({
        type: 'success',
        message: `Ommaviy xabarnoma muvaffaqiyatli yuborildi!`
      });

      // Clear form
      setTitle('');
      setMessage('');
      setImageUrl('');
      setButtonText('');
      setButtonUrl('');

      fetchAllData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Xabar yuborishda xatolik yuz berdi" });
    } finally {
      setIsSending(false);
    }
  };

  const handleSetWebhook = async () => {
    const url = customWebhookUrl.trim() || `${window.location.origin}/api/telegram/webhook`;
    setIsSettingWebhook(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/telegram/set-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Webhook o'rnatishda xatolik");

      setFeedback({ type: 'success', message: "Webhook Telegram serveriga muvaffaqiyatli ulandi!" });
      setIsWebhookModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Xatolik yuz berdi" });
    } finally {
      setIsSettingWebhook(false);
    }
  };

  const handleDeleteWebhook = async () => {
    if (!window.confirm("Webhookni o'chirishni tasdiqlaysizmi?")) return;
    try {
      const res = await fetch('/api/telegram/delete-webhook', { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Xatolik");
      setFeedback({ type: 'success', message: "Webhook o'chirildi." });
      fetchAllData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Xatolik" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold text-slate-200">EDUAIBOT Broadcast Panel yuklanmoqda...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-white">EDUAIBOT</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Broadcast Center
                </span>
              </div>
              <p className="text-xs text-slate-400">Ommaviy Xabarnoma Yuborish Boshqaruv Paneli</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Telegram Bot Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
              <Bot className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-slate-200">{botConfig?.botUsername || '@testmarkaz123bot'}</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            {/* Webhook Button */}
            <button
              onClick={() => setIsWebhookModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Webhook</span>
              {botConfig?.isWebhookSet ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Alerts / Feedback */}
        {feedback && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            feedback.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{feedback.message}</span>
            </div>
            <button 
              onClick={() => setFeedback(null)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              Yopish
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bot Obunachilari</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats?.totalSubscribers || 0} ta</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Xabar yuboriladigan foydalanuvchilar</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Yuborilgan Postlar</p>
              <h3 className="text-2xl font-bold text-white mt-1">{broadcasts.length} ta</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Tarixdagi umumiy kampaniyalar</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Webhook Holati</p>
              <h3 className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Faol va Ulanishda
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Telegram Bot Webhook 100% Onlayn</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Broadcast Workspace: Composer + Live Telegram Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Composer Form (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-400" />
                  <span>Yangi Ommaviy Xabar Yaratish</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Barcha Telegram bot foydalanuvchilariga bir zumda yuborish</p>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Post Sarlavhasi (Ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Masalan: Yangi guruhlarga qabul boshlandi! 🚀 20% Chegirma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Xabar Matni <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={6}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Hurmatli talabgorlar! Yangi oy uchun Frontend, Python AI va IELTS guruhlariga ro'yxatga olish boshlandi. 25-sanagacha ro'yxatdan o'tganlarga 20% chegirma taqdim etiladi! 🎁"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  <span>Rasm Havolasi (URL - Ixtiyoriy)</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs"
                />
              </div>

              {/* Inline Action Button */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <LinkIcon className="w-4 h-4 text-indigo-400" />
                  <span>Telegram Inline Tugma (Ixtiyoriy)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tugma Matni</label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={e => setButtonText(e.target.value)}
                      placeholder="✍️ Ro'yxatdan o'tish"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tugma Havolasi (URL)</label>
                    <input
                      type="url"
                      value={buttonUrl}
                      onChange={e => setButtonUrl(e.target.value)}
                      placeholder="https://t.me/everest_admin"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Ommaviy Xabarni Barchaga Yuborish</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Live Telegram Preview (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Jonli Telegram Mockup</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Real-time Preview</span>
              </div>

              {/* Telegram Phone Screen Container */}
              <div className="flex-1 rounded-2xl bg-slate-950 p-4 border border-slate-800 flex flex-col justify-end min-h-[360px]">
                {/* Chat Bubble */}
                <div className="bg-[#182533] text-slate-100 rounded-2xl rounded-bl-sm p-4 shadow-lg max-w-[95%] space-y-3 self-start border border-[#2b5278]/30">
                  {/* Photo if provided */}
                  {imageUrl ? (
                    <div className="rounded-xl overflow-hidden max-h-48 border border-white/10">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : null}

                  {/* Title & Message */}
                  <div className="space-y-1 text-xs sm:text-[13px] leading-relaxed">
                    {title ? (
                      <div className="font-bold text-blue-300 text-sm">{title}</div>
                    ) : null}
                    <div className="whitespace-pre-wrap text-slate-200">
                      {message || "Bu yerda siz yozgan ommaviy xabarnoma matni ko'rinadi..."}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-[10px] text-slate-400 text-right font-mono">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {/* Inline Button if provided */}
                  {buttonText ? (
                    <div className="pt-2 border-t border-white/10">
                      <div className="w-full py-2 px-3 rounded-xl bg-[#2b5278]/80 hover:bg-[#2b5278] text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-sm">
                        <span>{buttonText}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Broadcast History Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Yuborilgan Xabarnomalar Tarixi</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Avval yuborilgan barcha broadcast postlar ro'yxati</p>
            </div>
            <button
              onClick={fetchAllData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Yangilash"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {broadcasts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <MessageSquare className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p className="text-sm">Hozircha hech qanday ommaviy xabarnoma yuborilmagan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {broadcasts.map(b => (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{b.title || "Ommaviy Xabarnoma"}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Yetkazildi
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{b.message}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {new Date(b.sentAt).toLocaleString('uz-UZ', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs self-end sm:self-center">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-300">
                      Muvaffaqiyatli: <b className="text-emerald-400">{b.successCount}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Webhook Modal */}
      {isWebhookModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span>Telegram Webhook Sozlamalari</span>
              </h3>
              <button
                onClick={() => setIsWebhookModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Telegram botingiz Vercel-dagi serverless backend orqali xabarlarni qabul qilishi uchun Webhookni ulab qo'ying:
              </p>
              <div>
                <label className="block font-bold text-slate-400 mb-1">Webhook URL</label>
                <input
                  type="url"
                  value={customWebhookUrl}
                  onChange={e => setCustomWebhookUrl(e.target.value)}
                  placeholder={`${window.location.origin}/api/telegram/webhook`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {botConfig?.isWebhookSet ? (
                <button
                  type="button"
                  onClick={handleDeleteWebhook}
                  className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold"
                >
                  Webhookni uzish
                </button>
              ) : <div></div>}

              <button
                type="button"
                onClick={handleSetWebhook}
                disabled={isSettingWebhook}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-1.5"
              >
                {isSettingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Webhookni Bog'lash</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
