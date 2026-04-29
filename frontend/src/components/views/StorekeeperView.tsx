import React, { useState, useEffect, useMemo } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { 
  Plus, 
  Package, 
  Search,
  Filter,
  TrendingUp, 
  TrendingDown, 
  Clock,
  Calendar,
  Truck,
  Layers,
  Archive,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Tag,
  DollarSign,
  MapPin,
  Thermometer,
  StickyNote,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  MoreVertical,
  ShieldCheck,
  PackagePlus,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

const StorekeeperView: React.FC = () => {
  const { showNotification } = useNotification();
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'PRODUCTS' | 'TRANSACTIONS'>('PRODUCTS');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isOutModalOpen, setIsOutModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Form states
  const [productForm, setProductForm] = useState({
    name: '', category: 'Oziq-ovqat', unit: 'kg', brand: '', 
    min_stock: '10',
    // Initial stock fields (only for new product)
    quantity: '', price_per_unit: '', total_price: '', supplier: '', 
    received_date: new Date().toISOString().split('T')[0],
    expiry_date: '', storage_location: '', storage_temp: '', notes: ''
  });

  const [stockInData, setStockInData] = useState({
    product_id: '', quantity: '', price_per_unit: '', total_price: '',
    supplier: '', received_date: new Date().toISOString().split('T')[0],
    expiry_date: '', storage_location: '', storage_temp: '', notes: ''
  });

  const [stockOutData, setStockOutData] = useState({
    product_id: '', quantity: '', date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-calculate total price
  useEffect(() => {
    const qty = parseFloat(productForm.quantity) || 0;
    const price = parseFloat(productForm.price_per_unit) || 0;
    if (qty && price) setProductForm(prev => ({ ...prev, total_price: (qty * price).toFixed(2) }));
  }, [productForm.quantity, productForm.price_per_unit]);

  useEffect(() => {
    const qty = parseFloat(stockInData.quantity) || 0;
    const price = parseFloat(stockInData.price_per_unit) || 0;
    if (qty && price) setStockInData(prev => ({ ...prev, total_price: (qty * price).toFixed(2) }));
  }, [stockInData.quantity, stockInData.price_per_unit]);

  const fetchData = async () => {
    try {
      const [prodRes, transRes] = await Promise.all([
        axios.get(`${API_BASE}/inventory/products`),
        axios.get(`${API_BASE}/inventory/transactions`)
      ]);
      setProducts(prodRes.data);
      setTransactions(transRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', category: 'Oziq-ovqat', unit: 'kg', brand: '', min_stock: '10',
      quantity: '', price_per_unit: '', total_price: '', supplier: '', 
      received_date: new Date().toISOString().split('T')[0],
      expiry_date: '', storage_location: '', storage_temp: '', notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name, category: product.category, unit: product.unit, 
      brand: product.brand || '', min_stock: product.min_stock.toString(),
      quantity: '', price_per_unit: '', total_price: '', supplier: '', 
      received_date: '', expiry_date: '', storage_location: '', storage_temp: '', notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update product definition
        await axios.put(`${API_BASE}/inventory/products/${editingProduct.id}`, {
          name: productForm.name, category: productForm.category, unit: productForm.unit, brand: productForm.brand, min_stock: parseFloat(productForm.min_stock)
        });
        showNotification("Mahsulot yangilandi!", 'success');
      } else {
        // Create product + Initial Stock In
        const prodRes = await axios.post(`${API_BASE}/inventory/products`, {
          name: productForm.name, category: productForm.category, unit: productForm.unit, brand: productForm.brand, min_stock: parseFloat(productForm.min_stock)
        });
        await axios.post(`${API_BASE}/inventory/stock-in`, {
          product_id: prodRes.data.id, quantity: parseFloat(productForm.quantity), price_per_unit: parseFloat(productForm.price_per_unit), total_price: parseFloat(productForm.total_price), expiry_date: productForm.expiry_date, supplier: productForm.supplier, received_date: productForm.received_date, storage_location: productForm.storage_location, storage_temp: parseFloat(productForm.storage_temp), notes: productForm.notes
        });
        showNotification("Yangi mahsulot saqlandi!", 'success');
      }
      fetchData();
      setIsAddModalOpen(false);
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const handleStockIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/inventory/stock-in`, {
        ...stockInData,
        quantity: parseFloat(stockInData.quantity),
        price_per_unit: parseFloat(stockInData.price_per_unit),
        total_price: parseFloat(stockInData.total_price),
        storage_temp: parseFloat(stockInData.storage_temp)
      });
      showNotification("Kirim muvaffaqiyatli bajarildi!", 'success');
      fetchData();
      setIsStockInModalOpen(false);
      setStockInData({ product_id: '', quantity: '', price_per_unit: '', total_price: '', supplier: '', received_date: new Date().toISOString().split('T')[0], expiry_date: '', storage_location: '', storage_temp: '', notes: '' });
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    }
  };

  const handleStockOut = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/inventory/stock-out`, {
        product_id: stockOutData.product_id, quantity: parseFloat(stockOutData.quantity), date: stockOutData.date
      });
      showNotification("Chiqim bajarildi", 'success');
      fetchData();
      setIsOutModalOpen(false);
      setStockOutData({ product_id: '', quantity: '', date: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      showNotification(err.response?.data?.error || "Xatolik yuz berdi", "error");
    }
  };

  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + (p.total_quantity * (p.avg_price || 0)), 0);
    const lowStock = products.filter(p => p.total_quantity < p.min_stock).length;
    const items = products.length;
    return { totalValue, lowStock, items };
  }, [products]);

  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['ALL', ...Array.from(new Set(cats))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-slate-50/50 min-h-screen">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-xl shadow-slate-200/50">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
               <Archive size={24} />
             </div>
             <h2 className="text-4xl font-black text-brand-depth tracking-tight">Ombor Logistika</h2>
          </div>
          <p className="text-brand-muted text-[10px] font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
            <BarChart3 size={14} className="text-brand-primary" />
            Zahiraviy miqdor va inventar nazorati
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleOpenAddModal}
            className="group px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-3"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Yangi mahsulot
          </button>
          <button 
            onClick={() => setIsStockInModalOpen(true)}
            className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-3"
          >
            <PackagePlus size={18} /> Kirim qilish
          </button>
          <button 
            onClick={() => setIsOutModalOpen(true)}
            className="px-8 py-4 bg-brand-depth text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-depth/20 hover:scale-105 transition-all flex items-center gap-3"
          >
            <TrendingDown size={18} /> Chiqim qilish
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6">
           <div className="w-14 h-14 bg-blue-50 text-brand-primary rounded-2xl flex items-center justify-center"><Package size={28} /></div>
           <div>
              <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Jami Mahsulotlar</p>
              <h3 className="text-2xl font-black text-brand-depth">{stats.items} tur</h3>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stats.lowStock > 0 ? 'bg-rose-50 text-rose-500 animate-pulse' : 'bg-emerald-50 text-emerald-500'}`}>
              {stats.lowStock > 0 ? <AlertCircle size={28} /> : <ShieldCheck size={28} />}
           </div>
           <div>
              <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Kritik Zahira</p>
              <h3 className={`text-2xl font-black ${stats.lowStock > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{stats.lowStock} ta</h3>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6">
           <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><DollarSign size={28} /></div>
           <div>
              <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Ombor Qiymati</p>
              <h3 className="text-2xl font-black text-brand-depth">{stats.totalValue.toLocaleString()} <span className="text-xs">so'm</span></h3>
           </div>
        </div>
      </section>

      <main className="space-y-6">
        <div className="flex bg-white p-2 rounded-2xl border border-brand-border w-fit gap-2">
          <button onClick={() => setViewMode('PRODUCTS')} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${viewMode === 'PRODUCTS' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-brand-muted hover:bg-slate-50'}`}><Archive size={14} /> Katalog</button>
          <button onClick={() => setViewMode('TRANSACTIONS')} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${viewMode === 'TRANSACTIONS' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-brand-muted hover:bg-slate-50'}`}><Clock size={14} /> Harakatlar tarixi</button>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'PRODUCTS' ? (
            <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4 bg-white p-6 rounded-[2.5rem] border border-brand-border shadow-sm">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                  <input type="text" placeholder="Mahsulot nomini qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-transparent focus:border-brand-primary rounded-2xl py-4 pl-14 pr-6 font-bold text-sm outline-none transition-all" />
                </div>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-slate-50 border-none font-black text-[9px] uppercase tracking-widest px-8 py-4 rounded-2xl outline-none cursor-pointer">
                  {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'Barcha katagoriyalar' : c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <motion.div layout key={product.id} className="bg-white rounded-[2.5rem] border border-brand-border p-8 shadow-sm hover:shadow-2xl hover:border-brand-primary/30 transition-all group relative">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-border group-hover:bg-brand-primary group-hover:text-white transition-all duration-500"><Package size={28} /></div>
                      <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${product.total_quantity < product.min_stock ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>{product.total_quantity < product.min_stock ? 'Kam qolgan' : 'Soni yetarli'}</div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-brand-depth truncate">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase text-brand-muted tracking-widest">{product.category}</span>
                        {product.brand && <><span className="w-1 h-1 bg-slate-300 rounded-full"></span><span className="text-[9px] font-black uppercase text-brand-primary/70">{product.brand}</span></>}
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[8px] font-black text-brand-muted uppercase tracking-widest mb-1">Mavjud qoldiq</p>
                          <p className="text-2xl font-black text-brand-depth leading-none">{product.total_quantity} <span className="text-xs uppercase text-brand-muted">{product.unit}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-black text-brand-muted uppercase tracking-widest mb-1">Zahiraviy limit</p>
                          <p className="text-sm font-black text-rose-500">{product.min_stock} <span className="text-[9px]">{product.unit}</span></p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${product.total_quantity < product.min_stock ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((product.total_quantity / (product.min_stock * 2 || 1)) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    <button onClick={() => handleOpenEditModal(product)} className="absolute top-8 right-8 text-slate-300 hover:text-brand-primary transition-colors p-2 hover:bg-brand-primary/10 rounded-xl">
                      <Edit3 size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="transactions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[3rem] border border-brand-border overflow-hidden shadow-sm">
              <div className="p-8 border-b border-brand-border bg-slate-50/30"><h3 className="font-black text-brand-depth uppercase text-xs tracking-widest flex items-center gap-2"><Layers size={18} className="text-brand-primary" /> Kirim-Chiqim jurnali</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-brand-muted tracking-widest border-b border-brand-border">
                      <th className="px-8 py-6">Sana</th><th className="px-8 py-6">Mahsulot</th><th className="px-8 py-6">Amal</th><th className="px-8 py-6 text-center">Miqdor</th><th className="px-8 py-6 text-right">Qiymati</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-brand-primary/[0.02] transition-colors group">
                        <td className="px-8 py-6 text-xs font-black text-brand-depth">{new Date(t.date).toLocaleDateString('uz-UZ')}</td>
                        <td className="px-8 py-6"><p className="text-sm font-black text-brand-depth">{t.product_name}</p><p className="text-[9px] font-bold text-brand-muted uppercase">{t.category}</p></td>
                        <td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center w-fit gap-2 ${t.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{t.type === 'IN' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}{t.type === 'IN' ? 'Kirim' : 'Chiqim'}</span></td>
                        <td className="px-8 py-6 text-center"><span className={`text-sm font-black ${t.type === 'IN' ? 'text-emerald-600' : 'text-amber-600'}`}>{t.type === 'IN' ? '+' : '-'}{t.quantity} {t.unit}</span></td>
                        <td className="px-8 py-6 text-right font-black text-xs text-brand-depth">{t.price ? `${t.price.toLocaleString()} so'm` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Product Form Modal (Add / Edit) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-6xl rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[95vh] relative scrollbar-hidden">
              <div className="flex justify-between items-start mb-10 text-brand-depth font-black">
                <div>
                  <h3 className="text-4xl tracking-tight">{editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot yaratish'}</h3>
                  <p className="text-[10px] text-brand-muted uppercase font-black tracking-widest mt-2">Barcha texnik va zahira parametrlarini sozlang</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all text-2xl shadow-sm">&times;</button>
              </div>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6 border border-brand-border">
                    <h4 className="text-[11px] font-black uppercase text-brand-primary tracking-widest flex items-center gap-2"><Tag size={16}/> Mahsulot ta'rifi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-muted uppercase ml-1">Nomi *</label>
                        <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-white border border-brand-border rounded-2xl p-4 font-bold outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-muted uppercase ml-1">Brend</label>
                        <input value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} className="w-full bg-white border border-brand-border rounded-2xl p-4 font-bold outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-muted uppercase ml-1">Kategoriya *</label>
                        <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-white border border-brand-border rounded-2xl p-4 font-black outline-none">
                          <option>Oziq-ovqat</option><option>Tozalovchi vositalar</option><option>Kanselyariya</option><option>Boshqa</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-muted uppercase ml-1">Birlik *</label>
                        <select value={productForm.unit} onChange={e => setProductForm({...productForm, unit: e.target.value})} className="w-full bg-white border border-brand-border rounded-2xl p-4 font-black outline-none">
                          <option value="kg">kg</option><option value="ltr">ltr</option><option value="dona">dona</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 bg-white rounded-[2.5rem] border border-brand-border shadow-sm space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-2"><ShieldCheck size={16}/> Xavfsizlik limitlari</h4>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-muted uppercase ml-1">Zahiraviy miqdor (Kritik qoldiq) *</label>
                      <input required type="number" value={productForm.min_stock} onChange={e => setProductForm({...productForm, min_stock: e.target.value})} className="w-full bg-rose-50 border-2 border-rose-100 text-rose-600 rounded-2xl p-4 font-black outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {!editingProduct ? (
                    <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 space-y-6">
                      <h4 className="text-[11px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2"><PackagePlus size={16}/> Boshlang'ich Kirim (Majburiy)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <input required type="number" placeholder="Miqdori *" value={productForm.quantity} onChange={e => setProductForm({...productForm, quantity: e.target.value})} className="w-full bg-white border border-emerald-100 rounded-2xl p-4 font-black outline-none" />
                        <input type="number" placeholder="Birlik narxi" value={productForm.price_per_unit} onChange={e => setProductForm({...productForm, price_per_unit: e.target.value})} className="w-full bg-white border border-emerald-100 rounded-2xl p-4 font-black outline-none" />
                      </div>
                      <input required placeholder="Yetkazib beruvchi *" value={productForm.supplier} onChange={e => setProductForm({...productForm, supplier: e.target.value})} className="w-full bg-white border border-emerald-100 rounded-2xl p-4 font-bold outline-none" />
                      <div className="grid grid-cols-2 gap-4">
                        <input required type="date" value={productForm.received_date} onChange={e => setProductForm({...productForm, received_date: e.target.value})} className="w-full bg-white border border-emerald-100 rounded-2xl p-4 font-black outline-none" title="Qabul sanasi" />
                        <input required type="date" value={productForm.expiry_date} onChange={e => setProductForm({...productForm, expiry_date: e.target.value})} className="w-full bg-white border border-emerald-100 rounded-2xl p-4 font-black outline-none" title="Yaroqlilik muddati" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex flex-col items-center justify-center text-center space-y-4 h-full">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm"><Info size={32}/></div>
                       <p className="text-sm font-bold text-blue-600">Tahrirlash rejimida faqat mahsulot parametrlarini o'zgartira olasiz. Zaxirani to'ldirish uchun "Kirim qilish" funksiyasidan foydalaning.</p>
                    </div>
                  )}
                  <button type="submit" className={`w-full py-6 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all ${editingProduct ? 'bg-brand-depth shadow-brand-depth/40' : 'bg-brand-primary shadow-brand-primary/40'}`}>
                    {editingProduct ? 'O\'zgarishlarni saqlash' : 'Mahsulotni yaratish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stock In & Stock Out modals (Same as before but integrated) */}
      <AnimatePresence>
        {isStockInModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-4xl rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[95vh] relative scrollbar-hidden">
              <div className="flex justify-between items-start mb-10 text-brand-depth font-black">
                <h3 className="text-4xl tracking-tight">Zaxira kirimi</h3>
                <button onClick={() => setIsStockInModalOpen(false)} className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all text-2xl shadow-sm">&times;</button>
              </div>
              <form onSubmit={handleStockIn} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6 border border-brand-border">
                    <h4 className="text-[11px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2"><Package size={16}/> Tanlash</h4>
                    <select required value={stockInData.product_id} onChange={e => setStockInData({...stockInData, product_id: e.target.value})} className="w-full bg-white border border-brand-border rounded-2xl p-5 font-black outline-none appearance-none cursor-pointer">
                      <option value="">Mahsulotni tanlang...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.total_quantity} {p.unit})</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="number" step="0.01" placeholder="Miqdor *" value={stockInData.quantity} onChange={e => setStockInData({...stockInData, quantity: e.target.value})} className="w-full bg-white border border-brand-border rounded-2xl p-4 font-black outline-none" />
                      <input type="number" placeholder="Narxi" value={stockInData.price_per_unit} onChange={e => setStockInData({...stockInData, price_per_unit: e.target.value})} className="w-full bg-white border border-brand-border rounded-2xl p-4 font-black outline-none" />
                    </div>
                  </div>
                  <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-center justify-between">
                     <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Jami:</span>
                     <span className="text-2xl font-black text-blue-600">{stockInData.total_price || '0.00'} so'm</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6 border border-brand-border">
                    <h4 className="text-[11px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2"><Truck size={16}/> Logistika</h4>
                    <input required placeholder="Yetkazib beruvchi *" value={stockInData.supplier} onChange={e => setStockInData({...stockInData, supplier: e.target.value})} className="w-full bg-white border border-brand-border rounded-2xl p-4 font-bold outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="date" value={stockInData.received_date} onChange={e => setStockInData({...stockInData, received_date: e.target.value})} className="w-full bg-white border border-brand-border rounded-2xl p-4 font-black outline-none" />
                      <input required type="date" value={stockInData.expiry_date} onChange={e => setStockInData({...stockInData, expiry_date: e.target.value})} className="w-full bg-white border-2 border-rose-50 rounded-2xl p-4 font-black outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-all">Kirimni tasdiqlash</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stock Out Modal (Compact) */}
      <AnimatePresence>
        {isOutModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl relative">
              <div className="flex justify-between items-start mb-10"><h3 className="text-3xl font-black text-brand-depth tracking-tight">Mahsulot chiqimi</h3><button onClick={() => setIsOutModalOpen(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all font-black text-2xl">&times;</button></div>
              <form onSubmit={handleStockOut} className="space-y-8">
                <select required value={stockOutData.product_id} onChange={e => setStockOutData({...stockOutData, product_id: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-5 font-black outline-none transition-all">{products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.total_quantity} {p.unit})</option>)}</select>
                <div className="relative"><ArrowDown className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} /><input required type="number" step="0.01" value={stockOutData.quantity} onChange={e => setStockOutData({...stockOutData, quantity: e.target.value})} className="w-full bg-slate-50 border border-transparent focus:border-brand-primary rounded-2xl py-5 pl-14 pr-6 font-black text-lg outline-none transition-all" /></div>
                <input required type="date" value={stockOutData.date} onChange={e => setStockOutData({...stockOutData, date: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 font-black outline-none" />
                <button type="submit" className="w-full py-6 bg-brand-depth text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-depth/30 hover:scale-[1.02] active:scale-95 transition-all">Chiqimni tasdiqlash</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorekeeperView;
const Info = ({size}: {size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
