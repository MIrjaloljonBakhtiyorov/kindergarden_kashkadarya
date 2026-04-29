import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Utensils, 
  Users, 
  Baby, 
  Bean, 
  GlassWater,
  Clock,
  CheckCircle2,
  Flame,
  ChefHat,
  Timer,
  AlertTriangle,
  Info,
  Thermometer,
  Printer,
  X,
  Check,
  ChevronRight,
  Package,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Zap,
  Activity,
  Scale,
  Weight,
  Layers
} from 'lucide-react';
import apiClient from '../../../api/apiClient';
import { useNotification } from '../../../context/NotificationContext';

const MEAL_TYPES = [
  { id: 'BREAKFAST', name: 'Nonushta', icon: '☀️', target: '08:30', color: 'blue' },
  { id: 'LUNCH', name: 'Tushlik', icon: '🍲', target: '12:30', color: 'indigo' },
  { id: 'TEA', name: 'Poldnik', icon: '☕', target: '16:00', color: 'amber' },
  { id: 'DINNER', name: 'Kechki ovqat', icon: '🌙', target: '18:30', color: 'slate' }
];

const STATUS_FLOW = ['PENDING', 'ACCEPTED', 'COOKING_STARTED', 'COOKING', 'SERVED'];

const STATUS_CONFIG: Record<string, { label: string, color: string, bg: string, icon: any }> = {
  'PENDING': { label: 'Navbatda', color: 'text-slate-400', bg: 'bg-slate-50', icon: Clock },
  'ACCEPTED': { label: 'Qabul qilindi', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle2 },
  'COOKING_STARTED': { label: 'Tayyorgarlik', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: ChefHat },
  'COOKING': { label: 'Pishmoqda', color: 'text-orange-600', bg: 'bg-orange-50', icon: Flame },
  'SERVED': { label: 'Tayyor', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 }
};

// Standard portion weights for kindergarten
const STANDARD_WEIGHTS: Record<string, string> = {
  'BREAKFAST': '200-250 gr',
  'LUNCH': '250-300 gr',
  'TEA': '150-200 gr',
  'DINNER': '200 gr'
};

