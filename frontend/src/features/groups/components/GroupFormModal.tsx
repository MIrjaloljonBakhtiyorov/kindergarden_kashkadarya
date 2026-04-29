import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupFormSchema, GroupFormValues } from '../schemas/groupForm.schema';
import { motion } from 'motion/react';
import { Group } from '../types/group.types';
import { useNotification } from '../../../context/NotificationContext';

interface Props {
  group?: Group;
  onClose: () => void;
  onSubmit: (data: GroupFormValues) => Promise<void>;
}

export const GroupFormModal: React.FC<Props> = ({ group, onClose, onSubmit }) => {
  const { showNotification } = useNotification();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: group ? {
      name: group.name,
      teacher_name: group.teacher_name,
      capacity: group.capacity,
      age_limit: group.age_limit
    } : { capacity: 25, age_limit: '3-7 yosh' }
  });

  const handleFormSubmit = async (data: GroupFormValues) => {
    try {
      await onSubmit(data);
      showNotification(group ? 'Guruh muvaffaqiyatli tahrirlandi!' : 'Guruh muvaffaqiyatli yaratildi!', 'success');
      onClose();
    } catch (error) {
      showNotification('Xatolik yuz berdi', 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 bg-black/5">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl border border-brand-border"
      >
        <div>
          <h3 className="text-xl font-black text-brand-depth">{group ? 'Guruhni tahrirlash' : 'Yangi guruh yarating'}</h3>
          <p className="text-xs text-brand-muted mt-1 uppercase font-bold tracking-widest">Guruh parametrlarini kiriting</p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brand-muted uppercase ml-1 tracking-widest">Guruh nomi</label>
            <input {...register('name')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-bold text-sm" placeholder="Masalan: Shaffoflar" />
            {errors.name && <p className="text-red-500 text-[10px] font-bold">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brand-muted uppercase ml-1 tracking-widest">Mas'ul tarbiyachi</label>
            <input {...register('teacher_name')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-bold text-sm" placeholder="F.I.Sh" />
            {errors.teacher_name && <p className="text-red-500 text-[10px] font-bold">{errors.teacher_name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1 tracking-widest">Kvota (Soni)</label>
              <input type="number" {...register('capacity', { valueAsNumber: true })} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-bold text-sm" placeholder="25" />
              {errors.capacity && <p className="text-red-500 text-[10px] font-bold">{errors.capacity.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1 tracking-widest">Yosh chegarasi</label>
              <select {...register('age_limit')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none appearance-none font-bold text-sm">
                 <option value="1-3 yosh">1-3 yosh</option>
                 <option value="3-7 yosh">3-7 yosh</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-brand-border rounded-2xl font-black text-brand-muted hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest">Bekor qilish</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all uppercase text-[10px] tracking-widest">
              {group ? 'Saqlash' : 'Guruhni yaratish'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
