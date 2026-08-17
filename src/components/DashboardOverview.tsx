import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  MapPin, 
  Phone, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Zap,
  Bot,
  Radio,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  Calendar
} from 'lucide-react';
import type { 
  LearningCenterInfo, 
  Course, 
  Teacher, 
  BotUser, 
  CenterStats, 
  BotMessageLog, 
  TelegramBotConfig 
} from '../types.ts';

interface DashboardOverviewProps {
  stats: CenterStats | null;
  centerInfo: LearningCenterInfo;
  courses: Course[];
  teachers: Teacher[];
  users: BotUser[];
  logs: BotMessageLog[];
  botConfig: TelegramBotConfig | null;
  onNavigate: (tab: string) => void;
  onOpenSimulator: () => void;
  onTestPrompt: (prompt: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  centerInfo,
  courses,
  teachers,
  users,
  logs,
  botConfig,
  onNavigate,
  onOpenSimulator,
  onTestPrompt,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const samplePrompts = [
    "Markaz ochilish vaqti",
    "Markaz nechchida ochiladi?",
    "Frontend kursi narxi qancha?",
    "IELTS kursini kim o'tadi?",
    "Yakshanba kuni ishlaysizmi?",
    "Manzilingiz va mo'ljalingiz qayerda?",
  ];

  const handleTestPrompt = async (promptText: string) => {
    setQuickPrompt(promptText);
    setIsAnswering(true);
    setQuickAnswer(null);

    try {
      const res = await fetch('/api/simulator/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: promptText, userName: 'Admin Bento Test' })
      });
      const data = await res.json();
      if (data.reply) {
        setQuickAnswer(data.reply);
      } else {
        setQuickAnswer("Javob olinmadi.");
      }
    } catch {
      setQuickAnswer("Xatolik yuz berdi. Serverga ulanishni tekshiring.");
    } finally {
      setIsAnswering(false);
    }
  };

  // Check if center is currently open
  const checkIsOpenNow = () => {
    try {
      const now = new Date();
      const [openHour, openMin] = (centerInfo.openingTime || '08:00').split(':').map(Number);
      const [closeHour, closeMin] = (centerInfo.closingTime || '20:00').split(':').map(Number);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const openMinutes = openHour * 60 + (openMin || 0);
      const closeMinutes = closeHour * 60 + (closeMin || 0);
      return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    } catch {
      return true;
    }
  };

  const isOpenNow = checkIsOpenNow();

