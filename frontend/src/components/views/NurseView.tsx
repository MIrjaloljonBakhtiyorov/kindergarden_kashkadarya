import React, { useState, useMemo, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';
import { 
  Stethoscope, 
  Save, 
  ArrowLeft,
  Users,
  Scale,
  Ruler,
  AlertTriangle,
  History,
  Activity,
  Thermometer,
  Utensils,
  Coffee,
  UserRound,
  ShieldCheck,
  PieChart,
  MilkOff
} from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

interface MedicalData {
  weight: string;
  height: string;
  temperature: string;
  allergy: string;
  isAllergic: boolean;
  isSick: boolean;
  notes: string;
}

const NurseView: React.FC = () => {
  const { showNotification } = useNotification();
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [children, setChildren] = useState<any[]>([]);
  
  const [medicalRecords, setMedicalRecords] = useState<Record<string, MedicalData>>({});
  const [archive, setArchive] = useState<any[]>([]);
  const [allergyWatchlist, setAllergyWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [globalStats, setGlobalStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    checked: 0,
    notChecked: 0,
    sick: 0,
    healthy: 0,
    age1_3: 0,
    age3_7: 0,
    allergyCount: 0
  });

  useEffect(() => {
    fetchGroups();
    fetchArchive();
    fetchGlobalStats();
    fetchAllergies();
  }, []);

  const fetchAllergies = async () => {
    try {
      const res = await axios.get(`${API_BASE}/health/allergies`);
      setAllergyWatchlist(res.data);
    } catch (err) {
      console.error("Error fetching allergies:", err);
    }
  };

  const fetchGlobalStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/attendance/today-stats`);
      setGlobalStats(res.data);
    } catch (err) {
      console.error("Error fetching global stats:", err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_BASE}/groups`);
      setGroups(res.data);
    } catch (err) {
      showNotification("Guruhlarni yuklashda xatolik", "error");
    }
  };

  const fetchArchive = async () => {
    try {
      const res = await axios.get(`${API_BASE}/health/archive`);
      setArchive(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChildren = async (groupId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/children`);
      const filtered = res.data.filter((c: any) => c.group_id === groupId);
      setChildren(filtered);
      
      const records: Record<string, MedicalData> = {};
      filtered.forEach((c: any) => {
        records[c.id] = {
          weight: c.weight?.toString() || '',
          height: c.height?.toString() || '',
          temperature: '',
          allergy: c.allergies || '',
          isAllergic: !!c.allergies,
          isSick: false,
          notes: c.medical_notes || ''
        };
      });
      setMedicalRecords(records);
    } catch (err) {
      showNotification("Bolalar ro'yxatini yuklashda xatolik", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    fetchChildren(groupId);
  };

  const selectedGroup = useMemo(() => {
    return groups.find(g => g.id === selectedGroupId);
  }, [groups, selectedGroupId]);

  const stats = useMemo(() => {
    const total = children.length;
    const records = Object.values(medicalRecords) as MedicalData[];
    const sickCount = records.filter(r => r.isSick).length;
    const measuredCount = records.filter(r => r.weight || r.height || r.temperature).length;

    return {
      total,
      sickCount,
      healthyCount: total - sickCount,
      measuredCount
    };
  }, [medicalRecords, children]);

  const handleDataChange = (childId: string, field: keyof MedicalData, value: any) => {
    setMedicalRecords(prev => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedGroup) return;

    const recordsToSave = Object.entries(medicalRecords).map(([childId, recordData]) => {
      const data = recordData as MedicalData;
      return {
        child_id: childId,
        weight: parseFloat(data.weight) || null,
        height: parseFloat(data.height) || null,
        temperature: parseFloat(data.temperature) || null,
        allergy: data.allergy,
        is_sick: data.isSick,
        notes: data.notes
      };
    });

    try {
      await axios.post(`${API_BASE}/health/batch`, {
        group_name: selectedGroup.name,
        records: recordsToSave
      });
      showNotification("Ma'lumotlar muvaffaqiyatli saqlandi va arxivlandi!", "success");
      fetchArchive();
    } catch (err) {
      showNotification("Saqlashda xatolik yuz berdi", "error");
    }
  };

  if (!selectedGroupId || !selectedGroup) {
    return (
      <div className="p-8 animate-in fade-in max-w-6xl mx-auto space-y-10">
        <header>
          <h2 className="text-4xl font-black text-brand-depth tracking-tight text-center">Tibbiy nazorat</h2>
          <p className="text-brand-muted font-bold uppercase text-[10px] tracking-widest mt-2 text-center">Bolalarning salomatligi va rivojlanishi monitoringi</p>
        </header>

        {/* Global Summary Dashboard */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white p-4 rounded-[2rem] border border-brand-border shadow-sm text-center">
              <Users className="mx-auto mb-2 text-brand-primary" size={18} />
              <p className="text-[7px] font-black text-brand-muted uppercase tracking-widest">Jami</p>
              <p className="text-xl font-black text-brand-depth">{globalStats.total}</p>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-[2rem] border border-emerald-100 text-center">
              <Activity className="mx-auto mb-2 text-emerald-600" size={18} />
              <p className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">Kelgan</p>
              <p className="text-xl font-black text-emerald-600">{globalStats.present}</p>
            </div>
            <div className="bg-rose-50/50 p-4 rounded-[2rem] border border-rose-100 text-center">
              <AlertTriangle className="mx-auto mb-2 text-rose-500" size={18} />
              <p className="text-[7px] font-black text-rose-500 uppercase tracking-widest">Kelmagan</p>
              <p className="text-xl font-black text-rose-500">{globalStats.absent}</p>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-[2rem] border border-blue-100 text-center">
              <ShieldCheck className="mx-auto mb-2 text-blue-600" size={18} />
              <p className="text-[7px] font-black text-blue-600 uppercase tracking-widest">Ko'rikdan</p>
              <p className="text-xl font-black text-blue-600">{(globalStats as any).checked || 0}</p>
            </div>
            <div className="bg-emerald-100/30 p-4 rounded-[2rem] border border-emerald-200 text-center">
              <Activity className="mx-auto mb-2 text-emerald-700" size={18} />
              <p className="text-[7px] font-black text-emerald-700 uppercase tracking-widest">Sog'lom</p>
              <p className="text-xl font-black text-emerald-700">{(globalStats as any).healthy || 0}</p>
            </div>
            <div className="bg-rose-100/30 p-4 rounded-[2rem] border border-rose-200 text-center">
              <AlertTriangle className="mx-auto mb-2 text-rose-700" size={18} />
              <p className="text-[7px] font-black text-rose-700 uppercase tracking-widest">Nosog'lom</p>
              <p className="text-xl font-black text-rose-700">{(globalStats as any).sick || 0}</p>
            </div>
            <div className="bg-orange-50/50 p-4 rounded-[2rem] border border-orange-100 text-center">
              <MilkOff className="mx-auto mb-2 text-orange-600" size={18} />
              <p className="text-[7px] font-black text-orange-600 uppercase tracking-widest">Allergiya</p>
              <p className="text-xl font-black text-orange-600">{(globalStats as any).allergyCount || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-brand-border shadow-sm overflow-hidden p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-brand-primary">
                  <PieChart size={20} />
                </div>
                <h3 className="font-black text-brand-depth uppercase text-xs tracking-widest">Yosh toifasi statistikasi</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-brand-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center font-black text-sm">1-3</div>
                    <div>
                      <p className="text-[8px] font-black text-brand-muted uppercase tracking-widest">Kichik yoshdagilar</p>
                      <p className="text-base font-bold text-brand-depth">1 - 3 yosh</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-600">{(globalStats as any).age1_3 || 0}</p>
                    <p className="text-[7px] font-bold text-brand-muted uppercase tracking-widest">ta bola</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-brand-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black text-sm">3-7</div>
                    <div>
                      <p className="text-[8px] font-black text-brand-muted uppercase tracking-widest">Katta yoshdagilar</p>
                      <p className="text-base font-bold text-brand-depth">3 - 7 yosh</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-600">{(globalStats as any).age3_7 || 0}</p>
                    <p className="text-[7px] font-bold text-brand-muted uppercase tracking-widest">ta bola</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-brand-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-brand-border bg-orange-50/30 flex items-center justify-between">
                <h3 className="font-black text-orange-700 uppercase text-[10px] tracking-widest flex items-center gap-2">
                  <MilkOff size={16} /> Allergiya nazorati
                </h3>
                <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">{allergyWatchlist.length}</span>
              </div>
              <div className="max-h-[160px] overflow-y-auto p-4 space-y-3">
                {allergyWatchlist.length > 0 ? allergyWatchlist.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-brand-border">
                    <div>
                      <p className="text-[11px] font-black text-brand-depth">{c.first_name} {c.last_name}</p>
                      <p className="text-[9px] font-bold text-brand-muted">{c.group_name}</p>
                    </div>
                    <div className="bg-orange-100 text-orange-700 text-[9px] font-black px-2 py-1 rounded-md max-w-[100px] truncate">
                      {c.allergies}
                    </div>
                  </div>
                )) : (
                  <p className="text-[10px] text-brand-muted italic text-center py-4">Allergiya aniqlanmadi</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(g => (
            <button 
              key={g.id} 
              onClick={() => handleGroupSelect(g.id)} 
              className="p-8 bg-white border border-brand-border rounded-[2.5rem] text-left transition-all hover:border-brand-primary hover:shadow-2xl hover:shadow-brand-primary/5 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                  <Stethoscope size={28} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Bolalar soni</p>
                  <p className="text-2xl font-black text-brand-depth">{(g.children || []).length}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-black text-brand-depth text-2xl group-hover:text-brand-primary transition-colors">{g.name}</h3>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-brand-muted">
                    <UserRound size={14} className="text-brand-primary/60" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">{g.teacher_name || 'Tarbiyachi tayinlanmagan'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-muted">
                    <Scale size={14} className="text-brand-primary/60" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">{g.age_limit || 'Yosh toifasi yo\'q'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-brand-border flex justify-between items-center">
                <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Guruhni tanlash</span>
                <ArrowLeft className="rotate-180 text-brand-primary" size={16} />
              </div>

              {/* Decorative element */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-all"></div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-brand-border shadow-sm overflow-hidden mt-12">
          <div className="p-8 border-b border-brand-border bg-slate-50/30 flex items-center justify-between">
             <h3 className="font-black text-brand-depth uppercase text-xs tracking-widest flex items-center gap-2">
               <History size={18} className="text-brand-primary" />
               Tibbiy arxiv (Kunlik hisobotlar)
             </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-brand-muted uppercase font-black tracking-widest border-b border-brand-border bg-slate-50/10">
                  <th className="py-6 px-8">Sana</th>
                  <th className="py-6 px-8">Guruh</th>
                  <th className="py-6 px-8">O'lchandi</th>
                  <th className="py-6 px-8">Nosog'lom / Sog'lom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {archive.length > 0 ? archive.map((a, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-8 font-bold text-brand-depth">{a.date}</td>
                    <td className="py-5 px-8 text-brand-slate font-bold">{a.group_name}</td>
                    <td className="py-5 px-8 text-blue-600 font-black">{a.total_measured} ta</td>
                    <td className="py-5 px-8">
                      <span className="text-rose-500 font-black">{a.sick_count}</span> / <span className="text-emerald-600 font-black">{a.total_measured - a.sick_count}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-brand-muted font-bold italic uppercase text-[10px] tracking-widest">
                      Hozircha arxivda ma'lumot yo'q
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-in fade-in space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-xl shadow-slate-200/50 gap-6">
        <div className="space-y-1">
          <button onClick={() => setSelectedGroupId(null)} className="text-brand-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mb-2 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={14} /> Guruhlarga qaytish
          </button>
          <h2 className="text-3xl font-black text-brand-depth tracking-tight">"{selectedGroup.name}" - Tibbiy jadval</h2>
        </div>
        <button 
          onClick={handleSave} 
          className="w-full md:w-auto bg-emerald-500 text-white font-black uppercase text-xs tracking-widest px-10 py-5 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Save size={18} /> Saqlash va Arxivlash
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm text-center">
          <Users className="mx-auto mb-2 text-brand-muted" size={18} />
          <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Guruhda</p>
          <p className="text-3xl font-black text-brand-depth">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm text-center">
          <Activity className="mx-auto mb-2 text-blue-500" size={18} />
          <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest">O'lchandi</p>
          <p className="text-3xl font-black text-brand-depth text-blue-500">{stats.measuredCount}</p>
        </div>
        <div className="bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100 text-center">
          <AlertTriangle className="mx-auto mb-2 text-rose-500" size={18} />
          <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Kasal / Shikoyat</p>
          <p className="text-3xl font-black text-rose-500">{stats.sickCount}</p>
        </div>
        <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 text-center">
          <Activity className="mx-auto mb-2 text-emerald-600" size={18} />
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Sog'lom</p>
          <p className="text-3xl font-black text-emerald-600">{stats.healthyCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-brand-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-brand-border bg-slate-50/30">
          <h3 className="font-black text-brand-depth uppercase text-xs tracking-widest flex items-center gap-2">
            <Stethoscope size={18} className="text-brand-primary" />
            Tibbiy nazorat jadvali
          </h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center font-bold text-brand-muted animate-pulse">Yuklanmoqda...</div>
          ) : (
            <table className="w-full text-left min-w-[1100px]">
              <thead>
                <tr className="text-[10px] text-brand-muted uppercase font-black tracking-widest border-b border-brand-border bg-slate-100/50">
                  <th className="py-6 px-8 bg-slate-100/30">Umumiy ma'lumot</th>
                  <th colSpan={2} className="py-6 px-4 text-center bg-blue-50/50 border-x border-brand-border">
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <Scale size={14} /> Oylik rivojlanish (Growth)
                    </div>
                  </th>
                  <th colSpan={5} className="py-6 px-4 text-center bg-emerald-50/30">
                    <div className="flex items-center justify-center gap-2 text-emerald-600">
                      <Activity size={14} /> Kunlik tibbiy nazorat
                    </div>
                  </th>
                </tr>
                <tr className="text-[10px] text-brand-muted uppercase font-black tracking-widest border-b border-brand-border bg-slate-50/10">
                  <th className="py-4 px-8">Bolaning F.I.Sh</th>
                  <th className="py-4 px-4 text-center border-l border-brand-border">Vazni (kg)</th>
                  <th className="py-4 px-4 text-center border-r border-brand-border">Bo'yi (sm)</th>
                  <th className="py-4 px-4">Harorat (°C)</th>
                  <th colSpan={2} className="py-4 px-4 text-center border-x border-brand-border bg-orange-50/20">
                    <div className="flex items-center justify-center gap-2 text-orange-600">
                       Allergiya (Bor/Turi)
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center">Holati</th>
                  <th className="py-4 px-8">Izoh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {children.map((child: any) => {
                  const record = medicalRecords[child.id] || { weight: '', height: '', temperature: '', allergy: '', isSick: false, isAllergic: false, notes: '' };
                  return (
                    <tr key={child.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-brand-depth">{child.first_name} {child.last_name}</span>
                          {record.isAllergic && (
                            <button 
                              onClick={() => showNotification(`Allergiya: ${record.allergy || 'Noma\'lum'}`, 'warning')}
                              className="text-orange-500 hover:scale-110 transition-transform"
                            >
                              <AlertTriangle size={14} fill="currentColor" fillOpacity={0.1} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-4 bg-blue-50/10 border-l border-brand-border">
                        <div className="relative flex justify-center">
                          <input 
                            type="number" 
                            step="0.1"
                            value={record.weight}
                            onChange={(e) => handleDataChange(child.id, 'weight', e.target.value)}
                            placeholder="0.0" 
                            className="w-20 px-3 py-2 bg-white border border-blue-100 rounded-xl text-xs font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-500/20 text-center" 
                          />
                        </div>
                      </td>
                      <td className="py-5 px-4 bg-blue-50/10 border-r border-brand-border">
                        <div className="relative flex justify-center">
                          <input 
                            type="number" 
                            value={record.height}
                            onChange={(e) => handleDataChange(child.id, 'height', e.target.value)}
                            placeholder="0" 
                            className="w-20 px-3 py-2 bg-white border border-blue-100 rounded-xl text-xs font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-500/20 text-center" 
                          />
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <div className="relative">
                          <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
                          <input 
                            type="number" 
                            step="0.1"
                            value={record.temperature}
                            onChange={(e) => handleDataChange(child.id, 'temperature', e.target.value)}
                            placeholder="36.6" 
                            className="w-24 pl-9 pr-3 py-2 bg-slate-50 border border-brand-border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-primary/10" 
                          />
                        </div>
                      </td>
                      <td className="py-5 px-2 bg-orange-50/10 border-l border-orange-100 w-10">
                        <div className="flex justify-center">
                          <input 
                            type="checkbox"
                            checked={record.isAllergic}
                            onChange={(e) => handleDataChange(child.id, 'allergy', e.target.checked ? 'ALLERGIC' : '')}
                            className="w-4 h-4 rounded border-orange-200 text-orange-500 focus:ring-orange-500/20"
                          />
                        </div>
                      </td>
                      <td className="py-5 px-2 bg-orange-50/10 border-r border-orange-100">
                        <input 
                          type="text" 
                          value={record.allergy}
                          onChange={(e) => handleDataChange(child.id, 'allergy', e.target.value)}
                          placeholder={record.isAllergic ? "Allergiya turi..." : "Mavjud emas"}
                          className={`w-full px-3 py-2 border rounded-xl text-xs font-bold outline-none transition-all ${
                            record.isAllergic 
                              ? 'bg-white border-orange-200 text-orange-700' 
                              : 'bg-slate-50 border-brand-border text-brand-muted'
                          }`} 
                        />
                      </td>
                      <td className="py-5 px-4 text-center">
                        <button 
                          onClick={() => handleDataChange(child.id, 'isSick', !record.isSick)}
                          className={`w-24 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            record.isSick 
                              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}
                        >
                          {record.isSick ? 'Kasal' : 'Sog\'lom'}
                        </button>
                      </td>
                      <td className="py-5 px-8">
                        <input 
                          type="text" 
                          value={record.notes}
                          onChange={(e) => handleDataChange(child.id, 'notes', e.target.value)}
                          placeholder="Qo'shimcha ma'lumot..." 
                          className="w-full px-3 py-2 bg-slate-50 border border-brand-border rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-brand-primary/10" 
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseView;
