import React, { useState, useEffect } from 'react';
import { Apple, Clock, Flame, Zap, Target, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import apiClient from '../../../api/apiClient';


const MEAL_LABELS: Record<string, string> = {
  'BREAKFAST': 'Nonushta',
  'LUNCH': 'Tushlik',
  'TEA': 'Ikkinchi tushlik',
  'DINNER': 'Kechki ovqat'
};

const MEAL_TIMES: Record<string, string> = {
  'BREAKFAST': '08:30',
  'LUNCH': '12:30',
  'TEA': '16:00',
  'DINNER': '18:30'
};

export const MenuSection = ({ data: initialData, childId }: any) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menu, setMenu] = useState(initialData?.menu || []);
  const [loading, setLoading] = useState(false);

  const fetchMenu = async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const res = await apiClient.get(`/parent-portal/menu/${childId}/${dateStr}`);
      setMenu(res.data);
    } catch (err) {
      console.error(err);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const selected = selectedDate.toISOString().split('T')[0];
    
    if (today !== selected) {
      fetchMenu(selectedDate);
    } else {
      setMenu(initialData?.menu || []);
    }
  }, [selectedDate, childId, initialData]);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = (date: Date) => {
    return date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
  };

  const getDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const d = date.toISOString().split('T')[0];
    if (d === today.toISOString().split('T')[0]) return 'Bugun';
    if (d === yesterday.toISOString().split('T')[0]) return 'Kecha';
    if (d === tomorrow.toISOString().split('T')[0]) return 'Ertaga';
    
    return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' });
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 md:space-y-12">
      {/* Calendar Navigation */}
      <div className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-brand-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shadow-inner">
               <CalendarIcon size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest leading-none mb-1">Taomnoma rejasi</p>
               <h4 className="text-xl md:text-2xl font-black text-brand-depth tracking-tighter uppercase">{getDateLabel(selectedDate)}</h4>
            </div>
         </div>

         <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <button 
              onClick={() => changeDate(-1)}
              className="p-3 hover:bg-white hover:text-brand-primary rounded-xl transition-all hover:shadow-md text-brand-muted"
            >
               <ChevronLeft size={24} />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <button 
              onClick={() => setSelectedDate(new Date())}
              className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isToday(selectedDate) ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-brand-muted hover:bg-white'}`}
            >
               Bugun
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <button 
              onClick={() => changeDate(1)}
              className="p-3 hover:bg-white hover:text-brand-primary rounded-xl transition-all hover:shadow-md text-brand-muted"
            >
               <ChevronRight size={24} />
            </button>
         </div>
      </div>

      <div className="bg-emerald-50 p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border-2 border-emerald-100 flex flex-col md:flex-row items-center gap-6 md:gap-12 text-center md:text-left">
         <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-lg shrink-0 border-4 border-emerald-50">
            <Apple className="text-emerald-500" size={56} />
         </div>
         <div className="space-y-2">
            <h4 className="text-2xl md:text-4xl font-black text-emerald-900 tracking-tighter">Parhez Menyu</h4>
            <p className="text-emerald-700 text-xs md:text-sm font-bold uppercase tracking-widest max-w-2xl">
               100% tabiiy va yangi mahsulotlardan tayyorlangan.
            </p>
         </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-emerald-600 font-black uppercase text-[10px] tracking-widest">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
           {menu?.length > 0 ? menu.map((item: any, idx: number) => (
             <motion.div 
               key={idx} 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="bg-white border border-slate-100 rounded-[2.5rem] md:rounded-[3.5rem] p-4 md:p-6 shadow-sm hover:shadow-2xl hover:border-brand-primary transition-all group overflow-hidden"
             >
                {/* Meal Image Container */}
                <div className="relative h-48 md:h-64 w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-6 bg-slate-100">
                   {item.image_url ? (
                      <img src={item.image_url} alt={item.meal_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                         <Apple size={64} className="opacity-20" />
                         <p className="text-[10px] font-black uppercase tracking-widest mt-2">Rasm mavjud emas</p>
                      </div>
                   )}
                   <div className="absolute top-4 left-4 flex gap-2">
                      <div className="px-4 py-2 bg-white/90 backdrop-blur-md text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                         {MEAL_LABELS[item.meal_type] || item.meal_type}
                      </div>
                   </div>
                   <div className="absolute bottom-4 right-4 flex items-center gap-2 text-brand-depth font-black text-[10px] md:text-xs bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
                      <Clock size={14} className="text-brand-primary"/> {MEAL_TIMES[item.meal_type] || '--:--'}
                   </div>
                </div>

                <div className="px-4 pb-4">
                   <h5 className="text-xl md:text-2xl font-black text-brand-depth mb-3 leading-tight tracking-tight group-hover:text-brand-primary transition-colors">
                      {item.meal_name}
                   </h5>
                   <p className="text-[10px] md:text-xs font-bold text-brand-slate mb-6 bg-slate-50 p-4 rounded-2xl border-l-4 border-emerald-300 italic">
                      Tarkibi: {item.vitamins}
                   </p>
                   
                   <div className="grid grid-cols-2 gap-3 md:gap-4 pt-6 border-t border-slate-100">
                      {[
                         {icon: Flame, label: "Temir", value: `${item.iron} mg`, color: "orange"},
                         {icon: Zap, label: "Uglerod", value: `${item.carbohydrates} g`, color: "blue"},
                      ].map(nut => (
                         <div key={nut.label} className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-between border border-transparent">
                            <div className="flex items-center gap-2">
                               <div className={`w-8 h-8 rounded-lg bg-${nut.color}-100 text-${nut.color}-500 flex items-center justify-center`}><nut.icon size={14} /></div>
                               <span className="text-[8px] md:text-[10px] font-black text-brand-muted uppercase">{nut.label}</span>
                            </div>
                            <span className="text-[10px] md:text-sm font-black text-brand-depth">{nut.value}</span>
                         </div>
                      ))}
                      <div className="bg-brand-depth p-4 md:p-5 rounded-xl md:rounded-2xl flex items-center justify-between col-span-2 text-white shadow-lg group-hover:bg-brand-primary transition-colors">
                         <div className="flex items-center gap-2 md:gap-3">
                            <Target size={18} className="opacity-40" />
                            <span className="text-[9px] md:text-[11px] font-black uppercase opacity-60 tracking-widest">Energetik quvvati</span>
                         </div>
                         <span className="text-xl md:text-2xl font-black tracking-tighter">{item.calories} <span className="text-xs opacity-40">kkal</span></span>
                      </div>
                   </div>
                </div>
             </motion.div>
           )) : (
             <div className="col-span-1 lg:col-span-2 bg-white p-12 md:p-20 rounded-[2rem] md:rounded-[4rem] border-2 border-dashed border-brand-border flex flex-col items-center justify-center text-center space-y-4">
                <Apple size={32} md:size={48} className="text-brand-muted" />
                <p className="text-brand-muted font-black uppercase tracking-widest text-[10px] md:text-xs">Ushbu sana uchun menyu topilmadi</p>
             </div>
           )}
        </div>
      )}
    </motion.div>
  );
};
