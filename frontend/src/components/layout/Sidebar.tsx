import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ClipboardCheck, 
  Apple, 
  ChefHat, 
  ShieldCheck, 
  FlaskConical, 
  Smartphone,
  Truck,
  Coins,
  LogOut
} from 'lucide-react';
import { UserRole, NavItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeRole, onRoleChange }) => {
  const { user, logout } = useAuth();

  const allMenuItems: NavItem[] = [
    { id: 'DIRECTOR', label: 'Boshqaruv (Direktor)', icon: LayoutDashboard },
    { id: 'OPERATOR', label: 'Operator', icon: Users },
    { id: 'TEACHER', label: 'Tarbiyachi', icon: ClipboardCheck },
    { id: 'NURSE', label: 'Hamshira', icon: Users },
    { id: 'CHEF', label: 'Oshpaz', icon: ChefHat },
    { id: 'STOREKEEPER', label: 'Omborchi', icon: Package },
    { id: 'INSPECTOR', label: 'Nazorat / Inspektor', icon: ShieldCheck },
    { id: 'LAB_CONTROLLER', label: 'Laboratoriya', icon: FlaskConical },
    { id: 'SUPPLY', label: 'Ta’minotchi', icon: Truck },
    { id: 'FINANCE', label: 'Buxgalteriya', icon: Coins },
  ];

  // If director or admin, show all. Otherwise only their own role.
  const menuItems = (user?.role === 'DIRECTOR' || user?.role === 'ADMIN')
    ? allMenuItems 
    : allMenuItems.filter(item => item.id === user?.role);

  return (
    <div className="w-full h-full bg-white flex flex-col border-r border-brand-border overflow-y-auto custom-scrollbar">
      <div className="p-8 border-b border-brand-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <span className="text-white font-sans font-bold text-xl uppercase tracking-tighter">K</span>
          </div>
          <div>
            <h1 className="text-brand-primary font-sans font-bold text-lg leading-tight uppercase tracking-tight">KinderFlow</h1>
            <p className="text-brand-muted text-[10px] uppercase tracking-widest font-bold">Qashqadaryo MTM Tizimi</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-6 space-y-1 pb-10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onRoleChange(item.id as UserRole)}
            className={`w-full flex items-center gap-3 px-6 py-4 transition-all duration-300 group border-l-[3px] ${
              activeRole === item.id 
                ? 'bg-brand-primary-light text-brand-primary border-brand-primary font-bold shadow-sm' 
                : 'text-brand-slate border-transparent hover:bg-slate-50 hover:text-brand-depth'
            }`}
          >
            <item.icon size={18} className={activeRole === item.id ? 'text-brand-primary' : 'group-hover:scale-110 transition-transform'} />
            <span className="text-sm whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer info or version */}
      <div className="p-6 border-t border-slate-50 mt-auto shrink-0">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors font-bold mb-4"
        >
          <LogOut size={18} />
          <span className="text-sm">Chiqish</span>
        </button>
        <div className="p-4 bg-brand-ghost rounded-xl">
           <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Tizim holati</p>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-brand-depth">Online • v2.4.0</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
