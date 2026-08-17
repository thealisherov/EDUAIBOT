import React, { useState } from 'react';
import { 
  Send, 
  Users, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Filter,
  Eye,
  Bot,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import type { BroadcastMessage, BotUser, TelegramBotConfig } from '../types.ts';

interface BroadcastManagerProps {
  broadcasts: BroadcastMessage[];
  users: BotUser[];
  botConfig: TelegramBotConfig | null;
  onSendBroadcast: (data: {
    title: string;
    message: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    targetFilter: 'all' | 'new' | 'contacted' | 'enrolled';
  }) => Promise<void>;
}

export const BroadcastManager: React.FC<BroadcastManagerProps> = ({
  broadcasts,
  users,
  botConfig,
  onSendBroadcast,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [targetFilter, setTargetFilter] = useState<'all' | 'new' | 'contacted' | 'enrolled'>('all');
  
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetUsersCount = targetFilter === 'all' 
    ? users.length 
    : users.filter(u => u.status === targetFilter).length;

  const handleTemplateInsert = (type: 'discount' | 'course_start' | 'open_doors') => {
    if (type === 'discount') {
      setTitle("🔥 25% MAXSUS CHEGIRMA! Faqat 3 kun");
      setMessage("Hurmatli o'quvchilar! EVEREST Academy yangi guruhlari uchun 25% chegirma e'lon qiladi.\n\nFrontend, Python Backend va IELTS kurslariga hoziroq ro'yxatdan o'ting va qulay narxda zamonaviy kasb egasiga aylaning!");
      setImageUrl("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80");
      setButtonText("✍️ Ro'yxatdan o'tish");
      setButtonUrl("https://t.me/everest_admin");
    } else if (type === 'course_start') {
      setTitle("🚀 Yangi Dasturlash Guruhiga Qabul!");
      setMessage("Dushanba kunidan boshlab 'Python & AI Backend' kursi bo'yicha yangi noldan boshlanuvchi guruh start oladi.\n\n🗓 Dars kunlari: Sesh-Pay-Shanba 18:30\n👨‍🏫 Ustoz: Jasur Toshmatov (4+ yil tajriba)\n\nJoyingizni band qilish uchun adminga yozing.");
      setImageUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80");
      setButtonText("📞 Administratorga yozish");
      setButtonUrl("https://t.me/everest_admin");
    } else {
      setTitle("🎉 Ochiq Eshiklar Kuni — Bepul Masterklass");
      setMessage("Shanba kuni soat 14:00 da markazimizda '2026-yilda IT va AI sohalari' mavzusida bepul ochiq masterklass bo'lib o'tadi.\n\nBarcha qiziquvchilarni kutamiz! Manzil: Amir Temur 45, Mega Planet ro'parasi.");
      setImageUrl("https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80");
      setButtonText("📍 Manzilni xaritada ko'rish");
      setButtonUrl("https://maps.google.com");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Xabar matnini kiritish majburiy");
      return;
    }

    setIsSending(true);
    setError(null);
    setSendSuccess(false);

    try {
      await onSendBroadcast({
        title: title.trim(),
        message: message.trim(),
        imageUrl: imageUrl.trim() || undefined,
        buttonText: buttonText.trim() || undefined,
        buttonUrl: buttonUrl.trim() || undefined,
        targetFilter
      });

      setSendSuccess(true);
      setTitle('');
      setMessage('');
      setImageUrl('');
      setButtonText('');
      setButtonUrl('');
      setTimeout(() => setSendSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Xabar yuborishda xatolik yuz berdi");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Send className="w-6 h-6 text-emerald-400" />
              <span>Ommaviy Xabar Yuborish Paneli (Broadcast)</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Telegram bot orqali ro'yxatdan o'tgan barcha talabgorlarga bir vaqtda e'lonlar, aksiyalar va xabarlar jo'natish.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">Auditoriya: <b>{users.length} ta</b> foydalanuvchi</span>
          </div>
        </div>
      </div>

      {sendSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>Ommaviy xabar muvaffaqiyatli jo'natildi va barcha foydalanuvchilarga yetkazildi!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Composer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Yangi Xabar Yaratish</h3>
            
            {/* Quick Templates */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Shablonlar:</span>
              <button
                type="button"
                onClick={() => handleTemplateInsert('discount')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 px-2 py-1 rounded border border-slate-700"
              >
                Chegirma
              </button>
              <button
                type="button"
                onClick={() => handleTemplateInsert('course_start')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-purple-300 px-2 py-1 rounded border border-slate-700"
              >
                Yangi guruh
              </button>
              <button
                type="button"
                onClick={() => handleTemplateInsert('open_doors')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-300 px-2 py-1 rounded border border-slate-700"
              >
                Masterklass
              </button>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            {/* Target Audience Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-blue-400" />
                  <span>Kimlarga yuborilsin?</span>
                </span>
                <span className="text-slate-400 text-[11px]">
                  Qamrov: <b>{targetUsersCount} nafar</b> foydalanuvchi
                </span>
              </label>
              <select
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">Barcha ro'yxatdan o'tganlarga ({users.length} ta)</option>
                <option value="new">Faqat yangi lidlarga ({users.filter(u => u.status === 'new').length} ta)</option>
                <option value="contacted">Bog'lanilgan talabgorlarga ({users.filter(u => u.status === 'contacted').length} ta)</option>
                <option value="enrolled">Kursga yozilgan talabalarga ({users.filter(u => u.status === 'enrolled').length} ta)</option>
              </select>
            </div>

            {/* Title / Headline */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Xabar Sarlavhasi (Ixtiyoriy)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: 🚀 Yangi Python AI guruhi start olmoqda!"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Xabar Matni (Telegram formati) *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                placeholder="Xabarnoma matnini kiriting. HTML teglari (<b>qalin</b>, <i>kursiv</i>) qo'llab-quvvatlanadi..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>Rasm Havolasi (Image URL - ixtiyoriy)</span>
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Inline Button (Text + URL) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tugma Matni</span>
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="✍️ Ro'yxatdan o'tish"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tugma Havolasi (URL)
                </label>
                <input
                  type="text"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  placeholder="https://t.me/everest_admin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Send Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/25 transition-all text-sm"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Xabarlar yuborilmoqda ({targetUsersCount} ta)...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Xabarni barcha {targetUsersCount} ta foydalanuvchiga yuborish</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Telegram Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Eye className="w-4 h-4 text-blue-400" />
                <span>Telegramda Qanday Ko'rinadi:</span>
              </div>
              <span className="text-[11px] text-slate-500">Live Preview</span>
            </div>

            {/* Realistic Telegram Message Balloon */}
            <div className="bg-[#0f172a] rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
              <div className="bg-[#1e293b] rounded-2xl p-4 text-slate-100 max-w-sm mx-auto shadow-md border border-slate-700/60">
                {imageUrl && (
                  <div className="mb-3 rounded-xl overflow-hidden max-h-48 border border-slate-700">
                    <img 
                      src={imageUrl} 
                      alt="Broadcast preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                )}

                {title && (
                  <h4 className="font-bold text-sm text-white mb-2 leading-snug">
                    📢 {title}
                  </h4>
                )}

                <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed mb-3">
                  {message || "Bu yerda siz kiritgan xabar matni Telegramdagi kabi real vaqtda ko'rinadi..."}
                </p>

                {buttonText && (
                  <div className="pt-2 border-t border-slate-700/80">
                    <div className="bg-blue-600/90 text-center text-xs text-white font-medium py-2 rounded-xl border border-blue-500 flex items-center justify-center gap-1.5 shadow-sm">
                      <span>{buttonText}</span>
                    </div>
                  </div>
                )}

                <div className="text-right text-[10px] text-slate-400 mt-1">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats / Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Xabar yetkazib berish tizimi</span>
            </div>
            <p>
              Xabar Telegram Bot API orqali barcha faol suhbatdoshlarga ketma-ket yuboriladi. Telegram tokeni ulanmagan bo'lsa xabar simulyator foydalanuvchilarining audit jurnaliga saqlanadi.
            </p>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Yuborilgan Xabarnomalar Tarixi ({broadcasts.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Sarlavha & Matn</th>
                <th className="py-2.5 px-3">Auditoriya</th>
                <th className="py-2.5 px-3">Yuborildi</th>
                <th className="py-2.5 px-3">Holat</th>
                <th className="py-2.5 px-3">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {broadcasts.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-semibold text-white truncate">{b.title || 'Ommaviy xabar'}</div>
                    <div className="text-[11px] text-slate-400 truncate">{b.message}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="capitalize text-slate-300 font-medium">{b.targetFilter}</span>
                    <div className="text-[10px] text-slate-500">{b.targetCount} ta qabul qiluvchi</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-400">
                    {b.successCount} ta muvaffaqiyatli
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Yetkazildi
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                    {new Date(b.sentAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {broadcasts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Hozircha ommaviy xabarnomalar yuborilmagan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
