import React, { useState, useRef, useMemo } from 'react';
import { Camera, X, Check, Users, Utensils, Info, ArrowRight, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSUMPTION_LEVELS } from '../constants/inspector.constants';
import { useGroups } from '../../groups/hooks/useGroups';
import { useChildren } from '../../children/hooks/useChildren';

interface FoodConsumptionMonitorProps {
  onDataChange?: (data: Record<string, any>, stats: any) => void;
  initialData?: Record<string, any>;
}

export const FoodConsumptionMonitor: React.FC<FoodConsumptionMonitorProps> = ({ onDataChange, initialData }) => {
  const { groups, loading: groupsLoading } = useGroups();
  const { children, loading: childrenLoading } = useChildren();
  
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [consumption, setConsumption] = useState<Record<string, { level: number; image: string | null; comment: string }>>(initialData || {});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);

  // Notify parent of changes
  const notifyParent = (updatedConsumption: Record<string, any>) => {
    const currentList = children; // Base stats on all children for global progress
    const answeredData = Object.values(updatedConsumption);
    
    const stats = {
      total: currentList.length,
      answered: answeredData.length,
      full: answeredData.filter(c => c.level === 100).length,
      partial: answeredData.filter(c => c.level > 0 && c.level < 100).length,
      none: answeredData.filter(c => c.level === 0).length,
      average: answeredData.length 
        ? Math.round(answeredData.reduce((acc, curr) => acc + curr.level, 0) / answeredData.length)
        : 0
    };
    onDataChange?.(updatedConsumption, stats);
  };

  const selectedGroup = useMemo(() => 
    groups.find(g => g.id === selectedGroupId), 
    [groups, selectedGroupId]
  );

  const filteredChildren = useMemo(() => {
    let list = children;
    if (selectedGroupId !== 'all') {
      list = list.filter(c => c.group_name === selectedGroup?.name);
    }
    if (searchQuery) {
      list = list.filter(c => 
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  }, [children, selectedGroupId, selectedGroup, searchQuery]);

  const handleLevelSelect = (childId: string, level: number) => {
    const updated = { 
      ...consumption, 
      [childId]: { ...consumption[childId], level, image: consumption[childId]?.image || null, comment: consumption[childId]?.comment || '' } 
    };
    setConsumption(updated);
    notifyParent(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChildId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = { 
          ...consumption, 
          [activeChildId]: { ...consumption[activeChildId], image: reader.result as string } 
        };
        setConsumption(updated);
        notifyParent(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = useMemo(() => {
    const currentList = children;
    const answeredData = Object.values(consumption);
    
    return {
      total: currentList.length,
      answered: answeredData.length,
      full: answeredData.filter(c => c.level === 100).length,
      partial: answeredData.filter(c => c.level > 0 && c.level < 100).length,
      none: answeredData.filter(c => c.level === 0).length,
      average: answeredData.length 
        ? Math.round(answeredData.reduce((acc, curr) => acc + curr.level, 0) / answeredData.length)
        : 0
    };
  }, [children, consumption]);

  if (groupsLoading || childrenLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Group Selector & Info */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 shrink-0">
              <Users size={24} className="text-blue-600" />
              Guruhni tanlang
            </h3>
            
            <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              <button
                onClick={() => setSelectedGroupId('all')}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                  selectedGroupId === 'all' 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-transparent bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    selectedGroupId === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'
                  }`}>
                    <Users size={18} />
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${selectedGroupId === 'all' ? 'text-blue-900' : 'text-slate-700'}`}>
                      Barcha bolalar
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {children.length} nafar bola
                    </p>
                  </div>
                </div>
                {selectedGroupId === 'all' && <ArrowRight size={16} className="text-blue-600" />}
              </button>

              {groups.map(group => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                    selectedGroupId === group.id 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-transparent bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      selectedGroupId === group.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'
                    }`}>
                      <Users size={18} />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold text-sm ${selectedGroupId === group.id ? 'text-blue-900' : 'text-slate-700'}`}>
                        {group.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {group.teacher_name || 'Ustoz biriktirilmagan'}
                      </p>
                    </div>
                  </div>
                  {selectedGroupId === group.id && <ArrowRight size={16} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <h4 className="text-lg font-black flex items-center gap-2 mb-4 uppercase tracking-tight">
              <Info size={20} className="text-blue-200" />
              Audit Yo'riqnomasi
            </h4>
            <ul className="space-y-3 text-sm text-blue-50 font-medium">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                Har bir bola bo'yicha iste'mol darajasini belgilang.
              </li>
              <li className="flex gap-2 text-blue-100">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                0% va 25% tanlanganda tarelka rasmi shart.
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Consumption Table & Stats */}
        <div className="lg:w-2/3 space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Jami bolalar', value: stats.total, color: 'text-slate-900', bg: 'bg-white' },
              { label: 'To‘liq yeganlar', value: stats.full, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Yemaganlar', value: stats.none, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'O‘rtacha %', value: `${stats.average}%`, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} p-6 rounded-[2rem] border border-slate-100 shadow-sm`}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                <h4 className={`text-2xl font-black ${s.color}`}>{s.value}</h4>
              </div>
            ))}
          </div>

          {/* Children Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Utensils size={20} />
                </div>
                Bolalar ro‘yxati
              </h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ism bo'yicha qidirish..." 
                  className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl w-full md:w-64 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto max-h-[800px] custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] border-b border-slate-100">
                    <th className="px-8 py-5">Bola F.I.Sh</th>
                    <th className="px-8 py-5 text-center">Iste’mol darajasi</th>
                    <th className="px-8 py-5 text-right">Tarelka rasmi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredChildren.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                        Ushbu guruhda bolalar topilmadi
                      </td>
                    </tr>
                  ) : (
                    filteredChildren.map((child) => {
                      const data = consumption[child.id];
                      const needsPhoto = data?.level === 0 || data?.level === 25;
                      
                      return (
                        <tr key={child.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div>
                              <p className="font-black text-slate-900">{child.first_name} {child.last_name}</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{child.group_name || 'Guruhsiz'}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-center gap-1.5">
                              {CONSUMPTION_LEVELS.map((level) => (
                                <button
                                  key={level.value}
                                  onClick={() => handleLevelSelect(child.id, level.value)}
                                  className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all border-2 ${
                                    data?.level === level.value 
                                      ? `bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110` 
                                      : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600'
                                  }`}
                                  title={level.description}
                                >
                                  {level.label}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end">
                              {data?.image ? (
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-200 group">
                                  <img src={data.image} alt="Plate" className="w-full h-full object-cover" />
                                  <button 
                                    onClick={() => setConsumption(prev => ({ ...prev, [child.id]: { ...prev[child.id], image: null } }))}
                                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => { setActiveChildId(child.id); fileInputRef.current?.click(); }}
                                  className={`w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                                    needsPhoto 
                                      ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' 
                                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500'
                                  }`}
                                >
                                  <Camera size={20} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
    </div>
  );
};