export const ChefMenuDashboard: React.FC = () => {
  const { showNotification } = useNotification();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState('BREAKFAST');
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [allergies, setAllergies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTempModal, setShowTempModal] = useState<string | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState<any | null>(null);
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, statsRes, allergiesRes] = await Promise.all([
        apiClient.get(`/kitchen/tasks/${selectedDate}`),
        apiClient.get('/attendance/today-stats'),
        apiClient.get('/health/allergies')
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
      setAllergies(allergiesRes.data);
    } catch (err) {
      console.error("Chef Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (menuId: string, currentStatus: string, additionalData = {}) => {
    try {
      const currentIndex = STATUS_FLOW.indexOf(currentStatus || 'PENDING');
      const nextStatus = STATUS_FLOW[Math.min(currentIndex + 1, STATUS_FLOW.length - 1)];
      const data: any = { status: nextStatus, ...additionalData };
      if (nextStatus === 'COOKING_STARTED') data.start_time = new Date().toISOString();
      if (nextStatus === 'SERVED') data.served_time = new Date().toISOString();

      await apiClient.post(`/kitchen/tasks/${menuId}/status`, data);
      showNotification(`Holat o'zgardi: ${STATUS_CONFIG[nextStatus].label}`, 'success');
      setShowTempModal(null);
      setTempValue('');
      fetchData();
    } catch (err) {
      showNotification("Xatolik", "error");
    }
  };

  const filteredTasks = tasks.filter(t => t.meal_type === selectedMealType);
  const activeMeal = MEAL_TYPES.find(m => m.id === selectedMealType);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans selection:bg-blue-100 pb-32">
      <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-10">
        
        {/* --- SUPREME LIGHT HEADER --- */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] rotate-12">
            <ChefHat size={180} strokeWidth={1} />
          </div>

          <div className="flex items-center gap-6 md:gap-8 relative z-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20"
            >
              <ChefHat size={32} className="md:size-10" />
            </motion.div>
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 italic uppercase">Oshpaz <span className="text-blue-600">Pro</span></h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2 font-bold text-slate-500 underline decoration-blue-500 decoration-2 underline-offset-4 tracking-[0.1em]">Porsiya va Me'yor</span>
                <span className="hidden md:block w-1 h-1 bg-slate-200 rounded-full"></span>
                <span className="flex items-center gap-2 text-emerald-500 font-bold"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Live ERP</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-50 rounded-2xl hover:border-blue-100 hover:shadow-lg transition-all font-black text-[10px] uppercase tracking-wider text-slate-600">
              <Printer size={16} /> Chop etish
            </button>
            <div className="bg-white border-2 border-slate-50 p-2 rounded-2xl flex items-center gap-2 shadow-sm">
              <Calendar size={18} className="text-blue-600 ml-2" />
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none outline-none font-black text-xs text-slate-800 p-1 cursor-pointer"
              />
            </div>
          </div>
        </motion.header>

        {/* --- DASHBOARD STATS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard icon={Baby} label="1-3 yosh" value={stats?.age1_3} color="blue" sub="Kichik" />
          <StatCard icon={Users} label="3-7 yosh" value={stats?.age3_7} color="indigo" sub="Katta" />
          <StatCard icon={Bean} label="Allergiyalar" value={stats?.allergyCount} color="amber" sub="Parhez" />
          <StatCard icon={Scale} label="Jami Porsiyalar" value={stats ? stats.age1_3 + stats.age3_7 : 0} color="emerald" sub="Jami" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
          
          {/* --- MAIN TASK AREA (LEFT) --- */}
          <div className="lg:col-span-8 space-y-8 md:space-y-10">
            
            {/* Meal Selector Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-3 p-2 bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 w-full md:w-fit">
              {MEAL_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedMealType(type.id)}
                  className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-[2rem] transition-all duration-300 font-black uppercase text-[10px] md:text-[11px] tracking-wider ${
                    selectedMealType === type.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl md:text-2xl">{type.icon}</span>
                  <div className="text-left">
                    <p className="leading-tight">{type.name}</p>
                    <p className={`text-[8px] md:text-[9px] mt-0.5 opacity-60 font-bold ${selectedMealType === type.id ? 'text-blue-100' : 'text-slate-400'}`}>{type.target}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => {
                    const portions = task.age_group === '1-3' ? (stats?.age1_3 || 0) : (stats?.age3_7 || 0);
                    const portionWeight = task.meal_type === 'BREAKFAST' || task.meal_type === 'DINNER' ? '200-250 gr' : (task.meal_type === 'LUNCH' ? '250-300 gr' : '150 gr');
                    
                    return (
                      <SupremePortionCard 
                        key={task.menu_id} 
                        task={task} 
                        portions={portions}
                        portionWeight={portionWeight}
                        onAction={() => task.status === 'COOKING' ? setShowTempModal(task.menu_id) : updateStatus(task.menu_id, task.status)}
                        onRecipe={() => setShowRecipeModal(task)}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-full py-20 md:py-32 bg-white rounded-3xl md:rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-6 shadow-inner">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <Utensils size={40} />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-slate-300 font-black uppercase text-lg md:text-xl tracking-widest">Hozircha bo'sh</p>
                      <p className="text-slate-200 text-sm font-bold">Ushbu taom turi uchun menyu belgilanmagan</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* --- SIDEBAR INTEL (RIGHT) --- */}
          <div className="lg:col-span-4 space-y-8 md:space-y-10">
            
            {/* Timeline Mission */}
            <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 md:p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                <Clock size={120} />
              </div>
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Timer size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-widest">{activeMeal?.name}</h4>
                    <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">Vaqt Nazorati</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Tarqatish vaqti</p>
                    <p className="text-2xl font-black text-white italic">{activeMeal?.target}</p>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="h-full w-1/3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Quick Bar */}
            <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6 md:space-y-8">
              <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                <Package size={24} className="text-blue-600" /> Ombor Monitor
              </h3>
              <div className="space-y-6">
                <StockBar label="Go'sht (Mol)" value="45 kg" percent={80} color="emerald" />
                <StockBar label="Sut" value="120 L" percent={35} color="blue" />
                <StockBar label="Sabzavot" value="200 kg" percent={90} color="emerald" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showTempModal && <SupremeLightTempModal value={tempValue} onChange={setTempValue} onSave={(val) => updateStatus(showTempModal, 'COOKING', { temperature: Number(val) })} onClose={() => setShowTempModal(null)} />}
        {showRecipeModal && <SupremeLightRecipeModal task={showRecipeModal} onClose={() => setShowRecipeModal(null)} />}
      </AnimatePresence>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl flex items-center gap-6 md:gap-8 group">
    <div className={`w-16 h-16 md:w-20 md:h-20 bg-${color}-50 text-${color}-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500`}>
      <Icon size={32} className="md:size-10" strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none">{value ?? '0'}</p>
        <p className={`text-[9px] font-bold text-${color}-500 mb-0.5`}>{sub}</p>
      </div>
    </div>
  </motion.div>
);

