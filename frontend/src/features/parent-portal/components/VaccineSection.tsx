import React from 'react';
import { Syringe, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const VaccineSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-12">
     <div className="bg-sky-600 text-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-white/10 rounded-full blur-[80px] md:blur-[120px] -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-12">
           <div className="space-y-2 text-center md:text-left">
              <h4 className="text-2xl md:text-5xl font-black tracking-tighter leading-none">Emlash Monitoringi</h4>
              <p className="text-[10px] md:text-xs font-bold text-sky-100/80 max-w-md uppercase tracking-widest">Rejali immunizatsiya nazorati</p>
           </div>
           <Syringe size={40} md:size={56} className="text-sky-300 opacity-60" />
        </div>
     </div>
     <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-brand-border overflow-hidden shadow-sm relative">
        <div className="divide-y divide-slate-100">
           {data?.vaccinations?.length > 0 ? data.vaccinations.map((v:any) => (
              <div key={v.id} className="p-6 md:p-10 flex flex-col sm:flex-row items-center justify-between group hover:bg-sky-50/30 transition-all gap-6">
                 <div className="flex items-center gap-4 md:gap-8">
                    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center border-4 transition-all shadow-md ${v.status === 'TAKEN' ? 'bg-emerald-50 border-white text-emerald-500' : 'bg-slate-50 border-white text-slate-300'}`}>
                       <Syringe size={24} md:size={36} />
                    </div>
                    <div>
                       <h5 className="text-base md:text-2xl font-black text-brand-depth tracking-tight leading-none">{v.vaccine_name}</h5>
                       <div className="flex flex-wrap gap-2 md:gap-3 mt-2">
                          <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-brand-muted uppercase bg-white border border-brand-border px-3 py-1 rounded-lg">
                             <Clock size={12} className="text-brand-primary" /> Reja: {v.planned_date}
                          </div>
                          {v.status === 'TAKEN' && (
                             <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                                <CheckCircle size={12} /> Olingan: {v.taken_date}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
                 <div className={`px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-[1.5rem] text-[9px] md:text-xs font-black uppercase tracking-widest shadow-md border-b-2 ${v.status === 'TAKEN' ? 'bg-emerald-500 text-white border-emerald-700' : 'bg-brand-depth text-white border-black'}`}>
                    {v.status === 'TAKEN' ? 'Olingan' : 'Kutilmoqda'}
                 </div>
              </div>
           )) : (
            <div className="p-12 md:p-20 text-center text-brand-muted font-black uppercase tracking-widest text-[10px] md:text-xs">Ma'lumotlar mavjud emas</div>
           )}
        </div>
     </div>
  </motion.div>
);
