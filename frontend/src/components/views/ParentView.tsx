import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Bell,
  Settings,
  LogOut,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Activity,
  MapPin,
  Calendar,
  UserCheck,
  Target,
  Users,
  ShieldAlert,
  Wallet,
  Star,
  Syringe,
  Apple,
  FileText,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

// Import Section Components
import { SecuritySection } from '../../features/parent-portal/components/SecuritySection';
import { FinanceSection } from '../../features/parent-portal/components/FinanceSection';
import { AttendanceSection } from '../../features/parent-portal/components/AttendanceSection';
import { ProgressSection } from '../../features/parent-portal/components/ProgressSection';
import { MedicalSection } from '../../features/parent-portal/components/MedicalSection';
import { VaccineSection } from '../../features/parent-portal/components/VaccineSection';
import { MenuSection } from '../../features/parent-portal/components/MenuSection';
import { DocumentsSection } from '../../features/parent-portal/components/DocumentsSection';
import { PickupSection } from '../../features/parent-portal/components/PickupSection';
import { MessagesSection } from '../../features/parent-portal/components/MessagesSection';


type SettingsTab = 'profile' | 'security' | 'menu' | 'medical' | 'messages' | 'finance' | 'attendance' | 'documents' | 'pickup' | 'progress' | 'vaccines';

