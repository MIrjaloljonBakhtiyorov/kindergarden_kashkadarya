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
  Scale,
  ShoppingBag,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import apiClient from '../../api/apiClient';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Pie
} from 'recharts';
import { useNotification } from '../../context/NotificationContext';

type FinanceTab = 'EXPENSES' | 'WEEKLY_NEEDS' | 'COST_PER_CHILD';

const FinanceView: React.FC = () => {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<FinanceTab>('EXPENSES');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [requiredProducts, setRequiredProducts] = useState<any[]>([]);
  const [childrenCount, setChildrenCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchRequiredProducts();
    fetchChildrenCount();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/finance/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequiredProducts = async () => {
    try {
      const res = await apiClient.get('/supply/required-products');
      setRequiredProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChildrenCount = async () => {
    try {
      const res = await apiClient.get('/children');
      setChildrenCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTotal = transactions.filter(t => t.date === today).reduce((sum, t) => sum + t.amount, 0);
    const monthTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
    const weeklyNeedsTotal = requiredProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    // Formula: Haftalik ehtiyoj / jami bolalar / 5 kun (bir kunlik sarf uchun)
    const perChildDaily = childrenCount > 0 ? (weeklyNeedsTotal / childrenCount / 5) : 0;

    return {
      today: todayTotal,
      month: monthTotal,
      perChild: perChildDaily,
      weeklyNeeds: weeklyNeedsTotal
    };
  }, [transactions, requiredProducts, childrenCount]);

  const tabs = [
    { id: 'EXPENSES', label: 'Xarajatlar', icon: Coins },
    { id: 'WEEKLY_NEEDS', label: 'Haftalik Ehtiyojlar', icon: ShoppingBag },
    { id: 'COST_PER_CHILD', label: 'Bir bola uchun sarf', icon: Users },
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      {/* Header with KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Bugungi Xarajat', value: stats.today.toLocaleString(), trend: '+5%', sub: 'so‘m', icon: ArrowUpRight, color: '#4F46E5' },
          { label: 'Haftalik Ehtiyoj', value: stats.weeklyNeeds.toLocaleString(), trend: 'Yangi', sub: 'so‘m', icon: Layers, color: '#3B82F6' },
          { label: 'Bir bola / kun', value: Math.round(stats.perChild).toLocaleString(), trend: `${childrenCount} ta bola`, sub: 'so‘m', icon: Users, color: '#10B981' },
          { label: 'Oylik Jami', value: stats.month.toLocaleString(), trend: '-2%', sub: 'so‘m', icon: Coins, color: '#8B5CF6' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center`} style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
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
          {activeTab === 'WEEKLY_NEEDS' && <WeeklyNeedsSection products={requiredProducts} />}
          {activeTab === 'COST_PER_CHILD' && <CostPerChildSection stats={stats} childrenCount={childrenCount} products={requiredProducts} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- View Sections ---

const WeeklyNeedsSection = ({ products }: { products: any[] }) => {
  const totalSum = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  return (
    <div className="space-y-8">
      <div className="bg-white p-10 rounded-[2.5rem] border border-brand-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-[1.5rem] flex items-center justify-center">
             <Layers size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-brand-depth tracking-tight">Haftalik Ehtiyojlar Ro'yxati</h3>
            <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1">Buxgalteriya uchun tasdiqlanishi kerak bo'lgan xarajatlar</p>
          </div>
        </div>
        <div className="bg-brand-depth text-white px-8 py-4 rounded-2xl text-right">
           <p className="text-[10px] font-black uppercase opacity-60">Jami hisoblangan qiymat</p>
           <p className="text-2xl font-black">{totalSum.toLocaleString()} <span className="text-sm font-bold opacity-60">so'm</span></p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-brand-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-brand-border text-[10px] font-black uppercase text-brand-muted tracking-widest">
                <th className="px-10 py-6">№</th>
                <th className="px-10 py-6">Mahsulot</th>
                <th className="px-10 py-6">Brend</th>
                <th className="px-10 py-6 text-center">Miqdor</th>
                <th className="px-10 py-6 text-right">Narxi</th>
                <th className="px-10 py-6 text-right">Qiymati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-brand-muted font-bold">Ehtiyojlar topilmadi</td></tr>
              ) : (
                products.map((p, i) => (
                  <tr key={i} className="hover:bg-brand-primary/[0.01] transition-colors">
                    <td className="px-10 py-6 font-bold text-brand-muted text-xs">{i + 1}</td>
                    <td className="px-10 py-6 font-black text-brand-depth">{p.name}</td>
                    <td className="px-10 py-6 text-xs font-bold text-brand-muted uppercase">{p.brand || '--'}</td>
                    <td className="px-10 py-6 text-center">
                       <span className="px-3 py-1 bg-slate-100 rounded-lg font-black text-brand-depth text-xs">{p.quantity} {p.unit}</span>
                    </td>
                    <td className="px-10 py-6 text-right font-bold text-brand-slate">{p.price?.toLocaleString()}</td>
                    <td className="px-10 py-6 text-right font-black text-brand-primary">{(p.price * p.quantity).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
            {products.length > 0 && (
              <tfoot className="bg-slate-50/50">
                 <tr>
                    <td colSpan={5} className="px-10 py-6 text-right font-black uppercase text-xs text-brand-muted">Jami:</td>
                    <td className="px-10 py-6 text-right font-black text-xl text-brand-depth">{totalSum.toLocaleString()} so'm</td>
                 </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

const ExpensesSection = ({ transactions }: { transactions: any[] }) => {
  return (
    <div className="space-y-8">
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
                <th className="px-8 py-5 Narx">Narx</th>
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

const CostPerChildSection = ({ stats, childrenCount, products }: { stats: any, childrenCount: number, products: any[] }) => {
  const chartData = [
    { day: 'Du', cost: stats.perChild * 0.9 },
    { day: 'Se', cost: stats.perChild * 1.1 },
    { day: 'Ch', cost: stats.perChild * 1.0 },
    { day: 'Pa', cost: stats.perChild * 1.2 },
    { day: 'Ju', cost: stats.perChild * 0.8 },
  ];

  const topExpenses = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      .slice(0, 5);
  }, [products]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-xl font-black text-brand-depth">Bir bola uchun kunlik sarf</h3>
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mt-1">Formula: Haftalik ehtiyoj / {childrenCount} ta bola / 5 kun</p>
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
                  <p className="text-2xl font-black text-brand-depth italic">{stats.weeklyNeeds.toLocaleString()} <span className="text-[10px] text-brand-muted uppercase">so'm</span></p>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6">
               <div className="w-14 h-14 bg-violet-50 text-violet-500 rounded-2xl flex items-center justify-center">
                  <PieChart size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Oylik prognoz</p>
                  <p className="text-2xl font-black text-brand-depth italic">{(stats.weeklyNeeds * 4).toLocaleString()} <span className="text-[10px] text-brand-muted uppercase">so'm</span></p>
               </div>
            </div>
         </div>
      </div>

      <div className="space-y-8">
         <div className="bg-brand-depth p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h4 className="text-xl font-black mb-6 flex items-center gap-3">
               <Scale size={20} className="text-brand-primary" />
               Eng ko'p xarajatlar
            </h4>
            <div className="space-y-4">
               {topExpenses.length === 0 ? (
                 <p className="text-white/40 text-xs font-bold">Ma'lumot yo'q</p>
               ) : (
                 topExpenses.map((p, idx) => (
                   <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10 flex justify-between items-center group/item hover:bg-white/10 transition-all">
                      <div>
                        <p className="text-xs font-black uppercase text-brand-primary tracking-widest mb-1">{p.name}</p>
                        <p className="text-[10px] font-medium text-white/50">{p.quantity} {p.unit} • {p.brand || 'Brendsiz'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-white italic">{(p.price * p.quantity).toLocaleString()}</p>
                        <ArrowRight size={12} className="ml-auto text-white/20 group-hover/item:text-brand-primary transition-colors" />
                      </div>
                   </div>
                 ))
               )}
            </div>
            <button className="w-full mt-8 py-4 bg-brand-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all">
               Batafsil tahlil
            </button>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-brand-border">
            <h4 className="font-black text-brand-depth uppercase text-xs tracking-widest mb-6">Xarajat tarkibi (%)</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topExpenses.map(p => ({ name: p.name, value: p.price * p.quantity }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {topExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#4F46E5', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
               {topExpenses.map((p, idx) => (
                 <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'][idx % 5] }}></div>
                    <span className="text-[10px] font-bold text-brand-muted truncate">{p.name}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default FinanceView;
