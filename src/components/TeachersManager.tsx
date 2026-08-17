import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Users, 
  Phone, 
  Award, 
  Check, 
  X,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import type { Teacher } from '../types.ts';

interface TeachersManagerProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Partial<Teacher>) => Promise<void>;
  onUpdateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  onDeleteTeacher: (id: string) => Promise<void>;
}

export const TeachersManager: React.FC<TeachersManagerProps> = ({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
}) => {
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormState: Partial<Teacher> = {
    name: '',
    subject: 'Frontend & Full-stack Dasturlash',
    experience: '4+ yil IT tajriba',
    degree: 'Senior Software Engineer',
    bio: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    phone: '+998 90 000 00 00',
    rating: 4.9,
    studentsCount: 150
  };

  const [formData, setFormData] = useState<Partial<Teacher>>(initialFormState);

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setIsCreating(true);
    setEditingTeacher(null);
    setError(null);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({ ...teacher });
    setIsCreating(false);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingTeacher(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingTeacher) {
        await onUpdateTeacher(editingTeacher.id, formData);
      } else {
        await onAddTeacher(formData);
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`"${name}" o'qituvchisini o'chirishni tasdiqlaysizmi?`)) {
      try {
        await onDeleteTeacher(id);
      } catch (err: any) {
        alert(err.message || "O'chirishda xatolik");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-400" />
            <span>O'qituvchilar va Mentorlar Tarkibi</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Ustozlar tajribasi, unvonlari va portfoliolari. Foydalanuvchilar Telegram botdan "O'qituvchilar kimlar?" deb so'raganda AI ushbu ma'lumotlarni taqdim etadi.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-purple-500/20 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi O'qituvchi Qo'shish</span>
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Photo & Actions */}
              <div className="relative mb-4">
                <img
                  src={teacher.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                  alt={teacher.name}
                  className="w-full h-48 object-cover rounded-xl border border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 flex space-x-1 bg-slate-950/80 backdrop-blur-sm p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => handleOpenEdit(teacher)}
                    className="p-1 text-slate-300 hover:text-blue-400 rounded transition-colors"
                    title="Tahrirlash"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id, teacher.name)}
                    className="p-1 text-slate-300 hover:text-red-400 rounded transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{teacher.rating}</span>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-base font-bold text-white mb-1">{teacher.name}</h3>
              <p className="text-xs font-semibold text-purple-400 mb-2">{teacher.subject}</p>

              <div className="space-y-1.5 text-xs text-slate-300 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{teacher.degree}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>{teacher.experience}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{teacher.studentsCount}+ o'quvchi tayyorlagan</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-3 mb-3">
                {teacher.bio}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{teacher.phone}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Dialog for Add & Edit Teacher */}
      {(isCreating || editingTeacher) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <span>{editingTeacher ? 'Ustozni Tahrirlash' : 'Yangi Ustoz Qo\'shish'}</span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ism va Familiya *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="Sanjarbek Aliyev"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fan / Yo'nalish *</label>
                  <input
                    type="text"
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="Frontend Dasturlash"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tajribasi</label>
                  <input
                    type="text"
                    value={formData.experience || ''}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="5+ yil tajriba"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Unvoni / Sertifikatlari</label>
                <input
                  type="text"
                  value={formData.degree || ''}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="IELTS 8.5 / Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Rasm URL (Photo)</label>
                <input
                  type="text"
                  value={formData.photoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Ma'lumot</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="O'qituvchining yutuqlari va o'qitish metodikasi..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bitiruvchilar soni</label>
                  <input
                    type="number"
                    value={formData.studentsCount || 0}
                    onChange={(e) => setFormData({ ...formData, studentsCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                    placeholder="250"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingTeacher ? 'Saqlash' : 'Qo\'shish'}</span>
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
