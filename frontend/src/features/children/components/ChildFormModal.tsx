import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { childFormSchema, ChildFormValues } from '../schemas/childForm.schema';
import { UserCircle, Smartphone, ArrowRight, FileText, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { useChildren } from '../hooks/useChildren';
import { useGroups } from '../../groups/hooks/useGroups';
import { useNotification } from '../../../context/NotificationContext';

interface Props {
  child?: any;
  onClose: () => void;
}

export const ChildFormModal: React.FC<Props> = ({ child, onClose }) => {
  const { createChild, updateChild } = useChildren();
  const { groups } = useGroups();
  const { showNotification } = useNotification();
  const [credentials, setCredentials] = useState<{login: string, password: string} | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ChildFormValues>({
    resolver: zodResolver(childFormSchema),
    defaultValues: child ? {
      first_name: child.first_name,
      last_name: child.last_name,
      birth_date: child.birth_date,
      age_category: child.age_category,
      gender: child.gender,
      address: child.address || '',
      weight: child.weight?.toString() || '',
      height: child.height?.toString() || '',
      allergies: child.allergies || '',
      passport_info: child.passport_info || '',
      birth_certificate_number: child.birth_certificate_number,
      medical_notes: child.medical_notes,
      group_id: child.group_id,
      father_full_name: child.father_name,
      father_workplace: child.father_workplace || '',
      father_phone: child.father_phone,
      father_passport: child.father_passport || '',
      mother_full_name: child.mother_name,
      mother_workplace: child.mother_workplace || '',
      mother_phone: child.mother_phone,
      mother_passport: child.mother_passport || '',
      parent_login: child.parent_login || '',
      status: child.status
    } : { status: 'PENDING', gender: 'M', passport_info: '', address: '', weight: '', height: '', allergies: '', father_passport: '', mother_passport: '', father_workplace: '', mother_workplace: '', parent_login: '' }
  });

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= 7) {
      showNotification('Ma\'lumotlaringiz yuklandi', 'success');
    }
  };

  const onSubmit = async (data: ChildFormValues) => {
    try {
      const status = child ? data.status : 'PENDING';
      if (child) {
        await updateChild(child.id, { ...data, status });
        showNotification('Muvaffaqiyatli yangilandi!', 'success');
        onClose();
      } else {
        const result = await createChild({ ...data, status });
        setCredentials(result);
        showNotification('Bola muvaffaqiyatli kiritildi!', 'success');
      }
    } catch (error) {
      showNotification('Xatolik yuz berdi', 'error');
    }
  };

  if (credentials) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 text-center space-y-8 p-10">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
           <CheckCircle2 size={40} />
        </div>
        <div>
          <h3 className="text-3xl font-black text-brand-depth">Muvaffaqiyatli yaratildi!</h3>
          <p className="text-brand-muted font-bold mt-2 uppercase tracking-widest text-xs">Ota-ona uchun kirish ma'lumotlari</p>
        </div>
        
        <div className="bg-slate-50 border-2 border-dashed border-brand-border rounded-[2rem] p-8 space-y-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Lock size={80} />
           </div>
           <div className="relative z-10 grid grid-cols-1 gap-4">
              <div className="space-y-1">
                 <span className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Login</span>
                 <div className="text-2xl font-mono font-black text-brand-primary tracking-tight bg-white border border-brand-border py-4 rounded-2xl shadow-sm">
                    {credentials.login}
                 </div>
              </div>
              <div className="space-y-1">
                 <span className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Parol</span>
                 <div className="text-2xl font-mono font-black text-brand-depth tracking-tight bg-white border border-brand-border py-4 rounded-2xl shadow-sm">
                    {credentials.password}
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-[11px] font-bold leading-relaxed border border-amber-100">
           DIQQAT! Ushbu parolni saqlab qoling yoki ota-onaga taqdim eting. 
           Xavfsizlik yuzasidan bu ma'lumot faqat bir marta ko'rsatiladi.
        </div>

        <button 
          onClick={onClose}
          className="w-full py-5 bg-brand-depth text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-brand-depth/90 transition-all active:scale-95"
        >
          Tushunarli
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 relative">
      <div className="border-b border-brand-border flex items-center justify-between pb-6 mb-8">
        <div>
          <h3 className="text-2xl font-black text-brand-depth">
            {child ? 'Bolani tahrirlash' : 'Yangi bola kiritish'}
          </h3>
          <p className="text-xs text-brand-slate uppercase font-bold tracking-wider mt-1">Ma'lumotlar butunligi nazoratda</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-brand-primary border-b border-brand-primary/10 pb-2">
            <UserCircle size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wider">Bolaning shaxsiy ma'lumotlari</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Ism (F.I.Sh) *</label>
              <input {...register('first_name')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" />
              {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Otasining ismi *</label>
              <input {...register('last_name')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" />
              {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Tug'ilgan sana *</label>
              <input 
                type="date" 
                {...register('birth_date')} 
                min="1970-01-01"
                max="2040-12-31"
                className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" 
              />
              {errors.birth_date && <p className="text-red-500 text-xs">{errors.birth_date.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Yosh kategoriyasi *</label>
              <select {...register('age_category')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none appearance-none">
                <option value="1-3 yosh">1 - 3 yosh</option>
                <option value="3-7 yosh">3 - 7 yosh</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Guruhi *</label>
              <select {...register('group_id')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none appearance-none">
                <option value="">Guruhni tanlang</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              {errors.group_id && <p className="text-red-500 text-xs">{errors.group_id.message}</p>}
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Turar joyi (Manzil) *</label>
              <input {...register('address')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="Viloyat, tuman, mahalla, ko'cha, uy" />
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Jinsi</label>
              <div className="flex gap-4">
                <label className="flex-1 bg-slate-50 border border-brand-border rounded-xl py-3 px-4 flex items-center gap-2 cursor-pointer hover:bg-white transition-colors">
                  <input type="radio" value="M" {...register('gender')} className="accent-brand-primary" />
                  <span className="text-sm font-medium">O'g'il</span>
                </label>
                <label className="flex-1 bg-slate-50 border border-brand-border rounded-xl py-3 px-4 flex items-center gap-2 cursor-pointer hover:bg-white transition-colors">
                  <input type="radio" value="F" {...register('gender')} className="accent-brand-primary" />
                  <span className="text-sm font-medium">Qiz</span>
                </label>
              </div>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Profil logini (Ixtiyoriy, avtomatik yaratiladi)</label>
              <div className="relative">
                <input 
                  {...register('parent_login')} 
                  className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" 
                  placeholder="masalan: mirjalol2020"
                />
                <ShieldCheck className="absolute right-4 top-3.5 text-brand-slate" size={18} />
              </div>
              {errors.parent_login && <p className="text-red-500 text-xs">{errors.parent_login.message}</p>}
              <p className="text-[10px] text-brand-muted italic mt-1">Agar bo'sh qolsa, tizim bolaning ismi va tug'ilgan yili asosida login yaratadi.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-brand-primary border-b border-brand-primary/10 pb-2">
            <FileText size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wider">Hujjat ma'lumotlari</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Tug'ilganlik guvohnomasi № *</label>
              <input {...register('birth_certificate_number')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" />
              {errors.birth_certificate_number && <p className="text-red-500 text-xs">{errors.birth_certificate_number.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Passport ma'lumotlari (ixtiyoriy)</label>
              <div className="relative">
                <input 
                  {...register('passport_info')} 
                  onChange={(e) => {
                    register('passport_info').onChange(e);
                    handlePassportChange(e);
                  }}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" 
                  placeholder="AB1234567"
                />
                <FileText className="absolute right-4 top-3.5 text-brand-slate" size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-brand-primary border-b border-brand-primary/10 pb-2">
            <Smartphone size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wider">Ota-ona ma'lumotlari</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Otasining ismi (F.I.Sh) *</label>
              <input {...register('father_full_name')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Otasining telefon raqami *</label>
              <input 
                {...register('father_phone')} 
                className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none" 
                placeholder="+998 90 123 45 67"
                onFocus={(e) => {
                  if (!e.target.value) e.target.value = '+998';
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val.startsWith('+998')) {
                    e.target.value = '+998';
                  }
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Otasining ishlash joyi</label>
              <input {...register('father_workplace')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none" placeholder="Korxona yoki tashkilot nomi" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Otasining passporti</label>
              <input {...register('father_passport')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none" placeholder="AA1234567" />
            </div>
            <div className="border-b md:col-span-2 border-brand-primary/5 my-2"></div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Onasining ismi (F.I.Sh) *</label>
              <input {...register('mother_full_name')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Onasining telefon raqami *</label>
              <input 
                {...register('mother_phone')} 
                className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none" 
                placeholder="+998 90 123 45 67"
                onFocus={(e) => {
                  if (!e.target.value) e.target.value = '+998';
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val.startsWith('+998')) {
                    e.target.value = '+998';
                  }
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Onasining ishlash joyi</label>
              <input {...register('mother_workplace')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none" placeholder="Korxona yoki tashkilot nomi" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Onasining passporti</label>
              <input {...register('mother_passport')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none" placeholder="AA1234567" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-brand-border">
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-3 rounded-xl border border-brand-border text-brand-slate font-bold hover:bg-slate-50 transition-colors">Bekor qilish</button>
          <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-10 py-3 rounded-xl bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2">
            Ma'lumotlarni saqlash <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