const SupremePortionCard = ({ task, portions, portionWeight, onAction, onRecipe }) => {
  const status = task.status || 'PENDING';
  const config = STATUS_CONFIG[status];
  const progress = (STATUS_FLOW.indexOf(status) / (STATUS_FLOW.length - 1)) * 100;

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      
      {/* CARD TOP - AGE & PORTIONS AREA */}
      <div className="p-4 md:p-5 border-b border-slate-50 bg-slate-50/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center bg-white shadow-md text-blue-600 border border-slate-50`}>
              {task.age_group === '1-3' ? <Baby size={18} className="md:size-[22px]" /> : <Users size={18} className="md:size-[22px]" />}
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Yosh</p>
              <h4 className="text-sm md:text-base font-black text-slate-800 leading-none">{task.age_group} yosh</h4>
            </div>
          </div>
          
          {/* SUPREME PORTION BADGE */}
          <div className="bg-blue-600 p-2 md:p-2.5 rounded-xl md:rounded-2xl text-white flex flex-col items-center justify-center min-w-[60px] md:min-w-[70px] shadow-lg shadow-blue-500/20 transform group-hover:scale-105 transition-transform">
            <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-70 mb-0.5">Porsiya</p>
            <p className="text-xl md:text-2xl font-black leading-none">{portions}</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-2 md:p-3 rounded-xl md:rounded-2xl border border-white">
          <div className="flex items-center gap-2">
            <Layers size={12} className="text-indigo-500 md:size-3.5" />
            <div>
              <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-wider">Hajm</p>
              <p className="text-[10px] md:text-xs font-black text-slate-800 italic">{portionWeight}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Weight size={12} className="text-amber-500 md:size-3.5" />
            <div>
              <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-wider">Turi</p>
              <p className="text-[10px] md:text-xs font-black text-slate-800 italic uppercase">{task.diet_type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* DISH NAME & STATUS ICON */}
      <div className="p-4 md:p-5 flex justify-between items-center bg-white relative">
        <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors flex-1">{task.meal_name}</h3>
        <div className={`w-10 h-10 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center ${config.color} ${config.bg} shadow-md shadow-black/5 border border-white ml-3 shrink-0`}>
          <config.icon size={20} className="md:size-6" strokeWidth={2} />
        </div>
      </div>

      {/* PROGRESS AREA */}
      <div className="px-4 md:px-5 pb-4 md:pb-5 space-y-2 md:space-y-3">
        <div className="flex justify-between px-1 text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest">
          <span>{config.label}</span>
          <span className="text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-100/50 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm`} />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="p-4 md:p-5 pt-0 flex gap-2 md:gap-3">
        <motion.button whileTap={{ scale: 0.95 }} onClick={onRecipe} className="p-3 md:p-3.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"><BookOpen size={18} /></motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction} 
          disabled={status === 'SERVED'}
          className={`flex-1 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-wider flex items-center justify-center gap-2 md:gap-3 transition-all shadow-md ${
            status === 'SERVED' ? 'bg-emerald-50 text-emerald-600 shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
          }`}
        >
          {status === 'SERVED' ? <Check size={16} /> : <><span className="mt-0.5">Tasdiqlash</span> <ArrowRight size={14} /></>}
        </motion.button>
      </div>
    </motion.div>
  );
};

const StockBar = ({ label, value, percent, color }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-base font-black text-slate-900 italic">{value}</p>
    </div>
    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
      <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className={`h-full bg-${color}-500 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.05)]`} />
    </div>
  </div>
);

const SupremeLightTempModal = ({ value, onChange, onSave, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/40 backdrop-blur-md">
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white border border-slate-100 w-full max-w-lg rounded-3xl md:rounded-[3rem] shadow-3xl overflow-hidden">
      <div className="p-8 md:p-10 bg-gradient-to-br from-orange-500 to-amber-600 text-white flex justify-between items-center relative">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30">
            <Thermometer size={32} strokeWidth={2} />
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic leading-none">Harorat Nazorati</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10"><X size={24} /></button>
      </div>
      <div className="p-8 md:p-12 space-y-8 md:space-y-10">
        <div className="relative">
          <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-8 md:p-10 bg-slate-50 border-2 border-transparent focus:border-orange-500 rounded-3xl md:rounded-[2.5rem] outline-none text-6xl md:text-7xl font-black text-center text-slate-900 transition-all" autoFocus />
          <div className="absolute inset-y-0 right-8 md:right-10 flex items-center text-slate-300 font-black text-2xl md:text-3xl italic">°C</div>
        </div>
        <button onClick={() => onSave(value)} disabled={!value} className={`w-full py-6 md:py-8 rounded-3xl md:rounded-[2.5rem] font-black uppercase text-[12px] md:text-[14px] tracking-widest transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/30`}>
          Saqlash va Yakunlash
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const SupremeLightRecipeModal = ({ task, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/40 backdrop-blur-md">
    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white border border-slate-100 w-full max-w-3xl rounded-3xl md:rounded-[3.5rem] shadow-3xl overflow-hidden">
      <div className="p-8 md:p-10 bg-blue-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30">
            <BookOpen size={32} strokeWidth={2} />
          </div>
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic">{task.meal_name}</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
      </div>
      <div className="p-8 md:p-12 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-widest border-b-2 border-blue-50 pb-3 inline-block">Tayyorlash Protokoli</h4>
        <div className="space-y-6">
          {[1, 2, 3].map((step, i) => (
            <div key={i} className="flex gap-6 items-start group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-lg md:text-xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100">{step}</div>
              <p className="font-bold text-slate-500 text-sm md:text-base pt-2 md:pt-3 leading-relaxed">Tayyorlanish bosqichi uchun batafsil texnologik xarita ma'lumotlari shu yerda aks etadi.</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </motion.div>
);
