import React, { useState, useEffect, useMemo } from 'react';
import { 
  Truck, 
  ShoppingBag, 
  Users2, 
  CalendarDays, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  FileText,
  Plus,
  Search,
  ChevronRight,
  Filter,
  ArrowRight,
  X,
  Save,
  User,
  Smartphone,
  Send,
  Link as LinkIcon,
  Activity,
  DollarSign,
  Layers,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';

const API_BASE = 'http://localhost:3001/api';

type SupplyTab = 'REQUIRED' | 'ORDERS' | 'SUPPLIERS' | 'PLAN';

const SupplyView: React.FC = () => {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<SupplyTab>('REQUIRED');
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [requiredProducts, setRequiredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    quantity: '',
    unit: 'kg',
    brand: '',
    category: 'Oziq-ovqat'
  });

  const [supplierForm, setSupplierForm] = useState({
    first_name: '',
    last_name: '',
    brand: '',
    phone: '',
    contact_user: '',
    telegram_link: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchRequiredProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/supply/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequiredProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/supply/required-products`);
      setRequiredProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/supply/required-products`, {
        ...productForm,
        price: parseFloat(productForm.price),
        quantity: parseFloat(productForm.quantity)
      });
      showNotification("Mahsulot muvaffaqiyatli qo'shildi!", "success");
      setShowProductModal(false);
      fetchRequiredProducts();
      setProductForm({ name: '', price: '', quantity: '', unit: 'kg', brand: '', category: 'Oziq-ovqat' });
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/suppliers`, supplierForm);
      showNotification("Yetkazib beruvchi muvaffaqiyatli qo'shildi!", "success");
      setShowSupplierModal(false);
      fetchSuppliers();
      setSupplierForm({ first_name: '', last_name: '', brand: '', phone: '', contact_user: '', telegram_link: '' });
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const stats = useMemo(() => {
    const totalRequiredSum = requiredProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    return {
      monthlyPurchase: (totalRequiredSum / 1000000).toFixed(1) + ' mln',
      activeOrders: orders.filter(o => o.status !== 'DELIVERED').length,
      requiredCount: requiredProducts.length,
      suppliersCount: suppliers.length
    };
  }, [orders, suppliers, requiredProducts]);

  const tabs = [
    { id: 'REQUIRED', label: 'Kerakli mahsulotlar', icon: ShoppingBag, color: 'brand-primary' },
    { id: 'ORDERS', label: 'Buyurtmalar', icon: FileText, color: 'blue-500' },
    { id: 'SUPPLIERS', label: 'Yetkazib beruvchilar', icon: Users2, color: 'emerald-500' },
    { id: 'PLAN', label: 'Xarid rejasi', icon: CalendarDays, color: 'violet-500' },
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-depth tracking-tight">Ta'minot va Logistika</h2>
          <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Activity size={14} className="text-brand-primary" />
            Tizimli xaridlar va yetkazib beruvchilar monitoringi
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowProductModal(true)}
            className="flex-1 md:flex-none bg-brand-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-95 transition-all justify-center"
          >
            <Plus size={20} /> Mahsulot qo'shish
          </button>
        </div>
      </div>

      {/* KPI Cards section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Rejadagi Xarid', value: stats.monthlyPurchase, sub: 'so‘m', trend: '+12%', icon: TrendingUp, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Aktiv Buyurtmalar', value: stats.activeOrders, sub: 'ta', trend: 'Bekor bo\'lmadi', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Kerakli Mahsulotlar', value: stats.requiredCount, sub: 'ta', trend: 'Bugun', icon: Layers, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'Yetkazib beruvchilar', value: stats.suppliersCount, sub: 'ta hamkor', trend: 'Barchasi faol', icon: Users2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-primary/10 transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.bg} rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">{kpi.label}</p>
                <h3 className={`text-4xl font-black ${kpi.color}`}>{kpi.value}</h3>
                <p className="text-[10px] font-bold text-brand-muted/60 mt-2 uppercase tracking-tight">{kpi.sub}</p>
              </div>
              <kpi.icon size={24} className={kpi.color} />
            </div>
          </div>
        ))}
      </section>

      {/* Internal Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SupplyTab)}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-white text-brand-primary shadow-md' : 'text-brand-muted hover:text-brand-depth'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Rendering */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'REQUIRED' && <RequiredProductsSection products={requiredProducts} onAdd={() => setShowProductModal(true)} />}
            {activeTab === 'ORDERS' && <OrdersSection orders={orders} />}
            {activeTab === 'SUPPLIERS' && <SuppliersSection suppliers={suppliers} onAdd={() => setShowSupplierModal(true)} />}
            {activeTab === 'PLAN' && <PlanSection products={requiredProducts} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/5">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl border border-slate-200"
             >
                <div className="flex justify-between items-center mb-10">
                   <div>
                     <h3 className="text-3xl font-black text-brand-depth tracking-tight">Yangi Mahsulot</h3>
                     <p className="text-xs text-brand-muted font-bold uppercase tracking-widest mt-1">Xarid uchun ehtiyoj yaratish</p>
                   </div>
                   <button onClick={() => setShowProductModal(false)} className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"><X /></button>
                </div>
                <form onSubmit={handleAddProduct} className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Mahsulot Nomi</label>
                     <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="Masalan: Sut 3.2%" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Narxi (so'm)</label>
                       <input type="number" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="0" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Miqdori</label>
                       <input type="number" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="0" value={productForm.quantity} onChange={e => setProductForm({...productForm, quantity: e.target.value})} required />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">O'lchov Birligi</label>
                       <select className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all appearance-none" value={productForm.unit} onChange={e => setProductForm({...productForm, unit: e.target.value})}>
                          <option value="kg">Kilogram (kg)</option>
                          <option value="litr">Litr (l)</option>
                          <option value="dona">Dona (шт)</option>
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Brend / Marka</label>
                       <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="Ixtiyoriy" value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} />
                     </div>
                   </div>

                   <button type="submit" className="w-full py-6 bg-brand-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-4"><Save size={20} /> Ro'yxatga qo'shish</button>
                </form>
             </motion.div>
          </div>
        )}

        {showSupplierModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/5">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl border border-slate-200"
             >
                <div className="flex justify-between items-center mb-10">
                   <div>
                     <h3 className="text-3xl font-black text-brand-depth tracking-tight">Yangi Hamkor</h3>
                     <p className="text-xs text-brand-muted font-bold uppercase tracking-widest mt-1">Yetkazib beruvchi ma'lumotlari</p>
                   </div>
                   <button onClick={() => setShowSupplierModal(false)} className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"><X /></button>
                </div>
                <form onSubmit={handleAddSupplier} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Ismi</label>
                       <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="Ism" value={supplierForm.first_name} onChange={e => setSupplierForm({...supplierForm, first_name: e.target.value})} required />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Familiyasi</label>
                       <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="Familiya" value={supplierForm.last_name} onChange={e => setSupplierForm({...supplierForm, last_name: e.target.value})} />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Brend Nomi</label>
                     <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="Kompaniya yoki Brend" value={supplierForm.brand} onChange={e => setSupplierForm({...supplierForm, brand: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Telefon Raqami</label>
                     <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="+998" value={supplierForm.phone} onChange={e => setSupplierForm({...supplierForm, phone: e.target.value})} required />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Telegram User</label>
                       <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="@username" value={supplierForm.contact_user} onChange={e => setSupplierForm({...supplierForm, contact_user: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Telegram Havola</label>
                       <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="https://t.me/..." value={supplierForm.telegram_link} onChange={e => setSupplierForm({...supplierForm, telegram_link: e.target.value})} />
                     </div>
                   </div>
                   <button type="submit" className="w-full py-6 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-4"><Save size={20} /> Hamkorni Saqlash</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Internal Page Sections ---

const RequiredProductsSection = ({ products, onAdd }: { products: any[], onAdd: () => void }) => (
  <div className="space-y-8">
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-[1.5rem] flex items-center justify-center">
           <Layers size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-brand-depth tracking-tight">Kerakli Mahsulotlar</h3>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1">Ombor va oshxonadan kelib tushgan ehtiyojlar</p>
        </div>
      </div>
      <button onClick={onAdd} className="bg-brand-primary text-white px-10 py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/30 hover:scale-105 transition-all flex items-center gap-3">
        <Plus size={20} /> Yangi Ehtiyoj
      </button>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {products.length === 0 ? (
        <div className="bg-white p-20 text-center text-brand-muted font-bold rounded-[3rem] border-2 border-dashed border-slate-200">
           Hozircha hech qanday mahsulotga ehtiyoj yo'q
        </div>
      ) : (
        products.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-brand-primary transition-all group shadow-sm hover:shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-8 relative z-10">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-50 text-brand-slate border border-slate-100 group-hover:bg-brand-primary group-hover:text-white transition-all`}>
                <ShoppingBag size={28} />
              </div>
              <div>
                <h4 className="font-black text-brand-depth text-xl">{item.name}</h4>
                <div className="flex items-center gap-4 mt-2">
                   <span className="text-[10px] font-black uppercase text-brand-muted tracking-[0.1em]">{item.brand || 'Brendsiz'}</span>
                   <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                   <span className="text-sm font-black text-brand-primary uppercase">{item.quantity} {item.unit}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-12 relative z-10">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-brand-muted tracking-widest mb-1">Taxminiy Narx</p>
                <p className={`text-lg font-black text-brand-depth`}>{item.price?.toLocaleString()} <span className="text-xs text-brand-muted font-bold uppercase">so'm</span></p>
              </div>
              <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                item.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                {item.status === 'PENDING' ? 'Kutilmoqda' : item.status}
              </div>
              <button className="w-12 h-12 bg-slate-50 text-brand-muted rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )
      ))}
    </div>
  </div>
);

