import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Bot, 
  User, 
  Sparkles, 
  Clock, 
  Filter,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import type { BotMessageLog } from '../types.ts';

interface LogsManagerProps {
  logs: BotMessageLog[];
  onClearLogs: () => Promise<void>;
}

export const LogsManager: React.FC<LogsManagerProps> = ({
  logs,
  onClearLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'telegram' | 'simulator'>('all');

  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      log.text.toLowerCase().includes(term) ||
      log.userName.toLowerCase().includes(term) ||
      String(log.telegramId).includes(term);

    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const handleClear = async () => {
    if (window.confirm("Barcha chat yozuvlari va audit jurnalini tozalashni tasdiqlaysizmi?")) {
      try {
        await onClearLogs();
      } catch (err: any) {
        alert(err.message || "Tozalashda xatolik");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-indigo-400" />
            <span>Chat Tarixi & AI Audit Jurnali</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Foydalanuvchilarning barcha savollari va Gemini AI tomonidan qaytarilgan intellektual javoblar arxivi.
          </p>
        </div>

        <button
          onClick={handleClear}
          disabled={logs.length === 0}
          className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 disabled:opacity-40 px-4 py-2 rounded-xl text-xs font-medium transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Jurnalni Tozalash</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Xabar matni, ism yoki Telegram ID bo'yicha qidiruv..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
          />
        </div>

        <div className="flex gap-2">
          {[
            { id: 'all', label: `Barchasi (${logs.length})` },
            { id: 'telegram', label: `Telegram (${logs.filter(l => l.source === 'telegram').length})` },
            { id: 'simulator', label: `Simulator (${logs.filter(l => l.source === 'simulator').length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSourceFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                sourceFilter === tab.id
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`p-4 rounded-xl border transition-all ${
              log.sender === 'bot'
                ? 'bg-slate-950/80 border-slate-800/80'
                : 'bg-blue-950/20 border-blue-900/30'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  log.sender === 'bot'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {log.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-semibold text-white">{log.userName}</span>
                  <span className="text-[11px] text-slate-400 ml-2">ID: {log.telegramId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {log.isAiGenerated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    <Sparkles className="w-2.5 h-2.5" />
                    Gemini AI
                  </span>
                )}
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md border border-slate-700">
                  {log.source === 'telegram' ? 'Real Telegram' : 'Simulator'}
                </span>
                <span className="text-[11px] text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed pl-9">
              {log.text}
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            Hech qanday chat jurnali topilmadi.
          </div>
        )}
      </div>
    </div>
  );
};
