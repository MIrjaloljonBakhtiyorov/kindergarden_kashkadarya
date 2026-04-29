import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Smartphone, Trash2, Contact, X, Save, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';

const API_BASE = 'http://localhost:3001/api';

const RELATIONS = [
  'Bobosi', 'Buvisi', 'Amakisi', 'Tog\'asi', 'Ammasi', 'Xolasi', 
  'Akasi', 'Opasi', 'Otasi', 'Onasi'
];

export const PickupSection = ({ data, onUpdate }: any) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
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
      await axios.post(`${API_BASE}/parent-portal/pickups`, {
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
    if (!confirm('Ushbu vakilni o\'chirishni xohlaysizmi?')) return;
    
    try {
      await axios.delete(`${API_BASE}/parent-portal/pickups/${id}`);
      showNotification('Vakil o\'chirildi', 'success');
      if (onUpdate) onUpdate();
    } catch (error) {
      showNotification('O\'chirishda xatolik', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-12">
       <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 border-slate-50 shadow-sm gap-6">
          <div className="text-center sm:text-left">
             <h4 className="text-2xl md:text-3xl font-black text-brand-depth tracking-tighter leading-none">Ishonchli Vakillar</h4>
             <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-2 flex items-center justify-center sm:justify-start gap-2">
                <ShieldCheck size={16} className="text-emerald-500" /> Faqat ruxsat etilgan shaxslar
             </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
             <UserCheck size={20} /> Yangi vakil
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {data?.pickups?.map((v:any) => (
             <div key={v.id} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-brand-border shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0 relative">
                   {v.photo_url ? (
                      <img src={v.photo_url} alt={v.full_name} className="w-full h-full object-cover" />
                   ) : (
                      <div className="text-brand-muted flex flex-col items-center">
                         <Contact size={40} md:size={48} className="opacity-20" />
                         <p className="text-[8px] font-black mt-2">RASM</p>
                      </div>
                   )}
                </div>
                <div className="flex-1 space-y-3">
                   <div>
                      <p className="text-[10px] md:text-[11px] font-black text-brand-primary uppercase tracking-widest mb-1">{v.relation}</p>
                      <p className="text-xl md:text-2xl font-black text-brand-depth tracking-tighter leading-none">{v.full_name}</p>
                   </div>
                   <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-brand-depth pt-1">
                      <Smartphone size={16} className="text-brand-muted" /> {v.phone}
                   </div>
                   <div className="pt-3 flex justify-center sm:justify-start">
                      <button 
                        onClick={() => handleDelete(v.id)}
                        className="px-5 py-2 bg-rose-50 text-rose-500 rounded-lg font-black text-[9px] uppercase tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      >
                         <Trash2 size={12} className="inline mr-1.5"/> O'chirish
                      </button>
                   </div>
                </div>
             </div>
          ))}
          {(!data?.pickups || data.pickups.length === 0) && (
            <div className="lg:col-span-2 py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                  <UserCheck size={40} />
               </div>
               <h5 className="text-xl font-black text-brand-depth">Hali vakillar qo'shilmagan</h5>
               <p className="text-sm text-brand-muted font-bold mt-2">Yangi vakil qo'shish tugmasini bosing</p>
            </div>
          )}
       </div>

       {/* Add Representative Modal */}
       <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setShowModal(false)}
                 className="absolute inset-0"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
               >
                  <div className="p-8 md:p-12">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="text-2xl font-black text-brand-depth uppercase tracking-tighter">Yangi vakil</h3>
                           <p className="text-brand-muted text-[10px] font-black uppercase tracking-[0.2em] mt-1">Ma'lumotlarni kiriting</p>
                        </div>
                        <button onClick={() => setShowModal(false)} className="p-3 bg-slate-100 rounded-2xl text-brand-muted hover:bg-rose-500 hover:text-white transition-all">
                           <X size={20} />
                        </button>
                     </div>

                     <form onSubmit={handleAdd} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-brand-depth uppercase tracking-widest px-4">F.I.SH</label>
                           <input 
                             required
                             type="text" 
                             value={formData.full_name}
                             onChange={e => setFormData({...formData, full_name: e.target.value})}
                             placeholder="Masalan: Bozorov Ahmad"
                             className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl outline-none font-bold text-sm transition-all"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-brand-depth uppercase tracking-widest px-4">Qarindoshligi</label>
                              <select 
                                value={formData.relation}
                                onChange={e => setFormData({...formData, relation: e.target.value})}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl outline-none font-bold text-sm transition-all appearance-none"
                              >
                                 {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-brand-depth uppercase tracking-widest px-4">Telefon</label>
                              <input 
                                required
                                type="tel" 
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                placeholder="+998 90 123 45 67"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl outline-none font-bold text-sm transition-all"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-brand-depth uppercase tracking-widest px-4">Rasm (URL)</label>
                           <div className="relative">
                              <input 
                                type="text" 
                                value={formData.photo_url}
                                onChange={e => setFormData({...formData, photo_url: e.target.value})}
                                placeholder="Ixtiyoriy rasm manzili"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl outline-none font-bold text-sm transition-all"
                              />
                              <Camera className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                           </div>
                        </div>

                        <div className="pt-6">
                           <button 
                             disabled={isSaving}
                             className="w-full py-5 bg-brand-depth text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-brand-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                           >
                              {isSaving ? (
                                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                 <>
                                    <Save size={18} /> Saqlash
                                 </>
                              )}
                           </button>
                        </div>
                     </form>
                  </div>
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </motion.div>
  );
};

