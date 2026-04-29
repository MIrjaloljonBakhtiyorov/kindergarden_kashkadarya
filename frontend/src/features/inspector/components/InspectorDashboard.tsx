import React from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Bell,
  User,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend?: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group transition-all"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${color}`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

interface InspectorDashboardProps {
  onNewInspection: () => void;
  audits: any[];
}

export const InspectorDashboard: React.FC<InspectorDashboardProps> = ({ onNewInspection, audits = [] }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Audit & Inspeksiya Markazi</h1>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
            <Activity size={16} className="text-blue-600" />
            Mustaqil audit va sifat nazorati
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Qidirish..." 
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-64 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900">Jasur Akhmedov</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bosh Inspektor</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-200">
              <User size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Dastlabki tahlil</h2>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewInspection}
          className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} /> + YANGI INSPEKSIYA
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard 
          title="Jami auditlar" 
          value={audits.length || 128} 
          icon={FileText} 
          color="bg-blue-600" 
          trend="+12%"
        />
        <KPICard 
          title="Aniqlangan xatolar" 
          value={audits.filter(a => a.overall_result !== 'PASS').length || 14} 
          icon={AlertTriangle} 
          color="bg-red-600" 
        />
        <KPICard 
          title="Muvaffaqiyatli" 
          value={`${audits.length ? Math.round((audits.filter(a => a.overall_result === 'PASS').length / audits.length) * 100) : 92}%`} 
          icon={CheckCircle2} 
          color="bg-emerald-600" 
        />
        <KPICard 
          title="Sifat indeksi" 
          value="4.8/5.0" 
          icon={Activity} 
          color="bg-purple-600" 
        />
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Inspeksiya tarixi</h3>
          </div>
          <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
            <Filter size={20} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] border-b border-slate-100">
                <th className="px-8 py-5">ID & Kategoriya</th>
                <th className="px-8 py-5">Natija</th>
                <th className="px-8 py-5">Sana</th>
                <th className="px-8 py-5">Mas’ul shaxs</th>
                <th className="px-8 py-5">Holat</th>
                <th className="px-8 py-5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {audits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-500 font-bold">Ma'lumotlar topilmadi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                audits.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{a.inspection_id || `AUD-${1000 + i}`}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{a.inspection_type || 'Oshxona'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${a.overall_result === 'PASS' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className={`text-xs font-bold ${a.overall_result === 'PASS' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {a.overall_result === 'PASS' ? 'Muvaffaqiyatli' : 'Xatolar aniqlandi'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-slate-600">{a.created_at || '2026-04-24 14:01'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900">{a.created_by || 'Bosh inspektor'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        a.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {a.status === 'COMPLETED' ? 'Yopilgan' : 'Jarayonda'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="w-8 h-8 inline-flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