const OrdersSection = ({ orders }: { orders: any[] }) => (
  <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/20">
    <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
      <div>
        <h3 className="text-2xl font-black text-brand-depth tracking-tight">Faol Buyurtmalar</h3>
        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Yetkazib berish jarayonidagi shartnomalar</p>
      </div>
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
        <input 
          type="text" 
          placeholder="Buyurtma ID yoki yetkazib beruvchi..."
          className="bg-white border border-slate-200 rounded-[1.25rem] py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-4 ring-brand-primary/10 w-full transition-all"
        />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[900px]">
        <thead>
          <tr className="bg-white border-b border-slate-100 text-[10px] font-black uppercase text-brand-muted tracking-[0.15em]">
            <th className="px-10 py-6">ID & Yetkazuvchi</th>
            <th className="px-10 py-6">Jami Summa</th>
            <th className="px-10 py-6">Sana</th>
            <th className="px-10 py-6">Holati</th>
            <th className="px-10 py-6 text-right">Amallar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.length === 0 ? (
            <tr><td colSpan={5} className="p-20 text-center text-brand-muted font-bold uppercase tracking-widest text-xs">Buyurtmalar topilmadi</td></tr>
          ) : (
            orders.map((order, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex flex-col gap-1">
                    <span className="font-black text-brand-primary text-sm uppercase tracking-tighter">{order.order_id}</span>
                    <span className="text-base font-bold text-brand-depth">{order.vendor}</span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="text-lg font-black text-brand-depth">{order.amount?.toLocaleString()} <span className="text-xs text-brand-muted font-bold uppercase">so'm</span></span>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-2 text-brand-slate font-bold text-sm">
                    <Clock size={14} />
                    {order.date}
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    order.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {order.status === 'SHIPPED' ? 'Yo\'lda' : order.status === 'PENDING' ? 'Kutilmoqda' : 'Yetkazildi'}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <button className="w-12 h-12 bg-white border border-slate-200 text-brand-muted rounded-2xl hover:text-brand-primary hover:border-brand-primary hover:shadow-lg transition-all flex items-center justify-center mx-auto sm:mr-0">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const SuppliersSection = ({ suppliers, onAdd }: { suppliers: any[], onAdd: () => void }) => (
  <div className="space-y-8">
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-[1.5rem] flex items-center justify-center">
           <Users2 size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-brand-depth tracking-tight">Hamkorlar Bazasi</h3>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1">Ishonchli va tasdiqlangan yetkazib beruvchilar</p>
        </div>
      </div>
      <button onClick={onAdd} className="bg-emerald-500 text-white px-10 py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all flex items-center gap-3">
        <Plus size={20} /> Hamkor Qo'shish
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {suppliers.length === 0 ? (
        <div className="col-span-full p-20 text-center text-brand-muted font-bold rounded-[3rem] border-2 border-dashed border-slate-200 uppercase tracking-widest text-sm">
           Hali hamkorlar qo'shilmagan
        </div>
      ) : (
        suppliers.map((vendor, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-primary border border-slate-100 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner">
                <Users2 size={30} />
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[11px] font-black shadow-inner border border-emerald-100">
                <Activity size={12} /> {vendor.score || 5.0}
              </div>
            </div>
            <h4 className="text-2xl font-black text-brand-depth mb-2 relative z-10">{vendor.name}</h4>
            <p className="text-brand-muted text-[11px] font-black uppercase tracking-[0.15em] mb-8 relative z-10">{vendor.brand || 'Brendsiz'}</p>
            
            <div className="space-y-4 pt-8 border-t border-slate-50 relative z-10">
               <div className="flex items-center gap-4 text-sm font-bold text-brand-depth bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Smartphone size={16} className="text-brand-muted" /> {vendor.phone}
               </div>
               <div className="flex items-center gap-4 text-sm font-bold text-brand-depth bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <User size={16} className="text-brand-muted" /> {vendor.contact_user || 'Kontakt yo\'q'}
               </div>
               {vendor.telegram_link && (
                 <a href={vendor.telegram_link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 py-4 bg-blue-50 text-blue-600 rounded-[1.25rem] text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <Send size={16} /> Telegram Profil
                 </a>
               )}
            </div>

            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )
      ))}
    </div>
  </div>
);

const PlanSection = ({ products }: { products: any[] }) => (
  <div className="space-y-10">
    <div className="bg-brand-depth p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-brand-primary/20"></div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
          <div className="w-24 h-24 bg-white/10 text-brand-primary rounded-[2rem] flex items-center justify-center shadow-inner border border-white/5">
            <CalendarDays size={48} />
          </div>
          <div>
            <h3 className="text-4xl font-black tracking-tight mb-2 uppercase">Xarid Rejasi</h3>
            <p className="text-white/50 text-sm font-bold tracking-widest uppercase">Kutilayotgan moliyaviy sarfiyat va buyurtmalar</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button className="flex-1 md:flex-none px-10 py-5 bg-white/5 border border-white/10 rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">Eksport (PDF)</button>
           <button className="flex-1 md:flex-none px-10 py-5 bg-brand-primary text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 transition-all">Tasdiqlash</button>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
       <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-md"><DollarSign size={20} /></div>
          <h4 className="text-xl font-black text-brand-depth tracking-tight uppercase">Xarajatlar Tahlili</h4>
       </div>
       <div className="overflow-x-auto">
         <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-white text-[10px] font-black uppercase text-brand-muted tracking-[0.2em] border-b border-slate-100">
                <th className="px-12 py-8">№</th>
                <th className="px-12 py-8">Mahsulot & Brend</th>
                <th className="px-12 py-8">Miqdor</th>
                <th className="px-12 py-8">O'rtacha Narx</th>
                <th className="px-12 py-8 text-right">Jami Summa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.length === 0 ? (
                <tr><td colSpan={5} className="p-32 text-center text-brand-muted font-bold uppercase tracking-[0.2em] text-sm">Xarid rejasi bo'sh</td></tr>
              ) : (
                products.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-12 py-8 font-black text-slate-300 text-sm group-hover:text-brand-primary transition-colors">{i + 1}</td>
                    <td className="px-12 py-8">
                       <div className="flex flex-col">
                          <span className="font-black text-brand-depth text-lg">{p.name}</span>
                          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">{p.brand || '--'}</span>
                       </div>
                    </td>
                    <td className="px-12 py-8">
                       <span className="px-4 py-2 bg-slate-100 rounded-full font-black text-brand-depth text-sm italic">{p.quantity} {p.unit}</span>
                    </td>
                    <td className="px-12 py-8 font-bold text-brand-depth text-base">{p.price?.toLocaleString()} <span className="text-[10px] text-brand-muted">so'm</span></td>
                    <td className="px-12 py-8 text-right font-black text-brand-primary text-xl">{(p.price * p.quantity).toLocaleString()} <span className="text-xs font-bold uppercase">so'm</span></td>
                  </tr>
                ))
              )}
            </tbody>
            {products.length > 0 && (
              <tfoot>
                 <tr className="bg-slate-50/50">
                    <td colSpan={4} className="px-12 py-10 font-black uppercase tracking-[0.2em] text-sm text-right text-brand-muted">Umumiy kutilayotgan byudjet:</td>
                    <td className="px-12 py-10 text-right font-black text-3xl text-brand-depth tracking-tighter italic">{products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()} <span className="text-sm font-bold uppercase not-italic">so'm</span></td>
                 </tr>
              </tfoot>
            )}
         </table>
       </div>
    </div>
  </div>
);

export default SupplyView;
