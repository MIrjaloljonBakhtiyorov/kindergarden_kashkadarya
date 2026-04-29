import React from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut,
  UserCircle,
  Menu
} from 'lucide-react';
import { UserRole } from '../../types';
import { ROLES_INFO } from '../../constants/mockData';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  role: UserRole;
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ role, onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <div className="h-20 bg-white border-b border-brand-border flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-40 backdrop-blur-md bg-white/80">
      <div className="flex items-center gap-4 lg:gap-8">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-brand-slate hover:bg-slate-50 rounded-lg lg:hidden transition-colors"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-brand-depth leading-none mb-1">{ROLES_INFO[role]?.label || role}</h2>
          <p className="text-[10px] text-brand-slate uppercase font-bold tracking-widest hidden sm:block">{ROLES_INFO[role]?.description || 'Tizim foydalanuvchisi'}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate group-focus-within:text-brand-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Qidirish..." 
            className="bg-slate-50 border border-brand-border rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:bg-white transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-3 border-l pl-6 border-slate-100">
          <button className="p-2 text-brand-slate hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all relative" title="Bildirishnomalar">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          <button className="p-2 text-brand-slate hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all" title="Sozlamalar">
            <Settings size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 border-l pl-6 border-slate-100">
          <div className="text-right hidden sm:block">
             <p className="text-sm font-bold text-brand-depth leading-none mb-1">{user?.full_name || 'Foydalanuvchi'}</p>
             <p className="text-[10px] text-brand-slate uppercase font-bold tracking-wider">{user?.role === 'DIRECTOR' ? 'Admin / Direktor' : user?.role}</p>
          </div>
          <div className="group relative">
            <button className="w-10 h-10 rounded-xl bg-brand-ghost border border-brand-border flex items-center justify-center font-bold text-xs text-brand-primary overflow-hidden shadow-sm uppercase hover:border-brand-primary transition-colors">
               {user?.login?.substring(0, 2) || 'US'}
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-brand-border py-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
               <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs font-bold text-brand-depth">{user?.full_name}</p>
                  <p className="text-[10px] text-brand-muted uppercase font-bold">{user?.role}</p>
               </div>
               <button className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-slate hover:bg-slate-50 transition-colors">
                  <UserCircle size={16} /> Profil
               </button>
               <button 
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
               >
                  <LogOut size={16} /> Chiqish
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
