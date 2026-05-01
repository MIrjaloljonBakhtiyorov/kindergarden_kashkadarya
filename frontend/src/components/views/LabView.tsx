import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Database, 
  Archive, 
  FlaskConical, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  Beaker, 
  Utensils, 
  ShieldCheck, 
  Info, 
  ChevronRight, 
  Download, 
  FileText,
  CheckCircle2,
  Thermometer,
  Droplets,
  Activity,
  History,
  ClipboardList,
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import apiClient from '../../api/apiClient';
import { LabSample, KitchenTask, LabRiskLevel, LabSampleStatus } from '../../types';
import { useNotification } from '../../context/NotificationContext';


const LabView: React.FC = () => {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'SAMPLES' | 'ENVIRONMENT' | 'STATS'>('SAMPLES');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSample, setSelectedSample] = useState<LabSample | null>(null);
  const [samples, setSamples] = useState<LabSample[]>([]);
  const [kitchenTasks, setKitchenTasks] = useState<KitchenTask[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [newSample, setNewSample] = useState<Partial<LabSample>>({
    storage_duration: 72,
    risk_level: 'NORMAL',
    status: 'COLLECTED',
    test_results: {
      ph_level: 6.5,
      bacterial_check: 'PASS',
      organoleptic_check: 'PASS'
    }
  });

  const [labChecklist, setLabChecklist] = useState<Record<number, boolean>>({});

  const LAB_CHECKLIST_ITEMS = [
    'Namuna 72 soatlik steril idishga olindi',
    'Harorat +4°C darajadan o‘tmadi',
    'Laboratoriya jurnali to‘ldirildi',
    'Oshpaz va laboratoriya imzosi qayd etildi'
  ];

  const allLabChecksDone = LAB_CHECKLIST_ITEMS.every((_, i) => labChecklist[i]);

  useEffect(() => {
    fetchSamples();
    fetchKitchenTasks();
  }, []);

  const fetchSamples = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/lab/samples`);
      setSamples(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKitchenTasks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await apiClient.get(`/kitchen/tasks/${today}`);
      setKitchenTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const stats = useMemo(() => {
    const pendingSampling = kitchenTasks.filter(t => (t.status === 'TAYYOR' || t.status === 'SUZISHGA_TAYYOR') && !samples.find(s => s.dish_id === t.id));
    return {
      total: samples.length,
      pending: samples.filter(s => s.status === 'COLLECTED' || s.status === 'STORED').length,
      critical: samples.filter(s => s.risk_level === 'CRITICAL').length,
      samplingNeeded: pendingSampling.length
    };
  }, [samples, kitchenTasks]);

  const getRiskBadge = (risk: LabRiskLevel) => {
    switch (risk) {
      case 'NORMAL': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'WARNING': return 'bg-amber-50 text-brand-amber border-amber-100';
      case 'CRITICAL': return 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse';
    }
  };

  const handleAddSample = async () => {
    const sampleData = {
      ...newSample,
      sample_id: `SAMP-${Date.now().toString().slice(-6)}`,
      batch_reference: `B-${new Date().getHours()}${new Date().getMinutes()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      created_by: 'Bosh Laborant',
      lab_result: 'Muvaffaqiyatli tekshirildi',
      storage_temp_history: [
        { time: '08:00', temp: 3.2 },
        { time: '12:00', temp: 3.5 },
        { time: '16:00', temp: 3.4 }
      ]
    };

    try {
      await apiClient.post(`/lab/samples`, sampleData);
      showNotification("Yangi sinama muvaffaqiyatli saqlandi!", "success");
      fetchSamples();
      setShowAddModal(false);
      setLabChecklist({});
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-depth tracking-tight">Laboratoriya Markazi</h2>
          <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Activity size={14} className="text-brand-primary" />
            Sinamalar xavfsizligi va biologik nazorat monitoringi
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none bg-brand-primary text-white px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-95 transition-all justify-center"
          >
            <Plus size={20} /> Yangi Sinama
          </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Jami Sinamalar', value: stats.total, sub: '72 soatlik baza', color: 'text-brand-depth', icon: Database, bg: 'bg-slate-50' },
          { label: 'Kritik Holatlar', value: stats.critical, sub: 'Zudlik bilan choralar', color: 'text-rose-500', icon: AlertOctagon, bg: 'bg-rose-50' },
          { label: 'Namuna Kutish', value: stats.samplingNeeded, sub: 'Oshxonadan chiqishda', color: 'text-amber-500', icon: ClipboardList, bg: 'bg-amber-50' },
          { label: 'Xavfsizlik Indeksi', value: '98.5%', sub: 'Haftalik ko\'rsatkich', color: 'text-emerald-500', icon: ShieldCheck, bg: 'bg-emerald-50' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-primary/10 transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.bg} rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">{kpi.label}</p>
                <h3 className={`text-4xl font-black ${kpi.color}`}>{kpi.value}</h3>
                <p className="text-[10px] font-bold text-brand-muted/60 mt-2 uppercase tracking-tight">{kpi.sub}</p>
              </div>
              <kpi.icon size={24} className={kpi.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-fit">
        {[
          { id: 'SAMPLES', label: 'Sinamalar Jurnali', icon: FlaskConical },
          { id: 'ENVIRONMENT', label: 'Muhit Nazorati', icon: Thermometer },
          { id: 'STATS', label: 'Hisobotlar', icon: Activity }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-white text-brand-primary shadow-md' : 'text-brand-muted hover:text-brand-depth'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'SAMPLES' && (
              <motion.div 
                key="samples"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden"
              >
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
                   <h4 className="font-black text-brand-depth text-xl flex items-center gap-3">
                      <History className="text-brand-primary" /> Sinamalar Jurnali
                   </h4>
                   <div className="flex gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                        <input type="text" placeholder="Qidirish..." className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl text-sm font-bold border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all" />
                      </div>
                      <button className="p-3 bg-white rounded-2xl border border-slate-200 text-brand-muted hover:text-brand-primary transition-all shadow-sm">
                        <Filter size={20} />
                      </button>
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="bg-white text-[10px] text-brand-muted uppercase font-black tracking-widest border-b border-slate-100">
                        <th className="px-10 py-6">Sinama & Batch</th>
                        <th className="px-10 py-6">Kategoriya</th>
                        <th className="px-10 py-6">Xulosa</th>
                        <th className="px-10 py-6">Status</th>
                        <th className="px-10 py-6 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {samples.map(sample => (
                        <tr key={sample.sample_id} className="group hover:bg-slate-50/80 transition-all cursor-pointer" onClick={() => setSelectedSample(sample)}>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all ${sample.risk_level === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                <Beaker size={24} />
                              </div>
                              <div>
                                <p className="text-base font-black text-brand-depth leading-tight">{sample.dish_name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <code className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">{sample.batch_reference}</code>
                                  <span className="text-[10px] text-brand-muted font-bold tracking-tight">{new Date(sample.timestamp).toLocaleTimeString()}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                             <span className="px-4 py-1.5 bg-slate-100 text-brand-depth text-[10px] font-black rounded-full uppercase tracking-widest">
                               {sample.dish_id ? 'PISHIRILGAN' : 'XOM ASHYO'}
                             </span>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex flex-col gap-1">
                              <span className={`text-[10px] font-black uppercase tracking-wider ${getRiskBadge(sample.risk_level)} px-2 py-1 rounded-lg w-fit border`}>
                                {sample.risk_level === 'NORMAL' ? 'Xavfsiz' : sample.risk_level}
                              </span>
                              <span className="text-xs text-brand-muted font-bold truncate max-w-[150px]">{sample.lab_result}</span>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 w-fit shadow-sm">
                               <div className={`w-2 h-2 rounded-full ${sample.status === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                               <span className="text-[10px] font-black text-brand-depth uppercase tracking-widest">{sample.status}</span>
                             </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <button className="w-10 h-10 inline-flex items-center justify-center text-brand-muted hover:text-white hover:bg-brand-primary rounded-xl transition-all shadow-sm border border-slate-200">
                                <ChevronRight size={20} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'ENVIRONMENT' && (
              <motion.div 
                key="environment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {[
                  { name: 'Muzlatgich-01 (Sinamalar)', temp: '3.4°C', hum: '45%', status: 'STABLE', icon: Thermometer, color: 'text-blue-500' },
                  { name: 'Muzlatgich-02 (Go\'sht)', temp: '-18.2°C', hum: '30%', status: 'STABLE', icon: Thermometer, color: 'text-indigo-500' },
                  { name: 'Laboratoriya Xonasi', temp: '22.5°C', hum: '55%', status: 'STABLE', icon: Droplets, color: 'text-emerald-500' },
                  { name: 'Inkubator-A', temp: '37.0°C', hum: '60%', status: 'STABLE', icon: Activity, color: 'text-rose-500' }
                ].map((env, i) => (
                  <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/10 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center ${env.color}`}>
                          <env.icon size={28} />
                        </div>
                        <div>
                          <h5 className="font-black text-brand-depth text-lg leading-tight">{env.name}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase">Onlayn</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-brand-muted hover:text-brand-primary"><History size={20} /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-6 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Harorat</p>
                        <p className={`text-2xl font-black ${env.color}`}>{env.temp}</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Namlik</p>
                        <p className="text-2xl font-black text-brand-depth">{env.hum}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Oxirgi 24 soat</span>
                       <div className="flex gap-1">
                          {[40, 45, 42, 48, 44, 46, 45].map((h, j) => (
                            <div key={j} className="w-1.5 bg-brand-primary/20 rounded-full group cursor-help relative" style={{ height: `${h}px` }}>
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-brand-depth text-white text-[8px] font-black px-1.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                 {h}%
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="xl:col-span-4 space-y-8">
           {/* Sampling Queue */}
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-8">
              <div className="flex justify-between items-center">
                <h4 className="font-black text-brand-depth text-xl flex items-center gap-3">
                   <Utensils className="text-orange-500" /> Navbatda
                </h4>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {stats.samplingNeeded} ta taom
                </span>
              </div>
              
              <div className="space-y-4">
                 {kitchenTasks.filter(t => (t.status === 'TAYYOR' || t.status === 'SUZISHGA_TAYYOR') && !samples.find(s => s.dish_id === t.id)).length === 0 ? (
                   <div className="text-center py-12 space-y-4">
                      <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-emerald-500">
                        <ShieldCheck size={40} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-brand-depth uppercase">Navbat bo'sh</p>
                        <p className="text-xs text-brand-muted font-bold mt-1">Barcha taomlardan namunalar olindi.</p>
                      </div>
                   </div>
                 ) : (
                   kitchenTasks.filter(t => (t.status === 'TAYYOR' || t.status === 'SUZISHGA_TAYYOR') && !samples.find(s => s.dish_id === t.id)).map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => {
                        setNewSample(prev => ({ ...prev, dish_id: task.id, dish_name: task.mealName }));
                        setShowAddModal(true);
                      }}
                      className="p-6 bg-orange-50/50 rounded-[2.5rem] border border-orange-100 group hover:bg-orange-50 hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
                    >
                       <div className="flex justify-between items-start mb-4 relative z-10">
                          <span className="text-[10px] font-black bg-white px-3 py-1.5 rounded-xl text-orange-600 shadow-sm border border-orange-100 uppercase tracking-widest">{task.mealType}</span>
                          <ArrowUpRight size={20} className="text-orange-300 group-hover:text-orange-600 transition-colors" />
                       </div>
                       <h5 className="font-black text-brand-depth text-lg mb-2 relative z-10">{task.mealName}</h5>
                       <div className="flex items-center gap-2 text-[10px] text-orange-600 font-black uppercase tracking-widest relative z-10">
                          <Plus size={14} /> Namuna olish shart
                       </div>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>
                   ))
                 )}
              </div>
           </div>

           {/* Guidelines */}
           <div className="bg-brand-depth p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              <h4 className="text-lg font-black relative z-10 flex items-center gap-3 uppercase tracking-wider mb-8">
                <Info size={24} className="text-brand-primary" />
                BIOLOGIK REGLAMENT
              </h4>
              <ul className="space-y-6 relative z-10">
                {[
                  { text: 'Har bir taomdan kamida 100g steril namuna olish.', color: 'bg-brand-primary' },
                  { text: 'Sinamalarni +2°C dan +6°C gacha haroratda saqlash.', color: 'bg-blue-400' },
                  { text: 'Saqlash muddati qat\'iy 72 soat (3 sutka).', color: 'bg-amber-400' },
                  { text: 'Utilizatsiya dalolatnoma asosida amalga oshiriladi.', color: 'bg-emerald-400' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full ${item.color} mt-2 shrink-0`}></div>
                    <p className="text-sm font-medium text-white/80 leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
              <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
                To'liq Yo'riqnomani Yuklash
              </button>
           </div>
        </div>
      </div>

      {/* Sample Detail View Overlay */}
      <AnimatePresence>
        {selectedSample && (
          <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 lg:p-12 animate-in fade-in duration-300 bg-black/20">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-5xl rounded-[10px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200"
             >
                <div className="flex-1 overflow-y-auto p-12 space-y-12">
                   <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRiskBadge(selectedSample.risk_level)}`}>
                            {selectedSample.risk_level} XATAR
                          </span>
                          <span className="px-4 py-1.5 bg-slate-100 text-brand-depth text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-200">
                            ID: {selectedSample.sample_id}
                          </span>
                        </div>
                        <h3 className="text-5xl font-black text-brand-depth leading-tight tracking-tighter">{selectedSample.dish_name}</h3>
                        <p className="text-sm text-brand-muted font-bold flex items-center gap-2">
                           <Clock size={16} /> Olingan vaqt: {new Date(selectedSample.timestamp).toLocaleString('uz-UZ')}
                        </p>
                      </div>
                      <button 
                        onClick={() => setSelectedSample(null)} 
                        className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center shadow-sm hover:bg-rose-50 hover:text-rose-500 transition-all text-3xl font-light"
                      >
                        &times;
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Technical Specs */}
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-6">
                        <h5 className="text-[10px] font-black text-brand-depth uppercase tracking-widest border-b border-slate-200 pb-4 flex items-center gap-2">
                          <ClipboardList size={16} className="text-brand-primary" /> Texnik Parametrlar
                        </h5>
                        <div className="space-y-4">
                          {[
                            { label: 'Batch/Partiya', value: selectedSample.batch_reference },
                            { label: 'Saqlash Joyi', value: selectedSample.storage_location },
                            { label: 'Muddati', value: `${selectedSample.storage_duration} soat` },
                            { label: 'Mas\'ul', value: selectedSample.created_by }
                          ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-brand-muted uppercase">{item.label}</span>
                              <span className="text-xs font-black text-brand-depth">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lab Results */}
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-6">
                        <h5 className="text-[10px] font-black text-brand-depth uppercase tracking-widest border-b border-slate-200 pb-4 flex items-center gap-2">
                          <FlaskConical size={16} className="text-brand-primary" /> Laborator Tahlillar
                        </h5>
                        <div className="space-y-4">
                          {[
                            { label: 'pH Darajasi', value: selectedSample.test_results?.ph_level || '6.5', unit: 'pH' },
                            { label: 'Bakterial Test', value: selectedSample.test_results?.bacterial_check || 'TOZA', status: 'PASS' },
                            { label: 'Organoleptika', value: selectedSample.test_results?.organoleptic_check || 'ME\'YOR', status: 'PASS' }
                          ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-brand-muted uppercase">{item.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-brand-depth">{item.value} {item.unit}</span>
                                {item.status === 'PASS' && <CheckCircle2 size={14} className="text-emerald-500" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Nutrition */}
                      <div className="bg-brand-primary/5 p-8 rounded-[2.5rem] border border-brand-primary/10 space-y-6">
                        <h5 className="text-[10px] font-black text-brand-primary uppercase tracking-widest border-b border-brand-primary/10 pb-4 flex items-center gap-2">
                          <Activity size={16} /> Ozuqaviy Tarkib (100g)
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: 'Kkal', value: selectedSample.nutrition?.calories || '250' },
                            { label: 'Oqsil', value: selectedSample.nutrition?.proteins || '12g' },
                            { label: 'Yog\'', value: selectedSample.nutrition?.fats || '8g' },
                            { label: 'Uglevod', value: selectedSample.nutrition?.carbs || '32g' }
                          ].map((item, i) => (
                            <div key={i} className="text-center bg-white p-3 rounded-2xl shadow-sm border border-brand-primary/5">
                              <p className="text-[8px] font-black text-brand-muted uppercase mb-1">{item.label}</p>
                              <p className="text-xs font-black text-brand-depth">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>

                   {/* Storage Temp History Chart Mockup */}
                   <div className="bg-slate-50 p-10 rounded-[3rem] space-y-8">
                      <div className="flex justify-between items-center">
                        <h5 className="text-[10px] font-black text-brand-depth uppercase tracking-widest flex items-center gap-2">
                          <Thermometer size={16} className="text-blue-500" /> Saqlash Harorati Tarixi
                        </h5>
                        <span className="text-[10px] font-black text-emerald-600 uppercase">Standart: +2°C / +6°C</span>
                      </div>
                      <div className="h-40 w-full flex items-end gap-1.5 px-4 border-b border-slate-200">
                         {Array.from({ length: 48 }).map((_, i) => {
                           const h = 20 + Math.random() * 60;
                           const isAlert = h > 70 || h < 25;
                           return (
                             <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                                <div 
                                  className={`w-full rounded-t-full transition-all ${isAlert ? 'bg-rose-400' : 'bg-brand-primary/40 group-hover:bg-brand-primary'}`} 
                                  style={{ height: `${h}%` }}
                                />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-brand-depth text-white text-[8px] font-black px-1.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                  {((h/10) + 1).toFixed(1)}°C
                                </div>
                             </div>
                           );
                         })}
                      </div>
                      <div className="flex justify-between text-[8px] font-black text-brand-muted uppercase px-2">
                        <span>Olingan vaqt</span>
                        <span>24 soat o'tgach</span>
                        <span>48 soat o'tgach</span>
                        <span>72 soat (Utilizatsiya)</span>
                      </div>
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button className="flex-1 bg-brand-ghost border-2 border-brand-primary/10 py-6 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all">
                         <Download size={22} /> Laboratoriya Dalolatnomasini Yuklash (PDF)
                      </button>
                      <button 
                        onClick={() => setSelectedSample(null)} 
                        className="flex-1 bg-brand-depth text-white py-6 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-depth/20"
                      >
                        Ma'lumotlarni Tasdiqlash
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Sample Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300 bg-black/20">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-2xl rounded-[10px] p-12 shadow-2xl relative overflow-y-auto max-h-[90vh] border border-slate-200"
             >
               <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-4xl font-black text-brand-depth tracking-tight">Sinama Qabul</h3>
                    <p className="text-xs text-brand-muted uppercase font-bold tracking-widest mt-2 flex items-center gap-2">
                      <ShieldCheck size={14} className="text-brand-primary" />
                      Sanitariya reglamenti bo'yicha namunani ro'yxatdan o'tkazing
                    </p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center shadow-sm hover:bg-rose-50 hover:text-rose-500 transition-all text-2xl font-light">&times;</button>
               </div>

               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Taom / Namuna Nomi</label>
                      <input 
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-5 text-sm font-black outline-none transition-all shadow-sm" 
                        placeholder="Masalan: Tovuqli Sho'rva" 
                        value={newSample.dish_name || ''} 
                        onChange={e => setNewSample(prev => ({...prev, dish_name: e.target.value}))} 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Saqlash Lokatsiyasi</label>
                      <input 
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-5 text-sm font-black outline-none transition-all shadow-sm" 
                        placeholder="Muzlatgich-01, Raf-B" 
                        value={newSample.storage_location || ''} 
                        onChange={e => setNewSample(prev => ({...prev, storage_location: e.target.value}))} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-brand-primary" />
                       Majburiy Tekshiruv (Checklist)
                     </p>
                     {LAB_CHECKLIST_ITEMS.map((text, i) => (
                       <button 
                         key={i} 
                         onClick={() => setLabChecklist(prev => ({...prev, [i]: !prev[i]}))} 
                         className={`w-full text-left p-5 rounded-[1.5rem] border-2 transition-all flex items-center gap-4 ${
                           labChecklist[i] ? 'bg-emerald-50 border-emerald-500 shadow-md' : 'bg-slate-50 border-transparent hover:border-brand-primary/20'
                         }`}
                       >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            labChecklist[i] ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200'
                          }`}>
                             {labChecklist[i] && <CheckCircle2 size={16} />}
                          </div>
                          <span className={`text-sm font-black uppercase tracking-tight ${labChecklist[i] ? 'text-emerald-700' : 'text-brand-depth'}`}>{text}</span>
                       </button>
                     ))}
                  </div>

                  <button 
                    onClick={handleAddSample} 
                    disabled={!allLabChecksDone || !newSample.dish_name || !newSample.storage_location} 
                    className={`w-full py-6 rounded-[1.5rem] font-black uppercase text-sm tracking-widest transition-all shadow-xl ${
                      allLabChecksDone && newSample.dish_name && newSample.storage_location 
                        ? 'bg-brand-primary text-white shadow-brand-primary/30 hover:scale-[1.02] active:scale-95' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    NAMUNANI SAQLASH VA TASDIQLASH
                  </button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LabView;