  return (
    <div id="bento-dashboard-container" className="space-y-5">
      {/* Bento Grid: Row 1 - Main Center Hero Card & Telegram Bot Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hero Bento Card (Span 8) */}
        <div 
          id="bento-card-hero"
          className="lg:col-span-8 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xl hover:border-slate-700/80 transition-all group"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-105 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div>
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Gemini 3.7 Flash AI Boshqaruvi
                </span>
                
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isOpenNow 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  {isOpenNow ? "Hozirda Ochiq" : "Hozirda Yopiq"} ({centerInfo.openingTime} - {centerInfo.closingTime})
                </span>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {centerInfo.name}
              </h1>
              <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
                {centerInfo.tagline}
              </p>
            </div>

            {/* Micro Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] text-slate-400 block font-medium">Ish vaqti</span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {centerInfo.openingTime} - {centerInfo.closingTime}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] text-slate-400 block font-medium">Manzil & Mo'ljal</span>
                  <span className="text-xs font-semibold text-white truncate block" title={centerInfo.address}>
                    {centerInfo.landmark || centerInfo.address}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] text-slate-400 block font-medium">Bog'lanish</span>
                  <span className="text-xs font-semibold text-white truncate block font-mono">
                    {centerInfo.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
              <button
                id="btn-open-simulator-hero"
                onClick={onOpenSimulator}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Bot className="w-4 h-4" />
                <span>Telegram Botni Sinash</span>
              </button>

              <button
                id="btn-broadcast-hero"
                onClick={() => onNavigate('broadcast')}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Ommaviy Xabar</span>
              </button>

              <button
                id="btn-center-settings-hero"
                onClick={() => onNavigate('center')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-colors ml-auto"
              >
                <span>Markaz Sozlamalari</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Telegram Bot Live Status Bento Card (Span 4) */}
        <div 
          id="bento-card-bot-status"
          className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700/80 transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Telegram Bot & Vercel</h3>
                  <p className="text-[11px] text-slate-400">Jonli integratsiya holati</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between">
                <span className="text-slate-400">Bot Username:</span>
                <span className="font-semibold text-blue-400 font-mono">
                  {botConfig?.botUsername || '@edubot_assistant_bot'}
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between">
                <span className="text-slate-400">AI Avto-javob:</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Faol (Gemini 3.7)
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between">
                <span className="text-slate-400">Webhook / Ulanish:</span>
                <span className="text-slate-200 font-medium">
                  {botConfig?.isWebhookSet ? 'Webhook O\'rnatilgan' : 'Tayyor / Faol'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <button
              onClick={() => onNavigate('telegram')}
              className="flex-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 py-2.5 px-3 rounded-xl text-xs font-medium transition-all text-center"
            >
              Sozlamalar
            </button>
            <button
              onClick={onOpenSimulator}
              className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 py-2.5 px-3 rounded-xl text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Sinov</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid: Row 2 - KPI Metrics (4 Bento Tiles) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bento Stat 1: Total Users / Leads */}
        <div 
          id="bento-stat-users"
          onClick={() => onNavigate('users')}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800/90 p-5 rounded-3xl shadow-md hover:border-slate-700/90 hover:scale-[1.01] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jami Foydalanuvchilar</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {stats?.totalUsers ?? users.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12% bu oy
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ro'yxatdan o'tgan barcha lidlar</p>
        </div>

        {/* Bento Stat 2: AI Dialogues & Messages */}
        <div 
          id="bento-stat-messages"
          onClick={() => onNavigate('logs')}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800/90 p-5 rounded-3xl shadow-md hover:border-slate-700/90 hover:scale-[1.01] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Xabarlar</span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {stats?.totalMessages ?? logs.length}
            </span>
            <span className="text-xs text-indigo-400 font-medium">Gemini AI</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avtomatik javob qaytarildi</p>
        </div>

        {/* Bento Stat 3: Active Courses */}
        <div 
          id="bento-stat-courses"
          onClick={() => onNavigate('courses')}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800/90 p-5 rounded-3xl shadow-md hover:border-slate-700/90 hover:scale-[1.01] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mavjud Kurslar</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {courses.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium">yo'nalishlar</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">IT, Tillar, Dizayn narxlar bilan</p>
        </div>

        {/* Bento Stat 4: Teachers */}
        <div 
          id="bento-stat-teachers"
          onClick={() => onNavigate('teachers')}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800/90 p-5 rounded-3xl shadow-md hover:border-slate-700/90 hover:scale-[1.01] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">O'qituvchilar</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {teachers.length}
            </span>
            <span className="text-xs text-purple-400 font-medium">Tajribali ustoz</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Markaz mentorlar tarkibi</p>
        </div>
      </div>

      {/* Bento Grid: Row 3 - Interactive AI Knowledge Query Console & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive AI Query Box Bento Card (Span 8) */}
        <div 
          id="bento-card-ai-tester"
          className="lg:col-span-8 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Tezkor AI Sinov Maydoni (Gemini 3.7 Flash)</h2>
                  <p className="text-xs text-slate-400">Markaz ma'lumotlarini qanday o'qib javob berishini shu yerdan tekshiring</p>
                </div>
              </div>
              <span className="text-xs bg-slate-950 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 font-mono inline-flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                Markaz Bilimlar Bazasi Ulangan
              </span>
            </div>

            {/* Quick sample prompt pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTestPrompt(prompt)}
                  className="text-xs bg-slate-950/80 hover:bg-blue-600/20 hover:border-blue-500/40 text-slate-300 hover:text-blue-300 border border-slate-800 px-3 py-1.5 rounded-xl transition-all text-left flex items-center gap-1.5"
                >
                  <span className="text-blue-400">💬</span>
                  <span>"{prompt}"</span>
                </button>
              ))}
            </div>

            {/* Custom prompt input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (quickPrompt.trim()) handleTestPrompt(quickPrompt);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Masalan: Markaz ochilish vaqti nechchida? yoki Python kursi narxi..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isAnswering || !quickPrompt.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap shadow-md shadow-blue-500/25"
              >
                {isAnswering ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>O'ylamoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Savol berish</span>
                  </>
                )}
              </button>
            </form>

            {/* AI Answer Box */}
            {quickAnswer && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-blue-500/30 text-sm animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-400 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    <span>EduBot AI Javobi:</span>
                  </div>
                  <button
                    onClick={() => onTestPrompt(quickPrompt)}
                    className="text-[11px] text-slate-400 hover:text-white underline flex items-center gap-1"
                  >
                    Bot oynasida to'liq sinash <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">{quickAnswer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Broadcast / Ommaviy Xabar Bento Card (Span 4) */}
        <div 
          id="bento-card-quick-broadcast"
          className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700/80 transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Ommaviy Xabar</h3>
                  <p className="text-[11px] text-slate-400">Barcha a'zolarga e'lon</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                {users.length} qabul qiluvchi
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Yangi guruhlar ochilishi, maxsus chegirmalar yoki muhim e'lonlarni barcha Telegram bot foydalanuvchilariga bir zumda yuboring.
            </p>

            <div className="space-y-2 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>🎯 Maqsadli guruh:</span>
                <span className="text-slate-200 font-semibold">Barcha Ro'yxatdan O'tganlar</span>
              </div>
              <div className="flex items-center justify-between">
                <span>⚡ Yetkazish tezligi:</span>
                <span className="text-emerald-400 font-semibold">Tezkor (1-2 soniya)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <button
              onClick={() => onNavigate('broadcast')}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-2xl text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Xabar Yuborish Paneli</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid: Row 4 - Recent Registered Leads & Center Knowledge Base Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Registered Users / Leads (Span 8) */}
        <div 
          id="bento-card-leads"
          className="lg:col-span-8 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 shadow-xl hover:border-slate-700/80 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">So'nggi Ro'yxatdan O'tganlar (Lidlar)</h2>
                <p className="text-xs text-slate-400">Telegram bot orqali murojaat qilgan yangi o'quvchilar</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('users')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
            >
              <span>Barchasi ({users.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3.5 rounded-l-xl">Foydalanuvchi</th>
                  <th className="py-3 px-3.5">Telefon / Telegram</th>
                  <th className="py-3 px-3.5">Qiziqqan kursi</th>
                  <th className="py-3 px-3.5">Holat</th>
                  <th className="py-3 px-3.5 rounded-r-xl">Vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-white">{user.firstName} {user.lastName || ''}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {user.telegramId}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-mono text-slate-200">{user.phoneNumber || 'Kiritilmagan'}</div>
                      {user.username && <div className="text-blue-400 text-[11px]">@{user.username}</div>}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="text-slate-300 font-medium truncate block max-w-[180px]">
                        {user.interestedCourseTitle || 'Umumiy ma\'lumot'}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        user.status === 'enrolled'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : user.status === 'contacted'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {user.status === 'enrolled' ? 'Kursga yozildi' : user.status === 'contacted' ? 'Bog\'lanildi' : 'Yangi lid'}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-400">
                      {new Date(user.registeredAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Center Knowledge Base Quick Summary Bento Card (Span 4) */}
        <div 
          id="bento-card-knowledge"
          className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700/80 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Markaz Bazasi</h2>
              </div>
              <button
                onClick={() => onNavigate('center')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sozlash
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5 font-medium">Ish vaqti:</span>
                <span className="text-white font-bold">{centerInfo.openingTime} dan {centerInfo.closingTime} gacha</span>
                <p className="text-slate-400 text-[11px] mt-0.5">{centerInfo.workDays}</p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5 font-medium">Manzil va Mo'ljal:</span>
                <span className="text-white font-semibold block truncate">{centerInfo.address}</span>
                <span className="text-emerald-400 text-[11px] mt-0.5 block truncate">📍 {centerInfo.landmark}</span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5 font-medium">Kurslar soni & Narxlar:</span>
                <span className="text-white font-semibold">{courses.length} ta yo'nalish</span>
                <p className="text-blue-400 text-[11px] mt-0.5">O'rtacha 650,000 - 950,000 so'm / oy</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('center')}
            className="w-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 py-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>Barcha ma'lumotlarni tahrirlash</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
