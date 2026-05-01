import React, { useState } from 'react';
import { ShieldCheck, Check, AlertCircle, Sparkles, User, Thermometer, Droplets, Wind } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';

const SANITARY_ITEMS = [
  { id: 1, text: 'Oshxona umumiy tozalangan va dezinfeksiya qilinganmi?', icon: Sparkles },
  { id: 2, text: 'Barcha jihozlar va idishlar tozaligi talabga javob beradimi?', icon: ShieldCheck },
  { id: 3, text: 'Oshpaz maxsus kiyimda (qalpoq, fartuk, qo\'lqop) va gigiyena qoidalariga mosmi?', icon: User },
  { id: 4, text: 'Mahsulotlar sifatli va yaroqlilik muddati tekshirilganmi?', icon: Check },
  { id: 5, text: 'Muzlatkichlar harorati me\'yordami (+4°C gacha)?', icon: Thermometer },
  { id: 6, text: 'Oshxonada ventilyatsiya tizimi to‘g‘ri ishlayaptimi?', icon: Wind },
  { id: 7, text: 'Qo\'l yuvish vositalari va antiseptiklar mavjudmi?', icon: Droplets },
  { id: 8, text: 'Oshpazning shaxsiy gigiyenasi (tirnoqlar, jarohatlar yo\'qligi) tekshirildimi?', icon: User },
  { id: 9, text: 'Pichoqlar va kesish taxtalari markirovka bo\'yicha alohidami?', icon: ShieldCheck },
  { id: 10, text: 'Sut va go\'sht mahsulotlari alohida muzlatkichlarda saqlanyaptimi?', icon: Check },
  { id: 11, text: 'Chiqindi idishlari yopiq holatda va vaqtida bo\'shatilyaptimi?', icon: Sparkles },
  { id: 12, text: 'Idish yuvish mashinasi yoki qo\'lda yuvish harorati me\'yordami?', icon: Thermometer },
  { id: 13, text: 'Oshxonada begona buyumlar va shaxsiy buyumlar yo\'qligi tekshirildimi?', icon: AlertCircle },
  { id: 14, text: 'Zararkunandalarga qarshi to\'siqlar butunligi tekshirildimi?', icon: ShieldCheck },
  { id: 15, text: 'Tayyor taomlar va xom mahsulotlar kesishishi yo\'qligi ta\'minlanganmi?', icon: Wind },
  { id: 16, text: 'Tozalash inventarlari markirovka qilingan va alohida saqlanyaptimi?', icon: Droplets }
];

interface Props {
  onComplete: () => void;
}

export const ChefSanitaryCheck: React.FC<Props> = ({ onComplete }) => {
  const { user } = useAuth();
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
    if (allChecked && user) {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        await apiClient.post('/chef/sanitary-check', {
          chef_id: user.id,
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
      <div className="flex flex-col h-[80vh] md:h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-200 animate-bounce">
            <Check size={40} className="text-white" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Muvaffaqiyatli!</h2>
            <p className="text-base font-medium text-slate-500">
              Sanitariya tekshiruvi yakunlandi. Taomnoma ochilmoqda...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh] md:h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
      {/* Header */}
      <div className="p-6 md:p-8 bg-slate-900 text-white shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight italic uppercase">Sanitariya nazorati</h1>
            <p className="text-blue-400 font-bold uppercase text-[9px] tracking-widest flex items-center gap-2 mt-1">
              <Sparkles size={10} className="animate-pulse" />
              Har bir bandni bajarganingizdan keyin saqlang
            </p>
            <p className="text-slate-400 font-medium text-[10px] mt-2 leading-tight">
              Farzandlarimiz kelajak mevasidir, shu sababli sanitariya qoidalariga qat'iy rioya qiling.
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar bg-slate-50/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SANITARY_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                checkedItems[item.id]
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                  : 'border-white bg-white text-slate-500 hover:border-blue-200 shadow-sm'
              }`}
            >
              <div className={`mt-1 shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                checkedItems[item.id] 
                  ? 'bg-emerald-500 border-emerald-500 shadow-sm' 
                  : 'border-slate-200 bg-white group-hover:border-blue-400'
              }`}>
                {checkedItems[item.id] && <Check size={12} className="text-white stroke-[3px]" />}
              </div>
              <div className="space-y-1">
                <item.icon size={12} className={checkedItems[item.id] ? 'text-emerald-500' : 'text-slate-400'} />
                <span className={`text-[12px] font-bold leading-tight ${checkedItems[item.id] ? 'opacity-90' : 'group-hover:text-slate-900'}`}>
                  {item.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 md:p-8 border-t border-slate-100 bg-white shrink-0">
        <div className="flex flex-col items-center gap-4">
          {!allChecked && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
              <AlertCircle size={16} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Qolgan punktlar: {SANITARY_ITEMS.length - Object.keys(checkedItems).filter(k => checkedItems[Number(k)]).length} ta
              </span>
            </div>
          )}
          
          <button
            onClick={handleConfirm}
            disabled={!allChecked || loading}
            className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 relative overflow-hidden group ${
              allChecked && !loading
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? "Saqlanmoqda..." : "Tasdiqlash va ishga tushirish"}
              {!loading && allChecked && <Check size={16} className="animate-bounce" />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
