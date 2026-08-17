import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Download, 
  Check, 
  X, 
  Calendar,
  Sparkles,
  ExternalLink,
  FileSpreadsheet
} from 'lucide-react';
import type { BotUser, Course } from '../types.ts';

interface UsersManagerProps {
  users: BotUser[];
  courses: Course[];
  onAddUser: (user: Partial<BotUser>) => Promise<void>;
  onUpdateUser: (id: string, user: Partial<BotUser>) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
}

export const UsersManager: React.FC<UsersManagerProps> = ({
  users,
  courses,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<BotUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<BotUser>>({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '+998 90 ',
    status: 'new',
    interestedCourseTitle: courses[0]?.title || '',
    notes: ''
  });

  const handleOpenCreate = () => {
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      phoneNumber: '+998 90 ',
      status: 'new',
      interestedCourseTitle: courses[0]?.title || '',
      notes: ''
    });
    setIsCreating(true);
    setEditingUser(null);
  };

  const handleOpenEdit = (user: BotUser) => {
    setEditingUser(user);
    setFormData({ ...user });
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await onUpdateUser(editingUser.id, formData);
      } else {
        await onAddUser(formData);
      }
      setIsCreating(false);
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`"${name}" foydalanuvchisini o'chirishni tasdiqlaysizmi?`)) {
      try {
        await onDeleteUser(id);
      } catch (err: any) {
        alert(err.message || "O'chirishda xatolik");
      }
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Telegram ID", "Ism Familiya", "Username", "Telefon", "Holat", "Qiziqqan kursi", "Ro'yxatdan o'tgan sana", "Izoh"];
    const rows = users.map(u => [
      u.id,
      u.telegramId,
      `"${u.firstName} ${u.lastName || ''}"`,
      `"@${u.username || ''}"`,
      `"${u.phoneNumber || ''}"`,
      u.status,
      `"${u.interestedCourseTitle || ''}"`,
      u.registeredAt,
      `"${(u.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `edubot_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      user.firstName.toLowerCase().includes(term) ||
      (user.lastName && user.lastName.toLowerCase().includes(term)) ||
      (user.username && user.username.toLowerCase().includes(term)) ||
      (user.phoneNumber && user.phoneNumber.includes(term)) ||
      String(user.telegramId).includes(term);

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-400" />
            <span>Foydalanuvchilar va Lidlar Bazasi</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Telegram bot orqali bog'langan yoki ro'yxatdan o'tgan talabgorlar ro'yxati (CRM).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV Eksport</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Lid Qo'shish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ism, telefon, username yoki Telegram ID bo'yicha qidiruv..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `Barchasi (${users.length})` },
            { id: 'new', label: `Yangi (${users.filter(u => u.status === 'new').length})` },
            { id: 'contacted', label: `Bog'lanildi (${users.filter(u => u.status === 'contacted').length})` },
            { id: 'enrolled', label: `Yozildi (${users.filter(u => u.status === 'enrolled').length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Talabgor</th>
                <th className="py-3 px-4">Aloqa & Telegram</th>
                <th className="py-3 px-4">Qiziqqan Kursi</th>
                <th className="py-3 px-4">Holat (Status)</th>
                <th className="py-3 px-4">Xabarlar</th>
                <th className="py-3 px-4">Ro'yxat vaqti</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white text-sm">
                      {user.firstName} {user.lastName || ''}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>ID:</span>
                      <span className="font-mono text-slate-400">{user.telegramId}</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">
                        {user.source === 'telegram_bot' ? 'TG Bot' : user.source === 'simulator' ? 'Simulator' : 'Manual'}
                      </span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-200 font-medium">
                      {user.phoneNumber || <span className="text-slate-400 italic">Mavjud emas</span>}
                    </div>
                    {user.username ? (
                      <a 
                        href={`https://t.me/${user.username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline text-xs inline-flex items-center gap-1"
                      >
                        @{user.username}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Usernamesiz</span>
                    )}
                  </td>

                  {/* Course Interested */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-medium text-slate-200 truncate">
                      {user.interestedCourseTitle || 'Umumiy konsultatsiya'}
                    </div>
                    {user.notes && (
                      <div className="text-[11px] text-amber-400/90 truncate mt-0.5 italic">
                        📝 {user.notes}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'enrolled'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : user.status === 'contacted'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : user.status === 'cancelled'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {user.status === 'enrolled' ? 'Kursga yozildi' : user.status === 'contacted' ? 'Bog\'lanildi' : user.status === 'cancelled' ? 'Bekor qilindi' : 'Yangi lid'}
                    </span>
                  </td>

                  {/* Messages count */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user.messagesCount || 1} ta</span>
                    </div>
                  </td>

                  {/* Registered At */}
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {new Date(user.registeredAt).toLocaleDateString('uz-UZ', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.firstName)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Hech qanday talabgor topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Dialog for Add & Edit User */}
      {(isCreating || editingUser) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>{editingUser ? 'Lid Ma\'lumotlarini Yangilash' : 'Yangi Lid Qo\'shish'}</span>
              </h3>
              <button
                onClick={() => { setIsCreating(false); setEditingUser(null); }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ism *</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Bobur"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Familiya</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Karimov"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Telefon Raqami</label>
                  <input
                    type="text"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Telegram Username</label>
                  <input
                    type="text"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.replace('@', '') })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="bobur_dev"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Holati (Status)</label>
                  <select
                    value={formData.status || 'new'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="new">Yangi lid</option>
                    <option value="contacted">Bog'lanildi</option>
                    <option value="enrolled">Kursga yozildi</option>
                    <option value="cancelled">Bekor qilindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Qiziqqan Kursi</label>
                  <select
                    value={formData.interestedCourseTitle || ''}
                    onChange={(e) => setFormData({ ...formData, interestedCourseTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Tanlanmagan</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Izoh / Admin Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Mijoz bilan suhbat xulosasi, sinov darsi vaqti..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingUser(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingUser ? 'Saqlash' : 'Qo\'shish'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
