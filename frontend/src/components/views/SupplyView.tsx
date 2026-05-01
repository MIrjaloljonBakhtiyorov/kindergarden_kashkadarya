import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Users2, 
  CalendarDays, 
  TrendingUp, 
  Clock, 
  Plus, 
  Search, 
  ChevronRight, 
  ArrowRight, 
  X, 
  Save, 
  User, 
  Smartphone, 
  Send, 
  Activity, 
  DollarSign, 
  Layers,
  CheckCircle2,
  Trash2,
  FileText,
  Calendar,
  Printer,
  Download,
  AlertCircle,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import apiClient from '../../api/apiClient';
import { useNotification } from '../../context/NotificationContext';

type SupplyTab = 'REQUIRED' | 'SUPPLIERS' | 'PLAN';

const SupplyView: React.FC = () => {
  const { showNotification, confirm } = useNotification();
  const [activeTab, setActiveTab] = useState<SupplyTab>('REQUIRED');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [requiredProducts, setRequiredProducts] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

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

  const [planForm, setPlanForm] = useState({
    title: '',
    month: new Date().toISOString().slice(0, 7),
    status: 'DRAFT'
  });

  useEffect(() => {
    fetchSuppliers();
    fetchRequiredProducts();
    fetchPlans();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await apiClient.get(`/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequiredProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/supply/required-products`);
      setRequiredProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await apiClient.get(`/supply/plans`);
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await apiClient.put(`/supply/required-products/${editingProduct.id}`, {
          ...productForm,
          price: parseFloat(productForm.price),
          quantity: parseFloat(productForm.quantity)
        });
        showNotification("Mahsulot yangilandi", "success");
      } else {
        await apiClient.post(`/supply/required-products`, {
          ...productForm,
          price: parseFloat(productForm.price),
          quantity: parseFloat(productForm.quantity)
        });
        showNotification("Mahsulot muvaffaqiyatli qo'shildi!", "success");
      }
      setShowProductModal(false);
      setEditingProduct(null);
      fetchRequiredProducts();
      setProductForm({ name: '', price: '', quantity: '', unit: 'kg', brand: '', category: 'Oziq-ovqat' });
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price?.toString() || '',
      quantity: product.quantity.toString(),
      unit: product.unit,
      brand: product.brand || '',
      category: product.category || 'Oziq-ovqat'
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    const ok = await confirm("Ushbu mahsulotni o'chirmoqchimisiz?");
    if (!ok) return;
    try {
      await apiClient.delete(`/supply/required-products/${id}`);
      showNotification("Mahsulot o'chirildi", "success");
      fetchRequiredProducts();
    } catch (err) {
      showNotification("O'chirishda xatolik", "error");
    }
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await apiClient.put(`/suppliers/${editingSupplier.id}`, supplierForm);
        showNotification("Yetkazib beruvchi yangilandi", "success");
      } else {
        await apiClient.post(`/suppliers`, supplierForm);
        showNotification("Yetkazib beruvchi muvaffaqiyatli qo'shildi!", "success");
      }
      setShowSupplierModal(false);
      setEditingSupplier(null);
      fetchSuppliers();
      setSupplierForm({ first_name: '', last_name: '', brand: '', phone: '', contact_user: '', telegram_link: '' });
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const openEditSupplier = (vendor: any) => {
    setEditingSupplier(vendor);
    setSupplierForm({
      first_name: vendor.first_name || '',
      last_name: vendor.last_name || '',
      brand: vendor.brand || '',
      phone: vendor.phone || '',
      contact_user: vendor.contact_user || '',
      telegram_link: vendor.telegram_link || ''
    });
    setShowSupplierModal(true);
  };

  const handleDeleteSupplier = async (id: string) => {
    const ok = await confirm("Ushbu yetkazib beruvchini o'chirmoqchimisiz?");
    if (!ok) return;
    try {
      await apiClient.delete(`/suppliers/${id}`);
      showNotification("Yetkazib beruvchi o'chirildi", "success");
      fetchSuppliers();
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiredProducts.length === 0) {
      showNotification("Avval mahsulotlar qo'shing", "error");
      return;
    }
    try {
      const totalAmount = requiredProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      
      await apiClient.post(`/supply/plans`, {
        ...planForm,
        total_amount: totalAmount,
        items: requiredProducts
      });
      showNotification("Haftalik xarid rejasi yaratildi!", "success");
      setShowPlanModal(false);
      fetchPlans();
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const stats = useMemo(() => {
    const totalRequiredSum = requiredProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    return {
      monthlyPurchase: (totalRequiredSum / 1000000).toFixed(1) + ' mln',
      requiredCount: requiredProducts.length,
      suppliersCount: suppliers.length
    };
  }, [suppliers, requiredProducts]);

  const tabs = [
    { id: 'REQUIRED', label: 'Kerakli mahsulotlar', icon: ShoppingBag, color: 'brand-primary' },
    { id: 'SUPPLIERS', label: 'Yetkazib beruvchilar', icon: Users2, color: 'emerald-500' },
    { id: 'PLAN', label: 'Xarid rejasi', icon: CalendarDays, color: 'violet-500' },
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-depth tracking-tight">Ta'minot va Logistika</h2>
          <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Activity size={14} className="text-brand-primary" />
            Tizimli xaridlar va yetkazib beruvchilar monitoringi
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          {activeTab === 'PLAN' ? (
            <button 
              onClick={() => setShowPlanModal(true)}
              className="flex-1 md:flex-none bg-violet-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-violet-600/30 hover:scale-[1.02] active:scale-95 transition-all justify-center"
            >
              <Calendar size={20} /> Haftalik reja yaratish
            </button>
          ) : (
            <button 
              onClick={() => {
                setEditingProduct(null);
                setProductForm({ name: '', price: '', quantity: '', unit: 'kg', brand: '', category: 'Oziq-ovqat' });
                setShowProductModal(true);
              }}
              className="flex-1 md:flex-none bg-brand-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-95 transition-all justify-center"
            >
              <Plus size={20} /> Mahsulot qo'shish
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Rejadagi Xarid', value: stats.monthlyPurchase, sub: 'so‘m', icon: TrendingUp, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Kerakli Mahsulotlar', value: stats.requiredCount, sub: 'ta', icon: Layers, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'Yetkazib beruvchilar', value: stats.suppliersCount, sub: 'ta hamkor', icon: Users2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
               setActiveTab(tab.id as SupplyTab);
               setSelectedPlan(null);
            }}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-white text-brand-primary shadow-md' : 'text-brand-muted hover:text-brand-depth'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (selectedPlan ? selectedPlan.id : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'REQUIRED' && (
              <RequiredProductsSection 
                products={requiredProducts} 
                onAdd={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', price: '', quantity: '', unit: 'kg', brand: '', category: 'Oziq-ovqat' });
                  setShowProductModal(true);
                }} 
                onEdit={openEditProduct}
                onDelete={handleDeleteProduct}
              />
            )}
            {activeTab === 'SUPPLIERS' && (
              <SuppliersSection 
                suppliers={suppliers} 
                onAdd={() => {
                  setEditingSupplier(null);
                  setSupplierForm({ first_name: '', last_name: '', brand: '', phone: '', contact_user: '', telegram_link: '' });
                  setShowSupplierModal(true);
                }} 
                onEdit={openEditSupplier}
                onDelete={handleDeleteSupplier}
              />
            )}
            {activeTab === 'PLAN' && (
               selectedPlan ? (
                 <PlanDetailView plan={selectedPlan} onBack={() => setSelectedPlan(null)} />
               ) : (
                 <PlanSection plans={plans} onCreate={() => setShowPlanModal(true)} onView={(plan) => setSelectedPlan(plan)} onDelete={async (id) => {
                   const ok = await confirm("Ushbu rejani o'chirmoqchimisiz?");
                   if(ok) {
                      apiClient.delete(`/supply/plans/${id}`).then(() => fetchPlans());
                   }
                 }} />
               )
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-lg rounded-[2rem] p-10 shadow-2xl border border-slate-200"
             >
                <div className="flex justify-between items-center mb-10">
                   <div>
                     <h3 className="text-3xl font-black text-brand-depth tracking-tight">{editingProduct ? 'Tahrirlash' : 'Yangi Mahsulot'}</h3>
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

                   <button type="submit" className="w-full py-6 bg-brand-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-4"><Save size={20} /> {editingProduct ? 'Yangilash' : 'Ro\'yxatga qo\'shish'}</button>
                </form>
             </motion.div>
          </div>
        )}

        {showSupplierModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-lg rounded-[2rem] p-10 shadow-2xl border border-slate-200"
             >
                <div className="flex justify-between items-center mb-10">
                   <div>
                     <h3 className="text-3xl font-black text-brand-depth tracking-tight">{editingSupplier ? 'Tahrirlash' : 'Yangi Hamkor'}</h3>
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
                   <button type="submit" className="w-full py-6 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-4"><Save size={20} /> {editingSupplier ? 'Yangilash' : 'Hamkorni Saqlash'}</button>
                </form>
             </motion.div>
          </div>
        )}

        {showPlanModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-lg rounded-[2rem] p-10 shadow-2xl border border-slate-200"
             >
                <div className="flex justify-between items-center mb-10">
                   <div>
                     <h3 className="text-3xl font-black text-brand-depth tracking-tight">Haftalik Reja</h3>
                     <p className="text-xs text-brand-muted font-bold uppercase tracking-widest mt-1">Yangi xarid davrini rejalashtirish</p>
                   </div>
                   <button onClick={() => setShowPlanModal(false)} className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"><X /></button>
                </div>
                <form onSubmit={handleCreatePlan} className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Reja Nomi</label>
                     <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" placeholder="Masalan: 18-hafta xarid rejasi" value={planForm.title} onChange={e => setPlanForm({...planForm, title: e.target.value})} required />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Davr (Oy)</label>
                     <input type="month" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none font-bold transition-all" value={planForm.month} onChange={e => setPlanForm({...planForm, month: e.target.value})} required />
                   </div>
                   <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                      <p className="text-xs font-bold text-amber-800 leading-relaxed">
                        Diqqat! Ushbu reja hozirgi "Kerakli mahsulotlar" ro'yxatidagi barcha elementlar asosida shakllantiriladi.
                      </p>
                   </div>
                   <button type="submit" className="w-full py-6 bg-violet-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-violet-600/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-4"><Save size={20} /> Rejani Tasdiqlash</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Internal Page Sections ---

const RequiredProductsSection = ({ products, onAdd, onEdit, onDelete }: { products: any[], onAdd: () => void, onEdit: (p: any) => void, onDelete: (id: string) => void }) => {
  const totalSum = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-[1.5rem] flex items-center justify-center">
             <Layers size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-brand-depth tracking-tight">Haftalik Ehtiyojlar Ro'yxati</h3>
            <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1">Joriy hafta uchun kerakli mahsulotlar va ularning qiymati</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onAdd} className="bg-brand-primary text-white px-10 py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/30 hover:scale-105 transition-all flex items-center gap-3">
            <Plus size={20} /> Yangi Mahsulot
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl relative">
         <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-brand-muted tracking-[0.2em] border-b border-slate-100">
                  <th className="px-10 py-8">№</th>
                  <th className="px-10 py-8">Mahsulot nomi</th>
                  <th className="px-10 py-8">Brend</th>
                  <th className="px-10 py-8">Miqdor</th>
                  <th className="px-10 py-8">Narxi (so'm)</th>
                  <th className="px-10 py-8">Qiymati</th>
                  <th className="px-10 py-8 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length === 0 ? (
                  <tr><td colSpan={7} className="p-32 text-center text-brand-muted font-bold uppercase tracking-[0.2em] text-sm">Hozircha ma'lumot yo'q</td></tr>
                ) : (
                  products.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-10 py-8 font-black text-slate-300 text-sm group-hover:text-brand-primary transition-colors">{i + 1}</td>
                      <td className="px-10 py-8 font-black text-brand-depth text-lg">{p.name}</td>
                      <td className="px-10 py-8 text-[10px] font-bold text-brand-muted uppercase tracking-widest">{p.brand || '--'}</td>
                      <td className="px-10 py-8">
                         <span className="px-4 py-2 bg-slate-100 rounded-full font-black text-brand-depth text-sm italic">{p.quantity} {p.unit}</span>
                      </td>
                      <td className="px-10 py-8 font-bold text-brand-depth text-base">{p.price?.toLocaleString()}</td>
                      <td className="px-10 py-8 font-black text-brand-primary text-xl">{(p.price * p.quantity).toLocaleString()}</td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex justify-end gap-2">
                            <button onClick={() => onEdit(p)} className="w-10 h-10 bg-slate-50 text-brand-primary rounded-lg flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                               <Pencil size={18} />
                            </button>
                            <button onClick={() => onDelete(p.id)} className="w-10 h-10 bg-slate-50 text-rose-500 rounded-lg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {products.length > 0 && (
                <tfoot>
                   <tr className="bg-brand-depth text-white">
                      <td colSpan={5} className="px-10 py-10 font-black uppercase tracking-[0.2em] text-sm text-right opacity-60">Jami haftalik ehtiyoj qiymati:</td>
                      <td colSpan={2} className="px-10 py-10 text-right font-black text-3xl tracking-tighter italic pr-20">{totalSum.toLocaleString()} <span className="text-sm font-bold uppercase not-italic">so'm</span></td>
                   </tr>
                </tfoot>
              )}
           </table>
         </div>
      </div>
    </div>
  );
};

