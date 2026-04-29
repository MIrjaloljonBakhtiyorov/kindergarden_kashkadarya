import React, { useState } from 'react';
import { useGroups } from '../hooks/useGroups';
import { GroupFormModal } from './GroupFormModal';
import { Group } from '../types/group.types';
import { Pencil, Trash2 } from 'lucide-react';

export const GroupsList: React.FC = () => {
  const { groups, loading, createGroup, updateGroup, deleteGroup } = useGroups();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);

  if (loading) return <div className="p-8 text-center text-brand-muted font-bold">Yuklanmoqda...</div>;

  const handleCreate = () => {
    setSelectedGroup(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
       <button onClick={handleCreate} className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold mb-6 shadow-lg shadow-brand-primary/10">+ Yangi guruh yaratish</button>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.length === 0 ? (
            <div className="col-span-full py-10 text-center text-brand-muted font-bold">Guruhlar mavjud emas.</div>
          ) : (
            groups.map(group => (
              <div key={group.id} className="p-5 bg-white rounded-3xl border border-brand-border flex items-center justify-between group hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/5 transition-all">
                 <div className="flex-1 min-w-0 pr-4">
                    <span className="font-black text-brand-depth block text-lg truncate">{group.name}</span>
                    <p className="text-[10px] text-brand-slate uppercase font-bold tracking-wider mt-1 flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-brand-primary rounded-full"></span>
                      {group.teacher_name} 
                      <span className="text-brand-border mx-1">|</span>
                      {group.capacity} o'rin 
                      <span className="text-brand-border mx-1">|</span>
                      {group.age_limit}
                    </p>
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => handleEdit(group)} 
                     title="Tahrirlash"
                     className="w-10 h-10 flex items-center justify-center text-brand-primary bg-brand-primary/5 rounded-2xl hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                   >
                     <Pencil size={18} />
                   </button>
                   <button 
                     onClick={() => deleteGroup(group.id)} 
                     title="O‘chirish"
                     className="w-10 h-10 flex items-center justify-center text-rose-500 bg-rose-50 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
              </div>
            ))
          )}
       </div>

       {isModalOpen && (
         <GroupFormModal 
           group={selectedGroup}
           onClose={() => setIsModalOpen(false)}
           onSubmit={async (data) => {
             if (selectedGroup) {
               await updateGroup(selectedGroup.id, data);
             } else {
               await createGroup(data);
             }
           }}
         />
       )}
    </div>
  );
};
