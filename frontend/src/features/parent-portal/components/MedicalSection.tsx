import React from 'react';
import { Activity, Heart, ShieldAlert, FileText, Clipboard, Thermometer, Ruler, Weight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const MedicalSection = ({ parentData }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
     {/* Medical Overview Header */}
     <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 md:w-[500px] h-80 md:h-[500px] bg-white/10 rounded-full blur-[80px] md:blur-[120px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
           <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center">
                    <Clipboard size={24} md:size={32} className="text-white" />
                 </div>
                 <div className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Tizimda Tasdiqlangan</div>
              </div>
              <h4 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none italic">Sog'liqni Saqlash <br/> Monitoringi</h4>
              <p className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] leading-relaxed max-w-sm">Farzandingizning jismoniy rivojlanishi va tibbiy holati nazorat ostida.</p>
           </div>
           
           <div className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] backdrop-blur-2xl shadow-inner min-w-[280px]">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"><CheckCircle2 size={24} /></div>
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Status</p>
                    <p className="text-xl font-black uppercase tracking-tighter">Sog'lom</p>
                 </div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full w-[95%] bg-gradient-to-r from-emerald-500 to-emerald-300"></div>
              </div>
              <p className="text-[9px] font-black text-white/30 uppercase mt-3 tracking-widest">Normal ko'rsatkich: 95%</p>
           </div>
        </div>
     </div>

     {/* Vitals Grid */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {[
           { label: 'Bo\'yi', val: parentData.height || '--', unit: 'cm', icon: Ruler, color: 'blue', desc: 'Jismoniy o\'sish' },
           { label: 'Vazni', val: parentData.weight || '--', unit: 'kg', icon: Weight, color: 'rose', desc: 'Vazn nazorati' },
           { label: 'Harorat', val: '36.6', unit: '°C', icon: Thermometer, color: 'emerald', desc: 'Hozirgi holat' }
        ].map((v, i) => (
           <div key={i} className="bg-white p-8 md:p-10 rounded-[3rem] border border-brand-border shadow-xl shadow-slate-200/40 group hover:border-brand-primary transition-all relative overflow-hidden">
              <div className={`absolute -right-8 -top-8 w-48 h-48 rounded-full bg-${v.color}-500/5 blur-3xl group-hover:bg-${v.color}-500/10 transition-all duration-700`}></div>
              
              <div className="flex items-center justify-between mb-8">
                 <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-${v.color}-50 text-${v.color}-500 flex items-center justify-center border border-${v.color}-100 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <v.icon size={28} md:size={36} />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-1">{v.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.desc}</p>
                 </div>
              </div>
              
              <p className="text-5xl md:text-7xl font-black text-brand-depth tracking-tighter leading-none">
                 {v.val}<span className={`text-xl md:text-2xl text-${v.color}-500 ml-2 opacity-40 uppercase`}>{v.unit}</span>
              </p>
           </div>
        ))}
     </div>
     
     {/* Allergies - High Alert UI */}
     <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-[3rem] md:rounded-[4.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-brand-border shadow-2xl flex flex-col md:flex-row items-center gap-10 md:gap-16">
           <div className="w-24 h-24 md:w-32 md:h-32 bg-amber-50 text-amber-500 rounded-[2.5rem] md:rounded-[3rem] flex items-center justify-center shadow-inner border-4 border-white shrink-0">
              <ShieldAlert size={48} md:size={64} className="animate-pulse" />
           </div>
           <div className="space-y-4 md:space-y-6 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                 <span className="px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-amber-200">Critical Info</span>
              </div>
              <h5 className="text-2xl md:text-4xl font-black text-brand-depth tracking-tighter uppercase leading-none">Allergiya va Maxsus Taqiqlar</h5>
              <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border-2 border-brand-border relative overflow-hidden group/card">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 transition-transform group-hover/card:scale-150 duration-700">
                    <ShieldAlert size={120} />
                 </div>
                 <p className="text-sm md:text-xl font-black text-amber-900 leading-relaxed uppercase tracking-tight relative z-10">
                    {parentData.allergies || 'Tizimda hech qanday allergiya yoki taqiqlar qayd etilmagan'}
                 </p>
              </div>
           </div>
        </div>
     </div>

     {/* Medical Notes - Professional Record UI */}
     <div className="bg-white rounded-[3rem] md:rounded-[5rem] border border-brand-border overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="p-8 md:p-14 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/30 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] md:rounded-[2.5rem] bg-brand-depth text-white flex items-center justify-center shadow-2xl group transition-all">
                 <FileText size={32} md:size={40} className="group-hover:rotate-[-10deg] transition-transform duration-500" />
              </div>
              <div className="text-left">
                 <h5 className="text-2xl md:text-4xl font-black text-brand-depth tracking-tighter uppercase leading-none">Shifokor Jurnali</h5>
                 <p className="text-[10px] md:text-[11px] font-black text-brand-muted uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                    <Activity size={14} className="text-brand-primary" /> Oxirgi tekshiruv qaydlari
                 </p>
              </div>
           </div>
        </div>
        <div className="p-8 md:p-16">
           <div className="relative p-8 md:p-12 bg-slate-50 rounded-[2.5rem] md:rounded-[4rem] border-2 border-slate-100 min-h-[200px] flex items-center justify-center group/note">
              <div className="absolute top-0 left-0 p-8 opacity-[0.03] group-hover/note:scale-110 transition-transform duration-1000">
                 <Clipboard size={120} />
              </div>
              <p className="text-sm md:text-xl font-bold text-brand-slate leading-loose italic text-center max-w-2xl relative z-10">
                 "{parentData.medical_notes || 'Tizimda hozircha shifokor tomonidan kiritilgan qo\'shimcha qaydlar mavjud emas. Farzandingiz sog\'lig\'i doimiy nazoratda.'}"
              </p>
           </div>
        </div>
     </div>
  </motion.div>
);
