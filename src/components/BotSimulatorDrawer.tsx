import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  RotateCcw, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  MapPin, 
  Phone, 
  FileEdit,
  User,
  CheckCheck,
  Zap,
  Info
} from 'lucide-react';
import type { LearningCenterInfo } from '../types.ts';

interface BotSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  centerInfo: LearningCenterInfo;
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isAi?: boolean;
}

export const BotSimulatorDrawer: React.FC<BotSimulatorDrawerProps> = ({
  isOpen,
  onClose,
  centerInfo,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Assalomu alaykum! 🎓 <b>${centerInfo.name}</b> rasmiy intellektual botiga xush kelibsiz!\n\nBizning markazda:\n• Zamonaviy IT va Dasturlash kurslari\n• IELTS 7.5+ va Xorijiy tillar\n• UI/UX va Grafik dizayn\n\nQuyidagi tugmalardan birini tanlang yoki istalgan savolingizni yozing (masalan: <i>"Markaz ochilish vaqti"</i> yoki <i>"Frontend kursi qancha?"</i>).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/simulator/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          userName: 'Simulator User',
          userId: 'sim_user_live'
        })
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'bot',
        text: data.reply || "Kechirasiz, javob olishda xatolik yuz berdi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: data.isAi
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'bot',
          text: "Serverga ulanishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `m_init_${Date.now()}`,
        sender: 'bot',
        text: `Assalomu alaykum! 🎓 <b>${centerInfo.name}</b> rasmiy intellektual botiga xush kelibsiz!\n\nBizning markazda:\n• Zamonaviy IT va Dasturlash kurslari\n• IELTS 7.5+ va Xorijiy tillar\n• UI/UX va Grafik dizayn\n\nQuyidagi tugmalardan birini tanlang yoki istalgan savolingizni yozing (masalan: <i>"Markaz ochilish vaqti"</i> yoki <i>"Frontend kursi qancha?"</i>).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: false
      }
    ]);
  };

  const quickButtons = [
    { label: '⏰ Ish vaqti', query: '⏰ Ish vaqti' },
    { label: '📚 Kurslar & Narxlar', query: '📚 Kurslar va Narxlar' },
    { label: "👨‍🏫 O'qituvchilar", query: "👨‍🏫 O'qituvchilar" },
    { label: "📍 Manzil va Mo'ljal", query: "📍 Manzil va Mo'ljal" },
    { label: "✍️ Ro'yxatdan o'tish", query: "✍️ Ro'yxatdan o'tish" },
    { label: "📞 Bog'lanish", query: "📞 Bog'lanish" },
  ];

  const sampleQuestions = [
    "Markaz ochilish vaqti",
    "Markaz nechchida ochiladi?",
    "Python kursi narxi qancha?",
    "IELTS darslarini kim o'tadi?",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-[#0f172a] border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Telegram Header */}
        <div className="bg-[#1e293b] border-b border-slate-700/80 p-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm leading-none">{centerInfo.name}</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-blue-400 font-mono mt-1">bot (Gemini 3.7 Flash AI)</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleResetChat}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
              title="Chatni qayta boshlash"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telegram Chat Wallpaper Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b1120]">
          {/* Info pill */}
          <div className="flex justify-center">
            <span className="text-[10px] bg-slate-800/80 text-slate-400 px-3 py-1 rounded-full border border-slate-700/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Markaz bilimlar bazasiga ulangan Gemini AI</span>
            </span>
          </div>

          {/* Quick prompt suggestions */}
          <div className="flex flex-wrap gap-1.5 justify-center py-1">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[10px] bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800/60 px-2.5 py-1 rounded-full transition-all"
              >
                💬 "{q}"
              </button>
            ))}
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-md text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-[#1e293b] text-slate-100 border border-slate-700/80 rounded-bl-none'
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                  className="space-y-1"
                />

                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-300 opacity-80">
                  {msg.isAi && (
                    <span className="text-purple-300 flex items-center gap-0.5 mr-1">
                      <Sparkles className="w-2.5 h-2.5" /> AI
                    </span>
                  )}
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-200" />}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#1e293b] border border-slate-700/80 rounded-2xl rounded-bl-none p-3 text-xs text-slate-300 flex items-center space-x-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-slate-400 ml-1">EduBot AI javob yozmoqda...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Telegram Quick Reply Buttons Grid */}
        <div className="bg-[#1e293b]/90 border-t border-slate-800 p-2.5">
          <div className="grid grid-cols-2 gap-1.5">
            {quickButtons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(btn.query)}
                className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/70 text-[11px] font-medium py-1.5 px-2 rounded-lg transition-colors text-center truncate"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-[#1e293b] p-3 border-t border-slate-700/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Savolingizni yozing (masalan: Markaz ochilish vaqti)..."
              className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
