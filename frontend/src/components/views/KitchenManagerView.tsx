import React, { useState, useEffect, useMemo } from 'react';
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
  ClipboardList
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useNotification } from '../../context/NotificationContext';
import { MOCK_CHECKLISTS } from '../../constants/mockData';


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

const KitchenManagerView: React.FC = () => {
  const { showNotification } = useNotification();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [hygieneChecks, setHygieneChecks] = useState<Record<number, boolean>>({});

  const hygieneRequirements = [
    ...MOCK_CHECKLISTS.KITCHEN,
    ...MOCK_CHECKLISTS.HYGIENE.slice(0, 2)
  ];

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000); // Har 30 soniyada yangilash
    return () => clearInterval(interval);
  }, [selectedDate]);

  const fetchTasks = async () => {
    try {
      const res = await apiClient.get(`/kitchen/tasks/${selectedDate}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (menuId: string, status: string, additionalData = {}) => {
    try {
      const data: any = { status, ...additionalData };
      
      // Statusga qarab vaqtni avtomatik belgilash
      if (status === 'COOKING_STARTED') data.start_time = new Date().toISOString();
      if (status === 'SERVED') data.served_time = new Date().toISOString();

      await apiClient.post(`/kitchen/tasks/${menuId}/status`, data);
      showNotification(`Holat yangilandi: ${STATUS_CONFIG[status].label}`, 'success');
      fetchTasks();
      setEditTask(null);
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const toggleHygiene = (index: number) => {
    setHygieneChecks(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const pendingTasksCount = tasks.filter(t => !t.status || t.status === 'PENDING').length;

  return (
    <div className="p-8 animate-in fade-in max-w-7xl mx-auto space-y-10">
      <header className="bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-xl shadow-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-brand-primary rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-brand-primary/30">
            <ChefHat size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-brand-depth tracking-tight">Oshxona Boshqaruvi</h2>
            <p className="text-brand-muted font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
              <Utensils size={14} className="text-brand-primary" />
              Real vaqt rejimidagi pishirish jarayoni
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {pendingTasksCount > 0 && (
            <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl animate-pulse border border-rose-100">
              <Bell size={18} />
              <span className="text-xs font-black uppercase tracking-widest">{pendingTasksCount} ta yangi menyu</span>
            </div>
          )}
          <div className="bg-slate-50 p-2 rounded-2xl border border-brand-border flex items-center gap-2">
            <Calendar size={18} className="text-brand-muted ml-2" />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-sm text-brand-depth p-2"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tasks */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-brand-depth flex items-center gap-2 uppercase tracking-wider">
              <ClipboardList className="text-brand-primary" size={20} />
              Tayyorlash jarayonlari
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => {
              const status = task.status || 'PENDING';
              const Config = STATUS_CONFIG[status];
              
              return (
                <div key={task.menu_id} className="bg-white rounded-[3rem] border border-brand-border shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all">
                  <div className="p-8 border-b border-brand-border bg-slate-50/50 flex justify-between items-start">
                    <div>
                      <span className="px-4 py-1.5 bg-brand-depth text-white text-[9px] font-black uppercase rounded-full tracking-widest">
                        {MEAL_LABELS[task.meal_type]}
                      </span>
                      <h3 className="text-xl font-black text-brand-depth mt-3">{task.meal_name}</h3>
                      <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">
                        {task.age_group} yosh • {task.diet_type === 'REGULAR' ? 'Oddiy' : 'Parhez'}
                      </p>
                    </div>
                    <div className={`p-3 rounded-2xl ${Config.color}`}>
                      <Config.icon size={20} />
                    </div>
                  </div>

                  <div className="p-8 flex-1 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-brand-muted uppercase tracking-widest mb-1">Harorat</p>
                        <div className="flex items-center gap-2 text-brand-depth font-black">
                          <Thermometer size={14} className="text-orange-500" />
                          <span>{task.temperature ? `${task.temperature}°C` : '--'}</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-brand-muted uppercase tracking-widest mb-1">Suzish vaqti</p>
                        <div className="flex items-center gap-2 text-brand-depth font-black">
                          <Clock size={14} className="text-blue-500" />
                          <span>{task.served_time ? new Date(task.served_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {status === 'PENDING' && (
                        <button 
                          onClick={() => updateStatus(task.menu_id, 'ACCEPTED')}
                          className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                        >
                          Qabul qilish
                        </button>
                      )}
                      {status === 'ACCEPTED' && (
                        <button 
                          onClick={() => updateStatus(task.menu_id, 'COOKING_STARTED')}
                          className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
                        >
                          Pishirishni boshlash
                        </button>
                      )}
                      {status === 'COOKING_STARTED' && (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input 
                              type="number" 
                              placeholder="Harorat (°C)" 
                              id={`temp-${task.menu_id}`}
                              className="flex-1 p-4 bg-slate-50 border border-brand-border rounded-2xl outline-none font-bold text-sm"
                            />
                            <button 
                              onClick={() => {
                                const temp = (document.getElementById(`temp-${task.menu_id}`) as HTMLInputElement).value;
                                updateStatus(task.menu_id, 'COOKING', { temperature: Number(temp) });
                              }}
                              className="px-6 bg-brand-depth text-white rounded-2xl font-black uppercase text-[10px]"
                            >
                              OK
                            </button>
                          </div>
                        </div>
                      )}
                      {status === 'COOKING' && (
                        <button 
                          onClick={() => updateStatus(task.menu_id, 'SERVED')}
                          className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                          <Check size={18} /> Suzildi (Tayyor)
                        </button>
                      )}
                      {status === 'SERVED' && (
                        <div className="py-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest">
                          <CheckCircle2 size={16} /> Muvaffaqiyatli yakunlandi
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {tasks.length === 0 && (
              <div className="col-span-full py-20 bg-white rounded-[4rem] border-2 border-dashed border-brand-border flex flex-col items-center justify-center text-center space-y-4">
                <Utensils size={64} className="text-slate-200" />
                <div>
                  <h4 className="text-xl font-black text-brand-depth">Bugun uchun topshiriqlar yo'q</h4>
                  <p className="text-sm font-bold text-brand-muted mt-1 uppercase tracking-widest">Dietolog menyu kiritishini kuting</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hygiene Requirements */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-depth text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase tracking-wider">Gigiyena Talablari</h4>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Sanitariya nazorati</p>
                </div>
              </div>

              <div className="space-y-3">
                {hygieneRequirements.map((req, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleHygiene(idx)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-start gap-3 text-left group ${
                      hygieneChecks[idx] 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`mt-1 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      hygieneChecks[idx] ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'
                    }`}>
                      {hygieneChecks[idx] && <Check size={12} className="text-brand-depth" />}
                    </div>
                    <span className="text-xs font-bold leading-relaxed">{req}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-brand-primary leading-relaxed flex items-start gap-2 italic">
                    <AlertCircle size={14} className="shrink-0" />
                    Barcha gigiyena talablariga rioya qilish oshpazning bevosita mas'uliyati hisoblanadi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-brand-border shadow-sm space-y-6">
            <h4 className="text-sm font-black text-brand-depth uppercase tracking-widest flex items-center gap-2">
              <Clock size={18} className="text-brand-primary" /> Oshxona Statistikasi
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">Bajarildi</span>
                <span className="text-sm font-black text-emerald-600">{tasks.filter(t => t.status === 'SERVED').length} / {tasks.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">O'rtacha harorat</span>
                <span className="text-sm font-black text-orange-600">
                  {tasks.filter(t => t.temperature).length > 0 
                    ? Math.round(tasks.filter(t => t.temperature).reduce((acc, t) => acc + t.temperature, 0) / tasks.filter(t => t.temperature).length)
                    : '--'}°C
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenManagerView;