const PlanSection = ({ plans, onCreate, onView, onDelete }: { plans: any[], onCreate: () => void, onView: (p: any) => void, onDelete: (id: string) => void }) => (
  <div className="space-y-10">
    <div className="bg-brand-depth p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-brand-primary/20"></div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
          <div className="w-24 h-24 bg-white/10 text-brand-primary rounded-[2rem] flex items-center justify-center shadow-inner border border-white/5">
            <CalendarDays size={48} />
          </div>
          <div>
            <h3 className="text-4xl font-black tracking-tight mb-2 uppercase">Haftalik Xarid Rejalari</h3>
            <p className="text-white/50 text-sm font-bold tracking-widest uppercase">Shakllantirilgan haftalik xarid jadvallari arxivi</p>
          </div>
        </div>
        <button onClick={onCreate} className="px-10 py-5 bg-brand-primary text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 transition-all">
          Yangi Reja Yaratish
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6">
      {plans.length === 0 ? (
        <div className="bg-white p-20 text-center text-brand-muted font-bold rounded-[3rem] border-2 border-dashed border-slate-200 uppercase tracking-widest text-xs">
           Xozircha xarid rejalari mavjud emas
        </div>
      ) : (
        plans.map((plan, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between group">
             <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-slate-50 text-violet-600 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-violet-600 group-hover:text-white transition-all">
                   <FileText size={28} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-brand-depth">{plan.title}</h4>
                   <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{plan.month}</span>
                      <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                      <span className="text-xs font-bold text-brand-primary">{plan.items?.length || 0} ta mahsulot</span>
                   </div>
                </div>
             </div>
             
             <div className="flex items-center gap-10">
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase text-brand-muted tracking-widest mb-1">Jami Qiymati</p>
                   <p className="text-xl font-black text-brand-depth">{plan.total_amount?.toLocaleString()} <span className="text-xs text-brand-muted">so'm</span></p>
                </div>
                
                <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                   plan.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                   {plan.status === 'APPROVED' ? 'Tasdiqlangan' : 'Qoralama'}
                </div>

                <div className="flex gap-2">
                   <button onClick={() => onView(plan)} className="w-12 h-12 bg-slate-50 text-brand-muted rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                      <ChevronRight size={20} />
                   </button>
                   <button onClick={() => onDelete(plan.id)} className="w-12 h-12 bg-slate-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 size={20} />
                   </button>
                </div>
             </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const PlanDetailView = ({ plan, onBack }: { plan: any, onBack: () => void }) => (
  <div className="space-y-8 animate-in slide-in-from-right duration-500">
    <div className="flex items-center justify-between">
       <button onClick={onBack} className="flex items-center gap-3 text-brand-muted hover:text-brand-primary font-black uppercase text-xs tracking-widest transition-all">
          <ArrowRight className="rotate-180" size={20} /> Orqaga qaytish
       </button>
       <div className="flex gap-4">
          <button className="p-4 bg-slate-100 text-brand-depth rounded-2xl hover:bg-brand-primary hover:text-white transition-all"><Printer size={20} /></button>
          <button className="p-4 bg-slate-100 text-brand-depth rounded-2xl hover:bg-brand-primary hover:text-white transition-all"><Download size={20} /></button>
       </div>
    </div>

    <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-slate-50 pb-12">
          <div>
             <h3 className="text-4xl font-black text-brand-depth tracking-tight uppercase">{plan.title}</h3>
             <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-brand-muted font-bold uppercase text-[10px] tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                   <Calendar size={14} className="text-brand-primary" /> {plan.month}
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase text-[10px] tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                   <CheckCircle2 size={14} /> {plan.status}
                </div>
             </div>
          </div>
          <div className="bg-brand-depth text-white p-8 rounded-[2.5rem] text-right shadow-xl">
             <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Umumiy Xarajat</p>
             <p className="text-4xl font-black">{plan.total_amount?.toLocaleString()} <span className="text-sm font-bold uppercase">so'm</span></p>
          </div>
       </div>

       <div className="overflow-x-auto">
         <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase text-brand-muted tracking-[0.2em]">
                <th className="pb-8">№</th>
                <th className="pb-8">Mahsulot</th>
                <th className="pb-8">Brend</th>
                <th className="pb-8">Miqdor</th>
                <th className="pb-8">Dona Narxi</th>
                <th className="pb-8 text-right">Qiymati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {plan.items?.map((item: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 font-black text-slate-300 text-sm">{i + 1}</td>
                  <td className="py-6 font-black text-brand-depth text-lg">{item.name}</td>
                  <td className="py-6 text-[10px] font-bold text-brand-muted uppercase tracking-widest">{item.brand || '--'}</td>
                  <td className="py-6 font-bold text-brand-depth">{item.quantity} {item.unit}</td>
                  <td className="py-6 font-bold text-brand-depth">{item.price?.toLocaleString()}</td>
                  <td className="py-6 text-right font-black text-brand-primary">{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
         </table>
       </div>
    </div>
  </div>
);

const SuppliersSection = ({ suppliers, onAdd, onEdit, onDelete }: { suppliers: any[], onAdd: () => void, onEdit: (v: any) => void, onDelete: (id: string) => void }) => (
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
              <div className="flex gap-2">
                 <button onClick={() => onEdit(vendor)} className="w-10 h-10 bg-white/80 backdrop-blur-sm text-brand-primary rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                    <Pencil size={18} />
                 </button>
                 <button onClick={() => onDelete(vendor.id)} className="w-10 h-10 bg-white/80 backdrop-blur-sm text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                    <Trash2 size={18} />
                 </button>
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

export default SupplyView;
