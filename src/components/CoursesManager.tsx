import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  Clock, 
  Calendar, 
  GraduationCap,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { Course, Teacher } from '../types.ts';

interface CoursesManagerProps {
  courses: Course[];
  teachers: Teacher[];
  onAddCourse: (course: Partial<Course>) => Promise<void>;
  onUpdateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  onDeleteCourse: (id: string) => Promise<void>;
}

export const CoursesManager: React.FC<CoursesManagerProps> = ({
  courses,
  teachers,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormState: Partial<Course> = {
    title: '',
    category: 'it',
    price: 800000,
    duration: '6 oy',
    lessonDuration: '1.5 soat (Haftada 3 kun)',
    schedule: 'Dush-Chor-Juma 14:00 - 15:30',
    description: '',
    topics: ['Mavzu 1', 'Mavzu 2'],
    level: "Boshlang'ichdan professionalgacha",
    teacherId: teachers[0]?.id || '',
    isActive: true,
    icon: 'code'
  };

  const [formData, setFormData] = useState<Partial<Course>>(initialFormState);
  const [topicsInput, setTopicsInput] = useState('');

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setTopicsInput('HTML5 & CSS3, JavaScript ES6+, React.js, Tailwind CSS');
    setIsCreating(true);
    setEditingCourse(null);
    setError(null);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({ ...course });
    setTopicsInput(course.topics.join(', '));
    setIsCreating(false);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingCourse(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const topicsArray = topicsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      topics: topicsArray
    };

    try {
      if (editingCourse) {
        await onUpdateCourse(editingCourse.id, payload);
      } else {
        await onAddCourse(payload);
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`"${title}" kursini o'chirishni tasdiqlaysizmi?`)) {
      try {
        await onDeleteCourse(id);
      } catch (err: any) {
        alert(err.message || "O'chirishda xatolik");
      }
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search and Create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Kurslar & Narxlar Boshqaruvi</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Kurs nomlari, oylik to'lovlari, dars soatlari va o'qituvchilar biriktirilishi (Telegram bot real vaqtda o'qiydi).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-emerald-500/20 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Kurs Qo'shish</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kurs nomi yoki mavzusi bo'yicha qidirish..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'it', label: 'IT & Dasturlash' },
            { id: 'languages', label: 'Xorijiy Tillar' },
            { id: 'design', label: 'Dizayn' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === tab.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const teacher = teachers.find(t => t.id === course.teacherId);
          return (
            <div
              key={course.id}
              className={`bg-slate-900 border ${course.isActive ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-70'} rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all`}
            >
              <div>
                {/* Top Badge & Actions */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    course.category === 'it' 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : course.category === 'languages'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {course.category === 'it' ? 'IT & Dasturlash' : course.category === 'languages' ? 'Xorijiy Tillar' : 'Dizayn'}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Course Title & Price */}
                <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 mb-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Oylik to'lov:</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{course.priceFormatted}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Davomiyligi:</span>
                    <span className="text-slate-200 font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Dars davomiyligi:</span>
                    <span className="text-slate-300">{course.lessonDuration}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {course.description}
                </p>

                {/* Topics Pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {course.topics.slice(0, 3).map((topic, i) => (
                    <span key={i} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60">
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 3 && (
                    <span className="text-[11px] text-slate-500 self-center">
                      +{course.topics.length - 3} ta
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom: Teacher & Status */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <GraduationCap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="text-slate-300 truncate">
                    {teacher ? teacher.name : "Ustoz biriktirilmagan"}
                  </span>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  course.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  {course.isActive ? 'Faol' : 'Nofaol'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Dialog for Add & Edit */}
      {(isCreating || editingCourse) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>{editingCourse ? 'Kursni Tahrirlash' : 'Yangi Kurs Qo\'shish'}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kurs Nomi *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Masalan: Python Backend & AI Dasturlash"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategoriya</label>
                  <select
                    value={formData.category || 'it'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="it">IT & Dasturlash</option>
                    <option value="languages">Xorijiy Tillar</option>
                    <option value="design">Dizayn</option>
                    <option value="math">Matematika & SAT</option>
                    <option value="other">Boshqa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Oylik Narxi (UZS) *</label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="850000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Davomiyligi (oy/hafta)</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="6 oy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dars Vaqti (davomiyligi)</label>
                  <input
                    type="text"
                    value={formData.lessonDuration || ''}
                    onChange={(e) => setFormData({ ...formData, lessonDuration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="1.5 soat (Haftada 3 kun)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dars Jadvali / Kunlari</label>
                  <input
                    type="text"
                    value={formData.schedule || ''}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Dush-Chor-Juma: 14:00 - 15:30 / 18:30 - 20:00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">O'qituvchi Biriktirish</label>
                  <select
                    value={formData.teacherId || ''}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Biriktirilmagan</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Darajasi</label>
                  <input
                    type="text"
                    value={formData.level || ''}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Boshlang'ichdan Junior darajagacha"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Asosiy O'rganiladigan Mavzular (vergul bilan)</label>
                  <input
                    type="text"
                    value={topicsInput}
                    onChange={(e) => setTopicsInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="React, Next.js, TypeScript, Tailwind, REST API"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Batafsil Tavsif</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Kurs haqida to'liq ma'lumot..."
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActiveCourse"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-800"
                  />
                  <label htmlFor="isActiveCourse" className="text-xs text-slate-300 cursor-pointer">
                    Ushbu kurs faol va Telegram bot orqali tavsiya etilsin
                  </label>
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
                  className="px-6 py-2 rounded-xl text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingCourse ? 'O\'zgarishlarni Saqlash' : 'Kursni Qo\'shish'}</span>
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
