import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardCheck, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  FlaskConical 
} from 'lucide-react';
import axios from 'axios';

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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [samples, setSamples] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, transRes, samplesRes] = await Promise.all([
          axios.get(`${API_BASE}/attendance/today-stats`),
          axios.get(`${API_BASE}/finance/transactions`),
          axios.get(`${API_BASE}/lab/samples`)
        ]);
        setStats(statsRes.data);
        setTransactions(transRes.data.slice(0, 5));
        setSamples(samplesRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Jami bolalar" value={stats?.total || 0} change="2" trend="up" icon={Users} color="bg-brand-primary" />
        <KPICard title="Bugungi davomat" value={`${stats?.total ? Math.round((stats.present / stats.total) * 100) : 0}%`} change="5" trend="up" icon={ClipboardCheck} color="bg-brand-emerald" />
        <KPICard title="Ombor qoldig'i" value="12.5 mln" change="3" trend="down" icon={Package} color="bg-brand-amber" />
        <KPICard title="To'lov darajasi" value="92%" change="1" trend="up" icon={TrendingUp} color="bg-brand-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-brand-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-sans font-bold text-base">So‘nggi Tranzaksiyalar</h4>
            <button className="text-brand-primary font-bold text-xs flex items-center gap-1 hover:underline">Barchasi <ArrowRight size={14} /></button>
          </div>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="py-10 text-center text-brand-muted text-xs font-bold uppercase tracking-widest">
                Hozircha tranzaksiyalar mavjud emas
              </div>
            ) : (
              transactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-bold text-brand-depth">{t.item}</p>
                    <p className="text-[10px] text-brand-muted uppercase font-black">{t.date}</p>
                  </div>
                  <p className="text-sm font-black text-brand-primary">{t.amount.toLocaleString()} so'm</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-brand-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-sans font-bold text-base">Laboratoriya & Sinama</h4>
            <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">Nazoratda</span>
          </div>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[300px]">
                <thead>
                  <tr className="text-[11px] text-brand-muted uppercase font-bold tracking-wider">
                    <th className="pb-3 border-b border-brand-border">Taom nomi</th>
                    <th className="pb-3 border-b border-brand-border">Sana</th>
                    <th className="pb-3 border-b border-brand-border text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {samples.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-10 text-center text-brand-muted text-xs font-bold uppercase tracking-widest">
                        Hozircha ma'lumot mavjud emas
                      </td>
                    </tr>
                  ) : (
                    samples.map((s, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 font-bold text-brand-depth">{s.dish_name}</td>
                        <td className="py-3 text-xs text-brand-muted">{s.date}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${s.status === 'COLLECTED' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{s.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3">
               <div className="p-2 bg-white rounded-lg border border-brand-border text-brand-emerald shadow-sm">
                 <FlaskConical size={18} />
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-center mb-1">
                   <p className="text-xs font-bold text-brand-depth">Bugun kunlik sinama olingan</p>
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
