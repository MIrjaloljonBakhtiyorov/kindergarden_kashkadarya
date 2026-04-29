import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  FileText,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InspectorCalendarProps {
  audits: any[];
  onDateSelect: (date: string) => void;
}

export const InspectorCalendar: React.FC<InspectorCalendarProps> = ({ audits, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktyabr", "Noyabr", "Dekabr"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const getAuditsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return audits.filter(a => a.created_at?.startsWith(dateStr));
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
      <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">{monthNames[month]} {year}</h3>
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Auditlar Taqvimi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-7 gap-4 mb-6">
          {['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />;
            
            const dateAudits = getAuditsForDate(day);
            const hasPass = dateAudits.some(a => a.overall_result === 'PASS');
            const hasFail = dateAudits.some(a => a.overall_result !== 'PASS');

            return (
              <motion.button
                key={day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDateSelect(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all relative ${
                  dateAudits.length > 0 
                    ? 'border-blue-100 bg-blue-50/30' 
                    : 'border-slate-50 hover:border-slate-100'
                }`}
              >
                <span className={`text-lg font-black ${dateAudits.length > 0 ? 'text-blue-600' : 'text-slate-400'}`}>{day}</span>
                <div className="flex gap-0.5">
                  {hasPass && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                  {hasFail && <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                </div>
                {dateAudits.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
                    {dateAudits.length}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Muvaffaqiyatli</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kamchiliklar bilan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audit o'tkazilgan</span>
        </div>
      </div>
    </div>
  );
};
