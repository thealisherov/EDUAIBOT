import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Building2, 
  Settings, 
  History, 
  Radio,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import type { TelegramBotConfig } from '../types.ts';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  centerName?: string;
  botConfig: TelegramBotConfig | null;
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  centerName = "EVEREST IT & Language Academy",
  botConfig,
  onOpenSimulator,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Boshqaruv Paneli', icon: Building2 },
    { id: 'center', label: 'Markaz Bazasi', icon: Settings },
    { id: 'courses', label: 'Kurslar & Narxlar', icon: BookOpen },
    { id: 'teachers', label: 'O\'qituvchilar', icon: GraduationCap },
    { id: 'users', label: 'Lidlar & O\'quvchilar', icon: Users },
    { id: 'broadcast', label: 'Ommaviy Xabar', icon: Send },
    { id: 'logs', label: 'AI Chat Tarixi', icon: History },
    { id: 'telegram', label: 'Telegram & Webhook', icon: Radio },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-base sm:text-lg tracking-tight">EduBot AI</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">{centerName}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            {/* Telegram Bot status pill */}
            <div 
              onClick={() => onTabChange('telegram')}
              className="hidden md:flex items-center gap-2 bg-slate-950/80 hover:bg-slate-950 border border-slate-800/90 px-3.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${botConfig?.token ? 'bg-emerald-400 ring-2 ring-emerald-400/20' : 'bg-blue-400'}`}></div>
              <span className="text-slate-300 font-mono font-medium">{botConfig?.botUsername || '@edubot_assistant'}</span>
            </div>

            {/* Test in Simulator Button */}
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Botni Sinash</span>
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Tabs in Bento style */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
