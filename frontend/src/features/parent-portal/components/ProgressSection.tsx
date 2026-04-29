import React from 'react';
import { Star, Award, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const ProgressSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-10">
     <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 md:p-16 rounded-[2.5rem] md:rounded-[5rem] text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
        <div className="relative z-10 space-y-2">
           <h4 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">Bolaning Yutuqlari</h4>
           <p className="text-xs md:text-sm font-bold text-white/80 italic">"Har bir kichik yutuq - kelajak uchun poydevor"</p>
        </div>
        <div className="relative z-10 flex items-center gap-4 bg-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[4rem] border border-white/20 backdrop-blur-2xl">
           <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-white text-amber-500 flex items-center justify-center shadow-xl"><Award size={32} md:size={48} /></div>
           <div className="text-center">
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest opacity-60">Reyting</p>
              <p className="text-5xl md:text-7xl font-black tracking-tighter">4.9</p>
           </div>
        </div>
     </div>
     <div className="grid grid-cols-1 gap-6 md:gap-10">
        {data?.progress?.length > 0 ? data.progress.map((r:any) => (
           <div key={r.id} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-brand-border shadow-sm hover:shadow-2xl transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-10 mb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                       <Star size={24} md:size={32} />
                    </div>
                    <div>
                       <h5 className="text-lg md:text-2xl font-black text-brand-depth tracking-tighter leading-none">{r.subject}</h5>
                       <p className="text-[8px] md:text-[11px] font-black text-brand-muted uppercase tracking-widest mt-1.5">{r.date} • TARBIYACHI</p>
                    </div>
                 </div>
                 <div className="flex gap-1 p-2 bg-slate-50 rounded-xl shadow-inner border border-slate-100">
                    {[...Array(5)].map((_, i) => (
                       <Star key={i} size={20} fill={i < r.rating ? '#fbbf24' : 'none'} className={i < r.rating ? 'text-amber-400 drop-shadow-sm' : 'text-slate-200'} />
                    ))}
                 </div>
              </div>
              <div className="bg-brand-ghost p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 border-brand-border relative">
                 <MessageSquare className="absolute -top-4 -left-4 text-brand-primary opacity-10 w-12 h-12" />
                 <p className="text-sm md:text-base font-bold text-brand-depth leading-relaxed italic relative z-10">"{r.comment}"</p>
              </div>
           </div>
        )) : (
          <div className="p-12 md:p-20 text-center text-brand-muted font-black uppercase tracking-widest text-[10px]">Yutuqlar hali kiritilmagan</div>
        )}
     </div>
  </motion.div>
);
