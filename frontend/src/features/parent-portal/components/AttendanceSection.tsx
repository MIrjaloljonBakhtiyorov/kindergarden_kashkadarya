import React, { useState } from 'react';
import { Calendar, UserCheck, AlertCircle, Clock, ChevronRight, CheckCircle2, XCircle, Download, Save, History, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { useNotification } from '../../../context/NotificationContext';

const API_BASE = 'http://localhost:3001/api';

export const AttendanceSection = ({ data, childId, onUpdate }: any) => {
  const { showNotification } = useNotification();
  const [tomorrowAttending, setTomorrowAttending] = useState(true);
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const stats = [
    { label: 'Kelgan kunlar', val: data?.attendance?.filter((a:any) => a.status === 'PRESENT').length || 0, icon: UserCheck, color: 'emerald', desc: 'Jami davomat' },
    { label: 'Kelmagan kunlar', val: data?.attendance?.filter((a:any) => a.status !== 'PRESENT').length || 0, icon: XCircle, color: 'rose', desc: 'Sababli/Sababsiz' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      await axios.post(`${API_BASE}/attendance`, {
        date: dateStr,
        attendance_data: {
          [childId]: tomorrowAttending ? 'PRESENT' : 'ABSENT'
        },
        reason: tomorrowAttending ? '' : reason
      });

      showNotification("Ertangi kun uchun reja saqlandi!", "success");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      showNotification("Saqlashda xatolik yuz berdi", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
      {/* Premium Planning Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-blue-600 rounded-[3rem] md:rounded-[4.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-brand-depth p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] text-white overflow-hidden shadow-2xl border border-white/10">
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
           
           <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10 md:gap-16">
              <div className="space-y-4 text-center lg:text-left flex-1">
                 <div className="flex items-center justify-center lg:justify-start gap-3">
                    <span className="px-4 py-1.5 bg-brand-primary/20 border border-brand-primary/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Smart Planning</span>
                 </div>
                 <h4 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase italic">Ertaga farzandingiz <br/> bog'chaga boradimi?</h4>
                 <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed max-w-md">Ertangi kun rejasini oldindan belgilash tarbiyachilarga tayyorgarlik ko'rishda yordam beradi.</p>
              </div>
              
              <div className="w-full lg:w-auto space-y-8">
                <div className="flex bg-white/5 p-3 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl">
                   <button 
                     onClick={() => setTomorrowAttending(true)}
                     className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 md:px-14 md:py-7 rounded-[1.8rem] font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-500 ${tomorrowAttending ? 'bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 ring-4 ring-emerald-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                   >
                      <CheckCircle2 size={20} md:size={24} /> Boradi
                   </button>
                   <button 
                     onClick={() => setTomorrowAttending(false)}
                     className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 md:px-14 md:py-7 rounded-[1.8rem] font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-500 ${!tomorrowAttending ? 'bg-rose-500 text-white shadow-2xl shadow-rose-500/40 ring-4 ring-rose-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                   >
                      <XCircle size={20} md:size={24} /> Yo'q
                   </button>
                </div>

                <AnimatePresence mode="wait">
                   {!tomorrowAttending && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="space-y-4"
                      >
                         <textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Sababini kiriting..."
                            className="w-full bg-white/5 border-2 border-white/10 focus:border-brand-primary rounded-[2rem] p-6 md:p-8 text-white font-bold outline-none transition-all placeholder:text-white/20 text-sm shadow-inner"
                            rows={2}
                         />
                      </motion.div>
                   )}
                </AnimatePresence>

                <button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="w-full flex items-center justify-center gap-4 py-6 md:py-8 bg-white text-brand-depth rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.4em] hover:bg-brand-primary hover:text-white transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-95 disabled:opacity-50 relative group overflow-hidden"
                 >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    {isSaving ? <div className="w-5 h-5 border-3 border-brand-depth border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                    Tasdiqlash
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border border-brand-border shadow-xl shadow-slate-200/40 group hover:border-brand-primary transition-all relative overflow-hidden">
             <div className={`absolute -right-8 -top-8 w-48 h-48 rounded-full bg-${stat.color}-500/5 blur-3xl group-hover:bg-${stat.color}-500/10 transition-all duration-700`}></div>
             
             <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-${stat.color}-100`}>
                   <stat.icon size={28} md:size={40} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.desc}</p>
                </div>
             </div>
             
             <div className="flex items-end justify-between">
                <p className={`text-6xl md:text-8xl font-black text-brand-depth tracking-tighter leading-none`}>
                   {stat.val}<span className={`text-xl md:text-2xl text-${stat.color}-500 ml-2 opacity-40`}>kun</span>
                </p>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                   <TrendingUp size={14} className={`text-${stat.color}-500`} />
                   <span className="text-[10px] font-black text-brand-depth">Normal</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Premium History List */}
      <div className="bg-white rounded-[3rem] md:rounded-[5rem] border border-brand-border overflow-hidden shadow-2xl shadow-slate-200/50">
         <div className="p-8 md:p-14 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/30 gap-6">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] md:rounded-[2.5rem] bg-brand-depth text-white flex items-center justify-center shadow-2xl group transition-all">
                  <History size={32} md:size={40} className="group-hover:rotate-[-45deg] transition-transform duration-500" />
               </div>
               <div>
                  <h5 className="text-2xl md:text-4xl font-black text-brand-depth tracking-tighter uppercase leading-none">Arxiv Jurnali</h5>
                  <p className="text-[10px] md:text-[11px] font-black text-brand-muted uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                     <Clock size={14} className="text-brand-primary" /> Oxirgi 30 kunlik ma'lumotlar
                  </p>
               </div>
            </div>
            <button className="flex items-center gap-3 px-10 py-5 bg-brand-ghost text-brand-depth rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary hover:text-white transition-all border border-brand-border">
               <Download size={18} />
               <span>Excel Hisobot</span>
            </button>
         </div>

         <div className="divide-y divide-slate-50">
            {data?.attendance?.length === 0 ? (
               <div className="p-24 text-center space-y-4">
                  <Calendar size={48} className="mx-auto text-slate-200" />
                  <p className="text-brand-muted uppercase text-[10px] font-black tracking-[0.3em]">Hozircha ma'lumotlar mavjud emas</p>
               </div>
            ) : (
              data?.attendance?.map((a:any, idx: number) => (
                 <motion.div 
                   key={a.id} 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className="p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50/50 transition-all group gap-8"
                 >
                    <div className="flex items-center gap-6 md:gap-10 w-full sm:w-auto">
                       <div className="text-center bg-white w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-slate-50 shadow-xl group-hover:scale-105 transition-transform">
                          <p className="text-[10px] md:text-xs font-black text-brand-primary uppercase mb-1">Aprel</p>
                          <p className="text-2xl md:text-4xl font-black text-brand-depth leading-none tracking-tighter">{a.date.split('-')[2]}</p>
                       </div>
                       <div className="space-y-1 text-left">
                          <p className="text-lg md:text-2xl font-black text-brand-depth tracking-tight leading-none">Bog'chaga {a.status === 'PRESENT' ? 'keldi' : 'kelmadi'}</p>
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${a.status === 'PRESENT' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                             <p className="text-[10px] md:text-[11px] font-black text-brand-muted uppercase tracking-widest">{a.date}</p>
                          </div>
                          {a.reason && (
                             <p className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 mt-2">Sabab: {a.reason}</p>
                          )}
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-6 sm:pt-0 border-slate-100">
                       <div className={`px-8 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-lg transition-all ${
                          a.status === 'PRESENT' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                       }`}>
                          {a.status === 'PRESENT' ? 'Tasdiqlangan' : 'Kelmagan'}
                       </div>
                       <div className="p-3 md:p-4 text-brand-muted hover:text-brand-primary transition-colors cursor-pointer bg-slate-50 rounded-xl">
                          <ChevronRight size={20} />
                       </div>
                    </div>
                 </motion.div>
              ))
            )}
         </div>
      </div>
    </motion.div>
  );
};

