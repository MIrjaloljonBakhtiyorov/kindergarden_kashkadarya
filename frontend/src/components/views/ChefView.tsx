import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Clock, 
  Thermometer, 
  CheckCircle2, 
  Play, 
  Flame, 
  Check, 
  AlertCircle,
  Calendar,
  ChefHat,
  Bell,
  ShieldCheck,
  ClipboardList,
  Timer
} from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { MOCK_CHECKLISTS } from '../../constants/mockData';

const API_BASE = 'http://localhost:3001/api';

const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  'PENDING': { label: 'Kutilmoqda', color: 'bg-slate-100 text-slate-600', icon: Clock },
  'ACCEPTED': { label: 'Qabul qilindi', color: 'bg-blue-100 text-blue-600', icon: CheckCircle2 },
  'COOKING_STARTED': { label: 'Pishirish boshlandi', color: 'bg-orange-100 text-orange-600', icon: Play },
  'COOKING': { label: 'Pishirilyapti', color: 'bg-amber-100 text-orange-700', icon: Flame },
  'SERVED': { label: 'Suzildi', color: 'bg-emerald-100 text-emerald-600', icon: Check }
};

const MEAL_LABELS: Record<string, string> = {
  'BREAKFAST': 'Nonushta',
  'LUNCH': 'Tushlik',
  'TEA': 'Poldnik',
  'DINNER': 'Kechki ovqat'
};

