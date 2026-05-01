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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight text-center lg:text-left">Audit & Inspeksiya Markazi</h1>
          <p className="text-slate-500 font-medium mt-1 flex items-center justify-center lg:justify-start gap-2">
            <Activity size={16} className="text-blue-600" />
            Mustaqil audit va sifat nazorati
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Qidirish..." 
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-64 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
            />
          </div>
          <button className="p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-slate-600 hover:bg-slate-50 transition-all relative">
            <Bell size={18} className="sm:w-5 sm:h-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs sm:text-sm font-black text-slate-900">Jasur Akhmedov</p>
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bosh Inspektor</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-600 border border-blue-200">
              <User size={20} className="sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">Dastlabki tahlil</h2>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewInspection}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" /> YANGI INSPEKSIYA
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <KPICard 
          title="Jami auditlar" 
          value={audits.length || 128} 
          icon={FileText} 
          color="bg-blue-600" 
          trend="+12%"
        />
        <KPICard 
          title="Xatolar" 
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
      <div className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-600">
              <FileText size={16} className="sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">Inspeksiya tarixi</h3>
          </div>
          <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
            <Filter size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-100 whitespace-nowrap">
                <th className="px-6 sm:px-8 py-4 sm:py-5">ID & Kategoriya</th>
                <th className="px-6 sm:px-8 py-4 sm:py-5">Natija</th>
                <th className="px-6 sm:px-8 py-4 sm:py-5">Sana</th>
                <th className="px-6 sm:px-8 py-4 sm:py-5 hidden md:table-cell">Mas’ul shaxs</th>
                <th className="px-6 sm:px-8 py-4 sm:py-5">Holat</th>
                <th className="px-6 sm:px-8 py-4 sm:py-5 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {audits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-10 sm:py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Search size={24} className="sm:w-8 sm:h-8" />
                      </div>
                      <p className="text-slate-500 font-bold text-sm">Ma'lumotlar topilmadi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                audits.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                          <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 text-xs sm:text-sm truncate">{a.inspection_id || `AUD-${1000 + i}`}</p>
                          <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{a.inspection_type || 'Oshxona'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${a.overall_result === 'PASS' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className={`text-[10px] sm:text-xs font-bold ${a.overall_result === 'PASS' ? 'text-emerald-600' : 'text-red-600'} whitespace-nowrap`}>
                          {a.overall_result === 'PASS' ? 'OK' : 'Xato'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                      <p className="text-[10px] sm:text-sm font-medium text-slate-600 whitespace-nowrap">{a.created_at?.split(' ')[0] || '2026-04-24'}</p>
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-6 hidden md:table-cell">
                      <p className="text-sm font-bold text-slate-900 truncate">{a.created_by || 'Bosh inspektor'}</p>
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${
                        a.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {a.status === 'COMPLETED' ? 'Yopilgan' : 'Faol'}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-6 text-right">
                      <button className="w-7 h-7 sm:w-8 sm:h-8 inline-flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
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
