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
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE = 'http://localhost:3001/api';

interface Operation {
  id: string;
  operation_type: string;
  entity_type: string;
  entity_name: string;
  description: string;
  created_at: string;
}

export const OperationsLog: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [filterDays, setFilterDays] = useState<string>('7');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOperations = async (days: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/operations?days=${days}`);
      setOperations(res.data);
    } catch (err) {
      console.error('Failed to fetch operations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations(filterDays);
  }, [filterDays]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add support for Uzbek characters if needed, for now using standard
    doc.setFontSize(18);
    doc.text('So\'nggi Tranzaksiyalar Logi', 14, 20);
    doc.setFontSize(10);
    doc.text(`Filtr: Oxirgi ${filterDays} kun`, 14, 30);
    doc.text(`Sana: ${new Date().toLocaleString()}`, 14, 35);

    autoTable(doc, {
      startY: 45,
      head: [['Vaqt', 'Turi', 'Obyekt', 'Tavsif']],
      body: operations.map(op => [
        new Date(op.created_at).toLocaleString(),
        op.operation_type,
        op.entity_name || op.entity_type,
        op.description
      ]),
      styles: { fontSize: 8, font: 'helvetica' },
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`tranzaksiyalar_${filterDays}_kun_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'CREATE': return <Plus size={14} />;
      case 'UPDATE': return <Edit2 size={14} />;
      case 'DELETE': return <Trash2 size={14} />;
      case 'SECURITY': return <ShieldCheck size={14} />;
      case 'LOGIN': return <UserCircle size={14} />;
      case 'INVENTORY': return <Package size={14} />;
      default: return <History size={14} />;
    }
  };

  const getOperationColor = (type: string) => {
    switch (type) {
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
      <div className="p-6 border-b border-brand-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="font-bold text-lg flex items-center gap-2 text-brand-depth">
            <History size={20} className="text-brand-primary" />
            So'nggi Tranzaksiyalar
          </h4>
          <p className="text-[11px] text-brand-muted uppercase font-bold tracking-widest mt-1">Tizimdagi barcha amallar va o'zgarishlar</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
            <select 
              value={filterDays}
              onChange={(e) => setFilterDays(e.target.value)}
              className="pl-9 pr-10 py-2.5 bg-slate-50 border border-brand-border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-primary/10 appearance-none cursor-pointer w-full"
            >
              <option value="1">1 kunlik</option>
              <option value="3">3 kunlik</option>
              <option value="5">5 kunlik</option>
              <option value="7">7 kunlik</option>
              <option value="15">15 kunlik</option>
              <option value="30">30 kunlik</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted">
              <ArrowRight size={12} className="rotate-90" />
            </div>
          </div>
          <button 
            onClick={downloadPDF}
            disabled={operations.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary-dark transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:shadow-none"
          >
            <FileDown size={14} /> PDF Yuklash
          </button>
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
            <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">Tanlangan davr uchun amallar topilmadi.</p>
          </div>
        ) : (
          operations.map((op) => (
            <div key={op.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${getOperationColor(op.operation_type)}`}>
                  {getOperationIcon(op.operation_type)}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-depth group-hover:text-brand-primary transition-colors">{op.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] bg-white border border-brand-border px-2 py-0.5 rounded-md font-black text-brand-muted uppercase tracking-tighter">
                        {op.entity_type}
                      </span>
                      {op.entity_name && (
                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tight">
                          • {op.entity_name}
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
              <div className="hidden sm:block">
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors ${
                  op.operation_type === 'DELETE' ? 'border-rose-200 bg-rose-50 text-rose-600' :
                  op.operation_type === 'CREATE' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
                  'border-slate-200 bg-white text-brand-muted'
                }`}>
                  {op.operation_type}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OperationsLog;
