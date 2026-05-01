import React, { useState, useMemo } from 'react';
import { useParents } from '../hooks/useParents';
import { useGroups } from '../../groups/hooks/useGroups';
import { Edit2, Trash2, Key, User, Phone, AlertTriangle, Search, Filter, X } from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';
import { ParentEditModal } from './ParentEditModal';

export const ParentsTable: React.FC = () => {
  const { parents, loading, deleteParent, updateParent } = useParents();
  const { groups } = useGroups();
  const { showNotification } = useNotification();
  const [editingParent, setEditingParent] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const filteredParents = useMemo(() => {
    return parents.filter(parent => {
      const matchesSearch = parent.childName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           parent.login?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = selectedGroup === 'ALL' || parent.childGroup === selectedGroup;
      
      return matchesSearch && matchesGroup;
    });
  }, [parents, searchQuery, selectedGroup]);

  if (loading) return <div className="p-8 text-center text-brand-muted font-bold italic tracking-widest uppercase text-xs">Yuklanmoqda...</div>;

  const handleDelete = async () => {
    if (!deletingId) return;
    
    try {
      await deleteParent(deletingId);
      showNotification('Ota-ona hisobi muvaffaqiyatli o\'chirildi', 'success');
      setDeletingId(null);
    } catch (error: any) {
      showNotification(error.response?.data?.error || 'O\'chirishda xatolik yuz berdi', 'error');
    }
  };

  const handleEdit = (parent: any) => {
    setEditingParent(parent);
  };

  const handleSave = async (id: string, data: any) => {
    try {
      await updateParent(id, data);
      showNotification('Ma\'lumotlar muvaffaqiyatli yangilandi', 'success');
      setEditingParent(null);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Yangilashda xatolik yuz berdi';
      showNotification(msg, 'error');
      throw error; 
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-6 bg-slate-50 border-b border-brand-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
          <input 
            type="text" 
            placeholder="Bolaning ismi yoki login bo'yicha qidiruv..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-white border border-brand-border rounded-xl font-bold text-sm outline-none focus:ring-4 ring-brand-primary/10 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-depth"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-black text-brand-muted uppercase tracking-widest mr-2">
            <Filter size={14} /> Filtr:
          </div>
          <select 
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="flex-1 md:w-60 px-4 py-3 bg-white border border-brand-border rounded-xl font-bold text-sm outline-none cursor-pointer focus:border-brand-primary transition-colors appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
          >
            <option value="ALL">Barcha guruhlar</option>
            {groups.map((g: any) => (
              <option key={g.id} value={g.name}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar border border-brand-border rounded-xl">
        <table className="w-full text-left min-w-[1200px] relative">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50 border-b border-brand-border text-[11px] text-brand-muted uppercase font-black tracking-widest shadow-sm">
              <th className="px-6 py-5 w-16 text-center">№</th>
              <th className="px-6 py-5">Bolaning F.I.Sh</th>
              <th className="px-6 py-5">Otasining F.I.Sh va Tel</th>
              <th className="px-6 py-5">Onasining F.I.Sh va Tel</th>
              <th className="px-6 py-5">Guruhi</th>
              <th className="px-6 py-5">Login</th>
              <th className="px-6 py-5">Parol</th>
              <th className="px-6 py-5 text-center">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredParents.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-20 text-center text-sm font-bold text-brand-muted uppercase tracking-widest bg-white">Hech qanday ma'lumot topilmadi.</td></tr>
            ) : (
              filteredParents.map((parent: any, index: number) => (
                <tr key={parent.id} className="group hover:bg-slate-50/80 transition-all bg-white">
                  <td className="px-6 py-6 text-center text-xs font-black text-brand-muted/50 group-hover:text-brand-primary">{index + 1}</td>
                  <td className="px-6 py-6">
                    <div className="font-black text-sm text-brand-depth group-hover:translate-x-1 transition-transform">{parent.childName}</div>
                    <div className="text-[10px] font-bold text-brand-muted mt-0.5">{parent.childBirthCertificate}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={12} className="text-brand-primary" />
                      <span className="font-bold text-xs text-brand-depth">{parent.fatherName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-brand-muted" />
                      <span className="text-xs font-medium text-brand-muted">{parent.fatherPhone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={12} className="text-rose-400" />
                      <span className="font-bold text-xs text-brand-depth">{parent.motherName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-brand-muted" />
                      <span className="text-xs font-medium text-brand-muted">{parent.motherPhone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 bg-brand-primary/5 text-brand-primary text-[10px] font-black rounded-full uppercase tracking-wider">
                      {parent.childGroup || 'Guruhsiz'}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                      <User size={12} className="text-brand-muted" />
                      <code className="text-xs font-black text-brand-depth">{parent.login}</code>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                      <Key size={12} className="text-brand-muted" />
                      <code className="text-xs font-black text-brand-depth">********</code>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => handleEdit(parent)}
                        className="p-2.5 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl transition-all shadow-sm hover:shadow-brand-primary/20"
                        title="Tahrirlash"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setDeletingId(parent.id)}
                        className="p-2.5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-rose-500/20"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deletingId && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 bg-black/20">
          <div className="bg-white w-full max-w-sm rounded-[10px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200 p-8 text-center">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-xl font-black text-brand-depth mb-2">Ishonchingiz komilmi?</h3>
            <p className="text-sm font-medium text-brand-muted mb-8">
              Ushbu ota-ona hisobini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeletingId(null)}
                className="flex-1 bg-slate-100 text-brand-depth py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
              >
                Bekor qilish
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {editingParent && (
        <ParentEditModal 
          parent={editingParent} 
          onClose={() => setEditingParent(null)} 
          onSave={handleSave}
        />
      )}
    </div>
  );
};
