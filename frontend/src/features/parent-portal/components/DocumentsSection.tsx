import React, { useState } from 'react';
import { FileText, ShieldCheck, Download, Clock, Plus, X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import apiClient from '../../../api/apiClient';
import { useNotification } from '../../../context/NotificationContext';


const DOC_TYPES = [
  { id: 'MEDICAL', label: 'Tibbiy ma\'lumotnoma' },
  { id: 'ALLERGY', label: 'Allergiya haqida ma\'lumot' },
  { id: 'PASSPORT', label: 'Guvohnoma nusxasi' },
  { id: 'OTHER', label: 'Boshqa hujjatlar' }
];

export const DocumentsSection = ({ data, childId, onUpdate }: any) => {
  const { showNotification } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    type: 'MEDICAL',
    file: null as File | null,
    fileUrl: ''
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewDoc({ ...newDoc, file });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.file || !newDoc.title) {
      showNotification("Iltimos, barcha maydonlarni to'ldiring", "error");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload file
      const formData = new FormData();
      formData.append('image', newDoc.file); // Backend uses 'image' field for uploads
      
      const uploadRes = await apiClient.post(`/upload`, formData);
      const fileUrl = uploadRes.data.url;

      // 2. Save document metadata
      await apiClient.post(`/parent-portal/documents`, {
        child_id: childId,
        title: newDoc.title,
        type: newDoc.type,
        file_url: fileUrl
      });

      showNotification("Hujjat muvaffaqiyatli yuklandi!", "success");
      setIsModalOpen(false);
      setNewDoc({ title: '', type: 'MEDICAL', file: null, fileUrl: '' });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      showNotification("Hujjatni yuklashda xatolik", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-12">
       <div className="bg-white rounded-[2rem] md:rounded-[4rem] border-2 border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/20 gap-6">
             <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] bg-brand-primary text-white flex items-center justify-center shadow-lg border-4 border-white/20 shrink-0">
                   <FileText size={32} md:size={40} />
                </div>
                <div>
                   <h5 className="text-xl md:text-3xl font-black text-brand-depth tracking-tighter uppercase leading-none">Hujjatlar</h5>
                   <p className="text-[9px] md:text-[11px] font-black text-brand-muted uppercase tracking-widest mt-1 flex items-center justify-center md:justify-start gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" /> Maxfiy Arxiv
                   </p>
                </div>
             </div>
             <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all"
             >
                <Plus size={18} /> Hujjat yuklash
             </button>
          </div>
          <div className="divide-y divide-slate-100">
             {data?.documents?.length > 0 ? data.documents.map((doc:any) => (
                <div key={doc.id} className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between group hover:bg-slate-50/80 transition-all gap-6">
                   <div className="flex items-center gap-4 text-center md:text-left">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-brand-primary border-2 border-slate-100 shadow-md shrink-0">
                         <FileText size={24} md:size={32} />
                      </div>
                      <div>
                         <p className="font-bold md:font-black text-sm md:text-xl text-brand-depth tracking-tight group-hover:text-brand-primary transition-colors leading-none">{doc.title}</p>
                         <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                            <span className="px-3 py-1 bg-slate-100 text-brand-muted text-[8px] md:text-[9px] font-black uppercase rounded-lg border border-slate-200">{doc.type}</span>
                            <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-black text-brand-slate uppercase tracking-widest">
                               <Clock size={12} className="text-brand-primary" /> {doc.created_at?.split(' ')[0]}
                            </div>
                         </div>
                      </div>
                   </div>
                   <a 
                     href={doc.file_url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-depth text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-brand-primary transition-all active:scale-95 shrink-0"
                   >
                      <Download size={16} /> 
                      <span>Yuklab olish</span>
                   </a>
                </div>
             )) : (
               <div className="p-12 md:p-20 text-center text-brand-muted font-black uppercase tracking-widest text-[10px]">Hujjatlar mavjud emas</div>
             )}
          </div>
       </div>

       {/* Upload Modal */}
       <AnimatePresence>
          {isModalOpen && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute inset-0 bg-black/5"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-xl bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl overflow-hidden"
                >
                   <div className="p-8 md:p-12 border-b border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center">
                            <Upload size={24} />
                         </div>
                         <h3 className="text-xl md:text-2xl font-black text-brand-depth uppercase tracking-tighter">Yangi hujjat</h3>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={24} /></button>
                   </div>

                   <form onSubmit={handleUpload} className="p-8 md:p-12 space-y-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-2">Hujjat turi</label>
                         <div className="grid grid-cols-2 gap-3">
                            {DOC_TYPES.map(type => (
                               <button
                                 key={type.id}
                                 type="button"
                                 onClick={() => setNewDoc({...newDoc, type: type.id})}
                                 className={`px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all border-2 ${
                                   newDoc.type === type.id 
                                     ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/5' 
                                     : 'bg-white border-slate-100 text-brand-muted hover:border-slate-200'
                                 }`}
                               >
                                  {type.label}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-2">Hujjat nomi</label>
                         <input 
                           type="text"
                           value={newDoc.title}
                           onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                           placeholder="Masalan: Tibbiy ko'rik varaqasi"
                           className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl py-4 px-6 font-bold text-brand-depth outline-none transition-all shadow-inner"
                         />
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-2">Faylni tanlang</label>
                         <div 
                           onClick={() => document.getElementById('doc-file')?.click()}
                           className={`relative cursor-pointer group p-8 md:p-12 border-4 border-dashed rounded-[2.5rem] transition-all flex flex-col items-center text-center space-y-4 ${
                              newDoc.file ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-brand-primary/30 hover:bg-slate-50'
                           }`}
                         >
                            <input id="doc-file" type="file" onChange={handleFileChange} className="hidden" />
                            {newDoc.file ? (
                               <>
                                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"><CheckCircle2 size={32} /></div>
                                  <div>
                                     <p className="font-black text-brand-depth text-sm uppercase truncate max-w-[200px]">{newDoc.file.name}</p>
                                     <p className="text-[10px] font-black text-emerald-600 uppercase mt-1 tracking-widest">Fayl tayyor</p>
                                  </div>
                               </>
                            ) : (
                               <>
                                  <div className="w-16 h-16 bg-white text-brand-muted rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"><Upload size={32} /></div>
                                  <div>
                                     <p className="font-black text-brand-depth text-sm uppercase tracking-tight">Faylni bosing yoki sudrab keling</p>
                                     <p className="text-[10px] font-black text-brand-muted uppercase mt-1 tracking-widest">PDF, JPG, PNG (Max 10MB)</p>
                                  </div>
                               </>
                            )}
                         </div>
                      </div>

                      <div className="pt-4 flex flex-col gap-4">
                         <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                            <AlertCircle size={20} className="text-blue-500 shrink-0" />
                            <p className="text-[9px] font-bold text-blue-700 uppercase leading-relaxed tracking-wider">
                               Yuklangan hujjat bog'cha tarbiyachisi va ma'muriyatiga avtomatik ravishda yuboriladi.
                            </p>
                         </div>
                         <button 
                           type="submit"
                           disabled={isUploading}
                           className="w-full py-6 bg-brand-depth text-white font-black rounded-2xl md:rounded-3xl shadow-2xl shadow-brand-depth/30 hover:bg-brand-primary hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3"
                         >
                            {isUploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={20} />}
                            {isUploading ? 'Yuklanmoqda...' : 'Hujjatni tasdiqlash'}
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
