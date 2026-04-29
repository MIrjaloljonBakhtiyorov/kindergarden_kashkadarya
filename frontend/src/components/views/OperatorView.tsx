import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  UserCircle, 
  Smartphone, 
  Package, 
  LogOut, 
  ClipboardCheck, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Edit2, 
  Trash2, 
  Clock, 
  History,
  FileDown
} from 'lucide-react';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';
import { ChildFormModal } from '../../features/children/components/ChildFormModal';
import { ChildrenTable } from '../../features/children/components/ChildrenTable';
import { StaffTable } from '../../features/staff/components/StaffTable';
import { StaffFormModal } from '../../features/staff/components/StaffFormModal';
import { GroupsList } from '../../features/groups/components/GroupsList';
import { ParentsTable } from '../../features/parents/components/ParentsTable';
import { useChildren } from '../../features/children/hooks/useChildren';
import { useGroups } from '../../features/groups/hooks/useGroups';
import { useStaff } from '../../features/staff/hooks/useStaff';
import { useOperations } from '../../features/operations/hooks/useOperations';
import { useNotification } from '../../context/NotificationContext';

interface OperatorViewProps {
  groups: any[];
  setGroups: React.Dispatch<React.SetStateAction<any[]>>;
}

const OperatorView: React.FC<OperatorViewProps> = ({ groups: initialGroups, setGroups }) => {
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'ADD_CHILD' | 'ADD_STAFF' | 'MANAGE_CHILDREN' | 'MANAGE_STAFF' | 'MANAGE_GROUPS' | 'MANAGE_PARENTS'>('DASHBOARD');
  const [editingChild, setEditingChild] = useState<any>(null);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const { children, createChild } = useChildren();
  const { groups } = useGroups();
  const { staff } = useStaff();
  const { operations } = useOperations();
  const { showNotification } = useNotification();

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          showNotification('Excel fayl bo\'sh!', 'error');
          return;
        }

        showNotification(`${data.length} ta qator topildi. Import boshlandi...`, 'info');

        let successCount = 0;
        let failCount = 0;

        for (const row of data as any[]) {
          try {
            // Ustun nomlarini qidirish (aqlli qidiruv)
            const getVal = (keys: string[]) => {
              const foundKey = Object.keys(row).find(k => keys.includes(k.trim()));
              return foundKey ? String(row[foundKey]).trim() : '';
            };

            const childData = {
              first_name: getVal(['Ismi', 'Ism', 'Name', 'First Name']),
              last_name: getVal(['Otasining ismi', 'Sharifi', 'Surname', 'Last Name', 'Patronymic']),
              birth_date: getVal(['Tug\'ilgan sana', 'Tugilgan sana', 'Birth Date', 'DOB']),
              age_category: getVal(['Yosh kategoriyasi', 'Yoshi', 'Age']),
              gender: getVal(['Jinsi', 'Jins', 'Gender']).toLowerCase().includes('qiz') ? 'F' : 'M',
              address: getVal(['Manzili', 'Manzil', 'Address']),
              birth_certificate_number: getVal(['Guvohnoma №', 'Guvohnoma', 'Certificate', 'Birth Certificate']),
              passport_info: getVal(['Passport', 'Pasport']),
              father_full_name: getVal(['Otasining F.I.Sh', 'Otasi', 'Father']),
              father_phone: getVal(['Otasining telefoni', 'Ota tel', 'Father Phone']),
              mother_full_name: getVal(['Onasining F.I.Sh', 'Onasi', 'Mother']),
              mother_phone: getVal(['Onasining telefoni', 'Ona tel', 'Mother Phone']),
              group_id: groups.find(g => g.name === getVal(['Guruhi', 'Guruh', 'Group']))?.id || '',
              status: 'PENDING'
            };

            // Tekshirish: Agar guruh topilmasa, birinchi mavjud guruhga biriktirish yoki xato berish
            if (!childData.group_id && groups.length > 0) {
               childData.group_id = groups[0].id;
            }

            await createChild(childData as any);
            successCount++;
          } catch (err) {
            failCount++;
            console.error('Row import failed:', row, err);
          }
        }
        
        if (failCount > 0) {
          showNotification(`${successCount} ta muvaffaqiyatli, ${failCount} ta xato.`, 'info');
        } else {
          showNotification(`Barcha ${successCount} ta bola import qilindi!`, 'success');
        }
        e.target.value = ''; 
      } catch (error) {
        showNotification('Excel faylni o\'qishda xatolik', 'error');
      }
    };
    reader.readAsBinaryString(file);
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'CREATE': return <Plus size={14} />;
      case 'UPDATE': return <Edit2 size={14} />;
      case 'DELETE': return <Trash2 size={14} />;
      default: return <History size={14} />;
    }
  };

  const getOperationColor = (type: string) => {
    switch (type) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-600';
      case 'UPDATE': return 'bg-amber-100 text-amber-600';
      case 'DELETE': return 'bg-rose-100 text-rose-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleEditChild = (child: any) => {
    setEditingChild(child);
    setViewMode('ADD_CHILD');
  };

  const handleEditStaff = (staffMember: any) => {
    setEditingStaff(staffMember);
    setViewMode('ADD_STAFF');
  };

  const closeChildModal = () => {
    setEditingChild(null);
    setViewMode('MANAGE_CHILDREN');
  };

  const closeStaffModal = () => {
    setEditingStaff(null);
    setViewMode('MANAGE_STAFF');
  };

  const renderModalContent = () => {
    if (viewMode === 'ADD_CHILD') {
      return <ChildFormModal child={editingChild} onClose={closeChildModal} />;
    }

    if (viewMode === 'ADD_STAFF') {
      return <StaffFormModal staffMember={editingStaff} onClose={closeStaffModal} />;
    }

    if (viewMode === 'MANAGE_CHILDREN') {
      return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="border-b border-brand-border flex items-center justify-between pb-6 mb-8">
              <h3 className="text-2xl font-black text-brand-depth">Bolalar ro'yxati</h3>
              <div className="flex gap-3">
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={handleImportExcel} 
                  className="hidden" 
                  id="excel-import" 
                />
                <label 
                  htmlFor="excel-import" 
                  className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <FileDown size={16} /> Excel Import
                </label>
              </div>
           </div>
           <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              <ChildrenTable onEdit={handleEditChild} />
           </div>
        </div>
      );
    }

    if (viewMode === 'MANAGE_GROUPS') {
      return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="border-b border-brand-border flex items-center justify-between pb-6 mb-8">
              <h3 className="text-2xl font-black text-brand-depth">Guruhlar boshqaruvi</h3>
           </div>
           <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              <GroupsList />
           </div>
        </div>
      );
    }

    if (viewMode === 'MANAGE_STAFF') {
      return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="border-b border-brand-border flex items-center justify-between pb-6 mb-8">
              <h3 className="text-2xl font-black text-brand-depth">Xodimlar ruyxati</h3>
           </div>
           <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              <StaffTable onEdit={handleEditStaff} />
           </div>
        </div>
      );
    }

    if (viewMode === 'MANAGE_PARENTS') {
      return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="border-b border-brand-border flex items-center justify-between pb-6 mb-8">
              <h3 className="text-2xl font-black text-brand-depth">
                Ota-onalar parollari va ID
              </h3>
           </div>
           <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              <ParentsTable />
           </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-wrap items-center gap-4">
        <button onClick={() => setViewMode('ADD_CHILD')} className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform"><Plus size={18}/> Yangi bola</button>
        <button onClick={() => setViewMode('ADD_STAFF')} className="bg-white text-brand-depth border border-brand-border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"><Plus size={18}/> Yangi xodim</button>
        <button onClick={() => setViewMode('MANAGE_CHILDREN')} className="bg-white text-brand-depth border border-brand-border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"><Users size={18}/> Bolalar</button>
        <button onClick={() => setViewMode('MANAGE_STAFF')} className="bg-white text-brand-depth border border-brand-border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"><UserCircle size={18}/> Xodimlar</button>
        <button onClick={() => setViewMode('MANAGE_GROUPS')} className="bg-white text-brand-depth border border-brand-border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"><Package size={18}/> Guruhlar</button>
        <button onClick={() => setViewMode('MANAGE_PARENTS')} className="bg-white text-brand-depth border border-brand-border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"><ShieldCheck size={18}/> Ota-onalar</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-brand-primary rounded-lg"><Users size={20} /></div>
          </div>
          <p className="text-brand-muted text-[11px] font-bold uppercase tracking-wider mb-1">Jami bolalar</p>
          <h3 className="text-2xl font-bold text-brand-depth">{children.length} ta</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm border-l-4 border-l-brand-emerald text-brand-depth">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 text-brand-emerald rounded-lg"><Package size={20} /></div>
          </div>
          <p className="text-brand-muted text-[11px] font-bold uppercase tracking-wider mb-1">Jami guruhlar</p>
          <h3 className="text-2xl font-bold text-brand-depth">{groups.length} ta</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><AlertCircle size={20} /></div>
          </div>
          <p className="text-brand-muted text-[11px] font-bold uppercase tracking-wider mb-1">Xatoliklar</p>
          <h3 className="text-2xl font-bold text-brand-depth">0 ta</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-brand-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
           <h4 className="font-bold text-base flex items-center gap-2">
             <History size={18} className="text-brand-primary" />
             So'nggi operatsiyalar
           </h4>
           <p className="text-[10px] text-brand-muted uppercase font-bold tracking-widest">Real vaqt rejimida</p>
        </div>
        <div className="divide-y divide-slate-50">
           {operations.length === 0 ? (
             <div className="p-20 text-center">
                <p className="text-brand-muted font-bold uppercase tracking-[0.2em] text-xs">Hozircha hech qanday operatsiya bajarilmadi.</p>
             </div>
           ) : (
             operations.map((op) => (
               <div key={op.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getOperationColor(op.operation_type)}`}>
                       {getOperationIcon(op.operation_type)}
                    </div>
                    <div>
                       <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-brand-depth">{op.entity_name}</span>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-brand-muted uppercase">{op.entity_type}</span>
                       </div>
                       <p className="text-xs text-brand-slate font-medium">{op.description}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-1.5 text-brand-muted">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold">{new Date(op.created_at).toLocaleTimeString()}</span>
                 </div>
               </div>
             ))
           )}
        </div>
      </div>

      {viewMode !== 'DASHBOARD' && (
        <div className="fixed inset-0 bg-brand-depth/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 lg:p-12 animate-in fade-in duration-300">
           <div className="bg-slate-50 w-full max-w-6xl h-full max-h-[90vh] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border border-white/20">
              <div className="absolute top-6 right-8 z-10">
                <button 
                  onClick={() => setViewMode('DASHBOARD')}
                  className="w-10 h-10 bg-white shadow-lg border border-brand-border rounded-full flex items-center justify-center text-brand-depth hover:bg-rose-50 hover:text-rose-500 hover:scale-110 transition-all active:scale-95 group"
                >
                  <span className="font-black text-xl leading-none group-hover:rotate-90 transition-transform">&times;</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                 {renderModalContent()}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OperatorView;
