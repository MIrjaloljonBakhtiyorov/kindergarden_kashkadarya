import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  TrendingDown, 
  FlaskConical,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { OperationsLog } from '../../features/operations/components/OperationsLog';

const API_BASE = 'http://localhost:3001/api';

const KPICard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={20} />
      </div>
      <div className={`flex items-center gap-1 font-bold text-xs ${trend === 'up' ? 'text-brand-emerald' : 'text-rose-500'}`}>
        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change}%
      </div>
    </div>
    <p className="text-brand-muted text-[11px] font-bold uppercase tracking-wider mb-1">{title}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-brand-depth font-sans font-bold text-2xl">{value}</h3>
    </div>
  </div>
);

const DirectorView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [samples, setSamples] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, samplesRes] = await Promise.all([
          axios.get(`${API_BASE}/attendance/today-stats`),
          axios.get(`${API_BASE}/lab/samples`)
        ]);
        setStats(statsRes.data);
        setSamples(samplesRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const approveRecipes = async () => {
    try {
      await axios.post(`${API_BASE}/menus/approve-today`);
      // Re-fetch stats to update UI
      const statsRes = await axios.get(`${API_BASE}/attendance/today-stats`);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Jami bolalar soni" value={stats?.total || 0} change="2" trend="up" icon={Users} color="bg-brand-primary" />
        <KPICard title="9 gacha kelganlar" value={(stats?.present || 0) - (stats?.late || 0)} change="5" trend="up" icon={ClipboardCheck} color="bg-brand-emerald" />
        <KPICard title="9 dan keyin kelganlar" value={stats?.late || 0} change="0" trend="down" icon={ClipboardCheck} color="bg-brand-amber" />
        <KPICard title="Bugungi davomat (%)" value={`${stats?.total ? Math.round((stats.present / stats.total) * 100) : 0}%`} change="1" trend="up" icon={TrendingUp} color="bg-brand-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <OperationsLog />
        </div>

        <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-brand-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-sans font-bold text-base">Laboratoriya & Sinama</h4>
            <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">Nazoratda</span>
          </div>
          <div className="space-y-4">
            {stats?.approved_recipes > 0 ? (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-600 uppercase">Ovqat retsepti</p>
                  <p className="text-sm font-bold text-brand-depth">Admin tomonidan tasdiqlandi</p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-amber-600 uppercase">Ovqat retsepti</p>
                    <p className="text-sm font-bold text-brand-depth">Tasdiqlanmagan</p>
                  </div>
                </div>
                <button 
                  onClick={approveRecipes}
                  className="px-3 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase rounded-lg hover:bg-brand-primary-dark transition-colors"
                >
                  Tasdiqlash
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] text-brand-muted uppercase font-bold tracking-wider">
                    <th className="pb-3 border-b border-brand-border">Sinama nomi</th>
                    <th className="pb-3 border-b border-brand-border text-right">Holati</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {samples.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-10 text-center text-brand-muted text-xs font-bold uppercase tracking-widest">
                        Ma'lumot topilmadi
                      </td>
                    </tr>
                  ) : (
                    samples.map((s, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3">
                          <p className="font-bold text-brand-depth">{s.dish_name}</p>
                          <p className="text-[9px] text-brand-muted">{s.date}</p>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${s.status === 'COLLECTED' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{s.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-slate-100 mt-4">
               <div className="p-2 bg-white rounded-lg border border-brand-border text-brand-emerald shadow-sm">
                 <FlaskConical size={18} />
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-center mb-1">
                   <p className="text-xs font-bold text-brand-depth">Bugun kunlik sinama</p>
                   <span className="text-[10px] font-black text-brand-emerald">100%</span>
                 </div>
                 <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-emerald h-full w-[100%] transition-all duration-1000"></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorView;
