import React, { useState } from 'react';
import { User, MapPin, Smartphone, Briefcase, Fingerprint, Target, Edit2, Save, X, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import apiClient from '../../../api/apiClient';
import { useNotification } from '../../../context/NotificationContext';


export const ProfileSection = ({ parentData, onUpdate }: any) => {
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Local state for form data
  const [formData, setFormData] = useState({
    address: parentData.address || '',
    photo_url: parentData.photo_url || '',
    father: {
      workplace: parentData.fatherWorkplace || '',
      phone: parentData.fatherPhone || '',
      passport_no: parentData.fatherPassport || '',
    },
    mother: {
      workplace: parentData.motherWorkplace || '',
      phone: parentData.motherPhone || '',
      passport_no: parentData.motherPassport || '',
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Use parentData.id which is the child_id in this context
      await apiClient.put(`/parent-portal/profile/${parentData.id}`, formData);
      showNotification("Ma'lumotlar muvaffaqiyatli yangilandi!", "success");
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      showNotification("Saqlashda xatolik yuz berdi", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      setLoading(true);
      const res = await apiClient.post(`/upload`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, photo_url: res.data.url });
      showNotification("Rasm muvaffaqiyatli yuklandi!", "success");
    } catch (err) {
      showNotification("Rasmni yuklashda xatolik", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
      <div className="flex justify-between items-center px-2">
         <h3 className="text-xl md:text-2xl font-black text-brand-depth uppercase tracking-tighter">Profil ma'lumotlari</h3>
         {!isEditing ? (
           <button 
             onClick={() => setIsEditing(true)}
             className="flex items-center gap-2 px-6 py-3 bg-brand-primary/10 text-brand-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
           >
             <div className="flex items-center gap-2">
                <Edit2 size={14} /> Tahrirlash
             </div>
           </button>
         ) : (
           <div className="flex gap-2">
             <button 
               onClick={() => setIsEditing(false)}
               className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-brand-muted rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
             >
               <X size={14} /> Bekor qilish
             </button>
             <button 
               onClick={handleSave}
               disabled={loading}
               className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
             >
               {loading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={14} />} 
               Saqlash
             </button>
           </div>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Child Details */}
        <div className="space-y-6 md:space-y-8">
          <h4 className="flex items-center gap-3 text-xs md:text-sm font-black text-brand-depth uppercase tracking-[0.2em] md:tracking-[0.3em] px-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-primary rounded-full animate-pulse"></div>
            Bola Ma'lumotlari
          </h4>
          <div className="space-y-4 md:space-y-5">
             {/* Child Photo Section */}
             <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 mb-6">
                <div className="relative group cursor-pointer" onClick={() => isEditing && document.getElementById('child-photo-upload')?.click()}>
                   <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] md:rounded-[3rem] bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center relative">
                      {formData.photo_url ? (
                         <img src={formData.photo_url} alt="Bola rasmi" className="w-full h-full object-cover" />
                      ) : (
                         <User size={64} className="text-slate-200" />
                      )}
                      {loading && (
                         <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                         </div>
                      )}
                   </div>
                   {isEditing && (
                      <div className="absolute inset-0 bg-brand-depth/40 flex items-center justify-center rounded-[2.5rem] md:rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity">
                         <Camera size={32} className="text-white" />
                      </div>
                   )}
                </div>
                {isEditing && (
                   <div className="mt-4">
                      <input 
                         id="child-photo-upload"
                         type="file"
                         accept="image/*"
                         onChange={handleFileChange}
                         className="hidden"
                      />
                      <button 
                        type="button"
                        onClick={() => document.getElementById('child-photo-upload')?.click()}
                        className="px-6 py-2 bg-white border border-brand-border rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                      >
                         <Camera size={14} /> Rasmni tanlash
                      </button>
                   </div>
                )}
             </div>

             <div className="bg-white p-5 md:p-7 rounded-[1.5rem] md:rounded-[2.5rem] border border-brand-border shadow-sm group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 md:p-6 opacity-[0.03]">
                   <User size={48} className="md:w-[60px] md:h-[60px]" />
                </div>
                <p className="text-[8px] md:text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">To'liq ism-familiyasi</p>
                <p className="text-sm md:text-base font-black text-brand-depth">{parentData.first_name} {parentData.last_name}</p>
             </div>

             <div className="bg-white p-5 md:p-7 rounded-[1.5rem] md:rounded-[2.5rem] border border-brand-border shadow-sm group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 md:p-6 opacity-[0.03]">
                   <Target size={48} className="md:w-[60px] md:h-[60px]" />
                </div>
                <p className="text-[8px] md:text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Guvohnoma raqami</p>
                <p className="text-sm md:text-base font-black text-brand-depth">{parentData.birth_certificate_number}</p>
             </div>

             <div className={`bg-white p-5 md:p-7 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all ${isEditing ? 'border-brand-primary ring-4 ring-brand-primary/5' : 'border-brand-border'} shadow-sm group overflow-hidden relative`}>
                <div className="absolute top-0 right-0 p-4 md:p-6 opacity-[0.03]">
                   <MapPin size={48} className="md:w-[60px] md:h-[60px]" />
                </div>
                <p className="text-[8px] md:text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Yashash manzili</p>
                {isEditing ? (
                  <input 
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary/10 outline-none"
                  />
                ) : (
                  <p className="text-sm md:text-base font-black text-brand-depth">{formData.address || '--'}</p>
                )}
             </div>

             <div className="bg-gradient-to-br from-brand-primary to-brand-primary-dark p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform duration-700">
                   <Target size={80} className="md:w-[100px] md:h-[100px]" />
                </div>
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Hozirgi Guruhi</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{parentData.childGroup || '3-guruh'}</p>
             </div>
          </div>
        </div>

        {/* Parent Details */}
        <div className="space-y-6 md:space-y-8">
          <h4 className="flex items-center gap-3 text-xs md:text-sm font-black text-brand-depth uppercase tracking-[0.2em] md:tracking-[0.3em] px-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-rose-500 rounded-full"></div>
            Ota-ona Ma'lumotlari
          </h4>
          <div className="space-y-5 md:space-y-6">
             {/* Father */}
             <div className="bg-white p-6 md:p-8 rounded-[1.8rem] md:rounded-[3rem] border border-brand-border shadow-sm space-y-5 md:space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-brand-primary"></div>
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-[8px] md:text-[10px] font-black text-brand-primary uppercase tracking-widest">Otasi ma'lumotlari</p>
                      <h5 className="text-xl md:text-2xl font-black text-brand-depth mt-1 tracking-tight">{parentData.fatherName}</h5>
                   </div>
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-brand-muted"><User size={20} md:size={24} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                   <div className="bg-slate-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Briefcase size={14} md:size={16} className="text-brand-muted" />
                      <div className="flex-1">
                         <p className="text-[7px] md:text-[8px] font-black text-brand-muted uppercase">Ish joyi</p>
                         {isEditing ? (
                           <input 
                             type="text"
                             value={formData.father.workplace}
                             onChange={(e) => setFormData({...formData, father: {...formData.father, workplace: e.target.value}})}
                             className="w-full bg-white border border-brand-border rounded-lg py-1 px-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-brand-primary/10"
                           />
                         ) : (
                           <p className="text-xs font-bold text-brand-depth">{formData.father.workplace || 'Kiritilmagan'}</p>
                         )}
                      </div>
                   </div>
                   <div className="bg-slate-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Smartphone size={14} md:size={16} className="text-brand-muted" />
                      <div className="flex-1">
                         <p className="text-[7px] md:text-[8px] font-black text-brand-muted uppercase">Telefon</p>
                         {isEditing ? (
                           <input 
                             type="text"
                             value={formData.father.phone}
                             onChange={(e) => setFormData({...formData, father: {...formData.father, phone: e.target.value}})}
                             className="w-full bg-white border border-brand-border rounded-lg py-1 px-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-brand-primary/10"
                           />
                         ) : (
                           <p className="text-xs font-bold text-brand-depth">{formData.father.phone || '--'}</p>
                         )}
                      </div>
                   </div>
                   <div className="bg-slate-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 flex items-center gap-3 col-span-1 md:col-span-2">
                      <Fingerprint size={14} md:size={16} className="text-brand-muted" />
                      <div className="flex-1">
                         <p className="text-[7px] md:text-[8px] font-black text-brand-muted uppercase">Passport</p>
                         {isEditing ? (
                           <input 
                             type="text"
                             value={formData.father.passport_no}
                             onChange={(e) => setFormData({...formData, father: {...formData.father, passport_no: e.target.value}})}
                             className="w-full bg-white border border-brand-border rounded-lg py-1 px-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-brand-primary/10 uppercase"
                           />
                         ) : (
                           <p className="text-[10px] md:text-xs font-bold text-brand-depth uppercase tracking-widest">{formData.father.passport_no || '--'}</p>
                         )}
                      </div>
                   </div>
                </div>
             </div>

             {/* Mother */}
             <div className="bg-white p-6 md:p-8 rounded-[1.8rem] md:rounded-[3rem] border border-brand-border shadow-sm space-y-5 md:space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-rose-500"></div>
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-[8px] md:text-[10px] font-black text-rose-500 uppercase tracking-widest">Onasi ma'lumotlari</p>
                      <h5 className="text-xl md:text-2xl font-black text-brand-depth mt-1 tracking-tight">{parentData.motherName}</h5>
                   </div>
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-brand-muted"><User size={20} md:size={24} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                   <div className="bg-slate-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Briefcase size={14} md:size={16} className="text-brand-muted" />
                      <div className="flex-1">
                         <p className="text-[7px] md:text-[8px] font-black text-brand-muted uppercase">Ish joyi</p>
                         {isEditing ? (
                           <input 
                             type="text"
                             value={formData.mother.workplace}
                             onChange={(e) => setFormData({...formData, mother: {...formData.mother, workplace: e.target.value}})}
                             className="w-full bg-white border border-brand-border rounded-lg py-1 px-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-brand-primary/10"
                           />
                         ) : (
                           <p className="text-xs font-bold text-brand-depth">{formData.mother.workplace || 'Kiritilmagan'}</p>
                         )}
                      </div>
                   </div>
                   <div className="bg-slate-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Smartphone size={14} md:size={16} className="text-brand-muted" />
                      <div className="flex-1">
                         <p className="text-[7px] md:text-[8px] font-black text-brand-muted uppercase">Telefon</p>
                         {isEditing ? (
                           <input 
                             type="text"
                             value={formData.mother.phone}
                             onChange={(e) => setFormData({...formData, mother: {...formData.mother, phone: e.target.value}})}
                             className="w-full bg-white border border-brand-border rounded-lg py-1 px-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-brand-primary/10"
                           />
                         ) : (
                           <p className="text-xs font-bold text-brand-depth">{formData.mother.phone || '--'}</p>
                         )}
                      </div>
                   </div>
                   <div className="bg-slate-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 flex items-center gap-3 col-span-1 md:col-span-2">
                      <Fingerprint size={14} md:size={16} className="text-brand-muted" />
                      <div className="flex-1">
                         <p className="text-[7px] md:text-[8px] font-black text-brand-muted uppercase">Passport</p>
                         {isEditing ? (
                           <input 
                             type="text"
                             value={formData.mother.passport_no}
                             onChange={(e) => setFormData({...formData, mother: {...formData.mother, passport_no: e.target.value}})}
                             className="w-full bg-white border border-brand-border rounded-lg py-1 px-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-brand-primary/10 uppercase"
                           />
                         ) : (
                           <p className="text-[10px] md:text-xs font-bold text-brand-depth uppercase tracking-widest">{formData.mother.passport_no || '--'}</p>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