const ParentView = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<SettingsTab>('security');
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [parentData, setParentData] = useState<any>(null);
  const [fullPortalData, setFullPortalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.childId) {
      fetchPortalData(user.childId);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPortalData = async (childId: string) => {
    setLoading(true);
    try {
      const [infoRes, fullRes] = await Promise.all([
        apiClient.get(`/parent-portal/child-info/${childId}`),
        apiClient.get(`/parent-portal/full-data/${childId}`)
      ]);
      setParentData(infoRes.data);
      setFullPortalData(fullRes.data);
    } catch (err) {
      console.error(err);
      showNotification("Ma'lumotlarni yuklashda xatolik", "error");
    } finally {
      setLoading(false);
    }
  };

  const [credentials, setCredentials] = useState({
    login: user?.login || '',
    newPassword: '',
    confirmPassword: ''
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-brand-depth font-black uppercase tracking-widest text-[10px] md:text-xs">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user?.childId || !parentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center border-2 border-rose-100 shadow-xl">
           <ShieldAlert size={40} />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-black text-brand-depth">Hisob bog'lanmagan</h2>
           <p className="text-brand-muted font-bold max-w-sm mx-auto text-sm">Ushbu ota-ona hisobi hali biron bir bola ma'lumotlariga bog'lanmagan.</p>
        </div>
        <button onClick={logout} className="px-8 py-4 bg-brand-depth text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-brand-primary transition-all flex items-center gap-3">
           <LogOut size={16} /> Chiqish
        </button>
      </div>
    );
  }

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.newPassword !== credentials.confirmPassword) {
      showNotification("Parollar mos kelmadi", "error");
      return;
    }
    setIsSaving(true);
    try {
      await apiClient.put(`/parents/${user?.id}`, {
        login: credentials.login,
        password: credentials.newPassword
      });
      showNotification('Ma’lumotlar yangilandi!', 'success');
    } catch (err) {
      showNotification("Xatolik yuz berdi", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const navItems: { id: SettingsTab; label: string; icon: any; color: string }[] = [
    { id: 'security', label: 'Xavfsizlik', icon: ShieldCheck, color: 'blue-500' },
    { id: 'finance', label: 'Moliya', icon: Wallet, color: 'emerald-500' },
    { id: 'attendance', label: 'Davomat', icon: Calendar, color: 'indigo-500' },
    { id: 'progress', label: 'Yutuqlar', icon: Star, color: 'amber-400' },
    { id: 'medical', label: 'Salomatlik', icon: Activity, color: 'rose-500' },
    { id: 'vaccines', label: 'Emlash', icon: Syringe, color: 'sky-500' },
    { id: 'menu', label: 'Menyu', icon: Apple, color: 'orange-500' },
    { id: 'documents', label: 'Hujjatlar', icon: FileText, color: 'slate-500' },
    { id: 'pickup', label: 'Vakillar', icon: UserCheck, color: 'teal-500' },
    { id: 'messages', label: 'Xabarlar', icon: MessageSquare, color: 'brand-primary' },
  ];

  const handleProfileUpdate = () => {
    if (user?.childId) {
      fetchPortalData(user.childId);
    }
  };

  const renderTabContent = () => {
    const data = fullPortalData;

    switch (activeTab) {
      case 'finance': return <FinanceSection data={data} />;
      case 'attendance': return <AttendanceSection data={data} childId={user.childId} onUpdate={handleProfileUpdate} />;
      case 'menu': return <MenuSection data={data} childId={user.childId} />;
      case 'medical': return <MedicalSection parentData={parentData} />;
      case 'vaccines': return <VaccineSection data={data} />;
      case 'progress': return <ProgressSection data={data} />;
      case 'messages': return <MessagesSection />;
      case 'documents': return <DocumentsSection data={data} childId={user.childId} onUpdate={handleProfileUpdate} />;
      case 'pickup': return <PickupSection data={data} onUpdate={handleProfileUpdate} />;
      case 'security':
        return (
          <SecuritySection 
            credentials={credentials} 
            setCredentials={setCredentials} 
            isSaving={isSaving} 
            onUpdate={handleUpdateCredentials} 
          />
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10 bg-slate-50/30 min-h-screen">
      {/* Header Profile Summary - Fully Responsive */}
      <div className="relative p-6 md:p-12 lg:p-16 bg-brand-depth rounded-[2rem] md:rounded-[4rem] text-white shadow-2xl overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-64 md:w-[500px] h-64 md:h-[500px] bg-brand-primary/10 rounded-full blur-[80px] md:blur-[120px] -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12 text-center md:text-left">
          <div className="relative shrink-0">
             <div className="w-24 h-24 md:w-40 md:h-40 rounded-[2rem] md:rounded-[3rem] border-4 border-white/10 p-1 bg-white/5 shadow-2xl flex items-center justify-center">
                <User size={40} className="text-white/20 md:hidden" />
                <User size={64} className="text-white/20 hidden md:block" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-xl flex items-center justify-center border-4 border-brand-depth shadow-lg">
                   <CheckCircle2 size={16} className="text-white" />
                </div>
             </div>
          </div>

          <div className="flex-1 space-y-4 md:space-y-6">
             <div className="space-y-2">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                   <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">{parentData?.first_name} {parentData?.last_name}</h2>
                   <div className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-[8px] md:text-[10px] font-black uppercase rounded-lg tracking-widest border border-brand-primary/30">Premium</div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-8 text-white/60">
                   <p className="font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2">
                      <Users size={16} className="text-brand-primary" /> {parentData?.childGroup}
                   </p>
                   <p className="font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={16} className="text-brand-primary" /> Toshkent
                   </p>
                </div>
             </div>

             <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"><Target size={18} className="text-brand-primary" /></div>
                   <div className="text-left">
                      <p className="text-[8px] font-black text-white/40 uppercase">O'zlashtirish</p>
                      <p className="text-lg font-black leading-none">98.2%</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"><Activity size={18} className="text-emerald-400" /></div>
                   <div className="text-left">
                      <p className="text-[8px] font-black text-white/40 uppercase">Salomatlik</p>
                      <p className="text-lg font-black leading-none">Sog'lom</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="absolute top-4 right-4 md:static">
             <button onClick={logout} className="p-3 md:p-5 bg-white/5 rounded-2xl hover:bg-rose-500 transition-all border border-white/10 group"><LogOut size={20} className="md:w-6 md:h-6" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Navigation - Sidebar for Desktop, Horizontal Scroll for Mobile */}
        <div className="lg:col-span-3">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth px-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 flex items-center gap-3 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                  activeTab === item.id 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105' 
                    : 'bg-white text-brand-muted border border-brand-border'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block bg-white p-6 rounded-[3rem] border border-brand-border shadow-sm space-y-2 sticky top-8">
            <p className="text-[10px] font-black text-brand-depth uppercase tracking-[0.3em] px-6 py-4 border-b border-slate-50 mb-4">Navigatsiya</p>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-[1.8rem] font-black text-xs transition-all group ${
                  activeTab === item.id 
                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-[1.02]' 
                    : 'text-brand-muted hover:bg-slate-50 hover:text-brand-depth'
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-brand-muted group-hover:text-brand-primary'} />
                <span className="uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white p-6 md:p-10 lg:p-16 rounded-[2.5rem] md:rounded-[4rem] lg:rounded-[5rem] border border-brand-border shadow-sm min-h-[600px] relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-4 text-center md:text-left">
               <div>
                  <h1 className="text-2xl md:text-4xl font-black text-brand-depth tracking-tighter uppercase">{navItems.find(n => n.id === activeTab)?.label}</h1>
                  <div className="text-brand-muted text-[8px] md:text-[10px] font-black mt-2 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-2">
                     <div className="w-4 md:w-8 h-px bg-brand-primary/30"></div> Portal Xizmati
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="p-3 md:p-4 bg-brand-ghost rounded-xl md:rounded-2xl text-brand-muted border border-brand-border relative cursor-pointer hover:text-brand-primary">
                     <Bell size={20} md:size={24} />
                     <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="p-3 md:p-4 bg-brand-ghost rounded-xl md:rounded-2xl text-brand-muted border border-brand-border cursor-pointer hover:text-brand-primary">
                     <Settings size={20} md:size={24} />
                  </div>
               </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentView;
