import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Utensils, 
  Plus, 
  Check,
  Flame,
  Zap,
  Leaf,
  Droplets,
  Clock,
  Camera,
  Info,
  Users
} from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';

const API_BASE = 'http://localhost:3001/api';

interface Dish {
  id: string;
  name: string;
  image: string;
  kcal: number;
  iron: number;
  carbs: number;
  vitamins: string;
}

const MEAL_TYPES = [
  { id: 'BREAKFAST', label: 'Nonushta', time: '08:30' },
  { id: 'LUNCH', label: 'Tushlik', time: '12:30' },
  { id: 'TEA', label: 'Poldnik', time: '16:00' },
  { id: 'DINNER', label: 'Kechki ovqat', time: '18:30' }
];

const DISHES_POOL: Dish[] = [
  { id: '1', name: 'Sutli Botqa (Guruchli)', image: 'https://images.unsplash.com/photo-1594610367113-211440453307?auto=format&fit=crop&w=300', kcal: 250, iron: 1.2, carbs: 45, vitamins: 'A, B1, D' },
  { id: '2', name: 'Osh (Palov)', image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff5e70?auto=format&fit=crop&w=300', kcal: 450, iron: 3.5, carbs: 60, vitamins: 'B12, E, PP' },
  { id: '3', name: 'Mastava', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=300', kcal: 320, iron: 2.8, carbs: 35, vitamins: 'C, B6' },
  { id: '4', name: 'Somsa', image: 'https://images.unsplash.com/photo-1601050638917-3d8bc6029a55?auto=format&fit=crop&w=300', kcal: 280, iron: 2.1, carbs: 40, vitamins: 'A, E' },
  { id: '5', name: 'Suli Botqasi (Oatmeal)', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=300', kcal: 210, iron: 1.5, carbs: 38, vitamins: 'B2, B5' },
  { id: '6', name: 'Tovuqli Sho\'rva', image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=300', kcal: 280, iron: 2.5, carbs: 20, vitamins: 'A, C, D' },
];

const NutritionistView: React.FC = () => {
  const { showNotification } = useNotification();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMenu, setCurrentMenu] = useState<any[]>([]);
  const [dishesPool, setDishesPool] = useState<Dish[]>(DISHES_POOL);
  const [isSelecting, setIsSelecting] = useState<{type: string, age: string, diet: string, open: boolean} | null>(null);
  const [isManagingDishes, setIsManagingDishes] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', image: '', kcal: 0, iron: 0, carbs: 0, vitamins: '' });
  const [loading, setLoading] = useState(false);

  const [activeAgeGroup, setActiveAgeGroup] = useState<'1-3' | '3-7'>('3-7');
  const [activeDietType, setActiveDietType] = useState<'REGULAR' | 'DIETARY'>('REGULAR');

  // Computed stats based on age group
  const totalChildren = activeAgeGroup === '1-3' ? 45 : 82;
  const dietChildren = activeAgeGroup === '1-3' ? 5 : 12;
  const portionSize = activeAgeGroup === '1-3' ? '150-200g' : '250-300g';
  const dietPortionSize = activeAgeGroup === '1-3' ? '150g' : '250g';

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = -3; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        full: d.toISOString().split('T')[0],
        day: d.getDate(),
        month: d.toLocaleString('uz-UZ', { month: 'short' }),
        weekday: d.toLocaleString('uz-UZ', { weekday: 'short' }),
        isToday: d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
      });
    }
    return days;
  }, []);

  useEffect(() => {
    fetchMenuForDate(selectedDate);
    fetchDishes();
  }, [selectedDate]);

  const fetchMenuForDate = async (date: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/menu/${date}`);
      setCurrentMenu(res.data);
    } catch (err) {
      console.error("Menu fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDishes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dishes`);
      if (res.data && res.data.length > 0) {
        setDishesPool(res.data);
      }
    } catch (err) {
      console.error("Dishes fetch error, using fallback:", err);
    }
  };

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/dishes`, newDish);
      showNotification("Yangi taom qo'shildi!", 'success');
      fetchDishes();
      setNewDish({ name: '', image: '', kcal: 0, iron: 0, carbs: 0, vitamins: '' });
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!window.confirm("Haqiqatan ham ushbu taomni o'chirmoqchimisiz?")) return;
    try {
      await axios.delete(`${API_BASE}/dishes/${id}`);
      showNotification("Taom o'chirildi", 'success');
      fetchDishes();
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const handleSelectDish = async (dish: Dish) => {
    if (!isSelecting) return;
    try {
      await axios.post(`${API_BASE}/menu`, {
        date: selectedDate,
        meal_name: dish.name,
        meal_type: isSelecting.type,
        age_group: isSelecting.age,
        diet_type: isSelecting.diet,
        nutrition: {
          iron: dish.iron,
          carbs: dish.carbs,
          vitamins: dish.vitamins,
          kcal: dish.kcal
        }
      });
      showNotification(`${dish.name} muvaffaqiyatli tanlandi!`, 'success');
      fetchMenuForDate(selectedDate);
      setIsSelecting(null);
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const getMealForType = (type: string, age: string, diet: string) => {
    return currentMenu.find(m => m.meal_type === type && m.age_group === age && m.diet_type === diet);
  };

  const filteredMenu = useMemo(() => {
    return currentMenu.filter(m => m.age_group === activeAgeGroup && m.diet_type === activeDietType);
  }, [currentMenu, activeAgeGroup, activeDietType]);

  return (
    <div className="p-8 animate-in fade-in max-w-7xl mx-auto space-y-10">
      <header className="bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-xl shadow-slate-200/50 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-brand-depth tracking-tight">Oshxona Menyu Tizimi</h2>
            <div className="flex items-center gap-4">
              <p className="text-brand-muted font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-brand-primary" />
                Ovqatlanish rejasini boshqarish
              </p>
              <button 
                onClick={() => setIsManagingDishes(true)}
                className="bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
              >
                Taomlar bazasi
              </button>
            </div>
          </div>
          <div className="flex bg-slate-50 p-2 rounded-2xl border border-brand-border gap-2 overflow-x-auto max-w-full">
            {calendarDays.map(d => (
              <button
                key={d.full}
                onClick={() => setSelectedDate(d.full)}
                className={`flex flex-col items-center justify-center min-w-[60px] py-3 rounded-xl transition-all ${
                  selectedDate === d.full 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105' 
                    : 'hover:bg-white text-brand-muted'
                }`}
              >
                <span className={`text-[9px] font-black uppercase ${selectedDate === d.full ? 'text-white/80' : ''}`}>{d.weekday}</span>
                <span className="text-lg font-black">{d.day}</span>
                {d.isToday && <div className={`w-1 h-1 rounded-full mt-1 ${selectedDate === d.full ? 'bg-white' : 'bg-brand-primary'}`}></div>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-brand-border">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
            <button 
              onClick={() => setActiveAgeGroup('1-3')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAgeGroup === '1-3' ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-muted hover:text-brand-depth'}`}
            >
              1-3 yosh
            </button>
            <button 
              onClick={() => setActiveAgeGroup('3-7')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAgeGroup === '3-7' ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-muted hover:text-brand-depth'}`}
            >
              3-7 yosh
            </button>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
            <button 
              onClick={() => setActiveDietType('REGULAR')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDietType === 'REGULAR' ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-muted hover:text-brand-depth'}`}
            >
              Oddiy Menyu
            </button>
            <button 
              onClick={() => setActiveDietType('DIETARY')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDietType === 'DIETARY' ? 'bg-emerald-500 text-white shadow-sm' : 'text-brand-muted hover:text-brand-depth'}`}
            >
              Parhez Menyu
            </button>
          </div>
        </div>
      </header>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] p-6 border border-brand-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Umumiy bolalar</p>
            <p className="text-2xl font-black text-brand-depth">{totalChildren} <span className="text-sm font-bold text-brand-muted/70">ta ({dietChildren} ta parhezda)</span></p>
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-6 border border-brand-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Utensils size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Porsiya hajmi</p>
            <p className="text-2xl font-black text-brand-depth">{portionSize}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-brand-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Leaf size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Parhez taom hajmi</p>
            <p className="text-2xl font-black text-brand-depth">{dietPortionSize}</p>
          </div>
        </div>
      </div>

      {/* Daily Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MEAL_TYPES.map(type => {
          const savedMeal = getMealForType(type.id, activeAgeGroup, activeDietType);
          return (
            <div key={type.id} className="bg-white rounded-[2.5rem] border border-brand-border shadow-sm overflow-hidden flex flex-col group hover:border-brand-primary/30 transition-all">
              <div className="p-6 border-b border-brand-border bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-brand-depth uppercase text-[10px] tracking-widest">{type.label}</h3>
                  <div className="flex items-center gap-1 text-brand-muted mt-1">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold">{type.time}</span>
                  </div>
                </div>
                {savedMeal && <Check className="text-emerald-500" size={18} />}
              </div>

              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
                {savedMeal ? (
                  <>
                    <div className="w-28 h-28 rounded-full border-4 border-slate-50 overflow-hidden shadow-xl">
                      <img 
                        src={dishesPool.find(d => d.name === savedMeal.meal_name)?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200'} 
                        className="w-full h-full object-cover" 
                        alt="Dish"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-brand-depth text-lg">{savedMeal.meal_name}</h4>
                      <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">{savedMeal.vitamins}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full pt-4">
                      <div className="bg-orange-50 rounded-xl p-2">
                        <Flame size={12} className="mx-auto text-orange-500 mb-1" />
                        <p className="text-[10px] font-black text-brand-depth">{savedMeal.calories}</p>
                        <p className="text-[7px] text-brand-muted font-black uppercase">kkal</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-2">
                        <Zap size={12} className="mx-auto text-blue-500 mb-1" />
                        <p className="text-[10px] font-black text-brand-depth">{savedMeal.carbohydrates}</p>
                        <p className="text-[7px] text-brand-muted font-black uppercase">ugl</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-2">
                        <Leaf size={12} className="mx-auto text-emerald-500 mb-1" />
                        <p className="text-[10px] font-black text-brand-depth">{savedMeal.iron}</p>
                        <p className="text-[7px] text-brand-muted font-black uppercase">temir</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsSelecting({ type: type.id, age: activeAgeGroup, diet: activeDietType, open: true })}
                      className="mt-4 text-[9px] font-black text-brand-primary uppercase tracking-widest hover:underline"
                    >
                      Tahrirlash
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsSelecting({ type: type.id, age: activeAgeGroup, diet: activeDietType, open: true })}
                    className="w-20 h-20 rounded-full bg-slate-50 border-2 border-dashed border-brand-border flex items-center justify-center text-brand-muted group-hover:bg-brand-primary/5 group-hover:border-brand-primary group-hover:text-brand-primary transition-all"
                  >
                    <Plus size={24} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="bg-brand-depth text-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${activeDietType === 'DIETARY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-brand-primary'}`}>
            <Info size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black">Energiya Balansi ({activeAgeGroup} yosh)</h4>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
              {activeDietType === 'REGULAR' ? 'Oddiy kunlik me\'yorlar' : 'Maxsus parhez rejasi'}
            </p>
          </div>
        </div>
        <div className="flex gap-10">
          <div className="text-center">
            <p className="text-3xl font-black text-brand-primary">
              {filteredMenu.reduce((sum, m) => sum + (m.calories || 0), 0).toFixed(0)}
            </p>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Jami Kkal</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-blue-400">
              {filteredMenu.reduce((sum, m) => sum + (m.carbohydrates || 0), 0).toFixed(0)}
            </p>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Uglevodlar</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-emerald-400">
              {filteredMenu.reduce((sum, m) => sum + (m.iron || 0), 0).toFixed(1)}
            </p>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Temir (mg)</p>
          </div>
        </div>
      </div>

      {/* Dish Selection Modal */}
      {isSelecting && isSelecting.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <header className="p-8 border-b border-brand-border flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-brand-depth">{MEAL_TYPES.find(t => t.id === isSelecting.type)?.label} uchun taom tanlash</h3>
                <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mt-1">
                  {isSelecting.age} yosh • {isSelecting.diet === 'REGULAR' ? 'Oddiy' : 'Parhez'} taomlar ro'yxati
                </p>
              </div>
              <button 
                onClick={() => setIsSelecting(null)}
                className="w-12 h-12 rounded-2xl bg-white border border-brand-border flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="rotate-45" size={24} />
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {dishesPool.map(dish => (
                  <button
                    key={dish.id}
                    onClick={() => handleSelectDish(dish)}
                    className="group flex flex-col text-left space-y-3 p-2 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-brand-primary/20"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                      <img src={dish.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={dish.name} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-brand-depth leading-tight group-hover:text-brand-primary">{dish.name}</p>
                      <div className="flex items-center gap-1 text-[8px] font-bold text-brand-muted mt-1">
                        <Flame size={10} className="text-orange-500" />
                        <span>{dish.kcal} kkal</span>
                        <span className="mx-1">•</span>
                        <span>{dish.vitamins}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dish Management Modal */}
      {isManagingDishes && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <header className="p-8 border-b border-brand-border flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-brand-depth">Taomlar Bazasi</h3>
                <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mt-1">Yangi taomlar qo'shish va mavjudlarini boshqarish</p>
              </div>
              <button onClick={() => setIsManagingDishes(false)} className="w-12 h-12 rounded-2xl bg-white border border-brand-border flex items-center justify-center hover:bg-slate-50">
                <ChevronRight className="rotate-45" size={24} />
              </button>
            </header>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-80 p-8 border-r border-brand-border bg-slate-50/30 overflow-y-auto">
                <h4 className="font-black text-brand-depth text-xs uppercase tracking-widest mb-6">Yangi Taom Qo'shish</h4>
                <form onSubmit={handleAddDish} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-brand-muted mb-1 block">Nomi</label>
                    <input required value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} className="w-full p-3 rounded-xl border border-brand-border text-xs font-bold outline-none focus:border-brand-primary" placeholder="Masalan: Tovuqli Sho'rva" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-brand-muted mb-1 block">Rasm URL</label>
                    <input value={newDish.image} onChange={e => setNewDish({...newDish, image: e.target.value})} className="w-full p-3 rounded-xl border border-brand-border text-xs font-bold outline-none focus:border-brand-primary" placeholder="https://..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-brand-muted mb-1 block">Kkal</label>
                      <input type="number" value={newDish.kcal} onChange={e => setNewDish({...newDish, kcal: Number(e.target.value)})} className="w-full p-3 rounded-xl border border-brand-border text-xs font-bold outline-none focus:border-brand-primary" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-brand-muted mb-1 block">Temir</label>
                      <input type="number" step="0.1" value={newDish.iron} onChange={e => setNewDish({...newDish, iron: Number(e.target.value)})} className="w-full p-3 rounded-xl border border-brand-border text-xs font-bold outline-none focus:border-brand-primary" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-brand-muted mb-1 block">Ugl</label>
                      <input type="number" value={newDish.carbs} onChange={e => setNewDish({...newDish, carbs: Number(e.target.value)})} className="w-full p-3 rounded-xl border border-brand-border text-xs font-bold outline-none focus:border-brand-primary" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-brand-muted mb-1 block">Vitaminlar</label>
                      <input value={newDish.vitamins} onChange={e => setNewDish({...newDish, vitamins: e.target.value})} className="w-full p-3 rounded-xl border border-brand-border text-xs font-bold outline-none focus:border-brand-primary" placeholder="A, C, D" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-primary/30 hover:scale-105 transition-all">Qo'shish</button>
                </form>
              </div>
              
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dishesPool.map(dish => (
                    <div key={dish.id} className="bg-white border border-brand-border p-4 rounded-3xl flex items-center gap-4 relative group">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                        <img src={dish.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-black text-brand-depth text-xs truncate">{dish.name}</h5>
                        <p className="text-[9px] text-brand-muted font-bold">{dish.kcal} kkal • {dish.vitamins}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteDish(dish.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      >
                        <ChevronRight className="rotate-45" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionistView;
