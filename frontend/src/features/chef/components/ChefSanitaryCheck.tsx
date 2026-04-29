import React, { useState } from 'react';
import { ShieldCheck, Check, AlertCircle, Sparkles, User, Thermometer, Droplets, Wind } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import { useNotification } from '../../../context/NotificationContext';

const SANITARY_ITEMS = [
  { id: 1, text: 'Oshxona umumiy tozalangan va tartibga keltirilganmi?', icon: Sparkles },
  { id: 2, text: 'Barcha jihozlar dezinfeksiya qilingan va ishga tayyormi?', icon: ShieldCheck },
  { id: 3, text: 'Oshpaz maxsus kiyimda (qalpoq, fartuk, qo\'lqop) bormi?', icon: User },
  { id: 4, text: 'Mahsulotlar toza, sifatli va yaroqlilik muddati o\'tmaganmi?', icon: Check },
  { id: 5, text: 'Qo\'l yuvish vositalari va antiseptiklar mavjudmi?', icon: Droplets },
  { id: 6, text: 'Oshxonada havo aylanishi (ventilyatsiya) me\'yordami?', icon: Wind },
  { id: 7, text: 'Muzlatkichlar harorati me\'yordami (+4°C gacha)?', icon: Thermometer },
  { id: 8, text: 'Oshpazning shaxsiy gigiyenasi (tirnoqlar, jarohatlar yo\'qligi) tekshirildimi?', icon: User }
];

interface Props {
  onComplete: () => void;
}

export const ChefSanitaryCheck: React.FC<Props> = ({ onComplete }) => {
  const { showNotification } = useNotification();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleItem = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const allChecked = SANITARY_ITEMS.every((item) => checkedItems[item.id]);

  const handleConfirm = async () => {
    if (allChecked) {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        await apiClient.post('/chef/sanitary-check', {
          chef_id: 'chef_01', // Amalda auth contextdan olinadi
          date: today,
          checks: checkedItems
        });
        
        setIsSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } catch (err) {
        showNotification("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-8 md:p-12 rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-emerald-100 text-center max-w-md w-full space-y-6 md:space-y-8">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-200 animate-bounce">
            <Check size={40} className="md:size-12 text-white" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Muvaffaqiyatli!</h2>
            <p className="text-base font-medium text-slate-500">
              Sanitariya tekshiruvi muvaffaqiyatli yakunlandi. Taomnoma bo'limiga yo'naltirilmoqda...
            </p>
          </div>
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 md:p-10 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-24 -mt-24" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 rotate-3 shrink-0">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight italic uppercase">Sanitariya nazorati</h1>
              <p className="text-blue-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest flex items-center justify-center md:justify-start gap-2">
                <Sparkles size={12} className="animate-pulse" />
                Ish boshlashdan oldin tasdiqlang
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {SANITARY_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`group flex items-start gap-4 p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 transition-all duration-300 text-left ${
                  checkedItems[item.id]
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/5'
                    : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-blue-500 hover:bg-white'
                }`}
              >
                <div className={`mt-1 shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all ${
                  checkedItems[item.id] 
                    ? 'bg-emerald-500 border-emerald-500 shadow-md scale-105' 
                    : 'border-slate-300 bg-white group-hover:border-blue-500'
                }`}>
                  {checkedItems[item.id] && <Check size={14} className="md:size-16 text-white stroke-[3px]" />}
                </div>
                <div className="space-y-1">
                  <item.icon size={14} className={checkedItems[item.id] ? 'text-emerald-500' : 'text-slate-400'} />
                  <span className={`text-[13px] md:text-sm font-bold leading-tight ${checkedItems[item.id] ? 'opacity-90' : 'group-hover:text-slate-900'}`}>
                    {item.text}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Action */}
          <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-6">
            {!allChecked && (
              <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-5 py-2.5 rounded-xl animate-pulse">
                <AlertCircle size={18} />
                <span className="text-[11px] font-black uppercase tracking-wider">Barcha punktlarni belgilash shart</span>
              </div>
            )}
            
            <button
              onClick={handleConfirm}
              disabled={!allChecked || loading}
              className={`w-full py-5 rounded-2xl md:rounded-[2rem] font-black uppercase text-[12px] md:text-sm tracking-widest transition-all duration-500 relative overflow-hidden group ${
                allChecked && !loading
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:scale-[1.01] active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? "Saqlanmoqda..." : "Tasdiqlash va davom etish"}
                {!loading && <Check size={18} className={allChecked ? 'animate-bounce' : ''} />}
              </span>
              {allChecked && !loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
