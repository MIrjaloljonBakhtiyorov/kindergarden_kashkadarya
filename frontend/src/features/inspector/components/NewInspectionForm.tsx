import React, { useState, useMemo } from 'react';
import { 
  Send, 
  FileText, 
  BrainCircuit, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileCheck,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChecklistItem } from './ChecklistItem';
import { FoodConsumptionMonitor } from './FoodConsumptionMonitor';
import { INSPECTION_CATEGORIES } from '../constants/inspector.constants';

interface NewInspectionFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export const NewInspectionForm: React.FC<NewInspectionFormProps> = ({ onCancel, onSubmit }) => {
  const [activeCategory, setActiveCategory] = useState(INSPECTION_CATEGORIES[0].id);
  const [results, setResults] = useState<Record<string, Record<number, 'normal' | 'problem' | null>>>({});
  const [consumptionData, setConsumptionData] = useState<Record<string, any>>({});
  const [consumptionStats, setConsumptionStats] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleStatusChange = (catId: string, questionId: number, status: 'normal' | 'problem' | null) => {
    setResults(prev => ({
      ...prev,
      [catId]: {
        ...(prev[catId] || {}),
        [questionId]: status
      }
    }));
  };

  const handleConsumptionChange = (data: Record<string, any>, stats: any) => {
    setConsumptionData(data);
    setConsumptionStats(stats);
  };

  const categoryProgress = useMemo(() => {
    const progress: Record<string, number> = {};
    INSPECTION_CATEGORIES.forEach(cat => {
      if (cat.id === 'FOOD_CONSUMPTION') {
        if (!consumptionStats || consumptionStats.total === 0) {
          progress[cat.id] = 0;
        } else {
          progress[cat.id] = Math.round((consumptionStats.answered / consumptionStats.total) * 100);
        }
        return;
      }
      const answered = Object.keys(results[cat.id] || {}).length;
      progress[cat.id] = Math.round((answered / cat.questions.length) * 100) || 0;
    });
    return progress;
  }, [results, consumptionStats]);

  const totalProgress = useMemo(() => {
    const totalCats = INSPECTION_CATEGORIES.length;
    const sumProgress = Object.values(categoryProgress).reduce((acc, curr) => acc + curr, 0);
    return Math.round(sumProgress / totalCats);
  }, [categoryProgress]);

  const canSubmit = useMemo(() => {
    // Check if at least one category is started, or if all are 100%
    // The user was frustrated because they finished ONE section but couldn't save.
    // Let's allow saving if ANY category is 100% OR if total progress > 0.
    return Object.values(categoryProgress).some(p => p > 0);
  }, [categoryProgress]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitted(true);
    onSubmit({
      results,
      consumption: consumptionData,
      totalProgress
    });
  };

  const currentCategory = INSPECTION_CATEGORIES.find(c => c.id === activeCategory);

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-20 text-center"
      >
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10 border-4 border-white">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Hisobot muvaffaqiyatli yuborildi</h2>
        <p className="text-slate-500 font-medium mb-12">Inspeksiya natijalari tizimga saqlandi va mas'ul shaxslarga yuborildi.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <button className="flex items-center justify-center gap-3 p-6 bg-white border border-slate-200 rounded-[2rem] font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <FileText className="text-blue-600" /> PDF HISOBOT YARATISH
          </button>
          <button 
            onClick={() => { setAiLoading(true); setTimeout(() => setAiLoading(false), 2000); }}
            className="flex items-center justify-center gap-3 p-6 bg-purple-600 rounded-[2rem] font-black text-white hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20"
          >
            {aiLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <BrainCircuit /> {aiLoading ? 'TAHLIL QILINMOQDA...' : 'AI TAHLILGA YUBORISH'}
              </>
            )}
          </button>
        </div>

        <button 
          onClick={onCancel}
          className="flex items-center gap-2 mx-auto text-slate-400 font-bold hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} /> DASHBORDGA QAYTISH
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] -m-8 overflow-hidden bg-white">
      {/* Left Panel - Category Selector */}
      <div className="lg:w-[350px] border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-8 border-b border-slate-100 bg-white">
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Orqaga qaytish
          </button>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Obyekt va Yo'nalish</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Audit yo'nalishini tanlang</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {INSPECTION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full p-4 rounded-3xl border-2 transition-all flex items-center gap-4 group relative ${
                activeCategory === cat.id 
                  ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/5' 
                  : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
              }`}>
                <cat.icon size={22} />
              </div>
              <div className="text-left flex-1">
                <p className={`font-black text-sm uppercase tracking-tight ${activeCategory === cat.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {cat.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500" 
                      style={{ width: `${categoryProgress[cat.id]}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-black text-slate-400">{categoryProgress[cat.id]}%</span>
                </div>
              </div>
              {categoryProgress[cat.id] === 100 && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm">
                  <CheckCircle2 size={12} />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-8 border-t border-slate-100 bg-white">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Umumiy progress</span>
            <span className="text-sm font-black text-blue-600">{totalProgress}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Checklist Engine */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              {currentCategory?.name}
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                FAOL
              </span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Rasmiy tekshiruv varaqasi va monitoring</p>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <FileCheck size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Kategoriya</p>
                <p className="text-xs font-bold text-slate-700 leading-none">{currentCategory?.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <History size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sana</p>
                <p className="text-xs font-bold text-slate-700 leading-none">29.04.2026</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence mode="wait">
              {activeCategory === 'FOOD_CONSUMPTION' ? (
                <motion.div
                  key="food"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <FoodConsumptionMonitor 
                    onDataChange={handleConsumptionChange}
                    initialData={consumptionData}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {currentCategory?.questions.map((q, i) => (
                    <ChecklistItem 
                      key={i} 
                      id={i + 1} 
                      question={q} 
                      onStatusChange={(qid, status) => handleStatusChange(activeCategory, qid, status)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-colors ${
              canSubmit ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {canSubmit ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {canSubmit ? "Hisobotni yuborish mumkin" : "Ma'lumotlar kiritilmoqda"}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {totalProgress === 100 ? "Barcha bandlar yakunlandi" : `Progress: ${totalProgress}%`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={onCancel}
              className="flex-1 sm:flex-none px-8 py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
            >
              Bekor qilish
            </button>
            <motion.button 
              whileHover={canSubmit ? { scale: 1.02 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex-1 sm:flex-none px-12 py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                canSubmit 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              HISOBOTNI YUBORISH <Send size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
