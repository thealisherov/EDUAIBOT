import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  MapPin, 
  Phone, 
  Send, 
  Sparkles, 
  Save, 
  Check, 
  AlertCircle,
  Globe,
  Instagram,
  FileText
} from 'lucide-react';
import type { LearningCenterInfo } from '../types.ts';

interface CenterInfoManagerProps {
  centerInfo: LearningCenterInfo;
  onUpdate: (updated: LearningCenterInfo) => Promise<void>;
}

export const CenterInfoManager: React.FC<CenterInfoManagerProps> = ({
  centerInfo,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<LearningCenterInfo>({ ...centerInfo });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof LearningCenterInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await onUpdate(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Saqlashda xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-500" />
            <span>O'quv Markazi Ma'lumotlari & AI Bilimlar Bazasi</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Bu yerdagi har bir o'zgarish darhol Gemini AI botining bilimlar bazasiga o'tadi va barcha savollarga yangi ma'lumotlar bilan javob beradi.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all whitespace-nowrap"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saqlanmoqda...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saqlandi!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>O'zgarishlarni Saqlash</span>
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Barcha ma'lumotlar muvaffaqiyatli saqlandi va Telegram AI bot bilimlar bazasi yangilandi!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Asosiy Ma'lumotlar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>1. Asosiy Markaz Identifikatsiyasi</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Markaz Nomi *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="EVEREST IT & Language Academy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Shior / Qisqa Ta'rif
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Zamonaviy kasblar va xorijiy tillar akademiyasi"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Markaz Haqida To'liq Tavsif
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="O'quv markazi tarixi, afzalliklari, yutuqlari..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Ish Vaqti & Manzil (User specifically requested: ochilib yopilishi, manzil) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>2. Ish Vaqti, Ochilish/Yopilish & Manzil</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ⏰ Ochilish Vaqti *
              </label>
              <input
                type="text"
                value={formData.openingTime}
                onChange={(e) => handleChange('openingTime', e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                placeholder="08:00"
              />
              <p className="text-[11px] text-slate-400 mt-1">Masalan: 08:00 (ertalab)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                🌙 Yopilish Vaqti *
              </label>
              <input
                type="text"
                value={formData.closingTime}
                onChange={(e) => handleChange('closingTime', e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                placeholder="20:00"
              />
              <p className="text-[11px] text-slate-400 mt-1">Masalan: 20:00 (kechqurun)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                🗓 Ish Kunlari
              </label>
              <input
                type="text"
                value={formData.workDays}
                onChange={(e) => handleChange('workDays', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="Dushanba - Shanba (Yakshanba dam olish)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                🏢 To'liq Manzil
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Toshkent sh., Yunusobod t., Amir Temur ko'chasi 45-uy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                🎯 Mo'ljal (Landmark)
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => handleChange('landmark', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Mega Planet yonida, 3-qavat (Metro: Shahriston)"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Aloqa & Ijtimoiy Tarmoqlar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>3. Aloqa Telefonlari & Ijtimoiy Tarmoqlar</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Asosiy Telefon
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                placeholder="+998 71 200 45 45"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Qo'shimcha Telefon
              </label>
              <input
                type="text"
                value={formData.phoneSecondary}
                onChange={(e) => handleChange('phoneSecondary', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                placeholder="+998 90 999 88 77"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Telegram Administrator
              </label>
              <input
                type="text"
                value={formData.telegramUsername}
                onChange={(e) => handleChange('telegramUsername', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="@everest_admin"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Telegram Kanal Havolasi
              </label>
              <input
                type="text"
                value={formData.channelUrl}
                onChange={(e) => handleChange('channelUrl', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="https://t.me/everest_academy_uz"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Instagram Havolasi
              </label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="https://instagram.com/everest_academy_uz"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Veb-sayt
              </label>
              <input
                type="text"
                value={formData.websiteUrl}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="https://everest-academy.uz"
              />
            </div>
          </div>
        </div>

        {/* Section 4: AI Maxsus Ko'rsatmalari (Gemini System Context) */}
        <div className="bg-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">4. Gemini AI Maslahatchisi Uchun Maxsus Ko'rsatmalar (Prompt Context)</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Bu yerga markazingizga xos qoidalar, chegirmalar, bepul sinov darslari yoki o'quvchilarga yetkazilishi kerak bo'lgan maxsus ma'lumotlarni yozing.
          </p>

          <textarea
            value={formData.aiPromptContext}
            onChange={(e) => handleChange('aiPromptContext', e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-indigo-900/40 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
            placeholder="Markazimizda birinchi dars bepul. To'liq to'lov qilganga 10% chegirma beriladi..."
          />
        </div>

        {/* Save button bottom */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>O'zgarishlarni Saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
};
