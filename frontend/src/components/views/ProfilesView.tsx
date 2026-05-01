import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Users, 
  Smartphone, 
  Key, 
  Fingerprint, 
  Edit3, 
  X, 
  Save, 
  Lock,
  UserCircle,
  Trash2,
  Search,
  Filter,
  FileDown,
  Contact
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useParents } from '../../features/parents/hooks/useParents';
import { useNotification } from '../../context/NotificationContext';
import { ParentPortalUser } from '../../features/parents/types/parentPortal.types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProfilesView: React.FC = () => {
  const { parents, loading, updateParent, deleteParent } = useParents();
  const { showNotification } = useNotification();
  const [editingParent, setEditingParent] = useState<ParentPortalUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const groups = Array.from(new Set(parents.map(p => p.childGroup).filter(Boolean)));

  const filteredParents = parents.filter(p => {
    const matchesSearch = 
      p.childName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.motherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.login?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = selectedGroup === 'ALL' || p.childGroup === selectedGroup;
    
    return matchesSearch && matchesGroup;
  });

  const downloadCertificate = (parent: ParentPortalUser) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.text('TUG\'ILGANLIK HAQIDA GUVOHNOMA', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`Guvohnoma raqami: ${parent.childBirthCertificate}`, 105, 30, { align: 'center' });

    // Content
    autoTable(doc, {
      startY: 40,
      head: [['Tavsif', 'Ma\'lumot']],
      body: [
        ['Bola ismi familiyasi', parent.childName],
        ['Guruhi', parent.childGroup || 'Guruhsiz'],
        ['Otasi', parent.fatherName || '-'],
        ['Otasining passporti', parent.fatherPassport || '-'],
        ['Onasi', parent.motherName || '-'],
        ['Onasining passporti', parent.motherPassport || '-'],
        ['Tizim kodi', parent.id],
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.setFontSize(10);
    doc.text('KinderFlow Management System orqali tasdiqlangan', 105, doc.internal.pageSize.height - 10, { align: 'center' });
    
    doc.save(`${parent.childName}_guvohnoma.pdf`);
    showNotification('PDF yuklab olindi', 'success');
  };

  const handleEditClick = (parent: ParentPortalUser) => {
    setEditingParent({ ...parent, password: '' });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteParent(id);
      showNotification('Profil o‘chirib tashlandi', 'success');
    } catch (error) {
      showNotification('Xatolik yuz berdi', 'error');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParent) return;

    try {
      await updateParent(editingParent.id, {
        login: editingParent.login,
        password: editingParent.password
      });
      showNotification('Ma’lumotlar muvaffaqiyatli yangilandi!', 'success');
      setEditingParent(null);
    } catch (error) {
      showNotification('Xatolik yuz berdi', 'error');
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-brand-muted animate-pulse">Yuklanmoqda...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-10 rounded-[2.5rem] border border-brand-border shadow-xl shadow-slate-200/50 gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-brand-primary/10 transition-all duration-700"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-brand-depth tracking-tight">Ota-ona va bolalar profillari</h2>
          <p className="text-brand-muted text-sm font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-primary" />
            Tizimga kirish xavfsizligi va nazorati
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 relative z-10">
           <div className="px-6 py-4 bg-slate-50 rounded-[1.5rem] flex items-center gap-3 border border-brand-border shadow-inner">
              <Users size={18} className="text-brand-primary" />
              <div className="flex flex-col">
                <span className="text-base font-black text-brand-depth leading-none">{parents.length}</span>
                <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest mt-0.5">Jami</span>
              </div>
           </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-slate" size={20} />
           <input 
             type="text" 
             placeholder="Ism, login yoki ota-onasi bo'yicha qidirish..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-slate-50 border border-brand-border rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-bold text-sm"
           />
        </div>
        <div className="relative w-full md:w-64">
           <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-slate" size={18} />
           <select 
             value={selectedGroup}
             onChange={(e) => setSelectedGroup(e.target.value)}
             className="w-full bg-slate-50 border border-brand-border rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
           >
              <option value="ALL">Barcha guruhlar</option>
              {groups.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-brand-border shadow-2xl shadow-slate-200/40 overflow-hidden">
        <div className="p-8 border-b border-brand-border bg-slate-50/30 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center">
                <Fingerprint size={18} />
             </div>
             <h3 className="font-black text-brand-depth uppercase text-xs tracking-widest">Aktiv foydalanuvchilar jadvali</h3>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1400px]">
            <thead>
              <tr className="bg-slate-50/20 border-b border-brand-border text-[10px] text-brand-muted uppercase font-black tracking-widest">
                <th className="px-6 py-6 text-center w-16">№</th>
                <th className="px-6 py-6">Bolaning F.I.Sh / Guvohnoma</th>
                <th className="px-6 py-6">Otasi (F.I.Sh / Tel / Passport)</th>
                <th className="px-6 py-6">Onasi (F.I.Sh / Tel / Passport)</th>
                <th className="px-6 py-6">Login ma'lumotlari</th>
                <th className="px-6 py-6 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredParents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center text-brand-muted font-bold uppercase tracking-widest text-xs">
                    Ma'lumot topilmadi
                  </td>
                </tr>
              ) : (
                filteredParents.map((parent, index) => (
                  <tr key={parent.id} className="hover:bg-brand-primary/[0.02] transition-all group/row">
                    <td className="px-6 py-7 text-center text-xs font-black text-brand-muted">{index + 1}</td>
                    <td className="px-6 py-7">
                      <div className="flex flex-col gap-1">
                         <span className="text-sm font-black text-brand-depth group-hover/row:text-brand-primary transition-colors">{parent.childName}</span>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] text-brand-muted font-bold uppercase">{parent.childBirthCertificate}</span>
                            <button 
                              onClick={() => downloadCertificate(parent)}
                              className="p-1.5 bg-slate-100 text-brand-depth hover:bg-brand-primary hover:text-white rounded-md transition-all"
                              title="PDF yuklab olish"
                            >
                              <FileDown size={12} />
                            </button>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex flex-col gap-1">
                         <span className="text-sm font-bold text-brand-slate">{parent.fatherName || 'Kiritilmagan'}</span>
                         <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-[10px] text-brand-muted font-bold">
                               <Smartphone size={10} /> {parent.fatherPhone || '-'}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-brand-muted font-bold">
                               <Contact size={10} /> {parent.fatherPassport || '-'}
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex flex-col gap-1">
                         <span className="text-sm font-bold text-brand-slate">{parent.motherName || 'Kiritilmagan'}</span>
                         <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-[10px] text-brand-muted font-bold">
                               <Smartphone size={10} /> {parent.motherPhone || '-'}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-brand-muted font-bold">
                               <Contact size={10} /> {parent.motherPassport || '-'}
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-brand-border w-fit group-hover/row:bg-white transition-colors">
                            <UserCircle size={12} className="text-brand-primary" />
                            <span className="text-xs font-mono font-bold text-brand-depth">{parent.login}</span>
                         </div>
                         <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-brand-border w-fit group-hover/row:bg-white transition-colors">
                            <Lock size={12} className="text-brand-muted" />
                            <span className="text-[10px] font-mono font-bold text-brand-muted tracking-tighter">••••••••</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-7 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-all translate-x-4 group-hover/row:translate-x-0">
                         <button 
                           onClick={() => handleEditClick(parent)}
                           className="p-2.5 bg-white text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl transition-all border border-brand-border shadow-sm active:scale-95"
                           title="Tahrirlash"
                         >
                           <Edit3 size={14} />
                         </button>
                         <button 
                           onClick={() => handleDelete(parent.id)}
                           className="p-2.5 bg-white text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-brand-border shadow-sm active:scale-95"
                           title="O'chirish"
                         >
                           <Trash2 size={14} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingParent && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingParent(null)}
              className="absolute inset-0 bg-black/20"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white w-full max-w-xl rounded-[10px] shadow-[0_32px_128px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden border border-white/20"
            >
              <div className="h-2 bg-brand-primary"></div>
              <div className="p-10 sm:p-14 overflow-y-auto max-h-[85vh] custom-scrollbar">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-brand-depth tracking-tight">
                      Profilni tahrirlash
                    </h3>
                    <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest mt-1">
                      {`${editingParent.childName}`}
                    </p>
                  </div>
                  <button 
                    onClick={() => setEditingParent(null)}
                    className="w-12 h-12 rounded-2xl bg-slate-50 border border-brand-border flex items-center justify-center text-brand-depth hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-brand-muted uppercase ml-2 tracking-widest">Login *</label>
                         <div className="relative">
                            <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted" />
                            <input 
                              type="text" 
                              value={editingParent.login}
                              onChange={(e) => setEditingParent({...editingParent, login: e.target.value})}
                              className="w-full bg-slate-50 border border-brand-border rounded-[1.5rem] py-5 pl-14 pr-6 font-bold text-brand-depth focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                              placeholder="login_id..."
                              required
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-brand-muted uppercase ml-2 tracking-widest">Yangi Parol (ixtiyoriy)</label>
                         <div className="relative">
                            <Key size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted" />
                            <input 
                              type="password" 
                              value={editingParent.password || ''}
                              onChange={(e) => setEditingParent({...editingParent, password: e.target.value})}
                              className="w-full bg-slate-50 border border-brand-border rounded-[1.5rem] py-5 pl-14 pr-6 font-bold text-brand-depth focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                              placeholder="O'zgartirmaslik uchun bo'sh qoldiring"
                            />
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setEditingParent(null)}
                      className="flex-1 py-5 rounded-[1.5rem] border border-brand-border font-black text-brand-muted hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
                    >
                      Bekor qilish
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-5 bg-brand-primary text-white rounded-[1.5rem] font-black shadow-2xl shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-3"
                    >
                      <Save size={18} /> Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilesView;
