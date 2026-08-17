import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { DashboardOverview } from './components/DashboardOverview.tsx';
import { CenterInfoManager } from './components/CenterInfoManager.tsx';
import { CoursesManager } from './components/CoursesManager.tsx';
import { TeachersManager } from './components/TeachersManager.tsx';
import { UsersManager } from './components/UsersManager.tsx';
import { BroadcastManager } from './components/BroadcastManager.tsx';
import { TelegramConfigManager } from './components/TelegramConfigManager.tsx';
import { LogsManager } from './components/LogsManager.tsx';
import { BotSimulatorDrawer } from './components/BotSimulatorDrawer.tsx';
import { Bot, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import type { 
  LearningCenterInfo, 
  Course, 
  Teacher, 
  BotUser, 
  BroadcastMessage, 
  BotMessageLog, 
  TelegramBotConfig, 
  DashboardStats 
} from './types.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulatorInitialPrompt, setSimulatorInitialPrompt] = useState<string | undefined>();

  // Application Data States
  const [centerInfo, setCenterInfo] = useState<LearningCenterInfo | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [users, setUsers] = useState<BotUser[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [logs, setLogs] = useState<BotMessageLog[]>([]);
  const [botConfig, setBotConfig] = useState<TelegramBotConfig | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all initial data from server
  const fetchAllData = async () => {
    try {
      setError(null);
      const [
        statsRes,
        centerRes,
        coursesRes,
        teachersRes,
        usersRes,
        broadcastsRes,
        logsRes,
        configRes
      ] = await Promise.all([
        fetch('/api/stats').then(r => r.json()).catch(() => null),
        fetch('/api/center-info').then(r => r.json()).catch(() => null),
        fetch('/api/courses').then(r => r.json()).catch(() => null),
        fetch('/api/teachers').then(r => r.json()).catch(() => null),
        fetch('/api/users').then(r => r.json()).catch(() => null),
        fetch('/api/broadcasts').then(r => r.json()).catch(() => null),
        fetch('/api/logs').then(r => r.json()).catch(() => null),
        fetch('/api/telegram/config').then(r => r.json()).catch(() => null),
      ]);

      if (statsRes) {
        setStats(statsRes.stats || statsRes);
      }
      if (centerRes) {
        setCenterInfo(centerRes.data || centerRes.centerInfo || centerRes);
      }
      if (coursesRes) {
        const rawCourses = coursesRes.data || coursesRes.courses || coursesRes;
        setCourses(Array.isArray(rawCourses) ? rawCourses : []);
      }
      if (teachersRes) {
        const rawTeachers = teachersRes.data || teachersRes.teachers || teachersRes;
        setTeachers(Array.isArray(rawTeachers) ? rawTeachers : []);
      }
      if (usersRes) {
        const rawUsers = usersRes.data || usersRes.users || usersRes;
        setUsers(Array.isArray(rawUsers) ? rawUsers : []);
      }
      if (broadcastsRes) {
        const rawBroadcasts = broadcastsRes.data || broadcastsRes.broadcasts || broadcastsRes;
        setBroadcasts(Array.isArray(rawBroadcasts) ? rawBroadcasts : []);
      }
      if (logsRes) {
        const rawLogs = logsRes.data || logsRes.logs || logsRes;
        setLogs(Array.isArray(rawLogs) ? rawLogs : []);
      }
      if (configRes) {
        setBotConfig(configRes.data || configRes.config || configRes);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Server bilan aloqa o'rnatishda xatolik yuz berdi. Iltimos qayta yuklang.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handlers for Center Info
  const handleSaveCenterInfo = async (updated: LearningCenterInfo) => {
    const res = await fetch('/api/center-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "Saqlashda xatolik");
    if (data.data) setCenterInfo(data.data);
    fetchAllData();
  };

  // Handlers for Courses
  const handleAddCourse = async (course: Partial<Course>) => {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "Kurs qo'shishda xatolik");
    fetchAllData();
  };

  const handleUpdateCourse = async (id: string, course: Partial<Course>) => {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "Tahrirlashda xatolik");
    fetchAllData();
  };

  const handleDeleteCourse = async (id: string) => {
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "O'chirishda xatolik");
    fetchAllData();
  };

  // Handlers for Teachers
  const handleAddTeacher = async (teacher: Partial<Teacher>) => {
    const res = await fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacher)
    });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "O'qituvchi qo'shishda xatolik");
    fetchAllData();
  };

  const handleUpdateTeacher = async (id: string, teacher: Partial<Teacher>) => {
    const res = await fetch(`/api/teachers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacher)
    });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "Tahrirlashda xatolik");
    fetchAllData();
  };

  const handleDeleteTeacher = async (id: string) => {
    const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "O'chirishda xatolik");
    fetchAllData();
  };

  // Handlers for Users
  const handleAddUser = async (user: Partial<BotUser>) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "Lid qo'shishda xatolik");
    fetchAllData();
  };

  const handleUpdateUser = async (id: string, user: Partial<BotUser>) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "Lid yangilashda xatolik");
    fetchAllData();
  };

  const handleDeleteUser = async (id: string) => {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "O'chirishda xatolik");
    fetchAllData();
  };

  // Broadcast
  const handleSendBroadcast = async (payload: {
    title: string;
    message: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    targetFilter: 'all' | 'new' | 'contacted' | 'enrolled';
  }) => {
    const res = await fetch('/api/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success && data.error) throw new Error(data.error || "Xabar yuborishda xatolik");
    fetchAllData();
  };

  // Telegram Config
  const handleUpdateTelegramConfig = async (data: { token?: string; autoReplyWithAI?: boolean }) => {
    const res = await fetch('/api/telegram/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!resData.success) throw new Error(resData.error || "Tokenni yangilashda xatolik");
    setBotConfig(resData.data);
    fetchAllData();
  };

  const handleSetWebhook = async (url: string) => {
    const res = await fetch('/api/telegram/set-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Webhook o'rnatishda xatolik");
    setBotConfig(data.data);
    fetchAllData();
  };

  const handleDeleteWebhook = async () => {
    const res = await fetch('/api/telegram/delete-webhook', { method: 'POST' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Webhookni o'chirishda xatolik");
    setBotConfig(data.data);
    fetchAllData();
  };

  const handleClearLogs = async () => {
    const res = await fetch('/api/logs/clear', { method: 'POST' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Xatolik");
    setLogs([]);
    fetchAllData();
  };

  const handleTestInBot = (prompt: string) => {
    setSimulatorInitialPrompt(prompt);
    setIsSimulatorOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold text-slate-200">EduBot AI Admin Panel yuklanmoqda...</h2>
        <p className="text-xs text-slate-400 mt-1">O'quv markazi ma'lumotlar bazasi va Gemini AI ulanmoqda</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white pb-20 sm:pb-12">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        centerName={centerInfo?.name}
        botConfig={botConfig}
        onOpenSimulator={() => {
          setSimulatorInitialPrompt(undefined);
          setIsSimulatorOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchAllData}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold rounded-lg transition-colors"
            >
              Qayta urinish
            </button>
          </div>
        )}

        {/* Dynamic Views */}
        {activeTab === 'dashboard' && stats && centerInfo && (
          <DashboardOverview
            stats={stats}
            centerInfo={centerInfo}
            courses={courses}
            teachers={teachers}
            users={users}
            logs={logs}
            botConfig={botConfig}
            onNavigate={setActiveTab}
            onOpenSimulator={() => {
              setSimulatorInitialPrompt(undefined);
              setIsSimulatorOpen(true);
            }}
            onTestPrompt={handleTestInBot}
          />
        )}

        {activeTab === 'center' && centerInfo && (
          <CenterInfoManager
            centerInfo={centerInfo}
            onSave={handleSaveCenterInfo}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesManager
            courses={courses}
            teachers={teachers}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        )}

        {activeTab === 'teachers' && (
          <TeachersManager
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
          />
        )}

        {activeTab === 'broadcast' && (
          <BroadcastManager
            broadcasts={broadcasts}
            users={users}
            botConfig={botConfig}
            onSendBroadcast={handleSendBroadcast}
          />
        )}

        {activeTab === 'users' && (
          <UsersManager
            users={users}
            courses={courses}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === 'telegram' && (
          <TelegramConfigManager
            config={botConfig}
            onUpdateConfig={handleUpdateTelegramConfig}
            onSetWebhook={handleSetWebhook}
            onDeleteWebhook={handleDeleteWebhook}
          />
        )}

        {activeTab === 'logs' && (
          <LogsManager
            logs={logs}
            onClearLogs={handleClearLogs}
          />
        )}
      </main>

      {/* Floating Action Button for Bot Simulator */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setSimulatorInitialPrompt(undefined);
            setIsSimulatorOpen(true);
          }}
          className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-3.5 rounded-full font-semibold shadow-xl shadow-blue-500/30 hover:scale-105 transition-all"
        >
          <Bot className="w-5 h-5" />
          <span className="text-sm">Telegram Botni Sinash</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      {/* Live Telegram Bot Simulator Drawer */}
      {centerInfo && (
        <BotSimulatorDrawer
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          centerInfo={centerInfo}
          initialPrompt={simulatorInitialPrompt}
        />
      )}
    </div>
  );
}
