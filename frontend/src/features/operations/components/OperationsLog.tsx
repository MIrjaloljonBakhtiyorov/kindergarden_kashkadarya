import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Filter, 
  FileDown, 
  History,
  Clock,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  UserCircle,
  Package,
  ArrowRight
} from 'lucide-react';
import apiClient from '../../../api/apiClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



interface Operation {
  id: string;
  operation_type: string;
  entity_type: string;
  entity_name: string;
  description: string;
  created_at: string;
  category: string;
  is_archived: number;
}

export const OperationsLog: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'INCOMING' | 'OUTGOING' | 'ARCHIVED'>('ALL');
  const [filterDays, setFilterDays] = useState<string>('7');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOperations = async () => {
    try {
      setLoading(true);
      let url = activeTab === 'ARCHIVED' 
        ? '/operations/archived' 
        : `/operations?days=${filterDays}`;
      
      if (activeTab === 'INCOMING' || activeTab === 'OUTGOING') {
        url = `/operations?category=${activeTab}`;
      }

      const res = await apiClient.get(url);
      setOperations(res.data);
    } catch (err) {
      console.error('Failed to fetch operations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, [filterDays, activeTab]);

  const handleArchive = async (id: string) => {
    if (!window.confirm('Haqiqatan ham ushbu amalni arxivlamoqchimisiz?')) return;
    try {
      await apiClient.post(`/operations/archive/${id}`);
      setOperations(prev => prev.filter(op => op.id !== id));
    } catch (err) {
      console.error('Failed to archive operation:', err);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const titleMap = {
      ALL: 'Barcha Amallar Logi',
      INCOMING: 'Kirim Amallari Logi',
      OUTGOING: 'Chiqim Amallari Logi',
      ARCHIVED: 'Arxivlangan Amallar Logi'
    };

    doc.setFontSize(18);
    doc.text(titleMap[activeTab], 14, 20);
    doc.setFontSize(10);
    if (activeTab !== 'ARCHIVED') {
      doc.text(`Filtr: Oxirgi ${filterDays} kun`, 14, 30);
    }
    doc.text(`Sana: ${new Date().toLocaleString()}`, 14, 35);

    autoTable(doc, {
      startY: 45,
      head: [['Vaqt', 'Turi', 'Obyekt', 'Kategoriya', 'Tavsif']],
      body: operations.map(op => [
        new Date(op.created_at).toLocaleString(),
        op.operation_type,
        op.entity_name || op.entity_type,
        op.category || 'OTHER',
        op.description
      ]),
      styles: { fontSize: 8, font: 'helvetica' },
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`log_${activeTab.toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getOperationIcon = (op: Operation) => {
    if (op.category === 'INCOMING') return <Plus size={14} />;
    if (op.category === 'OUTGOING') return <ArrowRight size={14} className="rotate-45" />;
    
    switch (op.operation_type) {
      case 'CREATE': return <Plus size={14} />;
      case 'UPDATE': return <Edit2 size={14} />;
      case 'DELETE': return <Trash2 size={14} />;
      case 'SECURITY': return <ShieldCheck size={14} />;
      case 'LOGIN': return <UserCircle size={14} />;
      case 'INVENTORY': return <Package size={14} />;
      default: return <History size={14} />;
    }
  };

  const getOperationColor = (op: Operation) => {
    if (op.category === 'INCOMING') return 'bg-emerald-100 text-emerald-600';
    if (op.category === 'OUTGOING') return 'bg-rose-100 text-rose-600';

    switch (op.operation_type) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-600';
      case 'UPDATE': return 'bg-amber-100 text-amber-600';
      case 'DELETE': return 'bg-rose-100 text-rose-600';
      case 'SECURITY': return 'bg-indigo-100 text-indigo-600';
      case 'LOGIN': return 'bg-blue-100 text-blue-600';
      case 'INVENTORY': return 'bg-orange-100 text-orange-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-brand-border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h4 className="font-bold text-lg flex items-center gap-2 text-brand-depth">
            <History size={20} className="text-brand-primary" />
            Amallar Logi
          </h4>
          <p className="text-[11px] text-brand-muted uppercase font-bold tracking-widest mt-1">Tizimdagi barcha amallar va o'zgarishlar</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('ALL')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'ALL' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Barchasi
            </button>
            <button 
              onClick={() => setActiveTab('INCOMING')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'INCOMING' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Kirim
            </button>
            <button 
              onClick={() => setActiveTab('OUTGOING')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'OUTGOING' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Chiqim
            </button>
            <button 
              onClick={() => setActiveTab('ARCHIVED')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'ARCHIVED' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Arxiv
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            {activeTab !== 'ARCHIVED' && activeTab !== 'INCOMING' && activeTab !== 'OUTGOING' && (
              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
                <select 
                  value={filterDays}
                  onChange={(e) => setFilterDays(e.target.value)}
                  className="pl-9 pr-10 py-2.5 bg-slate-50 border border-brand-border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-primary/10 appearance-none cursor-pointer w-full"
                >
                  <option value="1">1 kun</option>
                  <option value="7">7 kun</option>
                  <option value="30">30 kun</option>
                </select>
              </div>
            )}
            <button 
              onClick={downloadPDF}
              disabled={operations.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary-dark transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:shadow-none"
            >
              <FileDown size={14} /> <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mb-4"></div>
            <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">Ma'lumotlar yuklanmoqda...</p>
          </div>
        ) : operations.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <History size={24} className="text-slate-300" />
            </div>
            <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">Amallar topilmadi.</p>
          </div>
        ) : (
          operations.map((op) => (
            <div key={op.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${getOperationColor(op)}`}>
                  {getOperationIcon(op)}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-depth group-hover:text-brand-primary transition-colors">{op.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] bg-white border border-brand-border px-2 py-0.5 rounded-md font-black text-brand-muted uppercase tracking-tighter">
                        {op.entity_type}
                      </span>
                      {op.category && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter border ${
                          op.category === 'INCOMING' ? 'border-emerald-200 text-emerald-600' : 
                          op.category === 'OUTGOING' ? 'border-rose-200 text-rose-600' : 
                          'border-slate-200 text-slate-400'
                        }`}>
                          {op.category === 'INCOMING' ? 'Kirim' : op.category === 'OUTGOING' ? 'Chiqim' : 'Boshqa'}
                        </span>
                      )}
                    </div>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <div className="flex items-center gap-1.5 text-brand-muted">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold">
                        {new Date(op.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors ${
                    op.operation_type === 'DELETE' ? 'border-rose-200 bg-rose-50 text-rose-600' :
                    op.operation_type === 'CREATE' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
                    'border-slate-200 bg-white text-brand-muted'
                  }`}>
                    {op.operation_type}
                  </span>
                </div>
                {op.is_archived === 0 && (
                  <button 
                    onClick={() => handleArchive(op.id)}
                    className="p-2.5 bg-slate-50 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all border border-transparent hover:border-brand-primary/10"
                    title="Arxivlash"
                  >
                    <FileDown size={14} className="rotate-180" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OperationsLog;
