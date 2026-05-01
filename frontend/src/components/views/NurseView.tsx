import React, { useState, useMemo, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import apiClient from '../../api/apiClient';
import { 
  Users, AlertTriangle, ShieldCheck, HeartPulse, Activity, 
  ArrowLeft, Search, Filter, Eye, Edit3, PlusCircle,
  Thermometer, Scale, Ruler, FileText, Calendar, Clock,
  Stethoscope, ChevronLeft, ChevronRight, AlertCircle, Plus, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NurseView: React.FC = () => {
  const { showNotification } = useNotification();
  
  // Data States
  const [allChildren, setAllChildren] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [allergies, setAllergies] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'GROUP' | 'PROFILE'>('DASHBOARD');
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  
  // Modal States
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordForm, setRecordForm] = useState({
    child_id: '',
    status: 'Sog\'lom', // 'Sog\'lom' | 'Kasal'
    hasAllergy: 'Yo\'q', // 'Yo\'q' | 'Bor'
    allergyType: '',
    illnessType: '',
    notes: '',
    weight: '',
    height: '',
    temperature: ''
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [childrenRes, groupsRes, allergiesRes] = await Promise.all([
        apiClient.get('/children'),
        apiClient.get('/groups'),
        apiClient.get('/health/allergies')
      ]);
      setAllChildren(childrenRes.data);
      setGroups(groupsRes.data);
      setAllergies(allergiesRes.data);
    } catch (err) {
      showNotification("Ma'lumotlarni yuklashda xatolik", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupHistory = async (groupId: string) => {
    try {
      const res = await apiClient.get(`/health/history/${groupId}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Xatolik:", err);
    }
  };

  // --- KPI Calculations ---
  const stats = useMemo(() => {
    const total = allChildren.length;
    // Basic age calculation from birth_date or age_category
    const age1_3 = allChildren.filter(c => c.age_category === '1-3 yosh' || c.age_category === 'Kichik yosh').length;
    const age3_7 = allChildren.filter(c => c.age_category === '3-7 yosh' || c.age_category === 'Katta yosh' || c.age_category === 'Tayyorlov guruh').length;
    // In our generic schema, 'is_allergic' might not be directly on child object, we check allergies field or watchlist
    const allergyCount = allChildren.filter(c => c.allergies && c.allergies.trim() !== '').length;
    // We assume 'status' or checking recent history for 'Kasal'. We'll approximate from allChildren if possible, or use a default if not tracked directly.
    const sickCount = allChildren.filter(c => c.medical_notes?.toLowerCase().includes('kasal') || c.status === 'SICK').length || 0; // Fallback to 0 if not tracked globally this way

    return { total, age1_3, age3_7, sickCount, allergyCount };
  }, [allChildren]);

  const groupSummaries = useMemo(() => {
    return groups.map(g => {
      const groupChildren = allChildren.filter(c => c.group_id === g.id);
      const sick = groupChildren.filter(c => c.medical_notes?.toLowerCase().includes('kasal') || c.status === 'SICK').length;
      const allergy = groupChildren.filter(c => c.allergies && c.allergies.trim() !== '').length;
      return { ...g, total: groupChildren.length, sick, allergy };
    });
  }, [groups, allChildren]);

  // --- Handlers ---
  const handleOpenGroup = (group: any) => {
    setSelectedGroup(group);
    fetchGroupHistory(group.id);
    setViewMode('GROUP');
  };

  const handleOpenProfile = (child: any) => {
    setSelectedChild(child);
    setViewMode('PROFILE');
  };

  const handleOpenRecordModal = (child: any) => {
    setSelectedChild(child);
    setRecordForm({
      child_id: child.id,
      status: (child.status === 'SICK' || child.medical_notes?.toLowerCase().includes('kasal')) ? 'Kasal' : 'Sog\'lom',
      hasAllergy: (child.allergies && child.allergies.trim() !== '') ? 'Bor' : 'Yo\'q',
      allergyType: child.allergies || '',
      illnessType: '',
      notes: '',
      weight: child.weight || '',
      height: child.height || '',
      temperature: ''
    });
    setIsRecordModalOpen(true);
  };

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      const isSick = recordForm.status === 'Kasal';
      const allergyStr = recordForm.hasAllergy === 'Bor' ? recordForm.allergyType : '';
      const finalNotes = isSick && recordForm.illnessType ? `Kasallik: ${recordForm.illnessType} | ${recordForm.notes}` : recordForm.notes;

      await apiClient.post('/health/batch', {
        group_name: selectedGroup.name,
        records: [{
          child_id: recordForm.child_id,
          weight: parseFloat(recordForm.weight) || null,
          height: parseFloat(recordForm.height) || null,
          temperature: parseFloat(recordForm.temperature) || null,
          allergy: allergyStr,
          is_sick: isSick,
          notes: finalNotes,
          is_allergic: recordForm.hasAllergy === 'Bor'
        }]
      });
      
      showNotification("Tibbiy qayd saqlandi!", "success");
      setIsRecordModalOpen(false);
      fetchAllData();
      fetchGroupHistory(selectedGroup.id);
    } catch (err) {
      showNotification("Saqlashda xatolik yuz berdi", "error");
    }
  };

  const currentDate = new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-brand-primary animate-pulse font-black text-xl">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-sm border border-brand-border mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-brand-primary/10 text-brand-primary flex items-center justify-center rounded-xl sm:rounded-2xl">
            <HeartPulse size={20} className="sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-brand-depth tracking-tight">Hamshira Paneli</h1>
            <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest mt-0.5 sm:mt-1">Bugungi sog'liq monitoringi</p>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-brand-depth text-sm font-bold">{currentDate}</p>
            <p className="text-brand-muted text-[9px] font-black uppercase tracking-widest">Tizim vaqti</p>
          </div>
          <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-black uppercase tracking-widest">Real-time</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD VIEW */}
      <AnimatePresence mode="wait">
        {viewMode === 'DASHBOARD' && (
          <motion.div key="dashboard" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-6 sm:space-y-8">
            
            {/* KPI CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-[1.5rem] border border-brand-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 text-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center"><Users size={16} className="sm:w-5 sm:h-5"/></div>
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black text-brand-muted uppercase tracking-wider sm:tracking-widest mb-1">Jami bolalar</p>
                  <p className="text-xl sm:text-3xl font-black text-brand-depth">{stats.total}</p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-[1.5rem] border border-brand-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center"><ShieldCheck size={16} className="sm:w-5 sm:h-5"/></div>
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black text-brand-muted uppercase tracking-wider sm:tracking-widest mb-1">1-3 yosh</p>
                  <p className="text-xl sm:text-3xl font-black text-brand-depth">{stats.age1_3}</p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-[1.5rem] border border-brand-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-50 text-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center"><Activity size={16} className="sm:w-5 sm:h-5"/></div>
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black text-brand-muted uppercase tracking-wider sm:tracking-widest mb-1">3-7 yosh</p>
                  <p className="text-xl sm:text-3xl font-black text-brand-depth">{stats.age3_7}</p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-[1.5rem] border border-brand-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-50 text-rose-500 rounded-lg sm:rounded-xl flex items-center justify-center"><AlertTriangle size={16} className="sm:w-5 sm:h-5"/></div>
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black text-brand-muted uppercase tracking-wider sm:tracking-widest mb-1">Kasal bolalar</p>
                  <p className="text-xl sm:text-3xl font-black text-rose-500">{stats.sickCount}</p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-[1.5rem] border border-brand-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow col-span-2 lg:col-span-1">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 text-amber-500 rounded-lg sm:rounded-xl flex items-center justify-center"><Thermometer size={16} className="sm:w-5 sm:h-5"/></div>
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black text-brand-muted uppercase tracking-wider sm:tracking-widest mb-1">Allergiyasi bor</p>
                  <p className="text-xl sm:text-3xl font-black text-amber-500">{stats.allergyCount}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* GROUP HEALTH SUMMARY */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-black text-brand-depth">Guruhlar nazorati</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {groupSummaries.map(g => (
                    <div 
                      key={g.id} 
                      onClick={() => handleOpenGroup(g)}
                      className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm hover:shadow-xl hover:border-brand-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-black text-brand-depth group-hover:text-brand-primary transition-colors">{g.name}</h4>
                        <ChevronRight className="text-brand-slate group-hover:text-brand-primary group-hover:translate-x-1 transition-all" size={20} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-brand-muted" />
                          <span className="text-xs font-bold text-brand-slate">{g.total}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className={g.sick > 0 ? 'text-rose-500' : 'text-brand-muted'} />
                          <span className={`text-xs font-bold ${g.sick > 0 ? 'text-rose-500' : 'text-brand-slate'}`}>{g.sick} kasal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer size={14} className={g.allergy > 0 ? 'text-amber-500' : 'text-brand-muted'} />
                          <span className={`text-xs font-bold ${g.allergy > 0 ? 'text-amber-500' : 'text-brand-slate'}`}>{g.allergy} allergiya</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ALERTS SYSTEM */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-brand-depth">Sog'liq Ogohlantirishlari</h3>
                <div className="bg-white rounded-[2rem] border border-brand-border shadow-sm overflow-hidden p-6 space-y-4 h-full max-h-[500px] overflow-y-auto custom-scrollbar">
                  {stats.sickCount > 0 && (
                    <div className="flex gap-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in slide-in-from-right">
                      <div className="mt-1"><AlertCircle className="text-rose-500" size={20}/></div>
                      <div>
                        <p className="text-sm font-black text-rose-700">Kasal bolalar mavjud</p>
                        <p className="text-[11px] font-bold text-rose-600/80 mt-1">Tizimda bugun {stats.sickCount} ta kasal bola qayd etilgan.</p>
                      </div>
                    </div>
                  )}
                  {allergies.length > 0 && (
                    <div className="flex gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl animate-in slide-in-from-right delay-100">
                      <div className="mt-1"><AlertCircle className="text-amber-500" size={20}/></div>
                      <div>
                        <p className="text-sm font-black text-amber-700">Allergiya nazorati</p>
                        <p className="text-[11px] font-bold text-amber-600/80 mt-1">{allergies.length} ta bolada allergiya holati aniqlangan. Menyuni tekshiring.</p>
                      </div>
                    </div>
                  )}
                  {stats.sickCount === 0 && allergies.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center text-brand-muted">
                      <ShieldCheck size={40} className="text-emerald-500 opacity-50 mb-3" />
                      <p className="text-sm font-black uppercase tracking-widest">Barchasi joyida</p>
                      <p className="text-xs font-bold mt-1">Xavotirga o'rin yo'q</p>
                    </div>
                  )}
                  
                  {/* Miniature alert list based on real allergy data */}
                  {allergies.slice(0, 5).map((a: any, idx: number) => (
                    <div key={idx} className="flex gap-3 p-3 bg-slate-50 border border-brand-border rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="text-xs font-black text-brand-depth">{a.first_name} {a.last_name}</p>
                        <p className="text-[9px] font-bold text-brand-muted mt-0.5">{a.allergies}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* GROUP VIEW */}
        {viewMode === 'GROUP' && selectedGroup && (
          <motion.div key="group" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setViewMode('DASHBOARD')} className="w-12 h-12 bg-white rounded-[1rem] border border-brand-border flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <ArrowLeft size={20} className="text-brand-depth" />
                </button>
                <div>
                  <h2 className="text-3xl font-black text-brand-depth">{selectedGroup.name}</h2>
                  <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest mt-1">Guruh sog'liq jurnali</p>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                <input 
                  type="text" 
                  placeholder="Ism bo'yicha qidirish..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 bg-white border border-brand-border rounded-[1rem] py-3 pl-12 pr-4 font-bold text-sm outline-none focus:border-brand-primary transition-colors shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-brand-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-brand-muted tracking-widest border-b border-brand-border">
                      <th className="px-8 py-6">Bola F.I.Sh</th>
                      <th className="px-6 py-6">Guruh</th>
                      <th className="px-6 py-6">Yosh</th>
                      <th className="px-6 py-6">Holat</th>
                      <th className="px-6 py-6">Allergiya</th>
                      <th className="px-8 py-6 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allChildren
                      .filter(c => c.group_id === selectedGroup.id)
                      .filter(c => (c.first_name + ' ' + c.last_name).toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((child: any) => {
                        const isSick = child.medical_notes?.toLowerCase().includes('kasal') || child.status === 'SICK';
                        const hasAllergy = child.allergies && child.allergies.trim() !== '';

                        return (
                          <tr key={child.id} className="hover:bg-brand-primary/[0.02] transition-colors group">
                            <td className="px-8 py-5">
                              <p className="text-sm font-black text-brand-depth">{child.first_name} {child.last_name}</p>
                            </td>
                            <td className="px-6 py-5 text-xs font-bold text-brand-slate">{selectedGroup.name}</td>
                            <td className="px-6 py-5 text-xs font-bold text-brand-slate">{child.age_category || '-'}</td>
                            <td className="px-6 py-5">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isSick ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isSick ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                                {isSick ? 'Kasal' : 'Sog\'lom'}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${hasAllergy ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-brand-muted border border-brand-border'}`}>
                                {hasAllergy ? '⚠ Bor' : '❌ Yo\'q'}
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleOpenProfile(child)} className="p-2 text-brand-slate hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors" title="Ko'rish">
                                  <Eye size={18} />
                                </button>
                                <button onClick={() => handleOpenRecordModal(child)} className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                                  <PlusCircle size={14} /> Qayd qilish
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* PROFILE VIEW */}
        {viewMode === 'PROFILE' && selectedChild && (
          <motion.div key="profile" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="space-y-6">
            <button onClick={() => setViewMode('GROUP')} className="flex items-center gap-2 text-brand-muted hover:text-brand-primary font-black text-[10px] uppercase tracking-widest transition-colors mb-4">
              <ArrowLeft size={16} /> Jadvalga qaytish
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Info */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-sm flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-primary/20 to-blue-500/20 text-brand-primary rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                  <Stethoscope size={40} />
                </div>
                <h2 className="text-2xl font-black text-brand-depth">{selectedChild.first_name} {selectedChild.last_name}</h2>
                <p className="text-brand-muted font-bold text-sm mt-1">{selectedChild.age_category || 'Yosh kiritilmagan'} • {selectedGroup?.name}</p>
                
                <div className="w-full mt-8 space-y-4">
                  <div className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-brand-border">
                    <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Joriy Holat</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${(selectedChild.status === 'SICK' || selectedChild.medical_notes?.toLowerCase().includes('kasal')) ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {(selectedChild.status === 'SICK' || selectedChild.medical_notes?.toLowerCase().includes('kasal')) ? 'Kasal' : 'Sog\'lom'}
                    </span>
                  </div>
                  <div className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-brand-border">
                    <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Allergiya</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedChild.allergies ? 'text-amber-500' : 'text-brand-slate'}`}>
                      {selectedChild.allergies || "Yo'q"}
                    </span>
                  </div>
                  <button onClick={() => handleOpenRecordModal(selectedChild)} className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2">
                    <Edit3 size={16} /> Yangi Qayd Qo'shish
                  </button>
                </div>
              </div>

              {/* Timeline & History */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-sm h-[600px] overflow-y-auto custom-scrollbar">
                <h3 className="text-xl font-black text-brand-depth mb-6 flex items-center gap-2"><History size={20} className="text-brand-primary"/> Tibbiy Tarix (Timeline)</h3>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-border before:to-transparent">
                  {history.filter(h => h.child_id === selectedChild.id).length > 0 ? (
                    history.filter(h => h.child_id === selectedChild.id).map((record, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-50 text-brand-slate group-[.is-active]:bg-emerald-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          {record.is_sick ? <AlertTriangle size={14}/> : <Activity size={14}/>}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white border border-brand-border shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-brand-depth text-sm">{record.is_sick ? 'Kasallik qayd etildi' : 'Sog\'lom ko\'rik'}</span>
                            <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest">{record.date}</span>
                          </div>
                          <div className="space-y-1 mt-3 text-xs text-brand-slate font-medium">
                            {record.temperature && <p>Harorat: {record.temperature}°C</p>}
                            {record.weight && <p>Vazn: {record.weight}kg</p>}
                            {record.notes && <p className="mt-2 text-brand-depth italic bg-slate-50 p-2 rounded-lg">"{record.notes}"</p>}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-brand-muted font-bold text-sm italic">
                      Bu bola uchun tibbiy tarix mavjud emas.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MEDICAL RECORD MODAL */}
      <AnimatePresence>
        {isRecordModalOpen && selectedChild && (
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 bg-black/5 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-[10px] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-white/20 relative overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black text-brand-depth tracking-tight">Tibbiy Qayd</h3>
                  <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mt-1">Holatni va ko'rik natijalarini kiritish</p>
                </div>
                <button onClick={() => setIsRecordModalOpen(false)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all font-black text-xl">&times;</button>
              </div>
              
              <form onSubmit={handleSaveRecord} className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-[10px] border border-brand-border flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-primary"><Users size={24}/></div>
                  <div>
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Bemor (Bola)</p>
                    <p className="text-lg font-black text-brand-depth">{selectedChild.first_name} {selectedChild.last_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Umumiy Holat</label>
                    <select 
                      value={recordForm.status} 
                      onChange={e => setRecordForm({...recordForm, status: e.target.value})}
                      className={`w-full bg-white border-2 rounded-[10px] p-4 font-black outline-none transition-colors ${recordForm.status === 'Kasal' ? 'border-rose-100 text-rose-600 focus:border-rose-400' : 'border-emerald-100 text-emerald-600 focus:border-emerald-400'}`}
                    >
                      <option value="Sog'lom">Sog'lom</option>
                      <option value="Kasal">Kasal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Allergiya holati</label>
                    <select 
                      value={recordForm.hasAllergy} 
                      onChange={e => setRecordForm({...recordForm, hasAllergy: e.target.value})}
                      className={`w-full bg-white border-2 rounded-[10px] p-4 font-black outline-none transition-colors ${recordForm.hasAllergy === 'Bor' ? 'border-amber-100 text-amber-600 focus:border-amber-400' : 'border-slate-100 text-brand-slate focus:border-brand-primary'}`}
                    >
                      <option value="Yo'q">Yo'q</option>
                      <option value="Bor">Bor</option>
                    </select>
                  </div>
                </div>

                {recordForm.hasAllergy === 'Bor' && (
                  <div className="space-y-2 animate-in slide-in-from-top-2">
                    <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Allergiya turi</label>
                    <input 
                      required
                      placeholder="Masalan: Sutga, Sitrus mevalarga..."
                      value={recordForm.allergyType}
                      onChange={e => setRecordForm({...recordForm, allergyType: e.target.value})}
                      className="w-full bg-amber-50/50 border border-amber-200 rounded-[10px] p-4 font-bold outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                )}

                {recordForm.status === 'Kasal' && (
                  <div className="space-y-2 animate-in slide-in-from-top-2">
                    <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1">Kasallik turi (Tashxis)</label>
                    <input 
                      required
                      placeholder="Masalan: O'RVI, Shamollash..."
                      value={recordForm.illnessType}
                      onChange={e => setRecordForm({...recordForm, illnessType: e.target.value})}
                      className="w-full bg-rose-50/50 border border-rose-200 rounded-[10px] p-4 font-bold outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 border-t border-brand-border pt-6 mt-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Harorat (°C)</label>
                    <input 
                      type="number" step="0.1" placeholder="36.6"
                      value={recordForm.temperature} onChange={e => setRecordForm({...recordForm, temperature: e.target.value})}
                      className="w-full bg-white border border-brand-border rounded-[10px] p-4 font-black outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Vazn (kg)</label>
                    <input 
                      type="number" step="0.1" placeholder="15.5"
                      value={recordForm.weight} onChange={e => setRecordForm({...recordForm, weight: e.target.value})}
                      className="w-full bg-white border border-brand-border rounded-[10px] p-4 font-black outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Bo'y (sm)</label>
                    <input 
                      type="number" step="1" placeholder="105"
                      value={recordForm.height} onChange={e => setRecordForm({...recordForm, height: e.target.value})}
                      className="w-full bg-white border border-brand-border rounded-[10px] p-4 font-black outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Izoh va Ko'rsatmalar</label>
                  <textarea 
                    rows={3}
                    placeholder="Qo'shimcha tibbiy ko'rsatmalar yoki dori-darmonlar..."
                    value={recordForm.notes}
                    onChange={e => setRecordForm({...recordForm, notes: e.target.value})}
                    className="w-full bg-white border border-brand-border rounded-[10px] p-4 font-bold outline-none focus:border-brand-primary resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-brand-border">
                  <button type="submit" className="w-full py-5 bg-brand-primary text-white rounded-[10px] font-black uppercase text-sm tracking-[0.2em] shadow-xl shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all active:scale-95">
                    Saqlash va Qayd etish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default NurseView;
