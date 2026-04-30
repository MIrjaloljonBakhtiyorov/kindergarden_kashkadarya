import React from 'react';
import { Star, Award, MessageSquare, TrendingUp, Calendar, Zap, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const ProgressSection = ({ data }: any) => {
  const avgRating = data?.progress?.length > 0 
    ? (data.progress.reduce((sum: number, r: any) => sum + r.rating, 0) / data.progress.length).toFixed(1)
    : "5.0";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 md:space-y-12">
      {/* Gamified Header */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-8 md:p-16 rounded-[3rem] md:rounded-[5rem] text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-10 text-center lg:text-left">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse"></div>
        
        <div className="relative z-10 space-y-4">
           <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Muvaffaqiyatlar</span>
           </div>
           <h4 className="text-3xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">Bolaning <br/> Yutuqlari</h4>
           <p className="text-[10px] md:text-sm font-bold text-white/70 uppercase tracking-[0.4em] max-w-sm">Har bir kichik qadam - kelajak uchun katta yutuq.</p>
        </div>

        <div className="relative z-10 flex items-center gap-6 bg-white/10 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/20 backdrop-blur-2xl shadow-inner group">
           <div className="w-20 h-20 md:w-32 md:h-32 rounded-[2.5rem] md:rounded-[3rem] bg-white text-amber-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700">
              <Award size={48} md:size={64} className="drop-shadow-lg" />
           </div>
           <div className="text-center">
              <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Umumiy Reyting</p>
              <div className="flex items-end justify-center gap-2">
                 <p className="text-6xl md:text-8xl font-black tracking-tighter leading-none">{avgRating}</p>
                 <Sparkles className="text-white mb-2 animate-bounce" size={24} />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-10">
        {data?.progress?.length > 0 ? data.progress.map((r:any, idx: number) => (
           <motion.div 
             key={r.id} 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4.5rem] border border-brand-border shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-brand-primary transition-all relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                 <Star size={120} />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12 mb-10">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] bg-amber-50 text-amber-500 flex items-center justify-center border-4 border-white shadow-xl shrink-0 group-hover:rotate-12 transition-all">
                       <Star size={32} md:size={48} fill="#fbbf24" />
                    </div>
                    <div className="text-left">
                       <h5 className="text-2xl md:text-4xl font-black text-brand-depth tracking-tighter leading-none uppercase">{r.subject}</h5>
                       <div className="flex items-center gap-4 mt-3">
                          <p className="text-[10px] md:text-[11px] font-black text-brand-muted uppercase tracking-[0.3em] flex items-center gap-2">
                             <Calendar size={14} className="text-brand-primary" /> {r.date}
                          </p>
                          <div className="h-4 w-px bg-slate-200" />
                          <p className="text-[10px] md:text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">Tasdiqlangan</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                    <div className="flex gap-2 p-3 bg-slate-50 rounded-2xl shadow-inner border border-slate-100">
                       {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={24} 
                            fill={i < r.rating ? '#fbbf24' : 'none'} 
                            className={i < r.rating ? 'text-amber-400 drop-shadow-sm' : 'text-slate-200'} 
                          />
                       ))}
                    </div>
                    <p className="text-[9px] font-black text-brand-muted uppercase tracking-[0.4em]">Tarbiyachi bahosi</p>
                 </div>
              </div>

              <div className="bg-slate-50 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-2 border-brand-border relative group/comment">
                 <MessageSquare className="absolute -top-6 -left-6 text-brand-primary opacity-10 w-16 h-16 group-hover/comment:rotate-12 transition-transform" />
                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                       <Zap size={14} className="text-brand-primary" />
                       <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Tarbiyachi izohi</span>
                    </div>
                    <p className="text-base md:text-2xl font-bold text-brand-depth leading-relaxed italic">
                       "{r.comment}"
                    </p>
                 </div>
                 <div className="absolute bottom-6 right-8 flex items-center gap-2 text-[9px] font-black text-brand-primary/40 uppercase tracking-[0.3em]">
                    <TrendingUp size={14} /> Yuqori O'sish
                 </div>
              </div>
           </motion.div>
        )) : (
          <div className="p-24 text-center space-y-4 bg-white rounded-[4rem] border border-brand-border shadow-sm">
             <Star size={48} className="mx-auto text-slate-200" />
             <p className="text-brand-muted uppercase text-[10px] font-black tracking-[0.3em]">Bolaning yutuqlari hali tizimga kiritilmagan</p>
          </div>
        )}
     </div>

     {/* Motivational Banner */}
     <div className="bg-brand-depth p-8 md:p-14 rounded-[3rem] md:rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-primary/20 to-transparent"></div>
        <div className="relative z-10 flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20"><TrendingUp size={32} className="text-emerald-400" /></div>
           <div className="text-left">
              <h5 className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">Oylik Hisobot</h5>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">O'sish sur'ati: +12% o'tgan oydan</p>
           </div>
        </div>
        <button className="relative z-10 px-10 py-5 bg-white text-brand-depth rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary hover:text-white transition-all shadow-xl">
           To'liq tahlilni ko'rish
        </button>
     </div>
  </motion.div>
);
};
