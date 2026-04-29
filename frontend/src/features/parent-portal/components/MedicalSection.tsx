import React from 'react';
import { Activity, Heart, ShieldAlert, FileText, Target } from 'lucide-react';
import { motion } from 'motion/react';

export const MedicalSection = ({ parentData }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-10">
     {/* Stats */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-brand-border shadow-sm flex items-center gap-6 md:gap-10 hover:border-brand-primary transition-all">
           <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0"><Activity size={32} /></div>
           <div>
              <p className="text-[9px] md:text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Bo'yi</p>
              <h4 className="text-4xl md:text-5xl font-black text-blue-700 tracking-tighter">{parentData.height || '--'} <span className="text-xl font-bold opacity-60">cm</span></h4>
           </div>
        </div>
        <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-brand-border shadow-sm flex items-center gap-6 md:gap-10 hover:border-rose-500 transition-all">
           <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0"><Heart size={32} /></div>
           <div>
              <p className="text-[9px] md:text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Vazni</p>
              <h4 className="text-4xl md:text-5xl font-black text-rose-700 tracking-tighter">{parentData.weight || '--'} <span className="text-xl font-bold opacity-60">kg</span></h4>
           </div>
        </div>
     </div>
     
     {/* Allergies */}
     <div className="bg-amber-50 p-8 md:p-12 rounded-[2rem] md:rounded-[4rem] border-2 border-amber-100 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldAlert size={80} className="text-amber-600" /></div>
        <div className="relative z-10 space-y-4 md:space-y-6">
           <div className="flex items-center gap-4">
              <ShieldAlert size={20} md:size={24} className="text-amber-500" />
              <h5 className="text-lg md:text-2xl font-black text-amber-950 tracking-tight">Allergiya va Taqiqlar</h5>
           </div>
           <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-amber-200 shadow-inner">
              <p className="text-sm md:text-base font-black text-amber-900 leading-relaxed uppercase tracking-tight">{parentData.allergies || 'Taqiqlar mavjud emas'}</p>
           </div>
        </div>
     </div>

     {/* Medical Notes */}
     <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-brand-border shadow-sm">
        <h5 className="font-black text-[10px] md:text-xs uppercase tracking-widest text-brand-depth mb-4 md:mb-6 flex items-center gap-3">
           <FileText size={16} md:size={18} className="text-brand-primary" /> Shifokor qaydlari
        </h5>
        <div className="bg-slate-50 p-6 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border-2 border-slate-100">
           <p className="text-xs md:text-base font-bold text-brand-slate leading-loose italic">{parentData.medical_notes || 'Qaydlar mavjud emas'}</p>
        </div>
     </div>
  </motion.div>
);
