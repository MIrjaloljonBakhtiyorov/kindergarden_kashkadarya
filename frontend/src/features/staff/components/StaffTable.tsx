import React from 'react';
import { useStaff } from '../hooks/useStaff';
import { Edit2, Trash2, Users } from 'lucide-react';

interface Props {
  onEdit?: (staff: any) => void;
}

export const StaffTable: React.FC<Props> = ({ onEdit }) => {
  const { staff, loading, deleteStaff } = useStaff();

  if (loading) return <div className="p-8 text-center text-brand-muted font-bold">Yuklanmoqda...</div>;

  const handleDelete = async (id: string) => {
    await deleteStaff(id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[1000px]">
        <thead>
          <tr className="bg-slate-50 border-b border-brand-border text-[11px] text-brand-muted uppercase font-bold tracking-wider">
            <th className="px-4 py-4 w-12 text-center">№</th>
            <th className="px-4 py-4">F.I.Sh</th>
            <th className="px-4 py-4">Passport</th>
            <th className="px-4 py-4">Telefon</th>
            <th className="px-4 py-4">Guruhi</th>
            <th className="px-4 py-4 text-center">Bolalar soni</th>
            <th className="px-4 py-4 text-center">Amallar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {staff.length === 0 ? (
            <tr><td colSpan={7} className="px-4 py-4 text-center text-sm text-brand-muted">Hech qanday ma'lumot topilmadi.</td></tr>
          ) : (
            staff.map((s: any, index: number) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-5 text-center text-xs font-bold text-brand-muted">{index + 1}</td>
                <td className="px-4 py-5">
                  <div className="font-black text-sm text-brand-depth">{s.full_name}</div>
                  <div className="text-[10px] text-brand-muted uppercase font-bold">{s.position}</div>
                </td>
                <td className="px-4 py-5 text-sm font-medium text-brand-muted">{s.passport_no}</td>
                <td className="px-4 py-5 text-sm font-medium text-brand-muted">{s.phone}</td>
                <td className="px-4 py-5 text-sm font-medium text-brand-muted">{s.group_name || 'Guruhsiz'}</td>
                <td className="px-4 py-5 text-center">
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-brand-primary rounded-lg text-xs font-bold">
                    <Users size={12} />
                    {s.child_count || 0}
                  </div>
                </td>
                <td className="px-4 py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onEdit?.(s)}
                      className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50/50 rounded-lg transition-colors"
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
  );
};
