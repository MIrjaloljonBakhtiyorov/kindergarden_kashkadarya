import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Smartphone, Trash2, Contact, X, Save, Camera, ShieldAlert, UserPlus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';


const RELATIONS = [
  'Bobosi', 'Buvisi', 'Amakisi', 'Tog\'asi', 'Ammasi', 'Xolasi', 
  'Akasi', 'Opasi', 'Otasi', 'Onasi'
];

export const PickupSection = ({ data, onUpdate }: any) => {
  const { user } = useAuth();
  const { showNotification, confirm } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    relation: 'Bobosi',
    phone: '',
    photo_url: ''
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.childId) return;
    
    setIsSaving(true);
    try {
      await apiClient.post(`/parent-portal/pickups`, {
        ...formData,
        child_id: user.childId
      });
      showNotification('Yangi vakil qo\'shildi', 'success');
      setShowModal(false);
      setFormData({ full_name: '', relation: 'Bobosi', phone: '', photo_url: '' });
      if (onUpdate) onUpdate();
    } catch (error) {
      showNotification('Xatolik yuz berdi', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm('Ushbu vakilni o\'chirishni xohlaysizmi?');
    if (!ok) return;
    
    try {
      await apiClient.delete(`/parent-portal/pickups/${id}`);
      showNotification('Vakil o\'chirildi', 'success');
      if (onUpdate) onUpdate();
    } catch (error) {
      showNotification('O\'chirishda xatolik', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 md:space-y-12">
       {/* High Security Header */}
       <div className="bg-brand-depth p-8 md:p-14 rounded-[3rem] md:rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="relative z-10 flex items-center gap-6">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl rounded-[1.8rem] border border-white/20 flex items-center justify-center shadow-2xl shrink-0 group">
                <ShieldCheck size={32} md:size={40} className="text-brand-primary group-hover:scale-110 transition-transform duration-500" />
             </div>
             <div className="text-left">
                <h4 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none italic">Xavfsiz Olib <br/> Ketish Tizimi</h4>
                <p className="text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                   <ShieldAlert size={14} className="text-emerald-500" /> Faqat ruxsat etilgan shaxslar
                </p>
             </div>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="relative z-10 w-full md:w-auto px-10 py-5 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-brand-primary/30 hover:bg-brand-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
             <UserPlus size={20} className="group-hover:translate-y-[-2px] transition-transform" /> Yangi vakil qo'shish
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {data?.pickups?.map((v:any, idx: number) => (
             <motion.div 
               key={v.id} 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: idx * 0.1 }}
               className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-brand-border shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row items-center gap-8 md:gap-12 text-center sm:text-left hover:border-brand-primary transition-all group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12 group-hover:scale-110 transition-transform duration-1000">
                   <UserCheck size={120} />
                </div>

                <div className="w-28 h-28 md:w-40 md:h-40 rounded-[2.5rem] md:rounded-[3.5rem] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden shrink-0 relative z-10 group-hover:scale-105 transition-all">
                   {v.photo_url ? (
                      <img src={v.photo_url} alt={v.full_name} className="w-full h-full object-cover" />
                   ) : (
                      <div className="text-slate-200 flex flex-col items-center">
                         <Contact size={56} md:size={80} className="opacity-20" />
                         <p className="text-[9px] font-black mt-2 uppercase tracking-widest">Surat mavjud emas</p>
                      </div>
                   )}
                </div>
                
                <div className="flex-1 space-y-4 md:space-y-6 relative z-10">
                   <div className="space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                         <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg border border-brand-primary/20">{v.relation}</span>
                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      </div>
                      <p className="text-2xl md:text-3xl font-black text-brand-depth tracking-tighter leading-none group-hover:text-brand-primary transition-colors">{v.full_name}</p>
                   </div>
                   
                   <div className="space-y-2">
                      <div className="flex items-center justify-center sm:justify-start gap-3 text-sm md:text-base font-black text-brand-depth">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-brand-muted"><Smartphone size={16} /></div>
                         {v.phone}
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-3 text-[9px] md:text-[10px] font-bold text-brand-muted uppercase tracking-widest">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-brand-muted"><ShieldCheck size={16} /></div>
                         Ruxsat etilgan: 08:00 - 18:30
                      </div>
                   </div>

                   <div className="pt-4 flex justify-center sm:justify-start">
                      <button 
                        onClick={() => handleDelete(v.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                         <Trash2 size={14} /> Vakilni o'chirish
                      </button>
                   </div>
                </div>
             </motion.div>
          ))}
          {(!data?.pickups || data.pickups.length === 0) && (
            <div className="lg:col-span-2 py-24 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center shadow-inner">
               <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-6 shadow-sm">
                  <UserCheck size={48} />
               </div>
               <h5 className="text-2xl font-black text-brand-depth uppercase tracking-tighter">Hali ishonchli vakillar qo'shilmagan</h5>
               <p className="text-sm text-brand-muted font-bold mt-2 uppercase tracking-widest px-10 max-w-md">Bolani olib ketishga ruxsat berilgan shaxslar ro'yxatini shakllantiring.</p>
            </div>
          )}
       </div>

       {/* Security Notice */}
       <div className="bg-amber-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border-2 border-amber-100 flex items-start gap-6 shadow-lg shadow-amber-500/5">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white text-amber-500 rounded-2xl flex items-center justify-center shadow-md shrink-0 border border-amber-100">
             <Info size={28} md:size={32} />
          </div>
          <div className="space-y-1">
             <p className="text-[10px] md:text-xs font-black text-amber-900 uppercase tracking-[0.2em]">Xavfsizlik bo'yicha ogohlantirish</p>
             <p className="text-xs md:text-sm font-bold text-amber-800/70 leading-relaxed uppercase tracking-widest">
                Vakillarni qo'shishda ularning shaxsini tasdiqlovchi hujjatlar to'g'riligiga ishonch hosil qiling. Bog'cha ma'muriyati shubhali hollarda shaxsni tekshirish huquqini saqlab qoladi.
             </p>
          </div>
       </div>

       {/* Add Representative Modal - Redesigned */}
       <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setShowModal(false)}
                 className="absolute inset-0 bg-brand-depth/40 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 50 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 50 }}
                 className="relative w-full max-w-2xl bg-white rounded-[3rem] md:rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden"
               >
                  <div className="p-8 md:p-16 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-brand-primary/20">
                           <UserPlus size={28} />
                        </div>
                        <div>
                           <h3 className="text-2xl md:text-3xl font-black text-brand-depth uppercase tracking-tighter leading-none">Vakil Ro'yxati</h3>
                           <p className="text-brand-muted text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Xavfsizlikni ta'minlang</p>
                        </div>
                     </div>
                     <button onClick={() => setShowModal(false)} className="p-4 bg-white border border-slate-100 rounded-2xl text-brand-muted hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        <X size={24} />
                     </button>
                  </div>

                  <form onSubmit={handleAdd} className="p-8 md:p-16 space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-brand-depth uppercase tracking-[0.3em] px-4">To'liq ism-familiya</label>
                           <input 
                             required
                             type="text" 
                             value={formData.full_name}
                             onChange={e => setFormData({...formData, full_name: e.target.value})}
                             placeholder="Ism va familiyani kiriting"
                             className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-[2rem] outline-none font-black text-base transition-all shadow-inner"
                           />
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-brand-depth uppercase tracking-[0.3em] px-4">Bog'liqlik darajasi</label>
                           <div className="relative">
                              <select 
                                value={formData.relation}
                                onChange={e => setFormData({...formData, relation: e.target.value})}
                                className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-[2rem] outline-none font-black text-base transition-all appearance-none shadow-inner"
                              >
                                 {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-brand-primary">
                                 <Contact size={20} />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-brand-depth uppercase tracking-[0.3em] px-4">Aloqa telefoni</label>
                           <input 
                             required
                             type="tel" 
                             value={formData.phone}
                             onChange={e => setFormData({...formData, phone: e.target.value})}
                             placeholder="+998 -- --- -- --"
                             className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-[2rem] outline-none font-black text-base transition-all shadow-inner"
                           />
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-brand-depth uppercase tracking-[0.3em] px-4">Surat Manzili (URL)</label>
                           <div className="relative">
                              <input 
                                type="text" 
                                value={formData.photo_url}
                                onChange={e => setFormData({...formData, photo_url: e.target.value})}
                                placeholder="https://..."
                                className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-[2rem] outline-none font-black text-base transition-all shadow-inner"
                              />
                              <Camera className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                           </div>
                        </div>
                     </div>

                     <div className="pt-6">
                        <button 
                          disabled={isSaving}
                          className="w-full py-8 bg-brand-depth text-white rounded-[2.5rem] font-black uppercase text-sm tracking-[0.4em] shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-brand-primary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 relative group overflow-hidden"
                        >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                           {isSaving ? (
                              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                           ) : (
                              <>
                                 <Save size={24} /> Tasdiqlash va Saqlash
                              </>
                           )}
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </motion.div>
  );
};


