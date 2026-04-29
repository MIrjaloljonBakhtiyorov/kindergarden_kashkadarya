import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  TrendingDown, 
  FlaskConical,
  AlertCircle
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { OperationsLog } from '../../features/operations/components/OperationsLog';

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
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [statsRes, samplesRes, menuRes] = await Promise.all([
          apiClient.get('/attendance/today-stats'),
          apiClient.get('/lab/samples'),
          apiClient.get(`/menu/${today}`)
        ]);
        setStats(statsRes.data);
        setSamples(samplesRes.data.slice(0, 5));
        setMenu(menuRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleApproveMenu = async () => {
    try {
      await apiClient.post('/menus/approve-today');
      // Refresh stats
      const statsRes = await apiClient.get('/attendance/today-stats');
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

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-brand-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-sans font-bold text-base">Bugungi Menu</h4>
              <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">Admin tomonidan</span>
            </div>
            <div className="space-y-3">
              {menu.length === 0 ? (
                <div className="py-6 text-center text-brand-muted text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-xl">
                  Bugun uchun menu kiritilmagan
                </div>
              ) : (
                menu.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary font-bold text-[10px] border border-brand-border">
                        {item.meal_type === 'NONUSHTA' ? 'NO' : item.meal_type === 'TUSHLIK' ? 'TU' : 'KE'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-depth">{item.meal_name}</p>
                        <p className="text-[9px] text-brand-muted uppercase font-bold tracking-tight">{item.calories} kkal • {item.meal_type}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-brand-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-sans font-bold text-base">Laboratoriya & Sinama</h4>
              <span className="px-2 py-1 bg-brand-emerald/10 text-brand-emerald text-[10px] font-bold rounded-full uppercase tracking-tighter">Analizlar</span>
            </div>
            <div className="space-y-4">
              {stats?.approved_recipes > 0 ? (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                    <ClipboardCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-600 uppercase">Ovqat retsepti</p>
                    <p className="text-sm font-bold text-brand-depth">Tasdiqlangan</p>
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
                    onClick={handleApproveMenu}
                    className="px-3 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase rounded-lg hover:bg-brand-primary-dark transition-colors shadow-lg shadow-brand-primary/20"
                  >
                    Tasdiqlash
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {samples.length === 0 ? (
                  <div className="py-10 text-center text-brand-muted text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-xl">
                    Analizlar mavjud emas
                  </div>
                ) : (
                  samples.map((s, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-primary/20 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold text-brand-depth">{s.dish_name}</p>
                          <p className="text-[9px] text-brand-muted font-bold">{new Date(s.timestamp).toLocaleString()}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${
                          s.risk_level === 'NORMAL' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          s.risk_level === 'WARNING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-rose-50 text-rose-600 border-rose-100 animate-pulse'
                        }`}>
                          {s.risk_level === 'NORMAL' ? 'Toza' : s.risk_level}
                        </span>
                      </div>
                      
                      {s.test_results && (
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200">
                          <div className="text-center">
                            <p className="text-[7px] font-black text-brand-muted uppercase">pH</p>
                            <p className="text-[10px] font-black text-brand-depth">{s.test_results.ph_level}</p>
                          </div>
                          <div className="text-center border-x border-slate-200">
                            <p className="text-[7px] font-black text-brand-muted uppercase">Bakteriya</p>
                            <p className={`text-[10px] font-black ${s.test_results.bacterial_check === 'PASS' ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {s.test_results.bacterial_check === 'PASS' ? 'OK' : 'XAVF'}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[7px] font-black text-brand-muted uppercase">Organolep.</p>
                            <p className="text-[10px] font-black text-emerald-600">OK</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-slate-100 mt-4">
                 <div className="p-2 bg-white rounded-lg border border-brand-border text-brand-emerald shadow-sm">
                   <FlaskConical size={18} />
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-center mb-1">
                     <p className="text-xs font-bold text-brand-depth">Namuna Olish</p>
                     <span className="text-[10px] font-black text-brand-emerald">
                        {samples.length > 0 && menu.length > 0 ? Math.round((samples.length / menu.length) * 100) : 0}%
                     </span>
                   </div>
                   <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-emerald h-full transition-all duration-1000" 
                        style={{ width: `${samples.length > 0 && menu.length > 0 ? Math.round((samples.length / menu.length) * 100) : 0}%` }}
                      ></div>
                   </div>
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
