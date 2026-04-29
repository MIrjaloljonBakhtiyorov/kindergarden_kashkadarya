import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffFormSchema, StaffFormValues } from '../schemas/staffForm.schema';
import { UserCircle, Smartphone, ArrowRight, FileText, GraduationCap, Briefcase, Calendar, Upload } from 'lucide-react';
import { useStaff } from '../hooks/useStaff';
import { useGroups } from '../../groups/hooks/useGroups';
import { useNotification } from '../../../context/NotificationContext';

interface Props {
  staffMember?: any;
  onClose: () => void;
}

export const StaffFormModal: React.FC<Props> = ({ staffMember, onClose }) => {
  const { createStaff, updateStaff } = useStaff();
  const { groups } = useGroups();
  const { showNotification } = useNotification();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: (staffMember ? {
      full_name: staffMember.full_name,
      position: staffMember.position,
      phone: staffMember.phone,
      email: staffMember.email || '',
      passport_no: staffMember.passport_no,
      birth_date: staffMember.birth_date || '',
      education: staffMember.education || '',
      experience_years: staffMember.experience_years?.toString() || '',
      group_id: staffMember.group_id || '',
      status: staffMember.status as StaffFormValues['status']
    } : { 
      status: 'ACTIVE', 
      group_id: '',
      full_name: '',
      position: '',
      phone: '',
      passport_no: '',
      birth_date: '',
      education: '',
      experience_years: ''
    }) as StaffFormValues
  });

  const onSubmit = async (data: StaffFormValues) => {
    try {
      if (staffMember) {
        await updateStaff(staffMember.id, data);
      } else {
        await createStaff(data);
      }
      showNotification('Muvaffaqiyatli saqlandi!', 'success');
      onClose();
    } catch (error) {
      showNotification('Xatolik yuz berdi', 'error');
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 relative">
      <div className="border-b border-brand-border flex items-center justify-between pb-6 mb-8">
        <div>
          <h3 className="text-2xl font-black text-brand-depth">
            {staffMember ? 'Xodimni tahrirlash' : 'Yangi xodim kiritish'}
          </h3>
          <p className="text-xs text-brand-slate uppercase font-bold tracking-wider mt-1">Ma'lumotlar butunligi nazoratda</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Shaxsiy ma'lumotlar */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-brand-primary border-b border-brand-primary/10 pb-2">
            <UserCircle size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wider">Xodimning shaxsiy ma'lumotlari</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">F.I.Sh *</label>
              <input {...register('full_name')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" />
              {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Lavozimi *</label>
              <input {...register('position')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" />
              {errors.position && <p className="text-red-500 text-xs">{errors.position.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Tug'ilgan sana *</label>
              <div className="relative">
                <input type="date" {...register('birth_date')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" />
                <Calendar className="absolute right-4 top-3 text-brand-slate" size={18} />
              </div>
              {errors.birth_date && <p className="text-red-500 text-xs">{errors.birth_date.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Passport ma'lumotlari *</label>
              <div className="relative">
                <input 
                  {...register('passport_no')} 
                  className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" 
                  placeholder="AA1234567"
                />
                <FileText className="absolute right-4 top-3.5 text-brand-slate" size={18} />
              </div>
              {errors.passport_no && <p className="text-red-500 text-xs">{errors.passport_no.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Passport PDF yuklash</label>
              <div className="relative">
                <input 
                  type="file"
                  accept=".pdf"
                  {...register('passport_pdf')}
                  className="hidden"
                  id="passport-upload"
                />
                <label 
                  htmlFor="passport-upload"
                  className="w-full bg-slate-50 border-2 border-dashed border-brand-border rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-brand-primary/5 hover:border-brand-primary transition-all text-sm font-bold text-brand-slate"
                >
                  <Upload size={16} /> PDF Faylni tanlang
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Ta'lim va Tajriba */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-brand-primary border-b border-brand-primary/10 pb-2">
            <GraduationCap size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wider">Ta'lim va Ish tajribasi</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Qayerda o'qigan (Oliy/O'rta maxsus) *</label>
              <div className="relative">
                <input {...register('education')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="Masalan: Qarshi Davlat Universiteti" />
                <GraduationCap className="absolute right-4 top-3.5 text-brand-slate" size={18} />
              </div>
              {errors.education && <p className="text-red-500 text-xs">{errors.education.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Ish staji (yil) *</label>
              <div className="relative">
                <input type="number" {...register('experience_years')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="5" />
                <Briefcase className="absolute right-4 top-3.5 text-brand-slate" size={18} />
              </div>
              {errors.experience_years && <p className="text-red-500 text-xs">{errors.experience_years.message}</p>}
            </div>
          </div>
        </div>

        {/* Aloqa va Guruh */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-brand-primary border-b border-brand-primary/10 pb-2">
            <Smartphone size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wider">Aloqa va Biriktirish</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Telefon raqami *</label>
              <input {...register('phone')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none" placeholder="+998 90 123 45 67" />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Guruhi</label>
              <select {...register('group_id')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none appearance-none">
                <option value="">Guruhni tanlang (ixtiyoriy)</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-brand-border">
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-3 rounded-xl border border-brand-border text-brand-slate font-bold hover:bg-slate-50 transition-colors">Bekor qilish</button>
          <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-10 py-3 rounded-xl bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2">
            {staffMember ? 'Saqlash' : 'Kiritish'} <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
