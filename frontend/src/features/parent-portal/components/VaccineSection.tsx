import React from 'react';
import { Syringe, Clock, CheckCircle, ShieldCheck, AlertCircle, Info, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export const VaccineSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
     {/* Passport Style Header */}
     <div className="bg-gradient-to-br from-sky-500 to-blue-700 p-8 md:p-16 rounded-[3rem] md:rounded-[5rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white/10 rounded-full blur-[100px] md:blur-[150px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-300/20 rounded-full blur-[100px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
           <div className="space-y-4 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/20 flex items-center justify-center shadow-2xl">
                    <ShieldCheck size={32} md:size={48} className="text-white" />
                 </div>
                 <div className="px-5 py-2 bg-white/10 border border-white/20 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] backdrop-blur-md">Emlash Pasporti</div>
              </div>
              <h4 className="text-3xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">Raqamli <br/> Immunizatsiya</h4>
              <p className="text-white/60 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] leading-relaxed max-w-md">Davlat standartlari asosida tasdiqlangan emlash monitoringi.</p>
           </div>
           
           <div className="flex gap-4 md:gap-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-[2.5rem] text-center min-w-[140px] md:min-w-[180px]">
                 <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Olingan</p>
                 <p className="text-4xl md:text-5xl font-black">{data?.vaccinations?.filter((v:any) => v.status === 'TAKEN').length || 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2.5rem] text-center min-w-[140px] md:min-w-[180px]">
                 <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Rejada</p>
                 <p className="text-4xl md:text-5xl font-black">{data?.vaccinations?.filter((v:any) => v.status !== 'TAKEN').length || 0}</p>
              </div>
           </div>
        </div>
     </div>

     {/* List Section */}
     <div className="bg-white rounded-[3rem] md:rounded-[5rem] border border-brand-border overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="p-8 md:p-14 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/30 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] md:rounded-[2.5rem] bg-sky-600 text-white flex items-center justify-center shadow-2xl group transition-all">
                 <Syringe size={32} md:size={40} className="group-hover:rotate-[-45deg] transition-transform duration-500" />
              </div>
              <div className="text-left">
                 <h5 className="text-2xl md:text-4xl font-black text-brand-depth tracking-tighter uppercase leading-none">Emlashlar Ro'yxati</h5>
                 <p className="text-[10px] md:text-[11px] font-black text-brand-muted uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                    <Calendar size={14} className="text-sky-500" /> 2024-2026 reja asosida
                 </p>
              </div>
           </div>
        </div>

        <div className="divide-y divide-slate-50">
           {data?.vaccinations?.length > 0 ? data.vaccinations.map((v:any, idx: number) => (
              <motion.div 
                key={v.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50/50 transition-all group gap-8"
              >
                 <div className="flex items-center gap-6 md:gap-10 w-full sm:w-auto">
                    <div className={`w-16 h-16 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center border-4 transition-all shadow-xl group-hover:scale-105 ${v.status === 'TAKEN' ? 'bg-emerald-50 border-white text-emerald-500' : 'bg-slate-50 border-white text-slate-300'}`}>
                       <Syringe size={28} md:size={40} />
                    </div>
                    <div className="space-y-1 text-left flex-1">
                       <h5 className="text-xl md:text-3xl font-black text-brand-depth tracking-tight leading-none group-hover:text-sky-600 transition-colors">{v.vaccine_name}</h5>
                       <div className="flex flex-wrap gap-2 md:gap-4 mt-3">
                          <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                             <Clock size={14} className="text-sky-500" />
                             <span className="text-[9px] md:text-[11px] font-black text-brand-muted uppercase tracking-widest">Reja: {v.planned_date}</span>
                          </div>
                          {v.status === 'TAKEN' && (
                             <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm">
                                <CheckCircle size={14} className="text-emerald-500" />
                                <span className="text-[9px] md:text-[11px] font-black text-emerald-600 uppercase tracking-widest">Sana: {v.taken_date}</span>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-6 sm:pt-0 border-slate-100">
                    <div className={`px-8 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-lg transition-all ${
                       v.status === 'TAKEN' 
                         ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                         : 'bg-brand-depth text-white shadow-brand-depth/20'
                    }`}>
                       {v.status === 'TAKEN' ? 'Olingan' : 'Kutilmoqda'}
                    </div>
                    {v.status !== 'TAKEN' && (
                       <div className="p-3 bg-amber-50 text-amber-500 rounded-xl md:rounded-2xl border border-amber-100 hover:bg-amber-500 hover:text-white transition-all cursor-pointer">
                          <Info size={20} />
                       </div>
                    )}
                 </div>
              </motion.div>
           )) : (
            <div className="p-24 text-center space-y-4">
               <Syringe size={48} className="mx-auto text-slate-200" />
               <p className="text-brand-muted uppercase text-[10px] font-black tracking-[0.3em]">Hali emlash ma'lumotlari mavjud emas</p>
            </div>
           )}
        </div>
     </div>

     {/* Info Alert */}
     <div className="bg-blue-50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 border-blue-100 flex items-center gap-6">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white text-sky-500 rounded-2xl flex items-center justify-center shadow-md shrink-0">
           <AlertCircle size={28} md:size={32} />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-sky-800 uppercase leading-loose tracking-widest">
           Emlash ishlari davlat tomonidan tasdiqlangan grafik asosida olib boriladi. Savollar bo'lsa, hamshira bilan bog'laning.
        </p>
     </div>
  </motion.div>
);