const ChefView: React.FC = () => {
  const { showNotification } = useNotification();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [hygieneChecks, setHygieneChecks] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem('chef_hygiene_checks');
    return saved ? JSON.parse(saved) : {};
  });

  const hygieneRequirements = [
    ...MOCK_CHECKLISTS.KITCHEN,
    ...MOCK_CHECKLISTS.HYGIENE.slice(0, 3)
  ];

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('chef_hygiene_checks', JSON.stringify(hygieneChecks));
  }, [hygieneChecks]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/kitchen/tasks/${selectedDate}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (menuId: string, status: string, additionalData = {}) => {
    try {
      const data: any = { status, ...additionalData };
      if (status === 'COOKING_STARTED') data.start_time = new Date().toISOString();
      if (status === 'SERVED') data.served_time = new Date().toISOString();

      await axios.post(`${API_BASE}/kitchen/tasks/${menuId}/status`, data);
      showNotification(`Holat yangilandi: ${STATUS_CONFIG[status].label}`, 'success');
      fetchTasks();
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const toggleHygiene = (index: number) => {
    setHygieneChecks(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const pendingTasksCount = tasks.filter(t => !t.status || t.status === 'PENDING').length;

  return (
    <div className="p-6 lg:p-10 animate-in fade-in max-w-[1600px] mx-auto space-y-10">
      <header className="bg-brand-depth p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-brand-primary rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-brand-primary/40 transform -rotate-6 group-hover:rotate-0 transition-transform">
            <ChefHat size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight italic">Oshpaz Ish Stoli</h2>
            <p className="text-brand-primary font-bold uppercase text-[10px] tracking-[0.3em] mt-2 flex items-center gap-2">
              <Timer size={14} className="animate-pulse" />
              Sifat va gigiyena nazorati ostida
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="bg-white/5 border border-white/10 p-2 rounded-2xl flex items-center gap-2 backdrop-blur-md">
            <Calendar size={18} className="text-brand-primary ml-2" />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-sm text-white p-2 cursor-pointer"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Main Cooking Tasks */}
        <div className="xl:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-brand-depth flex items-center gap-3 uppercase tracking-widest">
              <Utensils className="text-brand-primary" size={24} />
              Bugungi Taomlar
            </h3>
            {pendingTasksCount > 0 && (
              <span className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black animate-bounce">
                {pendingTasksCount} YANGI
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tasks.map((task) => {
              const status = task.status || 'PENDING';
              const Config = STATUS_CONFIG[status];
              
              return (
                <div key={task.menu_id} className="bg-white rounded-[4rem] border border-brand-border shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group overflow-hidden">
                  <div className="p-10 border-b border-brand-border bg-slate-50/50 flex justify-between items-start">
                    <div>
                      <span className="px-5 py-2 bg-brand-depth text-white text-[10px] font-black uppercase rounded-full tracking-widest shadow-lg">
                        {MEAL_LABELS[task.meal_type]}
                      </span>
                      <h3 className="text-2xl font-black text-brand-depth mt-4 group-hover:text-brand-primary transition-colors">{task.meal_name}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] font-bold text-brand-muted uppercase bg-white border border-brand-border px-3 py-1 rounded-lg">
                          {task.age_group} yosh
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-lg border ${
                          task.diet_type === 'REGULAR' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {task.diet_type === 'REGULAR' ? 'Oddiy' : 'Parhez'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-[1.5rem] shadow-xl ${Config.color} transform group-hover:scale-110 transition-transform`}>
                      <Config.icon size={28} />
                    </div>
                  </div>

                  <div className="p-10 flex-1 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Harorat</p>
                        <div className="flex items-center gap-3 text-brand-depth font-black text-lg">
                          <Thermometer size={18} className="text-orange-500" />
                          <span>{task.temperature ? `${task.temperature}°C` : '--'}</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Suzish</p>
                        <div className="flex items-center gap-3 text-brand-depth font-black text-lg">
                          <Clock size={18} className="text-blue-500" />
                          <span>{task.served_time ? new Date(task.served_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {status === 'PENDING' && (
                        <button 
                          onClick={() => updateStatus(task.menu_id, 'ACCEPTED')}
                          className="w-full py-5 bg-blue-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          Qabul qilish
                        </button>
                      )}
                      {status === 'ACCEPTED' && (
                        <button 
                          onClick={() => updateStatus(task.menu_id, 'COOKING_STARTED')}
                          className="w-full py-5 bg-orange-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          Pishirishni boshlash
                        </button>
                      )}
                      {status === 'COOKING_STARTED' && (
                        <div className="flex gap-3">
                          <input 
                            type="number" 
                            placeholder="Harorat" 
                            id={`temp-${task.menu_id}`}
                            className="flex-1 p-5 bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-[1.5rem] outline-none font-black text-center text-lg transition-all"
                          />
                          <button 
                            onClick={() => {
                              const temp = (document.getElementById(`temp-${task.menu_id}`) as HTMLInputElement).value;
                              updateStatus(task.menu_id, 'COOKING', { temperature: Number(temp) });
                            }}
                            className="px-8 bg-brand-depth text-white rounded-[1.5rem] font-black uppercase text-xs shadow-xl transition-all active:scale-95"
                          >
                            OK
                          </button>
                        </div>
                      )}
                      {status === 'COOKING' && (
                        <button 
                          onClick={() => updateStatus(task.menu_id, 'SERVED')}
                          className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                          <Check size={20} /> Suzildi (Tayyor)
                        </button>
                      )}
                      {status === 'SERVED' && (
                        <div className="py-5 bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] flex items-center justify-center gap-3 text-emerald-600 font-black uppercase text-xs tracking-widest shadow-inner">
                          <CheckCircle2 size={20} /> Yakunlandi
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hygiene Checklist - THE RESTORED SECTION */}
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[4rem] border border-brand-border shadow-sm flex flex-col space-y-8 h-fit sticky top-10">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 bg-brand-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-brand-primary/20 transform rotate-3">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black text-brand-depth uppercase tracking-widest">Sanitariya</h4>
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Gigiyena Checklistlari</p>
              </div>
            </div>

            <div className="space-y-4">
              {hygieneRequirements.map((req, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleHygiene(idx)}
                  className={`w-full p-5 rounded-[2rem] border-2 transition-all flex items-start gap-4 text-left group ${
                    hygieneChecks[idx] 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/10' 
                      : 'border-slate-50 bg-slate-50/50 text-brand-muted hover:border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className={`mt-1 shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    hygieneChecks[idx] ? 'bg-emerald-500 border-emerald-500 shadow-md' : 'border-slate-300 bg-white group-hover:border-brand-primary'
                  }`}>
                    {hygieneChecks[idx] && <Check size={14} className="text-white" />}
                  </div>
                  <span className={`text-[13px] font-bold leading-relaxed ${hygieneChecks[idx] ? 'line-through opacity-70' : ''}`}>{req}</span>
                </button>
              ))}
            </div>

            <div className="p-6 bg-brand-depth rounded-[2rem] text-white relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-brand-primary/20 rounded-full blur-2xl -mb-12 -mr-12"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-2">Eslatma</p>
              <p className="text-[11px] font-bold leading-relaxed opacity-80">
                Har bir ish kuni boshlanishida va jarayon davomida ushbu bandlar bajarilishi shart. Bu bolalar xavfsizligi garovidir.
              </p>
            </div>
            
            <div className="pt-4">
               <button 
                 onClick={() => {
                   setHygieneChecks({});
                   showNotification("Checklistlar yangilandi", "success");
                 }}
                 className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-[10px] font-black text-brand-muted uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all"
               >
                 Ro'yxatni tozalash
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefView;
