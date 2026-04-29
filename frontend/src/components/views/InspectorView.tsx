import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  Download,
  Info,
  MessageSquare,
  Camera,
  Activity,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { AuditRecord, InspectionType, ChecklistResult, Severity } from '../../types';
import { MOCK_CHECKLISTS } from '../../constants/mockData';
import { useNotification } from '../../context/NotificationContext';

const API_BASE = 'http://localhost:3001/api';

// Extended type for detailed checklist state
interface DetailedResult {
  status: ChecklistResult | null;
  note: string;
  severity: Severity;
}

const InspectorView: React.FC = () => {
  const { showNotification } = useNotification();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE'>('LIST');
  const [selectedType, setSelectedType] = useState<InspectionType>('KITCHEN');
  const [loading, setLoading] = useState(false);
  
  // Detailed results mapping
  const [tempResults, setTempResults] = useState<Record<string, DetailedResult>>({});
  const [activeItemNote, setActiveItemNote] = useState<number | null>(null);

  const currentQuestions = MOCK_CHECKLISTS[selectedType] || [];

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/audits`);
      setAudits(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const progress = useMemo(() => {
    if (currentQuestions.length === 0) return 0;
    const answered = currentQuestions.filter((_, i) => tempResults[i]?.status).length;
    return Math.round((answered / currentQuestions.length) * 100);
  }, [tempResults, currentQuestions]);

  const handleResultChange = (index: number, status: ChecklistResult) => {
    setTempResults(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        status,
        severity: status === 'ISSUE' ? (prev[index]?.severity || 'MEDIUM') : 'LOW',
        note: prev[index]?.note || ''
      }
    }));
  };

  const handleNoteChange = (index: number, note: string) => {
    setTempResults(prev => ({
      ...prev,
      [index]: { ...prev[index], note }
    }));
  };

  const handleSeverityChange = (index: number, severity: Severity) => {
    setTempResults(prev => ({
      ...prev,
      [index]: { ...prev[index], severity }
    }));
  };

  const handleCreateAudit = async () => {
    if (progress < 100) {
      showNotification("Iltimos, barcha bandlarni to'ldiring!", "error");
      return;
    }

    const resultsArray = Object.values(tempResults) as DetailedResult[];
    const hasIssues = resultsArray.some(r => r.status === 'ISSUE');
    const hasCritical = resultsArray.some(r => r.status === 'ISSUE' && r.severity === 'CRITICAL');

    const overallSeverity: Severity = hasCritical ? 'CRITICAL' : (hasIssues ? 'MEDIUM' : 'LOW');
    const overallResult = hasCritical ? 'FAIL' : (hasIssues ? 'WARNING' : 'PASS');

    const newAudit = {
      inspection_id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      inspection_type: selectedType,
      checklist_items: currentQuestions.map((q, i) => ({
        question: q,
        result: tempResults[i]?.status || 'OK',
        note: tempResults[i]?.note || '',
        severity: tempResults[i]?.severity || 'LOW'
      })),
      overall_result: overallResult,
      severity: overallSeverity,
      notes: hasIssues ? 'Ba\'zi kamchiliklar aniqlandi. Zudlik bilan bartaraf etilishi shart.' : 'Barcha ko\'rsatkichlar me\'yorda.',
      created_by: 'Bosh Inspektor',
      status: 'OPEN'
    };
    
    try {
      await axios.post(`${API_BASE}/audits`, newAudit);
      showNotification("Inspeksiya hisoboti muvaffaqiyatli saqlandi!", "success");
      fetchAudits();
      setViewMode('LIST');
      setTempResults({});
      setActiveItemNote(null);
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const getSeverityStyle = (sev: Severity) => {
    switch (sev) {
      case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-depth tracking-tight">Audit & Inspeksiya Markazi</h2>
          <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Activity size={14} className="text-brand-primary" />
            Sifat nazorati va kompleks muvofiqlik monitoringi
          </p>
        </div>
        <div className="flex gap-4">
           {viewMode === 'LIST' ? (
             <button 
               onClick={() => {
                 setViewMode('CREATE');
                 setTempResults({});
                 setActiveItemNote(null);
               }}
               className="bg-brand-primary text-white font-black px-8 py-4 rounded-[1.5rem] shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
             >
               <Plus size={22} /> YANGI INSPEKSIYA
             </button>
           ) : (
             <button 
               onClick={() => setViewMode('LIST')}
               className="bg-white text-brand-depth border-2 border-slate-200 font-black px-8 py-4 rounded-[1.5rem] hover:bg-slate-50 transition-all active:scale-95"
             >
               BEKOR QILISH
             </button>
           )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'LIST' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { title: 'Jami auditlar', value: audits.length, color: 'text-brand-depth', bg: 'bg-white', icon: FileText },
                { title: 'Aniqlangan xatolar', value: audits.filter(a => a.overall_result !== 'PASS').length, color: 'text-red-500', bg: 'bg-red-50', icon: AlertTriangle },
                { title: 'Muvaffaqiyatli', value: `${audits.length ? Math.round((audits.filter(a => a.overall_result === 'PASS').length / audits.length) * 100) : 0}%`, color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2 },
                { title: 'Sifat indeksi', value: '4.8/5.0', color: 'text-brand-primary', bg: 'bg-brand-primary/10', icon: Activity }
              ].map((kpi, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-primary/20 transition-colors">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.bg} rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">{kpi.title}</p>
                      <h3 className={`text-4xl font-black ${kpi.color}`}>{kpi.value}</h3>
                    </div>
                    <kpi.icon size={24} className={kpi.color} />
                  </div>
                </div>
              ))}
            </div>

            {/* List Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
                <h4 className="font-black text-brand-depth text-xl flex items-center gap-2">
                  <ShieldCheck className="text-brand-primary" />
                  Inspeksiya tarixi
                </h4>
                <div className="flex gap-3 w-full sm:w-auto">
                   <div className="relative flex-1 sm:w-72">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                     <input type="text" placeholder="ID yoki holat bo'yicha qidirish..." className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary border border-slate-200 transition-all shadow-sm" />
                   </div>
                   <button className="p-3 bg-white rounded-2xl text-brand-depth border border-slate-200 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm flex items-center justify-center">
                     <Filter size={20} />
                   </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white text-[10px] font-black text-brand-muted uppercase tracking-widest border-b border-slate-100">
                      <th className="px-8 py-6">ID & Kategoriya</th>
                      <th className="px-8 py-6">Natija / Xulosa</th>
                      <th className="px-8 py-6">Sana</th>
                      <th className="px-8 py-6">Mas'ul shaxs</th>
                      <th className="px-8 py-6">Holat</th>
                      <th className="px-8 py-6 text-right">Batafsil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {audits.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-brand-muted text-sm font-bold">Hech qanday audit ma'lumoti topilmadi.</td>
                      </tr>
                    )}
                    {audits.map((a) => (
                      <tr key={a.inspection_id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-brand-depth group-hover:bg-brand-primary group-hover:text-white transition-colors shadow-sm">
                               {a.inspection_type === 'KITCHEN' && <ShieldCheck size={20} />}
                               {a.inspection_type === 'WAREHOUSE' && <FileText size={20} />}
                               {a.inspection_type === 'HYGIENE' && <AlertTriangle size={20} />}
                               {a.inspection_type === 'SAMPLE' && <Activity size={20} />}
                             </div>
                             <div>
                               <span className="font-black text-brand-depth block text-base">{a.inspection_id}</span>
                               <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{a.inspection_type}</span>
                             </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2">
                               {a.overall_result === 'PASS' && <CheckCircle2 size={16} className="text-emerald-500" />}
                               {a.overall_result === 'FAIL' && <XCircle size={16} className="text-red-500" />}
                               {a.overall_result === 'WARNING' && <AlertTriangle size={16} className="text-amber-500" />}
                               <span className={`text-[11px] font-black uppercase tracking-wider ${a.overall_result === 'PASS' ? 'text-emerald-600' : a.overall_result === 'FAIL' ? 'text-red-600' : 'text-amber-600'}`}>
                                  {a.overall_result === 'PASS' ? 'Muvaffaqiyatli' : a.overall_result === 'FAIL' ? 'Kritik muammo' : 'Ogohlantirish'}
                               </span>
                             </div>
                             <span className="text-xs text-brand-muted truncate max-w-[200px]" title={a.notes}>{a.notes}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-brand-depth">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-brand-muted" />
                            {a.created_at}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-bold text-brand-depth bg-slate-100 px-3 py-1.5 rounded-lg">{a.created_by}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl w-fit shadow-sm">
                             <div className={`w-2.5 h-2.5 rounded-full ${a.status === 'OPEN' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                             <span className="text-[10px] font-black text-brand-depth uppercase tracking-wider">{a.status === 'OPEN' ? 'Jarayonda' : 'Yopilgan'}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="w-10 h-10 inline-flex items-center justify-center text-brand-muted hover:text-white hover:bg-brand-primary rounded-xl transition-all shadow-sm border border-slate-200 hover:border-brand-primary">
                             <ChevronRight size={20} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 xl:grid-cols-12 gap-8"
          >
            {/* Sidebar Setup */}
            <div className="col-span-1 xl:col-span-4 flex flex-col gap-6">
               <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black text-brand-depth mb-1">Obyekt va Yo'nalish</h4>
                    <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest">Inspeksiya turini tanlang</p>
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                    {(['KITCHEN', 'WAREHOUSE', 'HYGIENE', 'SAMPLE'] as InspectionType[]).map(type => (
                      <button 
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setTempResults({});
                          setActiveItemNote(null);
                        }}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all group ${
                          selectedType === type ? 'border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/10' : 'border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white'
                        }`}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                              selectedType === type ? 'bg-brand-primary text-white scale-110 shadow-lg' : 'bg-white text-brand-muted group-hover:text-brand-primary shadow-sm'
                            }`}>
                               {type === 'KITCHEN' && <ShieldCheck size={24} />}
                               {type === 'WAREHOUSE' && <FileText size={24} />}
                               {type === 'HYGIENE' && <AlertTriangle size={24} />}
                               {type === 'SAMPLE' && <Activity size={24} />}
                            </div>
                            <div className="text-left">
                              <span className={`font-black text-sm uppercase tracking-wider block ${
                                selectedType === type ? 'text-brand-primary' : 'text-brand-depth group-hover:text-brand-primary'
                              }`}>
                                {type === 'KITCHEN' && 'Oshxona'}
                                {type === 'WAREHOUSE' && 'Omborxona'}
                                {type === 'HYGIENE' && 'Sanitariya'}
                                {type === 'SAMPLE' && 'Sinamalar'}
                              </span>
                              <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">{MOCK_CHECKLISTS[type]?.length || 0} ta band</span>
                            </div>
                         </div>
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedType === type ? 'border-brand-primary bg-brand-primary' : 'border-slate-300 bg-white'}`}>
                           {selectedType === type && <Check size={14} className="text-white" />}
                         </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Tugatish ko'rsatkichi</span>
                      <span className="text-sm font-black text-brand-primary">{progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-primary transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
               </div>

               <div className="bg-brand-depth p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <h4 className="text-lg font-black relative z-10 flex items-center gap-2 uppercase tracking-wide">
                    <Info size={20} className="text-brand-primary" />
                    Auditor Yo'riqnomasi
                  </h4>
                  <ul className="text-white/70 text-xs font-medium mt-6 space-y-4 relative z-10">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0"></div>
                      Har bir bandni obyektiv tasdiqlang.
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                      Aniqlangan kamchiliklarning jiddiylik darajasini (CRITICAL, HIGH, MEDIUM, LOW) to'g'ri belgilang.
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                      Muammoli holatlarda batafsil izoh qoldirish qat'iyan talab etiladi.
                    </li>
                  </ul>
               </div>
            </div>

            {/* Checklist Main Area */}
            <div className="col-span-1 xl:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10 flex flex-col h-fit">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
                  <div>
                    <h4 className="text-3xl font-black text-brand-depth tracking-tight">Tekshiruv Varaqasi</h4>
                    <p className="text-sm font-bold text-brand-muted mt-1">Rasmiy tekshiruv dalolatnomasi formasi</p>
                  </div>
                  <div className="px-6 py-2 bg-brand-ghost text-brand-depth text-xs font-black rounded-2xl uppercase tracking-widest border border-slate-200 shadow-sm flex items-center gap-2">
                    {selectedType}
                    <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
                  </div>
               </div>

               <div className="flex-1 space-y-6">
                  {currentQuestions.map((q, i) => {
                    const res = tempResults[i];
                    const isIssue = res?.status === 'ISSUE';
                    
                    return (
                      <div key={i} className={`p-6 rounded-[2rem] border-2 transition-all ${
                        res?.status === 'OK' ? 'border-emerald-500 bg-emerald-50/30' :
                        res?.status === 'ISSUE' ? 'border-red-500 bg-red-50/30' :
                        'border-slate-100 bg-white hover:border-slate-300'
                      }`}>
                         <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-sm ${
                                res?.status === 'OK' ? 'bg-emerald-500 text-white' :
                                res?.status === 'ISSUE' ? 'bg-red-500 text-white' :
                                'bg-slate-100 text-slate-400'
                              }`}>
                                {res?.status === 'OK' ? <CheckCircle2 size={16} /> : res?.status === 'ISSUE' ? <XCircle size={16} /> : i + 1}
                              </div>
                              <p className="font-bold text-brand-depth text-base leading-relaxed pt-1">{q}</p>
                            </div>
                            
                            <div className="flex bg-white p-1.5 rounded-[1.25rem] shadow-sm border border-slate-200 w-full md:w-auto">
                               <button 
                                 onClick={() => handleResultChange(i, 'OK')}
                                 className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                   res?.status === 'OK' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-500 hover:bg-slate-50'
                                 }`}
                               >
                                 ME'YORDA
                               </button>
                               <button 
                                 onClick={() => handleResultChange(i, 'ISSUE')}
                                 className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                   res?.status === 'ISSUE' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-slate-500 hover:bg-slate-50'
                                 }`}
                               >
                                 MUAMMO
                               </button>
                            </div>
                         </div>

                         {/* Expanded Options for Issues or Notes */}
                         <AnimatePresence>
                           {(res?.status || activeItemNote === i) && (
                             <motion.div 
                               initial={{ opacity: 0, height: 0, marginTop: 0 }}
                               animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                               exit={{ opacity: 0, height: 0, marginTop: 0 }}
                               className="overflow-hidden border-t border-slate-200/50 pt-6"
                             >
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {/* Notes Input */}
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                                     <MessageSquare size={12} />
                                     Izoh yoki tavsiya qoldirish
                                   </label>
                                   <textarea 
                                     value={res?.note || ''}
                                     onChange={(e) => handleNoteChange(i, e.target.value)}
                                     placeholder="Batafsil ma'lumot..."
                                     className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 resize-none h-24"
                                   />
                                 </div>

                                 {/* Issue Extra Controls */}
                                 {isIssue ? (
                                   <div className="space-y-2 bg-red-50/50 p-4 rounded-2xl border border-red-100">
                                     <label className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                                       Kamchilik darajasi
                                     </label>
                                     <div className="grid grid-cols-2 gap-2">
                                       {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Severity[]).map(sev => (
                                         <button
                                           key={sev}
                                           onClick={() => handleSeverityChange(i, sev)}
                                           className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                             res?.severity === sev ? getSeverityStyle(sev) + ' shadow-sm scale-105' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                           }`}
                                         >
                                           {sev}
                                         </button>
                                       ))}
                                     </div>
                                   </div>
                                 ) : (
                                   <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:bg-slate-50 hover:border-brand-primary/50 transition-colors cursor-pointer group">
                                     <div className="text-center">
                                       <Camera className="mx-auto text-slate-400 group-hover:text-brand-primary mb-2" size={24} />
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-brand-primary">Surat ilova qilish (ixtiyoriy)</span>
                                     </div>
                                   </div>
                                 )}
                               </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </div>
                    );
                  })}
               </div>

               <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 -mx-10 -mb-10 p-10 rounded-b-[3rem]">
                  <div className="flex-1">
                    <p className="text-brand-muted text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                      <AlertTriangle size={14} className={progress < 100 ? 'text-amber-500' : 'text-emerald-500'} />
                      Tasdiqlash bosqichi
                    </p>
                    <p className="text-sm font-bold text-brand-depth">
                      {progress < 100 ? `Inspeksiyani yakunlash uchun yana ${currentQuestions.length - Object.keys(tempResults).length} ta band qoldi.` : "Barcha bandlar to'ldirildi. Hisobotni yuborishingiz mumkin."}
                    </p>
                  </div>
                  <button 
                    onClick={handleCreateAudit}
                    disabled={progress < 100}
                    className={`flex items-center justify-center gap-3 px-12 py-5 rounded-[1.5rem] font-black transition-all text-sm w-full sm:w-auto ${
                      progress === 100 
                        ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-95' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    HISOBOTNI YUBORISH <ChevronRight size={20} />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InspectorView;
