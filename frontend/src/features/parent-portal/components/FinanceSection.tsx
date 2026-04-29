import React from 'react';
import { Wallet, CreditCard, Receipt, Download, CheckCircle2, ClipboardList, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const FinanceSection = ({ data }: any) => {
  const totalPaid = data?.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 md:space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
         {/* Balance Card */}
         <div className="lg:col-span-2 bg-brand-depth p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] text-white shadow-2xl relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 w-64 md:w-80 h-64 md:h-80 bg-brand-primary/20 rounded-full blur-[80px] md:blur-[100px] -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-8 md:gap-12">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <p className="text-[9px] md:text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Hisob holati (Balans)</p>
                     <h4 className="text-4xl md:text-6xl font-black tracking-tighter">0.00 <span className="text-lg md:text-xl opacity-40 uppercase ml-2">UZS</span></h4>
                  </div>
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center backdrop-blur-xl border-2 bg-emerald-500/20 border-emerald-500/30 text-emerald-400">
                     <CheckCircle2 size={28} md:size={36} />
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8 border-t border-white/5">
                  <div>
                     <p className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Umumiy to'lovlar</p>
                     <p className="text-base md:text-xl font-black">{totalPaid.toLocaleString()} UZS</p>
                  </div>
                  <div>
                     <p className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Joriy qarz</p>
                     <p className="text-base md:text-xl font-black text-emerald-400">0 UZS</p>
                  </div>
                  <div className="hidden md:block">
                     <p className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Keyingi hisob</p>
                     <p className="text-base md:text-xl font-black">1-may, 2026</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Action Buttons */}
         <div className="flex flex-row lg:flex-col gap-4 md:gap-6">
            <div className="flex-1 bg-brand-primary p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] text-white shadow-xl flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-brand-primary-dark transition-all active:scale-95 border-b-4 md:border-b-8 border-black/10">
               <CreditCard size={32} md:size={40} className="mb-2 md:mb-4" />
               <h5 className="text-sm md:text-xl font-black uppercase leading-tight">To'lov</h5>
            </div>
            <div className="flex-1 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-brand-border shadow-sm flex flex-col justify-center items-center text-center group cursor-pointer hover:border-brand-primary transition-all active:scale-95">
               <Receipt size={32} md:size={40} className="text-brand-primary mb-2 md:mb-4" />
               <h5 className="text-sm md:text-xl font-black text-brand-depth uppercase leading-tight">Invoys</h5>
            </div>
         </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-brand-border overflow-hidden shadow-sm">
         <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/20">
            <h5 className="font-black text-brand-depth uppercase text-[10px] md:text-xs tracking-widest flex items-center gap-3">
               <ClipboardList size={18} className="text-brand-primary" /> To'lovlar Tarixi
            </h5>
         </div>
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left min-w-[600px]">
               <thead>
                  <tr className="bg-slate-50/50 text-[9px] md:text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] border-b border-brand-border">
                     <th className="px-6 md:px-10 py-4 md:py-6">Operatsiya</th>
                     <th className="px-6 md:px-10 py-4 md:py-6">Sana</th>
                     <th className="px-6 md:px-10 py-4 md:py-6">Summa</th>
                     <th className="px-6 md:px-10 py-4 md:py-6">Holat</th>
                     <th className="px-6 md:px-10 py-4 md:py-6 text-right">Kvitansiya</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {data?.payments?.map((p: any) => (
                     <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-6 md:px-10 py-6 md:py-8 font-mono text-[9px] md:text-[10px] font-black text-brand-primary">#{p.id.slice(0, 8)}</td>
                        <td className="px-6 md:px-10 py-6 md:py-8 text-xs md:text-sm font-black text-brand-depth">{p.date}</td>
                        <td className="px-6 md:px-10 py-6 md:py-8 text-base md:text-lg font-black text-brand-depth tracking-tight">{p.amount.toLocaleString()} UZS</td>
                        <td className="px-6 md:px-10 py-6 md:py-8">
                           <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[8px] md:text-[9px] font-black uppercase rounded-lg">To'langan</span>
                        </td>
                        <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                           <button className="p-3 md:p-4 bg-white text-brand-depth hover:bg-brand-primary hover:text-white rounded-xl md:rounded-2xl transition-all shadow-md border border-brand-border group-hover:scale-110">
                              <Download size={18} md:size={20} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </motion.div>
  );
};
