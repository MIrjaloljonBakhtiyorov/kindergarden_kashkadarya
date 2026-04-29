import React, { useState, useEffect, useMemo } from 'react';
import { 
  Coins, 
  TrendingUp, 
  Users, 
  BarChart3, 
  PieChart, 
  Download, 
  Calendar, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Search,
  CheckCircle2, 
  FileText,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell,
  Pie
} from 'recharts';
import { useNotification } from '../../context/NotificationContext';

const API_BASE = 'http://localhost:3001/api';

type FinanceTab = 'EXPENSES' | 'COST_PER_CHILD' | 'PURCHASE_VS_USAGE' | 'REPORTS';

const FinanceView: React.FC = () => {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<FinanceTab>('EXPENSES');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/finance/transactions`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTotal = transactions.filter(t => t.date === today).reduce((sum, t) => sum + t.amount, 0);
    const monthTotal = transactions.reduce((sum, t) => sum + t.amount, 0); // Simplified
    return {
      today: todayTotal,
      month: monthTotal,
      perChild: 18500 // Fallback
    };
  }, [transactions]);

  const tabs = [
    { id: 'EXPENSES', label: 'Xarajatlar', icon: Coins },
    { id: 'COST_PER_CHILD', label: 'Bir bola uchun sarf', icon: Users },
    { id: 'PURCHASE_VS_USAGE', label: 'Xarid vs Iste’mol', icon: Scale },
    { id: 'REPORTS', label: 'Hisobotlar', icon: FileText },
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      {/* Header with KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Bugungi Xarajat', value: stats.today.toLocaleString(), trend: '+5%', sub: 'so‘m', icon: ArrowUpRight, color: 'brand-primary' },
          { label: 'Oylik Xarajat', value: stats.month.toLocaleString(), trend: '-2%', sub: 'so‘m', icon: ArrowDownRight, color: 'blue-500' },
          { label: 'O‘rtacha sarf / bola', value: '18,500', trend: 'Stabil', sub: 'so‘m', icon: Users, color: 'emerald-500' },
          { label: 'Eng qimmat mahsulot', value: 'Go‘sht', trend: 'Mol', sub: '65,000 / kg', icon: BarChart3, color: 'violet-500' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-${kpi.color}/10 flex items-center justify-center text-${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                kpi.trend.includes('+') ? 'bg-rose-50 text-rose-500' : 
                kpi.trend.includes('-') ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-brand-muted'
              }`}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">{kpi.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-brand-depth leading-none">{kpi.value}</span>
              <span className="text-[10px] font-bold text-brand-muted uppercase">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-[1.5rem] border border-brand-border shadow-sm flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as FinanceTab)}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${
              activeTab === tab.id 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-brand-muted hover:bg-slate-50 hover:text-brand-depth'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'EXPENSES' && <ExpensesSection transactions={transactions} />}
          {activeTab === 'COST_PER_CHILD' && <CostPerChildSection />}
          {activeTab === 'PURCHASE_VS_USAGE' && <PurchaseVsUsageSection />}
          {activeTab === 'REPORTS' && <ReportsSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- View Sections ---

const ExpensesSection = ({ transactions }: { transactions: any[] }) => {
  const data = useMemo(() => {
    return transactions.slice(0, 5).map(t => ({ name: t.date.slice(5), food: t.amount, nonFood: 0 }));
  }, [transactions]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-sm">
        <div className="flex justify-between items-center mb-8">
           <div>
             <h3 className="text-xl font-black text-brand-depth">Xarajatlar dinamikasi</h3>
             <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Oxirgi 30 kundagi tahlil</p>
           </div>
           <div className="flex gap-3">
              <button className="px-4 py-2 bg-slate-50 border border-brand-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">7 kun</button>
              <button className="px-4 py-2 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20">30 kun</button>
           </div>
        </div>
        <div className="h-[300px] w-full">
          {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700, fontSize: '12px' }}
                cursor={{ stroke: '#4F46E5', strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="food" stroke="#4F46E5" fillOpacity={1} fill="url(#colorFood)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-brand-muted font-bold">Ma'lumot mavjud emas</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-brand-border overflow-hidden shadow-sm">
        <div className="p-8 border-b border-brand-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center">
                 <Coins size={20} />
              </div>
              <div>
                 <h3 className="text-xl font-black text-brand-depth">Xarajatlar jadvali</h3>
                 <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Barcha tranzaksiyalar filteri</p>
              </div>
           </div>
           <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input type="text" placeholder="Mahsulot..." className="bg-slate-50 border border-brand-border rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold outline-none" />
              </div>
              <button className="p-2.5 bg-slate-50 border border-brand-border rounded-xl text-brand-muted hover:text-brand-primary transition-colors">
                <Filter size={18} />
              </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-brand-border text-[10px] font-black uppercase text-brand-muted tracking-widest">
                <th className="px-8 py-5">Sana</th>
                <th className="px-8 py-5">Kategoriya</th>
                <th className="px-8 py-5">Mahsulot</th>
                <th className="px-8 py-5">Miqdor</th>
                <th className="px-8 py-5">Narx (so'm)</th>
                <th className="px-8 py-5 text-right">Jami Summa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-brand-muted font-bold">Tranzaksiyalar topilmadi</td></tr>
              )}
              {transactions.map((row, idx) => (
                <tr key={idx} className="hover:bg-brand-primary/[0.02] transition-colors group">
                  <td className="px-8 py-6 text-xs font-bold text-brand-slate uppercase tracking-tighter">{row.date}</td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      row.category === 'Oziq-ovqat' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-brand-muted'
                    }`}>{row.category}</span>
                  </td>
                  <td className="px-8 py-6 font-bold text-brand-depth text-sm">{row.item}</td>
                  <td className="px-8 py-6 font-bold text-brand-depth text-sm italic">{row.quantity}</td>
                  <td className="px-8 py-6 font-mono text-xs font-black text-brand-slate">{row.price_per_unit}</td>
                  <td className="px-8 py-6 text-right font-black text-brand-primary text-sm">{row.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CostPerChildSection = () => {
  const chartData = [
    { day: 'Du', cost: 16500 },
    { day: 'Se', cost: 19200 },
    { day: 'Ch', cost: 17800 },
    { day: 'Pa', cost: 21500 },
    { day: 'Ju', cost: 18500 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-xl font-black text-brand-depth">Bir bola uchun kunlik sarf</h3>
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mt-1">Formula: Jami xarajat / Davomat soni</p>
               </div>
               <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={24} />
               </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800, fill: '#94A3B8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} />
                  <Tooltip 
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                  />
                  <Bar dataKey="cost" fill="#10B981" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6">
               <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Calendar size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Haftalik o'rtacha</p>
                  <p className="text-2xl font-black text-brand-depth italic">118,500 <span className="text-[10px] text-brand-muted uppercase">so'm</span></p>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6">
               <div className="w-14 h-14 bg-violet-50 text-violet-500 rounded-2xl flex items-center justify-center">
                  <PieChart size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Oylik prognoz</p>
                  <p className="text-2xl font-black text-brand-depth italic">485,000 <span className="text-[10px] text-brand-muted uppercase">so'm</span></p>
               </div>
            </div>
         </div>
      </div>

      <div className="space-y-8">
         <div className="bg-brand-depth p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h4 className="text-xl font-black mb-6 flex items-center gap-3">
               <AlertTriangle size={20} className="text-amber-400" />
               Diqqat talab joylar
            </h4>
            <div className="space-y-6">
               {[
                 { title: 'Normaldan og\'ish', desc: 'Pa-Ch kunlari mol go\'shti sabab sarf +20% ga oshdi.', severity: 'medium' },
                 { title: 'Davomat effekti', desc: 'Davomat past kunlari bir bola uchun xarajat 15% ga oshmoqda.', severity: 'high' }
               ].map((alert, idx) => (
                 <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10">
                    <p className="text-xs font-black uppercase text-amber-400 tracking-widest mb-1">{alert.title}</p>
                    <p className="text-xs font-medium text-white/70 leading-relaxed">{alert.desc}</p>
                 </div>
               ))}
            </div>
            <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 transition-all rounded-xl font-bold text-[10px] uppercase tracking-widest border border-white/10">
               Audit so'rash
            </button>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-brand-border">
            <h4 className="font-black text-brand-depth uppercase text-xs tracking-widest mb-6">Sarf tarkibi</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Oqsil', value: 45 },
                      { name: 'Uglevod', value: 30 },
                      { name: 'Vitaminlar', value: 25 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#4F46E5', '#10B981', '#F59E0B'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
               {['Go\'sht', 'Guruch', 'Sabzavot'].map((label, idx) => (
                 <div key={idx} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${['bg-brand-primary', 'bg-emerald-500', 'bg-amber-500'][idx]}`}></div>
                    <span className="text-[10px] font-bold text-brand-muted">{label}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const PurchaseVsUsageSection = () => (
  <div className="space-y-8">
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-brand-border h-[400px]">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-brand-depth italic">Kirim vs Sarf</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brand-primary rounded-full"></div>
                    <span className="text-[10px] font-black uppercase text-brand-muted">Xarid</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase text-brand-muted">Iste'mol</span>
                 </div>
              </div>
           </div>
           <ResponsiveContainer width="100%" height="90%">
              <BarChart data={[
                { name: 'Guruch', buy: 1500, use: 1420 },
                { name: 'Go\'sht', buy: 450, use: 445 },
                { name: 'Sut', buy: 1200, use: 1180 },
                { name: 'Yog\'', buy: 200, use: 195 },
                { name: 'Tuxum', buy: 1500, use: 1550 },
              ]}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                <Tooltip />
                <Bar dataKey="buy" fill="#4F46E5" radius={[5, 5, 0, 0]} />
                <Bar dataKey="use" fill="#F43F5E" radius={[5, 5, 0, 0]} />
              </BarChart>
           </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
           {[
             { title: 'Overuse Alert', value: '7%', desc: 'Tuxum iste\'molida kutilmagan oshib ketish', icon: ArrowUpRight, color: 'rose-500' },
             { title: 'Loss/Wastage', value: '1.2%', desc: 'Mevalar bo\'yicha minimal qisqarish', icon: AlertTriangle, color: 'amber-500' },
             { title: 'Efficiency Rate', value: '98.5%', desc: 'Tizim xarid va sarf mutanosibligi', icon: CheckCircle2, color: 'emerald-500' },
             { title: 'Inventory Diff', value: '0.4%', desc: 'Ombor va buxgalteriya saldosi', icon: Coins, color: 'blue-500' },
           ].map((stat, idx) => (
             <div key={idx} className="bg-white p-8 rounded-[2rem] border border-brand-border flex flex-col justify-between hover:shadow-lg transition-all">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}/10 flex items-center justify-center text-${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1">{stat.title}</h4>
                   <p className="text-3xl font-black text-brand-depth leading-none mb-3 italic">{stat.value}</p>
                   <p className="text-[10px] font-bold text-brand-muted leading-tight">{stat.desc}</p>
                </div>
             </div>
           ))}
        </div>
     </div>
  </div>
);

const ReportsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
     {[
       { type: 'KUNLIK', title: 'Operatsion hisobot', date: 'Bugun, 18.04', desc: 'Kunlik ovqatlanish vedomosti va kassa chiqimi', formats: ['PDF'] },
       { type: 'HAFTALIK', title: 'Xarid va sarf tahlili', date: 'Bu hafta', desc: 'Ombor va ta\'minot zanjiri bo\'yicha qisqacha hisobot', formats: ['PDF', 'XLSX'] },
       { type: 'OYLIK', title: 'Moliyaviy yakun', date: 'Mart oyi', desc: 'Barcha xarajatlar va bir bola uchun yakuniy sarf audit hisoboti', formats: ['PDF', 'XLSX', 'CSV'] },
     ].map((report, idx) => (
       <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-brand-border shadow-sm group hover:border-brand-primary transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
             <div className="px-4 py-2 bg-slate-50 border border-brand-border rounded-xl text-[10px] font-black text-brand-muted uppercase tracking-widest">
                {report.type}
             </div>
             <div className="w-12 h-12 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                <FileText size={24} />
             </div>
          </div>
          <h4 className="text-xl font-black text-brand-depth mb-2">{report.title}</h4>
          <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest mb-6">{report.date} holatiga</p>
          <p className="text-brand-slate text-xs font-medium leading-relaxed mb-10 min-h-[40px]">{report.desc}</p>
          
          <div className="flex flex-wrap gap-2 mb-8">
             {report.formats.map(fmt => (
               <span key={fmt} className="px-3 py-1 bg-slate-50 border border-brand-border rounded-lg text-[10px] font-black text-slate-500">{fmt}</span>
             ))}
          </div>

          <button className="w-full py-4 bg-brand-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
             <Download size={14} /> Hisobotni yuklash
          </button>
       </div>
     ))}
  </div>
);

export default FinanceView;
