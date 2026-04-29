import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { 
  LayoutDashboard, 
  Users, 
  Warehouse, 
  ChefHat, 
  Wallet, 
  Search, 
  Bell, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileText,
  Clock,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Lock,
  Smartphone,
  Globe,
  Trash2,
  Settings,
  Shield,
  CreditCard,
  HelpCircle,
  Eye,
  EyeOff,
  Baby,
  UserCheck,
  FlaskConical,
  CheckCircle2,
  Archive,
  Menu,
  X,
  User,
  Activity,
  Package,
  ShoppingCart,
  Truck,
  BarChart3,
  Clock3,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  ClipboardCheck,
  Zap,
  Coffee,
  Salad,
  Apple,
  Utensils,
  Stethoscope,
  GlassWater,
  ShieldAlert,
  Thermometer,
  Pill,
  Microscope,
  BabyIcon,
  Wind,
  Droplets,
  MicroscopeIcon,
  UserCog,
  ShieldHalf,
  UserCircle,
  Users2,
  ChevronDown,
  Edit2,
  UtensilsCrossed,
  Headset,
  UserCircle2,
  UserSquare2,
  MoreHorizontal,
  Target,
  MoreVertical,
  BadgeDollarSign,
  Mail,
  ShoppingBag,
  CalendarDays,
  ArrowLeft,
  List,
  MapPin,
  XCircle,
  ClipboardList,
  Flame,
  Snowflake,
  TrendingDown,
  Beaker,
  Heart,
  PhoneCall,
  Info,
  LineChart,
  BarChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart as RechartLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartBarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';


/* FILE: /src/index.css */
/*
@import "tailwindcss";

@theme {
  --color-brand-primary: #3B82F6;
  --color-brand-primary-light: #EFF6FF;
  --color-brand-depth: #0F172A;
  --color-brand-ghost: #F8FAFC;
  --color-brand-slate: #64748B;
  --color-brand-muted: #94A3B8;
  --color-brand-border: #E2E8F0;
  --color-brand-emerald: #10B981;
  --color-brand-amber: #F59E0B;
  
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

@layer base {
  body {
    @apply bg-brand-ghost text-brand-depth antialiased select-none;
  }
}

@layer components {
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-brand-border rounded-full hover:bg-brand-muted transition-colors;
  }
}
*/

/* FILE: /src/types.ts */
type UserRole = 
  | 'DIRECTOR' 
  | 'NUTRITIONIST' 
  | 'STOREKEEPER' 
  | 'KITCHEN_MANAGER' 
  | 'FINANCE' 
  | 'INSPECTOR' 
  | 'PARENT' 
  | 'NURSE' 
  | 'LAB' 
  | 'OPERATOR' 
  | 'TEACHER'
  | 'SUPPLY'
  | 'PROFILES';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface Child {
  id: number;
  name: string;
  allergy?: string;
  diet?: string;
  risk?: 'low' | 'medium' | 'high' | 'critical';
}

interface Group {
  name: string;
  children: Child[];
}

interface DishNutrition {
  kcal: number;
  proteins: number;
  fats: number;
  carbs: number;
  starch: number;
  vitamins: string;
}

interface Dish {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'tea' | 'dinner';
  ingredients: string[];
  image: string;
  tech_card: string[];
  nutrition: {
    '1-3': DishNutrition;
    '3-7': DishNutrition;
  };
}

type KitchenStatus = 'BOSHLASH' | 'PISHIRILYAPTI' | 'TAYYOR' | 'SUZISHGA_TAYYOR';

interface KitchenIngredient {
  name: string;
  amount: number;
  unit: string;
  inStock: boolean;
  expiryDate?: string;
  isUrgent?: boolean;
}

interface KitchenTask {
  id: string;
  mealName: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'TEA' | 'DINNER';
  portions: number;
  dietPortions: number;
  originalPortions: number;
  status: KitchenStatus;
  chef?: string;
  startTime?: string;
  completedAt?: string;
  ingredients: KitchenIngredient[];
  alerts?: string[];
  temperatureRecords?: { time: string, temp: number }[];
  hygieneChecks?: { item: string, status: 'OK' | 'ISSUE' }[];
}

type LabSampleStatus = 'COLLECTED' | 'STORED' | 'TESTED' | 'DISCARDED' | 'CRITICAL';
type LabRiskLevel = 'NORMAL' | 'WARNING' | 'CRITICAL';

interface LabSample {
  sample_id: string;
  dish_id: string;
  dish_name: string;
  batch_reference: string;
  date: string;
  storage_location: string;
  storage_duration: number;
  status: LabSampleStatus;
  lab_result?: string;
  risk_level: LabRiskLevel;
  notes?: string;
  created_by: string;
  timestamp: string;
  nutrition: {
    vitamins: string;
    starch: string;
    carbs: string;
    proteins: string;
    fats: string;
    calories: string;
    weight: string;
  };
}

interface Batch {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  receivedDate: string;
  storageLocation: string;
  storageTemp: number;
  supplier: string;
}

interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  batches: Batch[];
  minStock: number;
}

interface Transaction {
  id: string;
  date: string;
  type: 'IN' | 'OUT';
  productName: string;
  quantity: number;
  unit: string;
}

interface ParentUser {
  id: string;
  childName: string;
  fatherName: string;
  childGroup: string;
  login: string;
  password: string;
}

type InspectionType = 'KITCHEN' | 'WAREHOUSE' | 'HYGIENE' | 'SAMPLE';
type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type AuditStatus = 'OPEN' | 'CLOSED';
type ChecklistResult = 'OK' | 'ISSUE';

interface ChecklistItem {
  id: string;
  question: string;
  result: ChecklistResult;
  issueNote?: string;
  severity?: Severity;
}

interface AuditRecord {
  inspection_id: string;
  inspection_type: InspectionType;
  checklist_items: ChecklistItem[];
  overall_result: 'PASS' | 'FAIL' | 'WARNING';
  severity: Severity;
  notes: string;
  attachments: string[];
  created_by: string;
  created_at: string;
  follow_up_date?: string;
  status: AuditStatus;
  kitchen_metrics?: {
    cooking_temp?: number;
    serving_temp?: number;
    serving_time?: string;
  };
}

interface MenuItem {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  ingredients: { name: string; amount: number; unit: string }[];
}

interface DailyMenu {
  date: string;
  breakfast: MenuItem[];
  lunch: MenuItem[];
  teaTime: MenuItem[];
  dinner: MenuItem[];
}

interface FinanceLog {
  id: string;
  date: string;
  category: 'PURCHASE' | 'SALARY' | 'UTILITY' | 'OTHER';
  description: string;
  amount: number;
  type: 'EXPENSE' | 'INCOME';
}

/* FILE: /src/constants/mockData.ts */
const DISH_DATABASE: Dish[] = [];

const INITIAL_GROUPS: Group[] = [];

const INITIAL_KITCHEN_TASKS: KitchenTask[] = [];

const INITIAL_LAB_SAMPLES: LabSample[] = [];

const INITIAL_INVENTORY: InventoryProduct[] = [];

const INITIAL_TRANSACTIONS: Transaction[] = [];

const INITIAL_FINANCE_LOGS: FinanceLog[] = [];

const INITIAL_PARENT_USERS: ParentUser[] = [];

const MOCK_MENU_ITEMS: MenuItem[] = [];

/* FILE: /src/components/layout/Sidebar.tsx */
interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRole, onRoleChange, isOpen, onToggle }) => {
  const menuItems = [
    { id: 'DIRECTOR', label: 'Direktor', icon: BarChart3, color: 'brand-primary' },
    { id: 'OPERATOR', label: 'Operator', icon: Headset, color: 'teal-500' },
    { id: 'TEACHER', label: 'Tarbiyachi', icon: UserCircle2, color: 'blue-500' },
    { id: 'NURSE', label: 'Hamshira', icon: Stethoscope, color: 'cyan-500' },
    { id: 'NUTRITIONIST', label: 'Dietolog', icon: UtensilsCrossed, color: 'emerald-500' },
    { id: 'KITCHEN_MANAGER', label: 'Oshpaz', icon: ChefHat, color: 'indigo-500' },
    { id: 'STOREKEEPER', label: 'Omborchi', icon: Package, color: 'amber-500' },
    { id: 'INSPECTOR', label: 'Tekshiruv', icon: ShieldCheck, color: 'slate-600' },
    { id: 'LAB', label: 'Laboratoriya', icon: Beaker, color: 'orange-500' },
    { id: 'FINANCE', label: 'Tekshiruvchi', icon: Wallet, color: 'rose-500' },
    { id: 'SUPPLY', label: 'Ta\'minot', icon: Truck, color: 'violet-500' },
    { id: 'PARENT', label: 'Ota-ona', icon: Users, color: 'pink-500' },
    { id: 'PROFILES', label: 'Profillar', icon: UserSquare2, color: 'brand-primary' },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-white border-r border-brand-border z-50 transition-all duration-300 flex flex-col shadow-2xl shadow-brand-depth/5 ${isOpen ? 'w-72' : 'w-20'}`}
    >
      <div className="h-20 flex items-center justify-between px-6 border-b border-brand-border bg-brand-ghost/30">
        <div className={`flex items-center gap-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center -rotate-6 shadow-lg shadow-brand-primary/30">
            <BarChart3 className="text-white" size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-brand-depth italic">KINDERCORP</span>
        </div>
        <button 
          onClick={onToggle}
          className="w-10 h-10 rounded-xl hover:bg-brand-primary/10 text-brand-slate hover:text-brand-primary transition-all flex items-center justify-center border border-brand-border bg-white"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6 custom-scrollbar space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onRoleChange(item.id as UserRole)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
              currentRole === item.id 
                ? 'bg-brand-depth text-white shadow-xl shadow-brand-depth/20 scale-[1.02]' 
                : 'text-brand-slate hover:bg-brand-primary/5 hover:text-brand-primary'
            }`}
          >
            <div className={`shrink-0 transition-transform group-hover:scale-110 duration-200 ${isOpen ? '' : 'mx-auto'}`}>
              <item.icon size={isOpen ? 22 : 24} className={currentRole === item.id ? 'text-white' : `text-${item.color}`} />
            </div>
            {isOpen && (
              <div className="flex flex-col items-start overflow-hidden">
                <span className="font-black text-sm tracking-tight whitespace-nowrap">{item.label}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest leading-tight ${currentRole === item.id ? 'text-white/50' : 'text-brand-muted'}`}>
                  Portal
                </span>
              </div>
            )}
            {!isOpen && currentRole === item.id && (
              <div className="absolute right-0 w-1.5 h-6 bg-brand-primary rounded-l-full" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-border bg-slate-50/50">
        <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-colors font-bold ${isOpen ? '' : 'justify-center'}`}>
          <LogOut size={20} />
          {isOpen && <span className="text-sm uppercase tracking-widest font-black">Chiqish</span>}
        </button>
      </div>
    </aside>
  );
};


/* FILE: /src/components/layout/TopBar.tsx */
interface TopBarProps {
  role: string;
}

const TopBar: React.FC<TopBarProps> = ({ role }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const notifications: any[] = [];

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-border px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative group w-full max-w-md hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Tizim bo'ylab qidiruv..." 
            className="w-full bg-brand-ghost border border-brand-border rounded-2xl py-2.5 pl-12 pr-6 text-sm font-medium outline-none focus:ring-4 ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all tracking-tight"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-brand-ghost border border-brand-border rounded-2xl">
          <Calendar className="text-brand-primary" size={18} />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black tracking-widest text-brand-muted leading-none">Bugun</span>
            <span className="text-sm font-black text-brand-depth tracking-tighter">18 Aprel, 2024</span>
          </div>
        </div>

        <div className="relative group">
          <button className="w-12 h-12 bg-brand-ghost border border-brand-border rounded-2xl flex items-center justify-center text-brand-slate hover:bg-brand-primary/10 hover:text-brand-primary transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse shadow-sm shadow-rose-500/20"></span>
          </button>
          
          <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-brand-border opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-brand-depth">Bildirishnomalar</h3>
              <span className="text-[10px] font-black text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded uppercase">3 yangi</span>
            </div>
            <div className="space-y-4">
              {notifications.map((n) => (
                <div key={n.id} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group/item border border-transparent hover:border-slate-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'warning' ? 'bg-amber-50 text-amber-500' : 
                    n.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    <n.icon size={18} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-bold text-brand-depth leading-snug">{n.text}</p>
                    <span className="text-[10px] text-brand-muted font-bold mt-1">2 daqiqa avval</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-slate-50 text-brand-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all">Barchasini ko'rish</button>
          </div>
        </div>

        <div className="h-10 w-px bg-brand-border mx-2"></div>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-4 hover:bg-brand-primary/5 p-2 rounded-2xl transition-all border border-transparent hover:border-brand-primary/10"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[10px] uppercase font-black tracking-widest text-brand-muted leading-none mb-1">Xush kelibsiz</span>
              <span className="text-sm font-black text-brand-depth tracking-tighter">Mirjalol B.</span>
            </div>
            <div className="w-12 h-12 bg-brand-depth border-2 border-brand-primary text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-brand-depth/20 relative">
               M
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <ChevronDown size={16} className={`text-brand-muted transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-4 w-64 bg-white rounded-[2rem] shadow-2xl border border-brand-border p-4 overflow-hidden"
              >
                <div className="p-4 bg-brand-depth text-white rounded-[1.5rem] mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center font-black">M</div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black truncate">Mirjalol Bakhtiyorov</span>
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest truncate">{role}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <button 
                    onClick={() => { setShowEditModal(true); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-brand-depth transition-all group"
                  >
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Edit2 size={16} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider">Profilni tahrirlash</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-brand-depth transition-all group">
                    <div className="p-2 bg-slate-50 text-brand-slate rounded-lg group-hover:bg-brand-depth group-hover:text-white transition-colors">
                      <Settings size={16} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider">Sozlamalar</span>
                  </button>
                  <div className="h-px bg-slate-50 my-1 mx-4"></div>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 text-rose-500 transition-all group">
                    <div className="p-2 bg-rose-50 text-rose-500 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <LogOut size={16} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider">Chiqish</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 bg-brand-depth/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-brand-depth tracking-tight">Loginni tahrirlash</h3>
                    <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-1">Hisob ma'lumotlarini yangilash</p>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all font-black text-xl">
                    &times;
                  </button>
                </div>

                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Foydalanuvchi nomi</label>
                    <div className="relative group">
                       <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" />
                       <input 
                         type="text" 
                         defaultValue="mirjalol_b"
                         className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl py-4 pl-12 pr-6 font-black text-sm outline-none transition-all"
                       />
                    </div>
                  </div>

                  <div className="space-y-4">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Eski Parol</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl py-4 px-6 font-black text-sm outline-none transition-all"
                    />
                   </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Yangi Parol</label>
                    <input 
                      type="password" 
                      placeholder="Yangi parol..."
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl py-4 px-6 font-black text-sm outline-none transition-all"
                    />
                   </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-brand-muted hover:bg-slate-200 transition-all border border-brand-border"
                    >
                      Bekor qilish
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-primary/30"
                    >
                      Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};


/* FILE: /src/components/views/DirectorView.tsx */
const DirectorView: React.FC = () => {
  const [childCount, setChildCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/api/children');
        setChildCount(response.data.length);
      } catch (error) {
        console.error('Error fetching director stats:', error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Umumiy o\'quvchilar', value: childCount.toString(), trend: '0%', type: 'increase', icon: Users, color: 'blue-500' },
    { label: 'Oylik tushum', value: '0', trend: '0%', type: 'increase', icon: Wallet, color: 'emerald-500' },
    { label: 'Kunlik porisya', value: '0', trend: '0%', type: 'decrease', icon: Utensils, color: 'amber-500' },
    { label: 'Xavfsizlik balli', value: '0', trend: '0%', type: 'increase', icon: ShieldCheck, color: 'brand-primary' },
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-depth tracking-tighter">Boshqaruv Paneli</h2>
          <p className="text-brand-muted font-bold text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <Activity size={14} className="text-brand-primary animate-pulse" /> 
            Real vaqt rejimi • 18 Aprel, 2024
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none px-6 py-3.5 bg-white border border-brand-border rounded-2xl font-black text-[10px] uppercase tracking-widest text-brand-slate hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group shadow-sm">
            <Calendar size={16} className="group-hover:text-brand-primary transition-colors" /> Hisobotlar
          </button>
          <button className="flex-1 lg:flex-none px-8 py-3.5 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
            <Zap size={16} /> Eksport
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="group bg-white p-7 rounded-[2.5rem] border border-brand-border shadow-sm hover:shadow-2xl hover:shadow-brand-depth/5 transition-all duration-500 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-${stat.color}/10 transition-colors`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 flex items-center justify-center text-${stat.color} group-hover:scale-110 shadow-lg shadow-${stat.color}/5 transition-all duration-300`}>
                  <stat.icon size={26} strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 font-black text-[10px] tracking-tight px-2.5 py-1 rounded-full ${stat.type === 'increase' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                  {stat.type === 'increase' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.1em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-brand-depth tracking-tighter">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 bg-white rounded-[40px] border border-brand-border shadow-sm overflow-hidden flex flex-col group">
          <div className="p-8 border-b border-brand-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
            <div>
              <h4 className="font-black text-brand-depth uppercase text-sm tracking-widest flex items-center gap-2">
                <ShieldCheck size={18} className="text-brand-primary" /> Xavfsizlik va Sifat Logi
              </h4>
              <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">So'nggi 24 soatlik monitoring</p>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-brand-depth text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-depth/90 transition-all shadow-lg shadow-brand-depth/10">Barchasi</button>
              <button className="px-5 py-2.5 bg-blue-50 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Filtrlash</button>
            </div>
          </div>
          
          <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 text-[10px] text-brand-muted uppercase font-black tracking-widest border-b border-brand-border">
                  <th className="px-8 py-5">Departament</th>
                  <th className="px-8 py-5">Shaxs</th>
                  <th className="px-8 py-5">Vaqt</th>
                  <th className="px-8 py-5">Holat</th>
                  <th className="px-8 py-5 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[].map((row: any, i) => (
                  <tr key={i} className="group/row hover:bg-slate-50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-brand-primary/10"></div>
                        <span className="text-xs font-black text-brand-depth uppercase tracking-wider">{row.dept}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-brand-slate">{row.user}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-brand-muted italic">{row.time}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        row.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        row.type === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {row.type === 'success' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                        {row.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2.5 bg-slate-50 text-brand-muted hover:bg-brand-primary hover:text-white rounded-xl transition-all shadow-sm">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg:col-span-4 space-y-8">
          <div className="bg-brand-depth text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary opacity-20 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-emerald-400" size={24} />
                </div>
                <div>
                  <h5 className="font-black uppercase tracking-widest text-[10px]">Bugun kutilayotgan</h5>
                  <p className="text-2xl font-black italic tracking-tighter">Moliyaviy O'sish</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group-hover:bg-white/10 transition-colors">
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Plan: 0 mln</span>
                     <span className="text-xs font-black text-emerald-400">+0 mln</span>
                   </div>
                   <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }} 
                       animate={{ width: '0%' }} 
                       className="h-full bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                     ></motion.div>
                   </div>
                </div>
                <button className="w-full py-5 bg-white text-brand-depth rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-brand-primary hover:text-white transition-all transform hover:scale-105 active:scale-95">
                  Balansni ko'rish
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/5 group-hover:rotate-12 transition-transform duration-300">
                <Download size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">PDF format</span>
            </div>
            <div>
              <h5 className="text-xl font-black text-brand-depth tracking-tight leading-none mb-2 underline decoration-amber-200 decoration-4 underline-offset-4">Kunlik Analitika</h5>
              <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-6 leading-relaxed">Kecha bo'yicha hisobot tayyor</p>
              <button className="w-full py-4 border-2 border-brand-border text-brand-muted rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2">
                Hisobotni yuklash
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};


/* FILE: /src/components/views/FinanceView.tsx */
const FinanceView: React.FC = () => {
  const [logs, setLogs] = useState<FinanceLog[]>(INITIAL_FINANCE_LOGS);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXPENSES' | 'INCOME' | 'REPORTS'>('OVERVIEW');
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const stats = useMemo(() => {
    const totalIncome = logs.filter(l => l.type === 'INCOME').reduce((s, l) => s + l.amount, 0);
    const totalExpense = logs.filter(l => l.type === 'EXPENSE').reduce((s, l) => s + l.amount, 0);
    const balance = totalIncome - totalExpense;
    const foodCost = logs.filter(l => l.category === 'PURCHASE').reduce((s, l) => s + l.amount, 0);
    const costPerChild = 450 > 0 ? foodCost / 450 : 0; // Assuming 450 children for mock

    return { totalIncome, totalExpense, balance, foodCost, costPerChild };
  }, [logs]);

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Jami Tushum', value: stats.totalIncome, trend: '+15.2%', icon: TrendingUp, color: 'emerald-500', isCurrency: true },
          { label: 'Jami Xarajat', value: stats.totalExpense, trend: '+8.4%', icon: TrendingDown, color: 'rose-500', isCurrency: true },
          { label: 'Sof Foyda', value: stats.balance, trend: '+12.5%', icon: Wallet, color: 'brand-primary', isCurrency: true },
          { label: 'Oziq-ovqat/Bosh', value: stats.costPerChild, trend: '-3.1%', icon: Target, color: 'amber-500', isCurrency: true },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-7 rounded-[2.5rem] border border-brand-border shadow-sm group hover:shadow-xl hover:shadow-brand-depth/5 transition-all duration-500">
             <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-${item.color}/10 flex items-center justify-center text-${item.color} group-hover:scale-110 transition-transform duration-300`}>
                   <item.icon size={24} strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${item.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                   {item.trend.includes('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {item.trend}
                </div>
             </div>
             <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">{item.label}</p>
             <h3 className="text-2xl font-black text-brand-depth tracking-tighter">
                {item.isCurrency ? `${item.value.toLocaleString()} s.` : item.value}
             </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[40px] border border-brand-border shadow-sm overflow-hidden flex flex-col group">
               <div className="p-8 border-b border-brand-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
                  <div>
                    <h4 className="font-black text-brand-depth uppercase text-sm tracking-widest flex items-center gap-2">
                       <FileText size={18} className="text-brand-primary" /> So'nggi tranzaksiyalar
                    </h4>
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Barcha daromad va xarajatlar</p>
                  </div>
                  <button className="text-brand-primary font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-2">
                     Barchasini ko'rish <ArrowRight size={14} />
                  </button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50/30 text-[10px] text-brand-muted uppercase font-black tracking-widest border-b border-brand-border">
                           <th className="px-8 py-5">Tavsif / Sana</th>
                           <th className="px-8 py-5">Kategoriya</th>
                           <th className="px-8 py-5">Summa</th>
                           <th className="px-8 py-5 text-right">Harakat</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {logs.slice(0, 5).map((log) => (
                           <tr key={log.id} className="hover:bg-slate-50 transition-colors group/row">
                              <td className="px-8 py-6">
                                 <div className="flex flex-col">
                                    <span className="text-sm font-black text-brand-depth">{log.description}</span>
                                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-tighter">{log.date}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-brand-slate">
                                    {log.category}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`text-sm font-black ${log.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {log.type === 'INCOME' ? '+' : '-'}{log.amount.toLocaleString()} s.
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <button className="p-2 text-brand-muted hover:text-brand-depth hover:bg-slate-100 rounded-xl transition-all">
                                    <MoreVertical size={16} />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="bg-brand-depth text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                        <BadgeDollarSign className="text-brand-primary" size={24} />
                     </div>
                     <h5 className="font-black uppercase tracking-[0.2em] text-xs italic">Byudjet Nazorati</h5>
                  </div>
                  <div className="space-y-6">
                     {[
                        { label: 'Oziq-ovqat', current: stats.foodCost, limit: 15000000, color: 'brand-primary' },
                        { label: 'Maoshlar', current: 45000000, limit: 50000000, color: 'emerald-400' },
                        { label: 'Kommunal', current: 2500000, limit: 3000000, color: 'amber-400' },
                     ].map((b, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/60">
                              <span>{b.label}</span>
                              <span>{( (b.current / b.limit) * 100 ).toFixed(0)}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                 className={`h-full bg-${b.color} rounded-full`} 
                                 style={{ width: `${(b.current / b.limit) * 100}%` }}
                              ></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm group">
               <h5 className="font-black text-brand-depth uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2">
                  <ShoppingCart size={16} className="text-brand-primary" /> Xarid vs Iste'mol
               </h5>
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-2xl flex items-center justify-center shrink-0">
                        <TrendingUp size={20} />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest leading-none mb-1">Xarid qilindi</p>
                        <p className="text-lg font-black text-brand-depth">12,450,000 s.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                        <CheckCircle2 size={20} />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest leading-none mb-1">Iste'mol qilindi</p>
                        <p className="text-lg font-black text-brand-depth">11,800,000 s.</p>
                     </div>
                  </div>
                  <div className="pt-4 border-t border-slate-50 italic text-[10px] font-bold text-brand-muted">
                     * Farq omborga qoldiq bo'lib tushadi
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-10">
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-depth tracking-tighter">Moliya Nazorati</h2>
          <p className="text-brand-muted font-bold text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            Finance OS • Budget Tracking • Analytics
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none px-6 py-3.5 bg-white border border-brand-border rounded-2xl font-black text-[10px] uppercase tracking-widest text-brand-slate hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group shadow-sm">
            <Download size={16} className="text-brand-primary" /> Hisobot olish
          </button>
          <button 
            onClick={() => setShowAddTransaction(true)}
            className="flex-1 lg:flex-none px-8 py-3.5 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Yangi Tranzaksiya
          </button>
        </div>
      </section>

      <div className="bg-white p-2 rounded-[2rem] border border-brand-border shadow-sm flex flex-wrap gap-1">
        {[
          { id: 'OVERVIEW', label: 'Umumiy ko\'rinish', icon: PieChart },
          { id: 'EXPENSES', label: 'Xarajatlar', icon: TrendingDown },
          { id: 'INCOME', label: 'Tushumlar', icon: TrendingUp },
          { id: 'REPORTS', label: 'Hisobotlar', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest ${
              activeTab === tab.id 
                ? 'bg-brand-depth text-white shadow-xl shadow-brand-depth/20' 
                : 'text-brand-slate hover:bg-slate-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && renderOverview()}

      <AnimatePresence>
         {showAddTransaction && (
            <div className="fixed inset-0 bg-brand-depth/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl overflow-hidden"
               >
                  <div className="flex justify-between items-start mb-10">
                     <div>
                        <h3 className="text-3xl font-black text-brand-depth tracking-tight">Yangi Tranzaksiya</h3>
                        <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-1">Daromad yoki xarajatni kiriting</p>
                     </div>
                     <button onClick={() => setShowAddTransaction(false)} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all font-black text-2xl">
                        &times;
                     </button>
                  </div>

                  <form className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="py-4 rounded-2xl border-2 border-brand-primary bg-blue-50 text-brand-primary font-black text-xs uppercase tracking-widest">
                           XARAJAT
                        </button>
                        <button type="button" className="py-4 rounded-2xl border-2 border-transparent bg-slate-50 text-brand-muted font-black text-xs uppercase tracking-widest hover:bg-slate-100">
                           DAROMAD
                        </button>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Summa (so'm) *</label>
                        <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl py-5 px-6 font-black text-xl outline-none transition-all placeholder:text-slate-300" placeholder="0.00" />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Tavsif *</label>
                        <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl py-4 px-6 font-black text-sm outline-none transition-all" placeholder="Misol: Go'sht xaridi" />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Kategoriya</label>
                           <select className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl py-4 px-4 font-black text-sm outline-none transition-all appearance-none">
                              <option>Oziq-ovqat</option>
                              <option>Maosh</option>
                              <option>Kommunal</option>
                              <option>Inventar</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Sana</label>
                           <input type="date" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl py-4 px-4 font-black text-sm outline-none transition-all" />
                        </div>
                     </div>

                     <button className="w-full py-5 bg-brand-primary text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all mt-4">
                        Saqlash
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};


/* FILE: /src/components/views/InspectorView.tsx */
const InspectorView: React.FC = () => {
  const sections = [
    { title: 'Oshxona Sifat Nazorati', status: 'COMPLETED', score: '98/100', time: '08:45' },
    { title: 'Ombor Inventarizatsiyasi', status: 'IN_PROGRESS', score: '--', time: '10:15' },
    { title: 'Tibbiyot Xonasi Monitoringi', status: 'PENDING', score: '--', time: '13:00' },
    { title: 'Guruhlar Tozaligi', status: 'PENDING', score: '--', time: '15:30' },
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[40px] border border-brand-border">
        <div>
          <h2 className="text-3xl font-black text-brand-depth tracking-tight">Inspeksiya Portali</h2>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1">Davlat standartlari asosida monitoring</p>
        </div>
        <div className="flex gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Sifat Indeksi</span>
              <span className="text-3xl font-black text-emerald-500">96.4%</span>
           </div>
           <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <h3 className="font-black text-brand-depth uppercase text-xs tracking-widest flex items-center gap-2 mb-2">
             <ClipboardList size={18} className="text-brand-primary" /> Bugungi tekshiruvlar rejasi
           </h3>
           <div className="grid grid-cols-1 gap-4">
              {sections.map((sec, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm flex items-center justify-between group hover:border-brand-primary transition-all">
                   <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        sec.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-500' :
                        sec.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-brand-muted'
                      }`}>
                         {sec.status === 'COMPLETED' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                         <h4 className="font-black text-brand-depth">{sec.title}</h4>
                         <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Rejalashtirilgan vaqt: {sec.time}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      {sec.score !== '--' && (
                        <div className="text-right">
                           <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Natija</p>
                           <p className="text-sm font-black text-brand-depth">{sec.score}</p>
                        </div>
                      )}
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        sec.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                        sec.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-brand-slate'
                      }`}>
                         {sec.status}
                      </div>
                      <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-brand-muted group-hover:bg-brand-primary group-hover:text-white transition-all">
                         <ArrowRight size={18} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-brand-depth text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                 <AlertTriangle size={16} className="text-rose-500" /> Kritik muammolar
              </h4>
              <div className="space-y-4">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-xs font-bold leading-relaxed">Omborda harorat 2°C darajaga oshgan. Sut mahsulotlari xavf ostida!</p>
                    <span className="text-[10px] font-black text-rose-500 uppercase mt-2 block">Zudlik bilan choralar</span>
                 </div>
                 <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all">
                    Chora ko'rishni tasdiqlash
                 </button>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm">
              <h4 className="font-black text-brand-depth uppercase text-[10px] tracking-widest mb-6">Inspeksiya tarixi</h4>
              <div className="space-y-4">
                {[
                  { date: '15.04.2024', event: 'Oshxona tekshiruvi', result: 'Ijobiy' },
                  { date: '12.04.2024', event: 'Sut yetkazib beruvchi', result: 'Rad etildi' },
                  { date: '10.04.2024', event: 'Tibbiy ko\'rik', result: 'Ijobiy' },
                ].map((ev, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                     <div>
                        <p className="text-xs font-black text-brand-depth">{ev.event}</p>
                        <span className="text-[10px] font-bold text-brand-muted uppercase">{ev.date}</span>
                     </div>
                     <span className={`text-[9px] font-black uppercase ${ev.result === 'Ijobiy' ? 'text-emerald-500' : 'text-rose-500'}`}>{ev.result}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};


/* FILE: /src/components/views/KitchenManagerView.tsx */
const KitchenManagerView: React.FC = () => {
  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-depth tracking-tighter">Oshxona Nazorati</h2>
          <p className="text-brand-muted font-bold text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            Professional Kitchen OS • Hygiene & Production
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Oshxona Ochiq</span>
          </div>
          <button className="flex-1 md:flex-none px-8 py-3.5 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
            Taomnomani chop etish
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Bugungi porsiyalar', value: '1,350', sub: '3 mahal', icon: Utensils, color: 'brand-primary' },
          { label: 'Tayyorlash vaqti', value: '45 min', sub: 'Tushlikka qadar', icon: Clock, color: 'blue-500' },
          { label: 'Xizmatdagi xodimlar', value: '12', sub: 'Professional', icon: Users, color: 'indigo-500' },
          { label: 'Tadbir tayyorgarligi', value: '85%', sub: 'Bayram taomnoma', icon: Flame, color: 'rose-500' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-7 rounded-[2.5rem] border border-brand-border shadow-sm group hover:shadow-xl transition-all duration-500">
             <div className={`w-14 h-14 rounded-2xl bg-${item.color}/10 flex items-center justify-center text-${item.color} mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon size={26} strokeWidth={2.5} />
             </div>
             <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">{item.label}</p>
             <h3 className="text-3xl font-black text-brand-depth tracking-tighter leading-none mb-1">{item.value}</h3>
             <p className="text-[10px] font-bold text-brand-slate uppercase">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[40px] border border-brand-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-brand-border flex justify-between items-center bg-slate-50/50">
               <div>
                  <h4 className="font-black text-brand-depth uppercase text-sm tracking-widest flex items-center gap-2">
                    <ChefHat size={18} className="text-brand-primary" /> Oshxona Faoliyati
                  </h4>
                  <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Bugungi ishlab chiqarish jarayoni</p>
               </div>
               <span className="px-4 py-1.5 bg-brand-primary-light text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest">Aktiv</span>
            </div>
            <div className="p-8 space-y-6">
               {[
                 { stage: 'Nonushta', time: '08:00 - 09:00', status: 'COMPLETED', progress: 100 },
                 { stage: 'Tushlik', time: '12:30 - 13:30', status: 'IN_PREPARATION', progress: 65 },
                 { stage: 'Polden (Tushlikdan keyingi)', time: '15:30 - 16:00', status: 'WAITING', progress: 0 },
               ].map((item, idx) => (
                 <div key={idx} className="group p-6 rounded-3xl border border-brand-border bg-brand-ghost/30 hover:bg-white hover:shadow-xl hover:border-brand-primary transition-all duration-500">
                    <div className="flex justify-between items-center mb-4">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            item.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-500' :
                            item.status === 'IN_PREPARATION' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-brand-muted'
                          }`}>
                            {item.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Activity size={20} className={item.status === 'IN_PREPARATION' ? 'animate-spin-slow' : ''} />}
                          </div>
                          <div>
                             <h5 className="font-black text-brand-depth text-lg">{item.stage}</h5>
                             <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">{item.time}</p>
                          </div>
                       </div>
                       <button className="text-brand-primary font-black uppercase text-[11px] tracking-widest hover:underline flex items-center gap-2">
                          Detalizatsiya <ArrowRight size={14} />
                       </button>
                    </div>
                    <div className="w-full h-1.5 bg-brand-border rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: `${item.progress}%` }} 
                         className={`h-full rounded-full ${item.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-brand-primary'}`}
                       ></motion.div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        <section className="lg:col-span-4 space-y-8">
           <div className="bg-brand-depth text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                 <Snowflake size={16} className="text-blue-400" /> Sharoit Nazorati
              </h4>
              <div className="space-y-4">
                 <div className="p-5 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group-hover:bg-white/10 transition-colors">
                    <span className="text-xs font-bold text-white/50">Muzlatgich #1</span>
                    <span className="text-xl font-black text-blue-400">-18°C</span>
                 </div>
                 <div className="p-5 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group-hover:bg-white/10 transition-colors">
                    <span className="text-xs font-bold text-white/50">Meva ombori</span>
                    <span className="text-xl font-black text-amber-400">+4°C</span>
                 </div>
                 <button className="w-full py-4 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Barcha sensorlar</button>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <TrendingDown size={24} />
                 </div>
                 <div className="bg-blue-50 px-3 py-1 rounded-full"><span className="text-[10px] font-black text-blue-600 uppercase">-12% Bugun</span></div>
              </div>
              <h5 className="text-xl font-black text-brand-depth tracking-tight leading-none mb-2">Chiqindilar Nazorati</h5>
              <p className="text-xs font-bold text-brand-muted leading-relaxed mb-6 uppercase tracking-widest">Optimallashtirilgan iste'mol tufayli chiqindilar kamaygan</p>
              <div className="space-y-3">
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-black uppercase text-brand-muted">Maksimal Norma</span>
                    <span className="text-xs font-black text-brand-depth">50 kg/kun</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-brand-primary-light rounded-xl border border-brand-primary/10">
                    <span className="text-[10px] font-black uppercase text-brand-primary">Hozirgi holat</span>
                    <span className="text-xs font-black text-brand-primary">12.5 kg</span>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};


/* FILE: /src/components/views/LabView.tsx */
const LabView: React.FC = () => {
  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-brand-depth text-white p-10 rounded-[50px] shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000"></div>
         <div className="relative z-10">
           <h2 className="text-4xl font-black tracking-tighter mb-2 italic">Laboratoriya Nazorati</h2>
           <p className="text-brand-primary font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2">
             <ShieldCheck size={16} className="animate-pulse" /> Sifat va Xavfsizlik Portali
           </p>
         </div>
         <div className="relative z-10 flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
               <FileText size={18} /> Protokollar
            </button>
            <button className="flex-1 md:flex-none px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
               <Zap size={18} /> Yangi Test
            </button>
         </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Bugungi testlar', value: '14 ta', sub: 'Barchasi ijobiy', icon: Microscope, color: 'brand-primary' },
          { label: 'Havo sifati (Indoor)', value: 'AQI 12', sub: 'Ideal holat', icon: Activity, color: 'emerald-500' },
          { label: 'Suv tahlili', value: 'OK', sub: 'Filtrlar barqaror', icon: Beaker, color: 'blue-500' },
          { label: 'Kritik laboratoriya testlar', value: '0 ta', sub: 'Xavfsiz', icon: CheckCircle2, color: 'indigo-500' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm group hover:shadow-xl transition-all duration-500">
             <div className={`w-14 h-14 rounded-2xl bg-${item.color}/10 flex items-center justify-center text-${item.color} mb-6 group-hover:rotate-12 transition-transform`}>
                <item.icon size={26} strokeWidth={2.5} />
             </div>
             <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">{item.label}</p>
             <h3 className="text-3xl font-black text-brand-depth tracking-tighter leading-none">{item.value}</h3>
             <p className="text-[10px] font-bold text-brand-muted uppercase mt-2">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 bg-white rounded-[50px] border border-brand-border shadow-sm overflow-hidden flex flex-col group">
           <div className="p-10 border-b border-brand-border flex justify-between items-center bg-slate-50/50">
              <div>
                 <h4 className="font-black text-brand-depth uppercase text-sm tracking-widest flex items-center gap-2">
                    <FlaskConical size={18} className="text-brand-primary" /> Test Natijalari (Batches)
                 </h4>
                 <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Sertifikatlangan tahlil natijalari</p>
              </div>
              <div className="flex gap-2">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
                    <input className="bg-white border border-brand-border rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase outline-none focus:ring-2 ring-brand-primary/20 w-48 transition-all" placeholder="Batch ID..." />
                 </div>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/30 text-[10px] text-brand-muted uppercase font-black tracking-widest border-b border-brand-border">
                       <th className="px-10 py-6">ID / Mahsulot</th>
                       <th className="px-10 py-6">Parameterlar</th>
                       <th className="px-10 py-6">Vaqt</th>
                       <th className="px-10 py-6">Holat</th>
                       <th className="px-10 py-6 text-right">Protokol</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { id: '#B-9020', name: 'Sut (DairyFresh)', params: 'Yog\'lilik 3.2%, Kislotalilik OK', time: '07:30', status: 'PASS' },
                      { id: '#B-9021', name: 'Go\'sht (Beef-Premium)', params: 'PH 5.6, Bakteriya NEG', time: '08:15', status: 'PASS' },
                      { id: '#B-9025', name: 'Meva (Olma)', params: 'Pestitsidlar NEG, Organoleptika OK', time: '09:00', status: 'PASS' },
                      { id: '#B-9029', name: 'Suv (Markaziy)', params: 'Xlorlanish 0.3mg/l, Minerallar OK', time: '10:00', status: 'PASS' },
                    ].map((row, i) => (
                      <tr key={i} className="group/row hover:bg-brand-primary/[0.02] transition-colors">
                         <td className="px-10 py-7">
                            <div className="flex flex-col">
                               <span className="text-xs font-black text-brand-depth uppercase tracking-widest">{row.id}</span>
                               <span className="text-sm font-bold text-brand-slate">{row.name}</span>
                            </div>
                         </td>
                         <td className="px-10 py-7">
                            <span className="text-xs text-brand-slate font-medium leading-relaxed italic">{row.params}</span>
                         </td>
                         <td className="px-10 py-7">
                            <span className="text-[10px] font-black text-brand-muted">{row.time}</span>
                         </td>
                         <td className="px-10 py-7">
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest w-fit border border-emerald-100">
                               <CheckCircle2 size={12} /> {row.status}
                            </div>
                         </td>
                         <td className="px-10 py-7 text-right">
                            <button className="p-3 bg-slate-50 text-brand-muted rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                               <ArrowRight size={18} />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>

        <section className="lg:col-span-4 space-y-8">
           <div className="bg-white p-10 rounded-[50px] border border-brand-border shadow-sm group">
              <h5 className="font-black text-brand-depth uppercase text-[10px] tracking-[0.2em] mb-8 flex items-center gap-2">
                 <ClipboardCheck size={18} className="text-brand-primary" /> Tibbiy Sinamalar
              </h5>
              <div className="space-y-6">
                 {[
                   { user: 'Oshpazlar (Staff)', test: 'Antisanitariya ko\'rik', label: 'OK', color: 'emerald' },
                   { user: 'Barcha tarbiyachilar', test: 'Salomatlik varaqalari', label: '100%', color: 'blue' },
                   { user: 'Texnik xodimlar', test: 'Yillik ko\'rik', label: 'Aktiv', color: 'indigo' },
                 ].map((t, i) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-[30px] hover:bg-white hover:shadow-xl hover:translate-x-1 transition-all duration-300 border border-transparent hover:border-slate-100">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-brand-depth uppercase tracking-widest leading-none mb-1">{t.user}</span>
                          <span className="text-[11px] font-bold text-brand-muted uppercase tracking-tighter">{t.test}</span>
                       </div>
                       <div className={`px-4 py-1.5 bg-${t.color}-50 text-${t.color}-600 rounded-full text-[10px] font-black border border-${t.color}-100`}>
                          {t.label}
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-5 bg-slate-50 border border-brand-border rounded-3xl font-black text-[10px] uppercase tracking-widest text-brand-muted hover:bg-brand-depth hover:text-white hover:border-brand-depth transition-all duration-500">
                 Barcha hisobotlar
              </button>
           </div>

           <div className="bg-rose-50 border border-rose-100 p-10 rounded-[50px] group relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 space-y-4">
                 <div className="w-14 h-14 bg-white text-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/10 animate-pulse">
                    <AlertCircle size={24} strokeWidth={2.5} />
                 </div>
                 <h5 className="text-xl font-black text-rose-800 tracking-tight leading-none">Eksport Taqiqlangan</h5>
                 <p className="text-rose-700/60 text-xs font-bold uppercase tracking-widest leading-relaxed">Ba'zi sinamalar hali yakunlanmagan. Iltimos tekshirib ko'ring.</p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};


/* FILE: /src/components/views/NurseView.tsx */
const NurseView: React.FC = () => {
  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-depth tracking-tighter">Tibbiyot va Salomatlik</h2>
          <p className="text-brand-muted font-bold text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            Medical Support Port • Health Monitoring
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none px-6 py-3.5 bg-white border border-brand-border rounded-2xl font-black text-[10px] uppercase tracking-widest text-brand-slate hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group shadow-sm">
            <LineChart size={16} className="text-brand-primary" /> Dinamika
          </button>
          <button className="flex-1 lg:flex-none px-8 py-3.5 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
            <PhoneCall size={16} /> Zudlik bilan aloqa
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Bugungi ko\'rik', value: '450 bola', sub: '100% yakunlandi', icon: Stethoscope, color: 'brand-primary' },
          { label: 'O\'rtacha harorat', value: '36.6°C', sub: 'Optimal holat', icon: Thermometer, color: 'emerald-500' },
          { label: 'Sog\'lom ovqatlanish', value: '98%', sub: 'Alergiyasiz', icon: Heart, color: 'rose-500' },
          { label: 'Kutishda', value: '0 ta', sub: 'Barvaqt monitoring', icon: Clock, color: 'amber-500' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-7 rounded-[2.5rem] border border-brand-border shadow-sm group hover:shadow-xl transition-all duration-500">
             <div className={`w-14 h-14 rounded-2xl bg-${item.color}/10 flex items-center justify-center text-${item.color} mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon size={26} strokeWidth={2.5} />
             </div>
             <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">{item.label}</p>
             <h3 className="text-3xl font-black text-brand-depth tracking-tighter leading-none">{item.value}</h3>
             <p className="text-[10px] font-bold text-brand-slate uppercase mt-1">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-[40px] border border-brand-border shadow-sm overflow-hidden flex flex-col group">
              <div className="p-8 border-b border-brand-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
                 <div>
                    <h4 className="font-black text-brand-depth uppercase text-sm tracking-widest flex items-center gap-2">
                       <Activity size={18} className="text-brand-primary" /> Bolalar salomatligi logi
                    </h4>
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Guruhlar kesimida monitoring</p>
                 </div>
                 <div className="relative w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                    <input className="w-full md:w-64 bg-white border border-brand-border rounded-xl py-2.5 pl-12 pr-6 text-xs font-bold outline-none focus:ring-2 ring-brand-primary/20 transition-all font-black uppercase tracking-widest" placeholder="Bola Ismi..." />
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/30 text-[10px] text-brand-muted uppercase font-black tracking-widest border-b border-brand-border">
                          <th className="px-8 py-5">Bola Ismi / Guruh</th>
                          <th className="px-8 py-5">Isitma</th>
                          <th className="px-8 py-5">Holati</th>
                          <th className="px-8 py-5">Dori-darmon</th>
                          <th className="px-8 py-5 text-right">Eslatma</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {[
                         { name: 'Aliyev Ali', group: 'Quyoshcha', temp: '36.5°C', status: 'Sog\'lom', meds: 'Yo\'q', note: 'Oddiy ko\'rik' },
                         { name: 'Valiyev Vali', group: 'Yulduzcha', temp: '36.8°C', status: 'Kuzatuvda', meds: 'Vitamin C', note: 'Engil tumov' },
                         { name: 'Karimova Zilola', group: 'Quyoshcha', temp: '36.6°C', status: 'Sog\'lom', meds: 'Yo\'q', note: 'Foydali' },
                       ].map((row, i) => (
                         <tr key={i} className="hover:bg-slate-50 transition-all duration-300">
                            <td className="px-8 py-6">
                               <div className="flex flex-col">
                                  <span className="text-sm font-black text-brand-depth">{row.name}</span>
                                  <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Guruh: {row.group}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <span className="text-sm font-black text-brand-depth tracking-tighter">{row.temp}</span>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                 row.status === 'Sog\'lom' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                               }`}>
                                 {row.status}
                               </span>
                            </td>
                            <td className="px-8 py-6">
                               <span className="text-xs font-bold text-brand-slate">{row.meds}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <button className="text-brand-primary p-2 hover:bg-brand-primary/10 rounded-xl transition-all"><ArrowRight size={18} /></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </section>

        <section className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm group">
              <div className="flex justify-between items-center mb-6">
                 <h5 className="font-black text-brand-depth uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Users2 size={16} className="text-brand-primary" /> Xodimlar salomatligi
                 </h5>
                 <button className="text-[10px] font-black uppercase text-brand-muted hover:text-brand-primary transition-colors">Tarix</button>
              </div>
              <div className="space-y-4">
                 {[
                   { user: 'Oshpazlar', count: '12 ta', status: 'Afsal' },
                   { user: 'Tarbiyachilar', count: '24 ta', status: 'Afsal' },
                   { user: 'Xizmat xodimlari', count: '8 ta', status: 'Afsal' },
                 ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-brand-primary/20 hover:bg-white transition-all">
                       <span className="text-[10px] font-black uppercase text-brand-muted">{s.user} ({s.count})</span>
                       <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          <span className="text-[10px] font-black uppercase text-brand-depth">{s.status}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-brand-depth text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <AlertCircle className="text-rose-500" size={24} />
                 </div>
                 <h5 className="text-xl font-black tracking-tight leading-none mb-2">Kasallik tarqalishi xavfi</h5>
                 <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-8 leading-relaxed">Tizim orqali prognoz: Past (0.2%)</p>
                 <button className="w-full py-4 bg-emerald-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">Barqaror</button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};


/* FILE: /src/components/views/NutritionistView.tsx */
interface NutritionistViewProps {
  groups: any[];
}

const NutritionistView: React.FC<NutritionistViewProps> = ({ groups }) => {
  const [activeDay, setActiveDay] = useState(1);
  const [activeMeal, setActiveMeal] = useState<'breakfast' | 'lunch' | 'tea' | 'dinner'>('breakfast');
  const [selectedAge, setSelectedAge] = useState<'1-3' | '3-7'>('1-3');
  const [menuType, setMenuType] = useState<'standard' | 'alternative'>('standard');
  const [menu, setMenu] = useState<Record<string, Record<number, Record<string, { standard: string, alternative: string }>>>>({
    '1-3': {
      1: { breakfast: { standard: 'd1', alternative: 'd8' }, lunch: { standard: 'd3', alternative: 'd5' }, tea: { standard: 'd6', alternative: 'd10' }, dinner: { standard: 'd7', alternative: 'd14' } },
      2: { breakfast: { standard: 'd2', alternative: 'd11' }, lunch: { standard: 'd4', alternative: 'd12' }, tea: { standard: 'd6', alternative: 'd13' }, dinner: { standard: 'd7', alternative: 'd14' } },
      3: { breakfast: { standard: 'd8', alternative: 'd1' }, lunch: { standard: 'd9', alternative: 'd3' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd14', alternative: 'd7' } },
      4: { breakfast: { standard: 'd11', alternative: 'd2' }, lunch: { standard: 'd12', alternative: 'd4' }, tea: { standard: 'd13', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd4' } },
      5: { breakfast: { standard: 'd1', alternative: 'd8' }, lunch: { standard: 'd5', alternative: 'd9' }, tea: { standard: 'd6', alternative: 'd10' }, dinner: { standard: 'd14', alternative: 'd7' } },
      6: { breakfast: { standard: 'd2', alternative: 'd11' }, lunch: { standard: 'd3', alternative: 'd12' }, tea: { standard: 'd13', alternative: 'd6' }, dinner: { standard: 'd7', Dealer_alternative: 'd14' } },
      7: { breakfast: { standard: 'd11', alternative: 'd1' }, lunch: { standard: 'd4', alternative: 'd3' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd14', alternative: 'd7' } },
      8: { breakfast: { standard: 'd8', alternative: 'd2' }, lunch: { standard: 'd12', alternative: 'd5' }, tea: { standard: 'd6', alternative: 'd13' }, dinner: { standard: 'd7', alternative: 'd14' } },
      9: { breakfast: { standard: 'd1', alternative: 'd11' }, lunch: { standard: 'd9', alternative: 'd4' }, tea: { standard: 'd13', alternative: 'd10' }, dinner: { standard: 'd14', alternative: 'd7' } },
      10: { breakfast: { standard: 'd2', alternative: 'd8' }, lunch: { standard: 'd3', alternative: 'd9' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd14' } },
    },
    '3-7': {
      1: { breakfast: { standard: 'd1', alternative: 'd8' }, lunch: { standard: 'd3', alternative: 'd5' }, tea: { standard: 'd6', alternative: 'd10' }, dinner: { standard: 'd7', alternative: 'd14' } },
      2: { breakfast: { standard: 'd2', alternative: 'd11' }, lunch: { standard: 'd4', alternative: 'd12' }, tea: { standard: 'd6', alternative: 'd13' }, dinner: { standard: 'd7', alternative: 'd14' } },
      3: { breakfast: { standard: 'd8', alternative: 'd1' }, lunch: { standard: 'd9', alternative: 'd3' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd14', alternative: 'd7' } },
      4: { breakfast: { standard: 'd11', alternative: 'd2' }, lunch: { standard: 'd12', alternative: 'd4' }, tea: { standard: 'd13', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd4' } },
      5: { breakfast: { standard: 'd1', alternative: 'd8' }, lunch: { standard: 'd5', alternative: 'd9' }, tea: { standard: 'd6', alternative: 'd10' }, dinner: { standard: 'd14', alternative: 'd7' } },
      6: { breakfast: { standard: 'd2', alternative: 'd11' }, lunch: { standard: 'd3', alternative: 'd12' }, tea: { standard: 'd13', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd14' } },
      7: { breakfast: { standard: 'd11', alternative: 'd1' }, lunch: { standard: 'd4', alternative: 'd3' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd14', alternative: 'd7' } },
      8: { breakfast: { standard: 'd8', alternative: 'd2' }, lunch: { standard: 'd12', alternative: 'd5' }, tea: { standard: 'd6', alternative: 'd13' }, dinner: { standard: 'd7', alternative: 'd14' } },
      9: { breakfast: { standard: 'd1', alternative: 'd11' }, lunch: { standard: 'd9', alternative: 'd4' }, tea: { standard: 'd13', alternative: 'd10' }, dinner: { standard: 'd14', alternative: 'd7' } },
      10: { breakfast: { standard: 'd2', alternative: 'd8' }, lunch: { standard: 'd3', alternative: 'd9' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd14' } },
    }
  });

  const [status, setStatus] = useState<Record<string, Record<number, 'draft' | 'approved'>>>({
    '1-3': { 1: 'draft', 2: 'draft' },
    '3-7': { 1: 'draft', 2: 'draft' }
  });

  const [manualNutrition, setManualNutrition] = useState<Record<string, Record<number, Record<string, Record<string, { starch: number, carbs: number, vitamins: string }>>>>>({});

  const handleManualNutrientChange = (day: number, meal: string, type: 'standard' | 'alternative', field: 'starch' | 'carbs' | 'vitamins', value: any) => {
    setManualNutrition(prev => ({
      ...prev,
      [selectedAge]: {
        ...(prev[selectedAge] || {}),
        [day]: {
          ...(prev[selectedAge]?.[day] || {}),
          [meal]: {
            ...(prev[selectedAge]?.[day]?.[meal] || {}),
            [type]: {
              ...(prev[selectedAge]?.[day]?.[meal]?.[type] || { starch: 0, carbs: 0, vitamins: '' }),
              [field]: field === 'vitamins' ? value : Number(value)
            }
          }
        }
      }
    }));
  };

  const getNutrient = (day: number, meal: string, type: 'standard' | 'alternative') => {
    const dishId = menu[selectedAge][day]?.[meal]?.[type];
    const dish = DISH_DATABASE.find(d => d.id === dishId);
    const defaults = dish?.nutrition[selectedAge as '1-3' | '3-7'] || { kcal: 0, proteins: 0, fats: 0, carbs: 0, starch: 0, vitamins: '-' };
    const manual = manualNutrition[selectedAge]?.[day]?.[meal]?.[type] || {};
    
    return {
      ...defaults,
      starch: manual.starch ?? defaults.starch,
      carbs: manual.carbs ?? defaults.carbs,
      vitamins: manual.vitamins ?? defaults.vitamins
    };
  };

  const currentDishEntry = menu[selectedAge][activeDay]?.[activeMeal] || { standard: '', alternative: '' };
  const currentDishId = menuType === 'standard' ? currentDishEntry.standard : currentDishEntry.alternative;
  const currentDish = DISH_DATABASE.find(d => d.id === currentDishId);
  const currentNutrition = useMemo(() => getNutrient(activeDay, activeMeal, menuType), [activeDay, activeMeal, menuType, selectedAge, manualNutrition, menu]);

  const conflicts = useMemo(() => {
    if (!currentDish) return [];
    const results: { child: string, group: string, allergen: string }[] = [];
    
    groups.forEach(group => {
      group.children.forEach((child: any) => {
        const matchingAllergen = currentDish.ingredients.find(ing => 
          child.allergy.toLowerCase().includes(ing.toLowerCase())
        );
        if (matchingAllergen) {
          results.push({ child: child.name, group: group.name, allergen: matchingAllergen });
        }
      });
    });
    
    return results;
  }, [currentDish, groups]);

  const handleDishChange = (dishId: string) => {
    setMenu(prev => ({
      ...prev,
      [selectedAge]: {
        ...prev[selectedAge],
        [activeDay]: {
          ...(prev[selectedAge][activeDay] || { standard: '', alternative: '' }),
          [activeMeal]: {
            ...(prev[selectedAge][activeDay]?.[activeMeal] || { standard: '', alternative: '' }),
            [menuType]: dishId
          }
        }
      }
    }));
    setStatus(prev => ({
      ...prev,
      [selectedAge]: {
        ...prev[selectedAge],
        [activeDay]: 'draft'
      }
    }));
  };

  const handleApprove = () => {
    if (conflicts.length > 0) {
      alert("Diqqat! Allergiya konfliktlari mavjud. Iltimos, muammoli bolalar uchun alternativ taom belgilang!");
      return;
    }
    setStatus(prev => ({
      ...prev,
      [selectedAge]: {
        ...prev[selectedAge],
        [activeDay]: 'approved'
      }
    }));
    alert(`Yosh guruhi ${selectedAge}, Kun ${activeDay} menyusi muvaffaqiyatli tasdiqlandi va oshxonaga yuborildi!`);
  };

  return (
    <div className="p-8 animate-in fade-in space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-8 bg-white rounded-3xl border-b-4 border-brand-primary shadow-xl">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full">Oziq-ovqat nazorati</span>
            {status[selectedAge][activeDay] === 'approved' && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                <ShieldCheck size={10} /> Tasdiqlangan
              </span>
            )}
          </div>
          <h2 className="text-4xl font-black text-brand-depth leading-none tracking-tighter">Smart Menyu Rejalashtiruvchi</h2>
          <div className="flex flex-wrap gap-4 mt-4">
             <div className="flex bg-slate-100 p-1 rounded-xl">
               <button 
                 onClick={() => setSelectedAge('1-3')}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedAge === '1-3' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'}`}
               >
                 1-3 yosh
               </button>
               <button 
                 onClick={() => setSelectedAge('3-7')}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedAge === '3-7' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'}`}
               >
                 3-7 yosh
               </button>
             </div>
             <div className="flex bg-brand-primary/5 p-1 rounded-xl border border-brand-primary/10">
               <button 
                 onClick={() => setMenuType('standard')}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${menuType === 'standard' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-primary/60'}`}
               >
                 Asosiy Menyu
               </button>
               <button 
                 onClick={() => setMenuType('alternative')}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${menuType === 'alternative' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-primary/60'}`}
               >
                 Alternativ (Allergiya)
               </button>
             </div>
          </div>
        </div>
        <button 
          disabled={status[selectedAge][activeDay] === 'approved'}
          onClick={handleApprove}
          className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black transition-all transform active:scale-95 text-sm uppercase tracking-widest ${
            status[selectedAge][activeDay] === 'approved'
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-brand-primary text-white shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:-translate-y-0.5'
          }`}
        >
          <ShieldCheck size={20} /> TASDIQLASH
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
            <h3 className="font-black text-xs uppercase tracking-widest text-brand-muted mb-6 flex items-center gap-2">
              <Calendar size={16} className="text-brand-primary" /> Menyu Sikli (10 kun)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i + 1)}
                  className={`p-5 rounded-2xl font-black text-xl transition-all relative ${
                    activeDay === i + 1 
                      ? 'bg-brand-depth text-white shadow-lg scale-105 z-10' 
                      : 'bg-brand-ghost text-brand-muted hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                  {status[selectedAge][i + 1] === 'approved' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                       <CheckCircle2 size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border-2 transition-all ${conflicts.length > 0 ? 'bg-rose-50 border-rose-200 shadow-lg shadow-rose-100' : 'bg-brand-ghost border-transparent'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-black text-xs uppercase tracking-widest flex items-center gap-2 ${conflicts.length > 0 ? 'text-rose-700' : 'text-brand-muted'}`}>
                <ShieldAlert size={18} /> Allergiya Nazorati
              </h3>
            </div>
            {conflicts.length > 0 ? (
              <div className="space-y-3">
                {conflicts.map((conf, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm animate-in slide-in-from-left-2 duration-300">
                    <p className="text-xs font-black text-brand-depth">{conf.child}</p>
                    <p className="text-[10px] text-brand-muted mb-2 font-bold uppercase">{conf.group}</p>
                    <div className="flex items-center gap-1.5 p-2 bg-rose-50 text-rose-700 rounded-xl text-[10px] font-black uppercase">
                       <AlertCircle size={12} /> Ob'ekt: {conf.allergen}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-brand-muted flex flex-col items-center gap-2">
                 <ShieldCheck size={40} className="opacity-20 text-emerald-500" />
                 <p className="text-xs font-bold italic">Barchasi xavfsiz holatda</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-9 space-y-8">
          <div className="flex p-2 bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
            {[
              { id: 'breakfast', label: 'Nonushta', icon: Coffee },
              { id: 'lunch', label: 'Tushlik', icon: Salad },
              { id: 'tea', label: 'Poldnik', icon: Apple },
              { id: 'dinner', label: 'Kechki ovqat', icon: Utensils }
            ].map(meal => (
              <button
                key={meal.id}
                onClick={() => setActiveMeal(meal.id as any)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeMeal === meal.id 
                    ? 'bg-brand-primary text-white shadow-xl' 
                    : 'text-brand-muted hover:bg-slate-50'
                }`}
              >
                {meal.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm space-y-6">
               <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Taom Tanlash ({menuType})</h4>
                 <Utensils size={18} className="text-brand-primary" />
               </div>
               
               <div className="space-y-4">
                  {currentDish && (
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                       <img src={currentDish.image} alt={currentDish.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                       <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-depth to-transparent p-6">
                         <p className="text-white text-lg font-black leading-tight">{currentDish.name}</p>
                       </div>
                    </div>
                  )}
                  <select 
                    value={currentDishId || ''}
                    onChange={(e) => handleDishChange(e.target.value)}
                    className="w-full p-5 bg-brand-ghost border-2 border-transparent focus:border-brand-primary rounded-2xl font-black text-sm outline-none transition-all cursor-pointer shadow-inner"
                  >
                    <option value="">Taomni tanlang...</option>
                    {DISH_DATABASE.filter(d => d.type === activeMeal).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  
                  {currentDish && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {currentDish.ingredients.map(ing => (
                        <span key={ing} className="px-3 py-1 bg-slate-100 text-[10px] font-black text-brand-depth rounded-lg uppercase tracking-wider">
                          {ing}
                        </span>
                      ))}
                    </div>
                  )}
               </div>

               <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-emerald-800 uppercase mb-1">Norma</p>
                    <p className="text-xl font-black text-emerald-900">{selectedAge === '1-3' ? '180' : '250'}gr</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-blue-800 uppercase mb-1">Guruh</p>
                    <p className="text-xl font-black text-blue-900">{selectedAge}</p>
                  </div>
               </div>
            </div>

            <div className="bg-brand-depth rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col">
               <div className="relative z-10 space-y-6 flex-1">
                 <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                   <FileText size={16} /> Texnologik Ko'rsatmalar
                 </h4>
                 
                 {currentDish ? (
                   <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                     {(currentDish.tech_card as string[]).map((step, idx) => (
                       <div key={idx} className="flex gap-4 items-start">
                         <span className="w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center shrink-0 font-black text-[9px] mt-0.5">{idx + 1}</span>
                         <p className="text-xs font-medium text-white/70 leading-relaxed">{step}</p>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-20 opacity-30">
                     <ChefHat size={48} />
                     <p className="text-[10px] font-black uppercase mt-4">Taom tanlanmagan</p>
                   </div>
                 )}
               </div>

               <div className="relative z-10 pt-6 border-t border-white/10 grid grid-cols-4 gap-2 text-center mt-6">
                  <div className="p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] text-white/30 font-black uppercase">KCAL</p>
                    <p className="text-sm font-black text-brand-primary">{currentNutrition?.kcal || 0}</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] text-white/30 font-black uppercase">PROT</p>
                    <p className="text-sm font-black">{currentNutrition?.proteins || 0}</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] text-white/30 font-black uppercase">FAT</p>
                    <p className="text-sm font-black">{currentNutrition?.fats || 0}</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] text-white/30 font-black uppercase">CARB</p>
                    <p className="text-sm font-black">{currentNutrition?.carbs || 0}</p>
                  </div>
               </div>
               <ChefHat size={260} className="absolute -bottom-16 -right-16 text-white/[0.03] rotate-12" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-xl font-black text-brand-depth">Ozuqaviy Moddalar Tahlili</h4>
                  <p className="text-xs text-brand-muted mt-1 uppercase font-bold tracking-widest italic text-amber-600">Kun {activeDay} • {selectedAge} yosh • Tahrirlash mumkin</p>
                </div>
                <FlaskConical size={24} className="text-brand-primary" />
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                   <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-brand-muted uppercase tracking-widest border-b border-brand-border">
                         <th className="px-6 py-4">Taom / Vaqt</th>
                         <th className="px-6 py-4">Kraxmal (gr)</th>
                         <th className="px-6 py-4">Uglevod (gr)</th>
                         <th className="px-6 py-4">Vitaminlar</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {['breakfast', 'lunch', 'tea', 'dinner'].map(meal => {
                         const stdD = DISH_DATABASE.find(d => d.id === menu[selectedAge][activeDay]?.[meal]?.standard);
                         const stdN = getNutrient(activeDay, meal, 'standard');
                         const altD = DISH_DATABASE.find(d => d.id === menu[selectedAge][activeDay]?.[meal]?.alternative);
                         const altN = getNutrient(activeDay, meal, 'alternative');

                         return (
                            <React.Fragment key={meal}>
                               {stdD && (
                                  <tr className="hover:bg-slate-50/50">
                                     <td className="px-6 py-4">
                                        <p className="text-xs font-black text-brand-depth">{stdD.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{meal} • Standart</p>
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="number" value={stdN.starch || 0} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'standard', 'starch', e.target.value)} className="w-16 p-2 bg-brand-ghost border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary" />
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="number" value={stdN.carbs || 0} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'standard', 'carbs', e.target.value)} className="w-16 p-2 bg-brand-ghost border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary" />
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="text" value={stdN.vitamins || ''} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'standard', 'vitamins', e.target.value)} className="w-full min-w-[120px] p-2 bg-brand-ghost border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary" />
                                     </td>
                                  </tr>
                               )}
                               {altD && (
                                  <tr className="bg-brand-primary/[0.02]">
                                     <td className="px-6 py-4 border-l-4 border-brand-primary">
                                        <p className="text-xs font-black text-brand-depth">{altD.name}</p>
                                        <p className="text-[9px] font-black text-brand-primary uppercase">{meal} • Alternativ</p>
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="number" value={altN.starch || 0} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'alternative', 'starch', e.target.value)} className="w-16 p-2 bg-white border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary shadow-sm" />
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="number" value={altN.carbs || 0} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'alternative', 'carbs', e.target.value)} className="w-16 p-2 bg-white border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary shadow-sm" />
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="text" value={altN.vitamins || ''} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'alternative', 'vitamins', e.target.value)} className="w-full min-w-[120px] p-2 bg-white border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary shadow-sm" />
                                     </td>
                                  </tr>
                               )}
                            </React.Fragment>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* FILE: /src/components/views/OperatorView.tsx */
interface OperatorViewProps {
  groups: any[];
  setGroups: React.Dispatch<React.SetStateAction<any[]>>;
}

const OperatorView: React.FC<OperatorViewProps> = ({ groups: initialGroups, setGroups }) => {
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'ADD_CHILD' | 'ADD_STAFF' | 'MANAGE_CHILDREN' | 'MANAGE_STAFF' | 'MANAGE_GROUPS' | 'MANAGE_PARENTS'>('DASHBOARD');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [groups, setLocalGroups] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  const { register, handleSubmit, reset } = useForm();
  const groupForm = useForm();

  useEffect(() => {
    if (editingItem) {
      if (viewMode === 'ADD_CHILD') {
        reset({
          fullName: `${editingItem.first_name} ${editingItem.last_name}`,
          birthDate: editingItem.birth_date,
          ageCategory: editingItem.age_category,
          gender: editingItem.gender,
          certificateNo: editingItem.birth_certificate_number,
          medicalNotes: editingItem.medical_notes,
          fatherName: editingItem.father_full_name || editingItem.father_name,
          fatherPhone: editingItem.father_phone,
          fatherWork: editingItem.father_workplace,
          motherName: editingItem.mother_full_name || editingItem.mother_name,
          motherPhone: editingItem.mother_phone,
          motherWork: editingItem.mother_workplace,
          groupId: editingItem.group_id
        });
      } else if (viewMode === 'ADD_STAFF') {
        reset({
          fullName: editingItem.full_name,
          position: editingItem.position,
          phone: editingItem.phone,
          passportNo: editingItem.passport_no,
          groupId: editingItem.group_id
        });
      }
    } else {
      reset({
        fullName: '',
        birthDate: '',
        ageCategory: '1-3 yosh',
        gender: 'M',
        certificateNo: '',
        medicalNotes: '',
        fatherName: '',
        fatherPhone: '',
        fatherWork: '',
        motherName: '',
        motherPhone: '',
        motherWork: '',
        groupId: '',
        position: '',
        phone: '',
        passportNo: ''
      });
    }
  }, [editingItem, viewMode, reset]);

  useEffect(() => {
    if (editingGroup) {
      groupForm.reset({
        groupName: editingGroup.name,
        teacherName: editingGroup.teacher_name,
        capacity: editingGroup.capacity,
        ageLimit: editingGroup.age_limit
      });
    } else {
      groupForm.reset({
        groupName: '',
        teacherName: '',
        capacity: 25,
        ageLimit: '3-7 yosh'
      });
    }
  }, [editingGroup, groupForm]);

  const handleEdit = (item: any, mode: 'ADD_CHILD' | 'ADD_STAFF') => {
    setEditingItem(item);
    setViewMode(mode);
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setShowGroupModal(true);
  };

  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3001/api/children');
      setChildren(response.data);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3001/api/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchParents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3001/api/parents');
      setParents(response.data);
    } catch (error) {
      console.error('Error fetching parents:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3001/api/groups');
      setLocalGroups(response.data);
      if (setGroups) setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    fetchChildren();
    fetchGroups();
    fetchParents();
    fetchStaff();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (viewMode === 'ADD_CHILD') {
        // Mapping frontend fields to backend fields
        const backendData = {
          first_name: data.fullName.split(' ')[0] || '',
          last_name: data.fullName.split(' ').slice(1).join(' ') || '',
          birth_date: data.birthDate,
          age_category: data.ageCategory,
          gender: data.gender,
          birth_certificate_number: data.certificateNo,
          medical_notes: data.medicalNotes,
          father_full_name: data.fatherName,
          father_phone: data.fatherPhone,
          father_workplace: data.fatherWork,
          mother_full_name: data.motherName,
          mother_phone: data.motherPhone,
          mother_workplace: data.motherWork,
          group_id: data.groupId,
          status: editingItem?.status || 'DRAFT'
        };

        if (editingItem) {
          await axios.put(`http://127.0.0.1:3001/api/children/${editingItem.id}`, backendData);
          alert('Bola muvaffaqiyatli yangilandi!');
        } else {
          await axios.post('http://127.0.0.1:3001/api/children', backendData);
          alert('Bola muvaffaqiyatli qo\'shildi!');
        }
        fetchChildren();
        fetchParents();
      } else if (viewMode === 'ADD_STAFF') {
        const backendData = {
          full_name: data.fullName,
          position: data.position || 'Xodim',
          phone: data.phone || null,
          passport_no: data.passportNo,
          group_id: data.groupId || null,
          email: editingItem?.email || '',
          status: editingItem?.status || 'ACTIVE'
        };

        if (editingItem) {
          await axios.put(`http://127.0.0.1:3001/api/staff/${editingItem.id}`, backendData);
          alert('Xodim muvaffaqiyatli yangilandi!');
        } else {
          await axios.post('http://127.0.0.1:3001/api/staff', backendData);
          alert('Xodim muvaffaqiyatli qo\'shildi!');
        }
        fetchStaff();
      }

      reset();
      setEditingItem(null);
      setViewMode('DASHBOARD');
    } catch (error) {
      console.error('Error in onSubmit:', error);
      alert('Xatolik yuz berdi!');
    }
  };

  const onChildDelete = async (id: string) => {
    if (window.confirm('Haqiqatdan ham ushbu bolani o\'chirmoqchimisiz?')) {
      try {
        await axios.delete(`http://127.0.0.1:3001/api/children/${id}`);
        fetchChildren();
      } catch (error) {
        console.error('Error deleting child:', error);
        alert('O‘chirishda xatolik yuz berdi!');
      }
    }
  };

  const onStaffDelete = async (id: string) => {
    if (window.confirm('Haqiqatdan ham ushbu xodimni o\'chirmoqchimisiz?')) {
      try {
        await axios.delete(`http://127.0.0.1:3001/api/staff/${id}`);
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('O‘chirishda xatolik yuz berdi!');
      }
    }
  };

  const onGroupDelete = async (id: string) => {
    if (window.confirm('Haqiqatdan ham ushbu guruhni o\'chirmoqchimisiz?')) {
      try {
        await axios.delete(`http://127.0.0.1:3001/api/groups/${id}`);
        fetchGroups();
      } catch (error: any) {
        if (error.response?.data?.error?.includes('FOREIGN KEY')) {
          alert('Ushbu guruhni o‘chirib bo‘lmaydi, chunki unda bolalar mavjud.');
        } else {
          alert('O‘chirishda xatolik yuz berdi!');
        }
      }
    }
  };

  const onGroupSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.groupName,
        teacher_name: data.teacherName,
        capacity: parseInt(data.capacity),
        age_limit: data.ageLimit
      };

      if (editingGroup) {
        await axios.put(`http://127.0.0.1:3001/api/groups/${editingGroup.id}`, payload);
        alert('Guruh muvaffaqiyatli yangilandi!');
      } else {
        await axios.post('http://127.0.0.1:3001/api/groups', payload);
        alert('Guruh muvaffaqiyatli yaratildi!');
      }
      groupForm.reset();
      setEditingGroup(null);
      setShowGroupModal(false);
      fetchGroups();
    } catch (error) {
      console.error('Error with group:', error);
      alert('Xatolik yuz berdi!');
    }
  };

  const renderModalContent = () => {
    if (viewMode === 'ADD_CHILD' || viewMode === 'ADD_STAFF') {
      return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="border-b border-brand-border flex items-center justify-between pb-6 mb-8">
            <div>
              <h3 className="text-2xl font-black text-brand-depth">
                {viewMode === 'ADD_CHILD' ? 'Yangi bola kiritish' : 'Yangi xodim kiritish'}
              </h3>
              <p className="text-xs text-brand-slate uppercase font-bold tracking-wider mt-1">Ma'lumotlar butunligi nazoratda</p>
            </div>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
            {/* Section 1: Personal Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-brand-primary border-b border-brand-primary/10 pb-2">
                <UserCircle size={18} />
                <h4 className="font-bold text-sm uppercase tracking-wider">Shaxsiy ma'lumotlar</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">To'liq ism (F.I.Sh) *</label>
                  <input {...register('fullName')} type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="Masalan: Azizov Anvar" required />
                </div>
                {viewMode === 'ADD_CHILD' ? (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Otasining ismi *</label>
                    <input {...register('fatherPatronymic')} type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="Masalan: Anvarovich" />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Passport ma'lumotlari (seriya/raqam) *</label>
                    <input {...register('passportNo')} type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="AA 1234567" required />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">{viewMode === 'ADD_CHILD' ? 'Tug\'ilgan sana *' : 'Telefon raqami (ixtiyoriy)'}</label>
                  {viewMode === 'ADD_CHILD' ? (
                    <input {...register('birthDate')} type="date" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" required />
                  ) : (
                    <input {...register('phone')} type="tel" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="+998 90 123 45 67" />
                  )}
                </div>
                {viewMode === 'ADD_CHILD' ? (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Yosh kategoriyasi *</label>
                    <select {...register('ageCategory')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none appearance-none">
                      <option value="1-3">1 - 3 yosh</option>
                      <option value="3-7">3 - 7 yosh</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5 opacity-50 cursor-not-allowed">
                    <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Guruh (Xodim uchun shart emas)</label>
                    <div className="w-full bg-slate-100 border border-brand-border rounded-xl py-3 px-4 text-xs font-bold text-brand-muted">
                      Biriktirilmagan
                    </div>
                  </div>
                )}
                {viewMode === 'ADD_CHILD' ? (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Tug'ilganlik guvohnomasi № *</label>
                    <input {...register('certificateNo')} type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="AA 1234567" required />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Lavozim *</label>
                    <select {...register('position')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none appearance-none" required>
                      <option value="Tarbiyachi">Tarbiyachi</option>
                      <option value="Oshpaz">Oshpaz</option>
                      <option value="Hamshira">Hamshira</option>
                      <option value="Psixolog">Psixolog</option>
                    </select>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">{viewMode === 'ADD_CHILD' ? 'Jinsi' : 'Staj (yil/oy)'}</label>
                  {viewMode === 'ADD_CHILD' ? (
                    <div className="flex gap-4">
                      <label className="flex-1 bg-slate-50 border border-brand-border rounded-xl py-3 px-4 flex items-center gap-2 cursor-pointer hover:bg-white transition-colors">
                        <input {...register('gender')} type="radio" value="MALE" className="accent-brand-primary" required />
                        <span className="text-sm font-medium">O'g'il</span>
                      </label>
                      <label className="flex-1 bg-slate-50 border border-brand-border rounded-xl py-3 px-4 flex items-center gap-2 cursor-pointer hover:bg-white transition-colors">
                        <input {...register('gender')} type="radio" value="FEMALE" className="accent-brand-primary" required />
                        <span className="text-sm font-medium">Qiz</span>
                      </label>
                    </div>
                  ) : (
                    <input type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="Masalan: 5 yil" />
                  )}
                </div>
                {viewMode === 'ADD_CHILD' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Guruh *</label>
                    <select {...register('groupId')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none appearance-none" required>
                      <option value="">Guruhni tanlang...</option>
                      {groups.map((g: any) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                {viewMode === 'ADD_CHILD' ? (
                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Kasallik varaqasi / Tibbiy qaydlar</label>
                    <textarea {...register('medicalNotes')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none resize-none" rows={3} placeholder="Mavjud kasalliklar yoki allergiyalar..."></textarea>
                  </div>
                ) : (
                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Ma'lumoti va o‘quv yurti *</label>
                    <input type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="Oliy / Tugallanmagan oliy: Universitet nomi" />
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Contact/Parent Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-brand-primary border-b border-brand-primary/10 pb-2">
                <Smartphone size={18} />
                <h4 className="font-bold text-sm uppercase tracking-wider">
                  {viewMode === 'ADD_CHILD' ? 'Ota-ona ma\'lumotlari' : 'Aloqa va Hujjatlar'}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {viewMode === 'ADD_CHILD' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Otasining ismi (F.I.Sh) *</label>
                      <input {...register('fatherName')} type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="Masalan: Azizov Aziz" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Otasining ish joyi</label>
                      <input {...register('fatherWork')} type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="Kompaniya yoki tashkilot nomi" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Otasining telefon raqami *</label>
                      <input {...register('fatherPhone')} type="tel" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="+998 90 123 45 67" required />
                    </div>
                    <div className="hidden md:block col-span-2 h-2"></div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Onasining ismi (F.I.Sh) *</label>
                      <input {...register('motherName')} type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="Masalan: Azizova Aziza" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Onasining ish joyi</label>
                      <input {...register('motherWork')} type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="Kompaniya yoki tashkilot nomi" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Onasining telefon raqami *</label>
                      <input {...register('motherPhone')} type="tel" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="+998 90 123 45 67" required />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Aloqa raqami *</label>
                      <input type="tel" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-primary/10 outline-none" placeholder="+998 90 123 45 67" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-muted uppercase ml-1">Hujjat yuklash (Passport/Guvohnoma)</label>
                      <div className="relative border-2 border-dashed border-brand-border rounded-xl p-2 hover:bg-slate-50 transition-colors h-12 flex items-center justify-center">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="flex items-center gap-2 text-brand-muted">
                          <Plus size={16} />
                          <span className="text-xs font-bold uppercase">Faylni tanlang</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-brand-border">
              <button type="button" className="w-full sm:w-auto px-6 py-3 rounded-xl border border-brand-border text-brand-slate font-bold hover:bg-slate-50 transition-colors">Draft sifatida saqlash</button>
              <button type="submit" className="w-full sm:w-auto px-10 py-3 rounded-xl bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2">Tasdiqlashga yuborish <ArrowRight size={18} /></button>
            </div>
          </form>
        </div>
      );
    }

    if (viewMode === 'MANAGE_CHILDREN' || viewMode === 'MANAGE_STAFF' || viewMode === 'MANAGE_GROUPS' || viewMode === 'MANAGE_PARENTS') {
      const isChildren = viewMode === 'MANAGE_CHILDREN';
      const isStaff = viewMode === 'MANAGE_STAFF';
      const isGroups = viewMode === 'MANAGE_GROUPS';
      const isParents = viewMode === 'MANAGE_PARENTS';
      
      return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="border-b border-brand-border flex items-center justify-between pb-6 mb-8">
              <div>
                <h3 className="text-2xl font-black text-brand-depth">
                  {isChildren ? 'Bolalar ruyxati' : isStaff ? 'Xodimlar ruyxati' : isGroups ? 'Guruhlar boshqaruvi' : 'Ota-onalar parollari va ID'}
                </h3>
              </div>
           </div>
           
           <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              {isGroups ? (
                <div className="p-8">
                   <button 
                     onClick={() => { setEditingGroup(null); setShowGroupModal(true); }} 
                     className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold mb-6 shadow-lg shadow-brand-primary/10"
                   >
                     + Yangi guruh yaratish
                   </button>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {groups.map((g: any) => (
                        <div key={g.id} className="p-4 bg-slate-50 rounded-2xl border border-brand-border flex items-center justify-between group hover:border-brand-primary transition-all">
                           <span className="font-black text-brand-depth">{g.name}</span>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => handleEditGroup(g)}
                               className="text-brand-primary text-[10px] font-black uppercase hover:underline"
                             >
                               Tahrirlash
                             </button>
                             <button onClick={() => onGroupDelete(g.id)} className="text-rose-500 text-[10px] font-black uppercase hover:underline">O‘chirish</button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              ) : isParents ? (
                <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[1200px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-brand-border text-[11px] text-brand-muted uppercase font-bold tracking-wider">
                           <th className="px-6 py-4">ID</th>
                           <th className="px-6 py-4">Bola F.I.Sh</th>
                           <th className="px-6 py-4">Otasi F.I.Sh</th>
                           <th className="px-6 py-4">Nomeri (Ota)</th>
                           <th className="px-6 py-4">Onasi F.I.Sh</th>
                           <th className="px-6 py-4">Nomeri (Ona)</th>
                           <th className="px-6 py-4">Guruhi</th>
                           <th className="px-6 py-4">Login</th>
                           <th className="px-6 py-4">Parol</th>
                           <th className="px-6 py-4 text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {parents.map((parent) => (
                           <tr key={parent.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-5 text-[10px] font-black text-brand-primary">#{parent.id.slice(0, 8)}</td>
                              <td className="px-6 py-5 text-sm font-black text-brand-depth">{parent.childName}</td>
                              <td className="px-6 py-5 text-xs font-bold text-brand-slate">{parent.fatherName}</td>
                              <td className="px-6 py-5 text-xs font-medium text-brand-muted">{parent.fatherPhone}</td>
                              <td className="px-6 py-5 text-xs font-bold text-brand-slate">{parent.motherName}</td>
                              <td className="px-6 py-5 text-xs font-medium text-brand-muted">{parent.motherPhone}</td>
                              <td className="px-6 py-5">
                                 <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase rounded-lg">
                                    {parent.childGroup || 'Noma\'lum'}
                                 </span>
                              </td>
                              <td className="px-6 py-5 text-xs font-mono text-brand-muted">{parent.login}</td>
                              <td className="px-6 py-5 text-xs font-mono text-brand-muted">{parent.password}</td>
                              <td className="px-6 py-5 text-right space-x-2">
                                <button className="text-brand-primary font-black text-[9px] uppercase hover:underline">Tahrirlash</button>
                                <button className="text-rose-500 font-black text-[9px] uppercase hover:underline">Reset</button>
                              </td>
                           </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[900px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-brand-border text-[11px] text-brand-muted uppercase font-bold tracking-wider">
                        <th className="px-6 py-4">F.I.Sh</th>
                        <th className="px-6 py-4">Passport</th>
                        <th className="px-6 py-4">Tel. raqami</th>
                        <th className="px-6 py-4">Guruhi</th>
                        <th className="px-6 py-4">Bolalar soni</th>
                        <th className="px-6 py-4">Lavozimi</th>
                        <th className="px-6 py-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(isChildren ? children : staff).map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors px-2">
                          <td className="px-6 py-5 font-black text-sm text-brand-depth">{isChildren ? `${item.first_name} ${item.last_name}` : item.full_name}</td>
                          <td className="px-6 py-5 text-sm font-medium text-brand-muted">{isChildren ? (item.group_name || 'Guruhsiz') : (item.passport_no || 'Kiritilmagan')}</td>
                          <td className="px-6 py-5 text-sm font-medium text-brand-muted">{isChildren ? (item.father_phone || item.mother_phone) : (item.phone || 'Kiritilmagan')}</td>
                          <td className="px-6 py-5 text-sm font-bold text-brand-primary">{!isChildren ? (item.group_name || 'Guruhsiz') : (item.medical_notes || 'Yo\'q')}</td>
                          <td className="px-6 py-5 text-sm font-black text-center">{!isChildren ? (item.child_count || 0) : '-'}</td>
                          <td className="px-6 py-5 text-sm font-medium text-brand-muted">{!isChildren ? (item.position || 'Xodim') : 'BOLA'}</td>
                          <td className="px-6 py-5 text-right space-x-2">
                            <button 
                              onClick={() => handleEdit(item, isChildren ? 'ADD_CHILD' : 'ADD_STAFF')}
                              className="text-brand-primary font-black text-[9px] uppercase hover:underline"
                            >
                              Tahrirlash
                            </button>
                            <button 
                              onClick={() => isChildren ? onChildDelete(item.id) : onStaffDelete(item.id)}
                              className="text-rose-500 font-black text-[9px] uppercase hover:underline"
                            >
                              O‘chirish
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
           </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 p-8">
      <div className="flex flex-wrap items-center gap-4">
        <button 
          onClick={() => { setEditingItem(null); setViewMode('ADD_CHILD'); }} 
          className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={18}/> Yangi bola
        </button>
        <button 
          onClick={() => { setEditingItem(null); setViewMode('ADD_STAFF'); }} 
          className="bg-white text-brand-depth border border-brand-border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <Plus size={18}/> Yangi xodim
        </button>
        <button onClick={() => setViewMode('MANAGE_CHILDREN')} className="bg-white text-brand-depth border border-brand-border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"><Users size={18}/> Bolalar</button>
        <button onClick={() => setViewMode('MANAGE_STAFF')} className="bg-white text-brand-depth border border-brand-border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"><UserCircle size={18}/> Xodimlar</button>
        <button onClick={() => setViewMode('MANAGE_GROUPS')} className="bg-white text-brand-depth border border-brand-border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"><Package size={18}/> Guruhlar</button>
        <button onClick={() => setViewMode('MANAGE_PARENTS')} className="bg-white text-brand-depth border border-brand-border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"><ShieldCheck size={18}/> Ota-onalar</button>
        
        <div className="flex-1"></div>
        <button className="bg-brand-primary/10 text-brand-primary px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 uppercase tracking-wider hover:bg-brand-primary/20 transition-colors"><Package size={16} /> Excel Import</button>
      </div>

      {/* Main Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-brand-primary rounded-lg"><LogOut size={20} className="rotate-180" /></div>
            <span className="text-xs font-bold text-brand-emerald bg-brand-emerald/10 px-2 py-1 rounded-full">+{children.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length} bugun</span>
          </div>
          <p className="text-brand-muted text-[11px] font-bold uppercase tracking-wider mb-1">Jami kiritilganlar</p>
          <h3 className="text-2xl font-bold text-brand-depth">{children.length} ta</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm border-l-4 border-l-brand-amber text-brand-depth">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 text-brand-amber rounded-lg"><ClipboardCheck size={20} /></div>
            <span className="text-xs font-bold text-brand-amber">{children.filter(c => c.status === 'DRAFT').length} kutilmoqda</span>
          </div>
          <p className="text-brand-muted text-[11px] font-bold uppercase tracking-wider mb-1 text-brand-muted">Draft holatida</p>
          <h3 className="text-2xl font-bold">{children.filter(c => c.status === 'DRAFT').length} ta</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><AlertCircle size={20} /></div>
            <span className="text-xs font-bold text-rose-500">0 ta xatolik</span>
          </div>
          <p className="text-brand-muted text-[11px] font-bold uppercase tracking-wider mb-1">Rad etilganlar</p>
          <h3 className="text-2xl font-bold text-brand-depth">0 ta</h3>
        </div>
      </div>

      {/* Recents table */}
      <div className="bg-white rounded-xl border border-brand-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <h4 className="font-bold text-base">So'nggi operatsiyalar</h4>
           <div className="flex gap-2">
              <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-tighter rounded-lg bg-brand-primary text-white">Hammasi</button>
              <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-tighter rounded-lg text-brand-slate hover:bg-slate-50">Kutilayotgan</button>
              <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-tighter rounded-lg text-brand-slate hover:bg-slate-50">Draft</button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-brand-border text-[11px] text-brand-muted uppercase font-bold tracking-wider">
                 <th className="px-8 py-4">Nom / F.I.Sh</th>
                 <th className="px-8 py-4">Tur</th>
                 <th className="px-8 py-4">Sana</th>
                 <th className="px-8 py-4 text-right">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[].map((i: any) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-[10px] text-brand-slate">
                        {i === 1 ? 'AA' : i === 2 ? 'KV' : 'SB'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-depth">{i === 1 ? 'Azizov Anvar' : i === 2 ? 'Karimov Valijon' : 'Samatov Behzod'}</p>
                        <p className="text-[10px] text-brand-slate italic">Qo'shish operatsiyasi</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${i === 1 || i === 3 ? 'bg-blue-50 text-brand-primary' : 'bg-brand-amber/10 text-brand-amber'}`}>
                      {i === 1 || i === 3 ? 'BOLA' : 'XODIM'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-[11px] text-brand-muted font-bold">24-May, 2024</td>
                  <td className="px-8 py-4 text-right px-8">
                     <div className="flex items-center justify-end gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${i === 3 ? 'bg-brand-amber' : 'bg-brand-emerald'}`}></div>
                        <span className={`text-[10px] font-black uppercase ${i === 3 ? 'text-brand-amber' : 'text-brand-emerald'}`}>
                          {i === 3 ? 'Draft' : 'Tasdiqlangan'}
                        </span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay for Operator Views */}
      {viewMode !== 'DASHBOARD' && (
        <div className="fixed inset-0 bg-brand-depth/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 lg:p-12 animate-in fade-in duration-300">
           <div className="bg-slate-50 w-full max-w-6xl h-full max-h-[90vh] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border border-white/20">
              {/* Modal Header */}
              <div className="absolute top-6 right-8 z-10">
                <button 
                  onClick={() => setViewMode('DASHBOARD')}
                  className="w-10 h-10 bg-white shadow-lg border border-brand-border rounded-full flex items-center justify-center text-brand-depth hover:bg-rose-50 hover:text-rose-500 hover:scale-110 transition-all active:scale-95 group"
                >
                  <span className="font-black text-xl leading-none group-hover:rotate-90 transition-transform">&times;</span>
                </button>
              </div>

              {/* Modal Content Scrollable Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                 {renderModalContent()}
              </div>

              {/* Internal Modal for Group Creation (Nested) */}
              {showGroupModal && (
                <div className="fixed inset-0 bg-brand-depth/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     className="bg-white w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl border border-brand-border"
                   >
                      <form onSubmit={groupForm.handleSubmit(onGroupSubmit)} className="space-y-6">
                        <div>
                          <h3 className="text-xl font-black text-brand-depth">Yangi guruh yarating</h3>
                          <p className="text-xs text-brand-muted mt-1 uppercase font-bold tracking-widest">Guruh parametrlarini kiriting</p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-muted uppercase ml-1 tracking-widest">Guruh nomi</label>
                            <input {...groupForm.register('groupName')} type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-bold text-sm" placeholder="Masalan: Shaffoflar" required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-muted uppercase ml-1 tracking-widest">Mas'ul tarbiyachi</label>
                            <input {...groupForm.register('teacherName')} type="text" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-bold text-sm" placeholder="F.I.Sh" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1 tracking-widest">Kvota (Soni)</label>
                              <input {...groupForm.register('capacity')} type="number" className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-bold text-sm" placeholder="25" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-brand-muted uppercase ml-1 tracking-widest">Yosh chegarasi</label>
                              <select {...groupForm.register('ageLimit')} className="w-full bg-slate-50 border border-brand-border rounded-xl py-3 px-4 outline-none appearance-none font-bold text-sm">
                                 <option value="1-3 yosh">1-3 yosh</option>
                                 <option value="3-7 yosh">3-7 yosh</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 flex gap-3">
                          <button type="button" onClick={() => setShowGroupModal(false)} className="flex-1 py-4 border border-brand-border rounded-2xl font-black text-brand-muted hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest">Bekor qilish</button>
                          <button type="submit" className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all uppercase text-[10px] tracking-widest">Guruhni yaratish</button>
                        </div>
                      </form>
                   </motion.div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};


const ParentView: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 p-10 bg-white rounded-[40px] border border-brand-border shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
         
         <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
               <User size={64} className="text-brand-slate" />
            </div>
            <button className="absolute bottom-1 right-1 w-10 h-10 bg-brand-primary text-white rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
               <Settings size={18} />
            </button>
         </div>

         <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <h2 className="text-3xl font-black text-brand-depth tracking-tight">Azizov Aziz</h2>
               <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                  <ShieldCheck size={12} /> Faol
               </span>
            </div>
            <p className="text-brand-slate font-medium text-lg italic opacity-70">Azizov Anvarning otasi</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-brand-primary"><Smartphone size={16} /></div>
                  <span className="text-xs font-black text-brand-depth">+998 90 123 45 67</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-brand-primary"><Globe size={16} /></div>
                  <span className="text-xs font-black text-brand-depth">Toshkent, Chilonzor</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Settings */}
        <div className="lg:col-span-8 space-y-6">
           {/* Security Settings */}
           <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                 <div>
                    <h3 className="text-xl font-black text-brand-depth">Xavfsizlik va Kirish</h3>
                    <p className="text-[10px] text-brand-muted uppercase font-bold tracking-[0.2em] mt-1">Parol va kirish huquqlarini boshqarish</p>
                 </div>
                 <Lock className="text-brand-primary" size={24} />
              </div>

              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Joriy Parol</label>
                       <div className="relative group">
                          <input 
                            type="password" 
                            className="w-full bg-brand-ghost border border-brand-border rounded-2xl py-4 px-6 focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-mono" 
                            placeholder="••••••••"
                          />
                          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary transition-colors">
                             <Eye size={18} />
                          </button>
                       </div>
                    </div>
                    <div className="space-y-3 opacity-50">
                       <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Yangi Parol</label>
                       <div className="relative">
                          <input 
                            disabled
                            type="password" 
                            className="w-full bg-slate-50 border border-brand-border rounded-2xl py-4 px-6 outline-none font-mono" 
                            placeholder="••••••••"
                          />
                          <button disabled className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                             <EyeOff size={18} />
                          </button>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 items-start">
                    <Shield className="text-amber-600 shrink-0 mt-1" size={20} />
                    <div className="space-y-1">
                       <p className="text-xs font-black text-amber-900 uppercase tracking-tight leading-none">Ikki bosqichli autentifikatsiya</p>
                       <p className="text-[10px] text-amber-700 font-medium leading-relaxed opacity-80">Hisobingiz xavfsizligini oshirish uchun SMS orqali tasdiqlashni yoqing.</p>
                       <button className="text-[10px] font-black text-brand-primary uppercase hover:underline pt-2">Hoziroq yoqish</button>
                    </div>
                 </div>

                 <button className="w-full md:w-auto px-10 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all active:scale-95">Parolni yangilash</button>
              </div>
           </div>

           {/* Notification Preferences */}
           <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                 <div>
                    <h3 className="text-xl font-black text-brand-depth">Bildirishnomalar</h3>
                    <p className="text-[10px] text-brand-muted uppercase font-bold tracking-[0.2em] mt-1">Sizga qanday ma'lumotlar borishi kerak?</p>
                 </div>
                 <Bell className="text-brand-primary" size={24} />
              </div>

              <div className="space-y-4">
                 {[
                   { title: 'Davomat haqida bildirishnoma', desc: 'Bola bog‘chaga kelgan va ketganda darhol xabar olish', active: true },
                   { title: 'Oshxona menyusi', desc: 'Kunlik ovqatlanish tartibi va allergiyalar haqida ma’lumot', active: true },
                   { title: 'Moliyaviy to\'lovlar', desc: 'Kvitansiyalar va to‘lov muddati yaqinlashganda ogohlantirish', active: false },
                   { title: 'Sog\'liq va tibbiyot', desc: 'Hamshira ko‘rigi va sog‘liq holati haqida maxsus qaydlar', active: true },
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between p-6 bg-brand-ghost rounded-3xl border border-transparent hover:border-brand-primary/10 transition-all group">
                      <div className="space-y-1">
                         <p className="text-xs font-black text-brand-depth uppercase tracking-tight">{item.title}</p>
                         <p className="text-[10px] text-brand-muted font-medium">{item.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full relative transition-all duration-300 ${item.active ? 'bg-brand-primary' : 'bg-slate-200'}`}>
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${item.active ? 'left-7' : 'left-1'}`}></div>
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column Misc */}
        <div className="lg:col-span-4 space-y-8">
           {/* Account Summary Card */}
           <div className="bg-brand-depth p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10 space-y-8">
                 <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                       <CreditCard size={24} className="text-brand-primary" />
                    </div>
                    <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10">ID: 481,200</span>
                 </div>
                 
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Oylik to'lov balansi</p>
                    <h4 className="text-4xl font-black tracking-tight tracking-tighter">0.00 <span className="text-xl text-white/40">UZS</span></h4>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-4">
                       <span className="text-white/40">Oxirgi to'lov</span>
                       <span className="text-brand-emerald">1-Aprel, 2024</span>
                    </div>
                    <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-brand-primary/20 active:scale-95">Hisobni to'ldirish</button>
                 </div>
              </div>
           </div>

           {/* Quick Action Links */}
           <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm space-y-6">
              <h4 className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Foydali bo'limlar</h4>
              <div className="space-y-2">
                 {[
                   { icon: HelpCircle, label: 'Yordam markazi', color: 'text-brand-primary', bg: 'bg-blue-50' },
                   { icon: Shield, label: 'Maxfiylik siyosati', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                   { icon: Trash2, label: 'Hisobni o‘chirish', color: 'text-rose-500', bg: 'bg-rose-50' },
                 ].map((link, idx) => (
                   <button key={idx} className="w-full flex items-center justify-between p-4 bg-brand-ghost rounded-2xl border border-transparent hover:border-brand-border hover:bg-white transition-all group">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 ${link.bg} ${link.color} rounded-xl flex items-center justify-center`}>
                            <link.icon size={20} />
                         </div>
                         <span className="text-xs font-black text-brand-depth uppercase tracking-tight">{link.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-brand-muted group-hover:translate-x-1 transition-transform" />
                   </button>
                 ))}
              </div>
           </div>

           {/* Child Quick Info Card */}
           <div className="p-1 w-full bg-gradient-to-br from-brand-primary to-indigo-600 rounded-[44px] shadow-xl">
              <div className="bg-white p-8 rounded-[40px] space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-3xl overflow-hidden flex items-center justify-center font-black text-2xl text-brand-slate">AA</div>
                    <div>
                       <h5 className="font-black text-brand-depth leading-none">Azizov Anvar</h5>
                       <p className="text-[10px] font-black text-brand-primary uppercase mt-1 tracking-widest">Shaffoflar guruhi</p>
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-brand-muted uppercase">Bugungi davomat</span>
                       <span className="text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-full font-black uppercase">Kelgan (08:12)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-brand-muted uppercase">Sog'liq holati</span>
                       <span className="text-brand-primary font-black uppercase italic">A'lo (36.6°)</span>
                    </div>
                 </div>

                 <button className="w-full py-4 bg-brand-ghost text-brand-depth border border-brand-border rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    Profilni ko'rish <ChevronRight size={14} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};



const ProfilesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'children' | 'parents' | 'staff'>('children');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  // Flatten children from groups for the list
  const allChildren = INITIAL_GROUPS.flatMap(group => 
    group.children.map(child => ({ ...child, groupName: group.name }))
  );

  const mockParents = [
    { id: 1, name: 'Azizov Aziz', child: 'Azizov Anvar', phone: '+998 90 123 45 67', status: 'Active', lastActive: '2 min avval' },
    { id: 2, name: 'Karimova Malika', child: 'Karimov Valijon', phone: '+998 93 987 65 43', status: 'Active', lastActive: 'Bugun, 09:45' },
    { id: 3, name: 'Samatov Orif', child: 'Samatov Behzod', phone: '+998 97 444 22 11', status: 'Inactive', lastActive: '3 kun avval' },
  ];

  const filteredData = activeTab === 'children' 
    ? allChildren.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockParents.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-10 bg-white rounded-[40px] border border-brand-border shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
         
         <div className="relative z-10">
            <h2 className="text-4xl font-black text-brand-depth tracking-tighter leading-none mb-2">Profil Boshqaruvi</h2>
            <p className="text-[10px] text-brand-muted uppercase font-black tracking-[0.2em]">Markazlashgan foydalanuvchilar ma'lumotlar bazasi</p>
         </div>

         <div className="flex bg-slate-100 p-2 rounded-3xl relative z-10 shadow-inner">
            {[
              { id: 'children', label: 'Bolalar', icon: Baby },
              { id: 'parents', label: 'Ota-onalar', icon: Users },
              { id: 'staff', label: 'Xodimlar', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-brand-primary text-white shadow-xl scale-105' 
                    : 'text-brand-muted hover:text-brand-depth'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Search & Filter Bar */}
         <div className="lg:col-span-12 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={20} />
               <input 
                 type="text" 
                 placeholder="Ism, guruh yoki telefon bo'yicha qidirish..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-16 pr-8 py-5 bg-white border border-brand-border rounded-[24px] font-bold text-sm outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all shadow-sm"
               />
            </div>
            <button className="px-8 py-5 bg-white border border-brand-border rounded-[24px] font-black text-xs uppercase tracking-widest text-brand-depth flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
               <Filter size={18} /> Filtrlar
            </button>
            <button className="px-8 py-5 bg-brand-primary text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-brand-primary/20">
               <Plus size={18} /> Yangi Qo'shish
            </button>
         </div>

         {/* List Section */}
         <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
               {filteredData.map((item: any, idx) => (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setSelectedProfile(item)}
                    className={`p-6 bg-white rounded-[32px] border transition-all cursor-pointer flex items-center gap-6 group hover:translate-x-2 ${
                      selectedProfile?.id === item.id ? 'border-brand-primary ring-4 ring-brand-primary/5 shadow-xl shadow-brand-primary/10' : 'border-brand-border hover:border-brand-primary/30 shadow-sm'
                    }`}
                  >
                     <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-xl text-brand-depth border border-brand-border group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                        {item.name.split(' ').map((n: string) => n[0]).join('')}
                     </div>

                     <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                           <h4 className="text-lg font-black text-brand-depth leading-none">{item.name}</h4>
                           <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${item.status === 'Inactive' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                              {item.groupName || item.status || 'Active'}
                           </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-muted uppercase">
                              <Smartphone size={12} className="text-brand-primary" /> {item.phone || '+998 90 123 45 67'}
                           </div>
                           {item.child && (
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-muted uppercase">
                                 <Baby size={12} className="text-brand-primary" /> {item.child}
                              </div>
                           )}
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-muted uppercase">
                              <Calendar size={12} className="text-brand-primary" /> {item.lastActive || '24-May, 2024'}
                           </div>
                        </div>
                     </div>

                     <button className="p-3 text-brand-muted hover:text-brand-primary hover:bg-slate-50 rounded-xl transition-all">
                        <MoreVertical size={20} />
                     </button>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>

         {/* Profile Detail Sidebar */}
         <div className="lg:col-span-4 sticky top-8 h-fit">
            <AnimatePresence mode="wait">
               {selectedProfile ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-[40px] border-4 border-white shadow-2xl shadow-brand-depth/10 overflow-hidden flex flex-col"
                  >
                     <div className="h-48 bg-brand-primary relative overflow-hidden p-8 flex items-end">
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-depth/80 to-transparent"></div>
                        <img 
                          src={`https://picsum.photos/seed/${selectedProfile.id}/800/600`} 
                          alt="bg" 
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                        />
                        <div className="relative z-10 flex items-center gap-4">
                           <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center font-black text-2xl text-brand-primary">
                              {selectedProfile.name[0]}
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-white font-black text-xl leading-none">{selectedProfile.name}</h3>
                              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{selectedProfile.groupName || 'Ota-ona'}</p>
                           </div>
                        </div>
                     </div>

                     <div className="p-8 space-y-8">
                        <div className="space-y-4">
                           <h5 className="text-[10px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-2">
                              <Edit2 size={14} /> Ma'lumotlarni Tahrirlash
                           </h5>
                           <div className="space-y-2">
                              {[
                                { icon: Smartphone, label: 'Telefon', value: selectedProfile.phone || '+998 90 123 45 67' },
                                { icon: Mail, label: 'Email', value: 'aziz@example.com' },
                                { icon: MapPin, label: 'Manzil', value: 'Toshkent sh., Chilonzor tumani' },
                                { icon: Calendar, label: 'Oxirgi keldi', value: selectedProfile.lastActive || 'Bugun 08:30' }
                              ].map((info, i) => (
                                 <div key={i} className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-brand-primary/10 transition-all">
                                    <span className="text-[9px] font-black text-brand-muted uppercase tracking-wider mb-1">{info.label}</span>
                                    <div className="flex items-center gap-2 text-xs font-black text-brand-depth">
                                       <info.icon size={14} className="text-brand-primary" /> {info.value}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-3 pt-4">
                           <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2">
                              <UserCheck size={16} /> Saqlash va Tasdiqlash
                           </button>
                           <div className="grid grid-cols-2 gap-3">
                              <button className="py-4 bg-slate-50 text-brand-depth rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                                 <Lock size={14} /> Pass Reset
                              </button>
                              <button className="py-4 bg-rose-50 text-rose-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2">
                                 <Trash2 size={14} /> O'chirish
                              </button>
                           </div>
                        </div>
                        
                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 items-start">
                           <AlertCircle size={24} className="text-amber-600 shrink-0 mt-1" />
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-amber-900 uppercase">Tizim ogohlantirishi</p>
                              <p className="text-[10px] text-amber-700 font-medium leading-relaxed opacity-80">Ushbu foydalanuvchi ma'lumotlari oxirgi marta 3 oy avval yangilangan.</p>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ) : (
                  <div className="h-[600px] border-4 border-dashed border-brand-border rounded-[40px] flex flex-col items-center justify-center p-8 text-center bg-brand-ghost/30">
                     <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mb-6">
                        <UserCheck size={32} className="text-brand-muted" />
                     </div>
                     <h4 className="text-lg font-black text-brand-depth mb-2">Profilni tanlang</h4>
                     <p className="text-xs text-brand-muted leading-relaxed">Ma'lumotlarni ko'rish va boshqarish uchun ruyxatdan biror kishini tanlang</p>
                     
                     <div className="mt-8 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-primary/20 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-brand-primary/20 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-brand-primary/20 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                  </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};


/* FILE: /src/components/views/StorekeeperView.tsx */
const StorekeeperView: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryProduct[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'STOCK_IN' | 'STOCK_OUT' | 'ADJUST'>('DASHBOARD');
  
  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 4, 1)); // May 2024 for mock
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const stats = useMemo(() => {
    let totalItems = inventory.length;
    let lowStockCount = inventory.filter(p => p.batches.reduce((sum, b) => sum + b.quantity, 0) < p.minStock).length;
    let expiringSoonCount = inventory.filter(p => 
      p.batches.some(b => {
        const diff = new Date(b.expiryDate).getTime() - new Date().getTime();
        return diff > 0 && diff < (7 * 24 * 60 * 60 * 1000); // 7 days
      })
    ).length;
    let expiredCount = inventory.filter(p => 
      p.batches.some(b => new Date(b.expiryDate).getTime() < new Date().getTime())
    ).length;

    return { totalItems, lowStockCount, expiringSoonCount, expiredCount };
  }, [inventory]);

  const handleStockIn = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const productId = formData.get('product') as string;
    const quantity = parseFloat(formData.get('quantity') as string);
    const batchNumber = formData.get('batchNumber') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const supplier = formData.get('supplier') as string;
    const storageLocation = formData.get('storageLocation') as string;
    const storageTemp = parseFloat(formData.get('storageTemp') as string);

    if (!productId || isNaN(quantity) || quantity <= 0) return;

    const product = inventory.find(p => p.id === productId);
    if (!product) return;

    const newBatch: Batch = {
      id: `b-${Date.now()}`,
      batchNumber,
      quantity,
      expiryDate,
      receivedDate: new Date().toISOString().split('T')[0],
      storageLocation,
      storageTemp,
      supplier
    };

    setInventory(prev => prev.map(p => 
      p.id === productId ? { ...p, batches: [...p.batches, newBatch] } : p
    ));

    setTransactions(prev => [
      {
        id: `t-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'IN',
        productName: product.name,
        quantity,
        unit: product.unit
      },
      ...prev
    ]);

    setViewMode('DASHBOARD');
  };

  const handleStockOut = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const productId = formData.get('product') as string;
    let amountToTake = parseFloat(formData.get('quantity') as string);

    if (!productId || isNaN(amountToTake) || amountToTake <= 0) return;

    const product = inventory.find(p => p.id === productId);
    if (!product) return;

    const totalAvailable = product.batches.reduce((sum, b) => sum + b.quantity, 0);
    if (amountToTake > totalAvailable) {
       alert("Omborda yetarli mahsulot yo'q!");
       return;
    }

    const originalRequest = amountToTake;

    const sortedBatches = [...product.batches].sort((a, b) => 
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    );

    const updatedBatches: Batch[] = [];
    for (const batch of sortedBatches) {
      if (amountToTake <= 0) {
        updatedBatches.push(batch);
        continue;
      }

      if (batch.quantity <= amountToTake) {
        amountToTake -= batch.quantity;
      } else {
        updatedBatches.push({
          ...batch,
          quantity: batch.quantity - amountToTake
        });
        amountToTake = 0;
      }
    }

    setInventory(prev => prev.map(p => 
      p.id === productId ? { ...p, batches: updatedBatches } : p
    ));

    setTransactions(prev => [
      {
        id: `t-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'OUT',
        productName: product.name,
        quantity: originalRequest,
        unit: product.unit
      },
      ...prev
    ]);

    setViewMode('DASHBOARD');
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-brand-depth tracking-tight">Ombor va Logistika</h2>
          <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-1">Smart Inventory OS • FIFO Integration</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setViewMode('STOCK_IN')} 
            className="flex-1 md:flex-none justify-center bg-brand-primary text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-brand-primary/20 flex items-center gap-2 hover:scale-105 transition-all text-sm uppercase tracking-wider"
          >
            <Plus size={18} /> Kirim
          </button>
          <button 
            onClick={() => setViewMode('STOCK_OUT')} 
            className="flex-1 md:flex-none justify-center bg-brand-depth text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-brand-depth/20 flex items-center gap-2 hover:scale-105 transition-all text-sm uppercase tracking-wider"
          >
            <LogOut size={18} className="rotate-180" /> Chiqim
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-brand-primary rounded-2xl flex items-center justify-center mb-4"><Package size={20} /></div>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Barcha mahsulotlar</p>
          <h3 className="text-2xl font-black text-brand-depth">{stats.totalItems} tur</h3>
        </div>
        <div className={`bg-white p-6 rounded-3xl border shadow-sm border-l-4 ${stats.lowStockCount > 0 ? 'border-l-brand-amber border-brand-amber/20' : 'border-brand-border'}`}>
          <div className="w-10 h-10 bg-amber-50 text-brand-amber rounded-2xl flex items-center justify-center mb-4"><AlertTriangle size={20} /></div>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Kritik kamayish</p>
          <h3 className="text-2xl font-black text-brand-depth">{stats.lowStockCount} ta</h3>
        </div>
        <div className={`bg-white p-6 rounded-3xl border shadow-sm border-l-4 ${stats.expiringSoonCount > 0 ? 'border-l-rose-500 border-rose-500/20' : 'border-brand-border'}`}>
          <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4"><Clock size={20} /></div>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Muddati o'tayotgan</p>
          <h3 className="text-2xl font-black text-rose-500">{stats.expiringSoonCount} ta</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-brand-emerald rounded-2xl flex items-center justify-center mb-4"><CheckCircle2 size={20} /></div>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Tizim holati</p>
          <h3 className="text-2xl font-black text-brand-depth">OPTIMAL</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-brand-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-brand-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
            <h4 className="font-black text-brand-depth uppercase text-sm tracking-widest flex items-center gap-2">
              <List size={18} className="text-brand-primary" /> Inventarizatsiya
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/30 text-[10px] text-brand-muted uppercase font-black tracking-widest border-b border-brand-border">
                  <th className="px-8 py-5">Nomi / Turkumi</th>
                  <th className="px-8 py-5">Qoldiq</th>
                  <th className="px-8 py-5">Muddati</th>
                  <th className="px-8 py-5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventory.map(product => {
                  const totalQty = product.batches.reduce((s, b) => s + b.quantity, 0);
                  const isLow = totalQty < product.minStock;
                  const nearestExpiryBatch = [...product.batches].sort((a,b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0];
                  const expiryStr = nearestExpiryBatch ? nearestExpiryBatch.expiryDate : '-';

                  return (
                    <tr key={product.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-brand-ghost rounded-xl flex items-center justify-center text-brand-primary font-black text-[10px] uppercase">
                             {product.unit}
                           </div>
                           <div>
                              <p className="text-sm font-black text-brand-depth">{product.name}</p>
                              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-tighter">{product.category}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-brand-depth">{totalQty} {product.unit}</span>
                           {isLow && <span className="text-[8px] text-brand-amber font-black uppercase mt-1 px-1.5 py-0.5 bg-brand-amber/10 rounded w-fit">Kritik</span>}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-brand-muted">{expiryStr}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button className="text-brand-primary font-black text-[10px] uppercase hover:underline tracking-widest">Tafsilotlar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-depth text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="font-black uppercase tracking-widest text-xs">Harakatlar</h4>
                   <div className="flex gap-1">
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={16} /></button>
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><ChevronRight size={16} /></button>
                   </div>
                </div>
                <p className="text-2xl font-black text-center mb-8 uppercase tracking-tighter">{currentMonth.toLocaleString('uz-UZ', { month: 'long', year: 'numeric' })}</p>
                <div className="grid grid-cols-7 gap-1">
                   {(() => {
                      const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
                      const emptyDays = firstDay === 0 ? 6 : firstDay - 1;
                      return (
                         <>
                            {Array.from({ length: emptyDays }).map((_, i) => <div key={`empty-${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                               const day = i + 1;
                               const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                               const hasAct = transactions.some(t => t.date === dateStr);
                               return (
                                  <button key={day} onClick={() => setSelectedDate(dateStr)} className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${selectedDate === dateStr ? 'bg-brand-primary text-white shadow-lg scale-110 z-10' : 'hover:bg-white/5'} ${hasAct ? 'border border-brand-primary/30' : ''}`}>
                                     {day}
                                  </button>
                               );
                            })}
                         </>
                      );
                   })()}
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h5 className="font-black text-brand-depth uppercase text-[10px] tracking-widest flex items-center gap-2">
                  <Clock size={16} className="text-brand-primary" /> Log: {selectedDate}
                </h5>
             </div>
             <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
               {transactions.filter(t => t.date === selectedDate).length > 0 ? (
                 transactions.filter(t => t.date === selectedDate).map(t => (
                   <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-brand-primary transition-all">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl ${t.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                           {t.type === 'IN' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                         </div>
                         <div>
                            <p className="text-xs font-black text-brand-depth">{t.productName}</p>
                            <p className="text-[9px] font-bold text-brand-muted uppercase">{t.type === 'IN' ? 'Kirim' : 'Chiqim'}</p>
                         </div>
                      </div>
                      <span className={`text-xs font-black ${t.type === 'IN' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {t.type === 'IN' ? '+' : '-'}{t.quantity}
                      </span>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10">
                   <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest opacity-30">Harakat yo'q</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {viewMode === 'DASHBOARD' && renderDashboard()}
      {viewMode === 'STOCK_IN' && (
        <div className="fixed inset-0 bg-brand-depth/80 backdrop-blur-xl flex items-center justify-center z-[110] p-4 lg:p-12 animate-in fade-in duration-300">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl overflow-hidden overflow-y-auto max-h-full scrollbar-hidden">
             <div className="flex justify-between items-start mb-10">
               <div>
                  <h3 className="text-3xl font-black text-brand-depth tracking-tight">Kirim Operatsiyasi</h3>
                  <p className="text-xs text-brand-muted uppercase font-bold tracking-widest mt-1 italic">Yangi partiyani ro'yxatdan o'tkazing</p>
               </div>
               <button onClick={() => setViewMode('DASHBOARD')} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-50 hover:text-rose-500 transition-all text-2xl font-black">&times;</button>
             </div>
             <form onSubmit={handleStockIn} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Mahsulot *</label>
                    <select name="product" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all cursor-pointer">
                       {inventory.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Miqdor *</label>
                    <input name="quantity" type="number" step="0.01" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="0.00" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Partiya Raqami *</label>
                    <input name="batchNumber" type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="Masalan: B-2024/01" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Muddati *</label>
                    <input name="expiryDate" type="date" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Yetkazib beruvchi</label>
                  <input name="supplier" type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="Kompaniya nomi" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Saqlash joyi</label>
                    <input name="storageLocation" type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="A-tokcha / Muzlatgich" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Harorat (°C)</label>
                    <input name="storageTemp" type="number" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="+4" />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-brand-primary text-white rounded-3xl font-black shadow-xl shadow-brand-primary/30 hover:bg-brand-primary/95 transition-all text-xs uppercase tracking-widest">Kirimni tasdiqlash</button>
             </form>
           </motion.div>
        </div>
      )}
      {viewMode === 'STOCK_OUT' && (
        <div className="fixed inset-0 bg-brand-depth/80 backdrop-blur-xl flex items-center justify-center z-[110] p-4 lg:p-12 animate-in fade-in duration-300">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl">
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-3xl font-black text-brand-depth tracking-tight">Chiqim Operatsiyasi</h3>
                    <p className="text-xs text-brand-muted uppercase font-bold tracking-widest mt-1 italic italic text-amber-600">FIFO tizimi bo'yicha chegiriladi</p>
                 </div>
                 <button onClick={() => setViewMode('DASHBOARD')} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-50 hover:text-rose-500 transition-all text-2xl font-black">&times;</button>
              </div>
              <form onSubmit={handleStockOut} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Mahsulotni tanlang *</label>
                    <select name="product" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all cursor-pointer">
                       {inventory.map(p => (
                         <option key={p.id} value={p.id}>{p.name} ({p.batches.reduce((s, b) => s + b.quantity, 0)} {p.unit} mavjud)</option>
                       ))}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Chiqariladigan miqdor *</label>
                    <input name="quantity" type="number" step="0.01" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="0.00" required />
                 </div>
                 <div className="bg-amber-50 rounded-2xl p-4 border border-brand-amber/20">
                    <p className="text-[10px] text-brand-amber font-bold leading-relaxed flex items-start gap-2">
                       <AlertTriangle size={14} className="shrink-0" />
                       Tizim avtomatik ravishda muddati eng yaqin bo'lgan partiyalardan miqdorni chegiradi. Ushbu amal ortga qaytarilmaydi.
                    </p>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setViewMode('DASHBOARD')} type="button" className="flex-1 py-4 border-2 border-slate-100 rounded-3xl font-black text-brand-muted uppercase text-[10px] tracking-widest">Bekor qilish</button>
                    <button type="submit" className="flex-[2] py-4 bg-brand-depth text-white rounded-3xl font-black shadow-xl shadow-brand-depth/30 uppercase text-[10px] tracking-widest">Chiqimni tasdiqlash</button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
};

/* FILE: /src/components/views/SupplyView.tsx */
type SupplyTab = 'REQUIRED' | 'ORDERS' | 'SUPPLIERS' | 'PLAN' | 'DELAYED';

const SupplyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SupplyTab>('REQUIRED');

  const tabs = [
    { id: 'REQUIRED', label: 'Kerakli mahsulotlar', icon: ShoppingBag, color: 'brand-primary' },
    { id: 'ORDERS', label: 'Buyurtmalar', icon: FileText, color: 'blue-500' },
    { id: 'SUPPLIERS', label: 'Yetkazib beruvchilar', icon: Users2, color: 'emerald-500' },
    { id: 'PLAN', label: 'Xarid rejasi', icon: CalendarDays, color: 'violet-500' },
    { id: 'DELAYED', label: 'Kechikayotganlar', icon: AlertCircle, color: 'rose-500' },
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      {/* KPI Cards section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Oylik Xarid', value: '45.2 mln', sub: 'so‘m', trend: '+12%', icon: TrendingUp, color: 'brand-primary' },
          { label: 'Aktiv Buyurtmalar', value: '18', sub: 'ta', trend: 'Bekor bo\'lmadi', icon: ShoppingBag, color: 'blue-500' },
          { label: 'Kechikishlar', value: '3', sub: 'ta mahsulot', trend: '-2 bugun', icon: Clock, color: 'rose-500' },
          { label: 'Yetkazib beruvchilar', value: '12', sub: 'ta hamkor', trend: 'Barchasi faol', icon: Users2, color: 'emerald-500' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className={`w-14 h-14 rounded-2xl bg-${kpi.color}/10 flex items-center justify-center text-${kpi.color} group-hover:bg-${kpi.color} group-hover:text-white transition-colors`}>
              <kpi.icon size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest leading-none mb-1">{kpi.label}</p>
               <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-black text-brand-depth leading-none">{kpi.value}</span>
                 <span className="text-[10px] font-bold text-brand-muted uppercase">{kpi.sub}</span>
               </div>
               <p className={`text-[10px] font-bold mt-1 ${kpi.trend.includes('+') ? 'text-emerald-500' : kpi.trend.includes('-') ? 'text-rose-500' : 'text-brand-primary'}`}>{kpi.trend}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Internal Navigation */}
      <div className="bg-white p-2 rounded-[1.5rem] border border-brand-border shadow-sm flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SupplyTab)}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${
              activeTab === tab.id 
                ? `bg-brand-primary text-white shadow-lg shadow-brand-primary/20` 
                : 'text-brand-muted hover:bg-slate-50 hover:text-brand-depth'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === 'REQUIRED' && <RequiredProductsSection />}
          {activeTab === 'ORDERS' && <OrdersSection />}
          {activeTab === 'SUPPLIERS' && <SuppliersSection />}
          {activeTab === 'PLAN' && <PlanSection />}
          {activeTab === 'DELAYED' && <DelayedSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Internal Page Sections ---

const RequiredProductsSection = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-brand-border">
      <div>
        <h3 className="text-2xl font-black text-brand-depth">Kerakli mahsulotlar ro'yxati</h3>
        <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1">Oshxona va Ombor so'rovlari asosida</p>
      </div>
      <div className="flex gap-3">
        <button className="px-6 py-3 bg-slate-50 border border-brand-border rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-100 transition-colors">
          <Filter size={16} /> Saralash
        </button>
        <button className="px-6 py-3 bg-brand-primary text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all">
          <Plus size={16} /> Buyurtma ochish
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {[
        { name: 'Sut (3.2%)', amount: '120 L', dept: 'Oshxona', urgency: 'CRITICAL', deadline: '2 soat ichida' },
        { name: 'Go\'sht (Mol)', amount: '45 kg', dept: 'Oshxona', urgency: 'HIGH', deadline: '1 kun' },
        { name: 'Yuvish vositalari', amount: '10 quti', dept: 'Tozalik', urgency: 'MEDIUM', deadline: '3 kun' },
        { name: 'Qog\'oz salfetkalar', amount: '500 dona', dept: 'Ombor', urgency: 'LOW', deadline: '5 kun' },
      ].map((item, idx) => (
        <div key={idx} className="bg-white border border-brand-border p-6 rounded-[1.5rem] flex items-center justify-between hover:border-brand-primary transition-colors group">
          <div className="flex items-center gap-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              item.urgency === 'CRITICAL' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-slate-50 text-brand-slate'
            } border`}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h4 className="font-black text-brand-depth text-lg">{item.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                 <span className="text-[10px] font-black uppercase text-brand-muted tracking-widest">{item.dept} so'rovi</span>
                 <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                 <span className="text-[10px] font-black uppercase text-brand-primary">{item.amount}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-brand-muted tracking-widest mb-1">Muddati</p>
              <p className={`text-xs font-bold ${item.urgency === 'CRITICAL' ? 'text-rose-600' : 'text-brand-depth'}`}>{item.deadline}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
              item.urgency === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-200' :
              item.urgency === 'HIGH' ? 'bg-orange-50 text-orange-600 border-orange-200' :
              'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              {item.urgency}
            </div>
            <button className="w-10 h-10 bg-slate-50 text-brand-muted rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OrdersSection = () => (
  <div className="bg-white rounded-[2rem] border border-brand-border overflow-hidden shadow-sm">
    <div className="p-8 border-b border-brand-border bg-slate-50/30 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-black text-brand-depth">Faol Buyurtmalar</h3>
        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Yetkazib berish jarayonidagilar</p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
        <input 
          type="text" 
          placeholder="Buyurtma ID si..."
          className="bg-white border border-brand-border rounded-xl py-3 pl-12 pr-6 text-xs font-bold outline-none focus:ring-2 ring-brand-primary/20 w-64"
        />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 border-b border-brand-border text-[10px] font-black uppercase text-brand-muted tracking-widest">
            <th className="px-8 py-5">Buyurtma ID</th>
            <th className="px-8 py-5">Yetkazib beruvchi</th>
            <th className="px-8 py-5">Summa</th>
            <th className="px-8 py-5">Sana</th>
            <th className="px-8 py-5">Holati</th>
            <th className="px-8 py-5 text-right">Amallar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[
            { id: '#PO-4592', vendor: 'AgroFresh LLC', amount: '4,200,000', date: '18.04.2024', status: 'SHIPPED' },
            { id: '#PO-4588', vendor: 'Sutchi Biznes', amount: '1,850,000', date: '17.04.2024', status: 'PENDING' },
            { id: '#PO-4581', vendor: 'HygieTools', amount: '950,000', date: '15.04.2024', status: 'DELIVERED' },
          ].map((order, idx) => (
            <tr key={idx} className="hover:bg-brand-primary/[0.02] transition-colors group">
              <td className="px-8 py-6 font-black text-brand-primary text-xs">{order.id}</td>
              <td className="px-8 py-6">
                <span className="text-sm font-bold text-brand-depth">{order.vendor}</span>
              </td>
              <td className="px-8 py-6">
                <span className="text-sm font-black text-brand-depth">{order.amount} <span className="text-[10px] text-brand-muted">so'm</span></span>
              </td>
              <td className="px-8 py-6">
                <span className="text-xs font-bold text-brand-slate">{order.date}</span>
              </td>
              <td className="px-8 py-6">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                  order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                  order.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {order.status === 'SHIPPED' ? 'Yo\'lda' : order.status === 'PENDING' ? 'Kutilmoqda' : 'Qabul qilindi'}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <button className="p-2 bg-slate-50 text-brand-muted rounded-lg hover:text-brand-primary hover:bg-brand-primary/10 transition-all border border-brand-border">
                  <ChevronRight size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SuppliersSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
       { name: 'AgroFresh LLC', type: 'Meva va Sabzavotlar', score: '4.8', activeOrders: 3, contact: 'Jamshid A.' },
       { name: 'Sutchi Biznes', type: 'Sut mahsulotlari', score: '4.9', activeOrders: 1, contact: 'Elena K.' },
       { name: 'Go\'sht Dunyosi', type: 'Go\'sht va Parranda', score: '4.5', activeOrders: 0, contact: 'Bekzod T.' },
       { name: 'CleanSolutions', type: 'Xo\'jalik mollari', score: '4.2', activeOrders: 2, contact: 'Sardor L.' },
    ].map((vendor, idx) => (
      <div key={idx} className="bg-white p-8 rounded-[2rem] border border-brand-border shadow-sm group hover:shadow-xl transition-all duration-500">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-border group-hover:bg-brand-primary group-hover:text-white transition-all">
            <Users2 size={24} />
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black shadow-inner">
            <CheckCircle2 size={12} /> {vendor.score}
          </div>
        </div>
        <h4 className="text-xl font-black text-brand-depth mb-1">{vendor.name}</h4>
        <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-6">{vendor.type}</p>
        
        <div className="space-y-4 pt-6 border-t border-slate-50">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Mas'ul shaxs</span>
              <span className="text-xs font-bold text-brand-depth">{vendor.contact}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Aktiv buyurtmalar</span>
              <span className="px-2 py-0.5 bg-brand-primary-light text-brand-primary rounded text-[10px] font-black">{vendor.activeOrders} ta</span>
           </div>
        </div>

        <button className="w-full mt-8 py-4 bg-slate-50 border border-brand-border rounded-xl font-black text-[10px] uppercase tracking-widest text-brand-muted group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all">
          Aloqaga chiqish
        </button>
      </div>
    ))}
  </div>
);

const PlanSection = () => (
  <div className="bg-white rounded-[2rem] border border-brand-border p-10 shadow-sm flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
    <div className="w-20 h-20 bg-violet-50 text-violet-500 rounded-3xl flex items-center justify-center mb-4">
      <CalendarDays size={40} />
    </div>
    <div>
      <h3 className="text-2xl font-black text-brand-depth">Aprel oyi xarid rejasi</h3>
      <p className="text-brand-muted text-sm max-w-md mx-auto mt-2 leading-relaxed">
        Kelgusi hafta uchun oziq-ovqat va tozalik vositalari xaridi avtomatik tarzda shakllantirildi. 
        Rejani oshpaz va dietolog bilan tasdiqlashingiz lozim.
      </p>
    </div>
    <div className="flex gap-4">
       <button className="px-8 py-4 bg-slate-50 border border-brand-border rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">Rejani yuklash</button>
       <button className="px-8 py-4 bg-violet-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-violet-500/20 hover:scale-105 transition-all">Tasdiqlash</button>
    </div>
  </div>
);

const DelayedSection = () => (
  <div className="space-y-6">
    <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2rem] flex items-center gap-6">
       <div className="w-16 h-16 bg-white text-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/10">
          <AlertCircle size={32} />
       </div>
       <div>
          <h3 className="text-xl font-black text-rose-800">Kechikayotgan Ta'minot</h3>
          <p className="text-rose-700/60 text-sm font-medium">Ushbu mahsulotlar belgilangan vaqtdan o'tib ketgan, zudlik bilan qo'ng'iroq qiling!</p>
       </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
       {[
         { id: '#PO-4588', name: 'Meva to\'plami', vendor: 'AgroFresh LLC', delay: '4 soat', action: 'Call Jamshid' },
         { id: '#PO-4589', name: 'Non va yopgan non', vendor: 'City Bakery', delay: '1.5 soat', action: 'Call Driver' },
       ].map((item, idx) => (
         <div key={idx} className="bg-white border border-brand-border p-8 rounded-[1.5rem] flex items-center justify-between group">
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{item.id}</span>
                  <span className="text-lg font-black text-brand-depth">{item.name}</span>
               </div>
               <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Yetkazuvchi</span>
                  <span className="text-xs font-bold text-brand-slate">{item.vendor}</span>
               </div>
            </div>
            <div className="flex items-center gap-10">
               <div className="text-right">
                  <span className="block text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Kechikish vaqti</span>
                  <span className="text-lg font-black text-rose-600">-{item.delay}</span>
               </div>
               <button className="px-6 py-3 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all">
                  {item.action}
               </button>
            </div>
         </div>
       ))}
    </div>
  </div>
);

/* FILE: /src/components/views/TeacherView.tsx */
interface TeacherViewProps {
  groups: Group[];
}

const TeacherView: React.FC<TeacherViewProps> = ({ groups }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  if (!selectedGroup) {
    return (
      <div className="p-8 animate-in fade-in">
        <h2 className="text-xl font-bold mb-6">Guruhni tanlang</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(g => (
            <button key={g.name} onClick={() => setSelectedGroup(g.name)} className="p-8 bg-white border border-brand-border rounded-xl text-center font-bold hover:shadow-lg transition">
              {g.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const groupData = groups.find(g => g.name === selectedGroup)!;

  return <GroupAttendanceView groupData={groupData} onBack={() => setSelectedGroup(null)} />;
};

const GroupAttendanceView = ({ groupData, onBack }: { groupData: {name: string, children: {id: number, name: string}[]}, onBack: () => void }) => {
  const [attendance, setAttendance] = useState(
    groupData.children.map((child, i) => ({
      ...child,
      meal: i % 3 === 0 ? 'breakfast' : i % 3 === 1 ? 'lunch' : 'dinner',
      status: 'present' as 'present' | 'absent' | 'present_no_meal'
    }))
  );

  const [archive, setArchive] = useState<any[]>([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const stats = useMemo(() => {
    const present = attendance.filter(a => a.status === 'present' || a.status === 'present_no_meal').length;
    const noMeal = attendance.filter(a => a.status === 'present_no_meal').length;
    return {
      total: attendance.length,
      kelgan: present,
      kelmagan: attendance.filter(a => a.status === 'absent').length,
      nonushta_qilmaydi: noMeal,
      porsiya_soni: present - noMeal
    };
  }, [attendance]);

  const handleSave = () => {
    setArchive(prev => [...prev, { date: new Date().toLocaleDateString(), ...stats }]);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-brand-border gap-4">
        <button onClick={onBack} className="text-brand-muted hover:text-brand-depth font-bold text-sm flex items-center gap-2 underline underline-offset-4 decoration-transparent hover:decoration-brand-muted transition-all">
          <ArrowLeft size={16} /> Guruhlar
        </button>
        <h2 className="text-xl font-bold">Guruh: "{groupData.name}" ({new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })})</h2>
        <div className="relative w-full md:w-auto">
          <button onClick={handleSave} className="w-full md:w-auto bg-brand-primary text-white font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-transform active:scale-95">Saqlash va Arxivlash</button>
          {showSavedMessage && (
            <div className="absolute right-0 top-full mt-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">Saqlandi!</div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {['breakfast', 'lunch', 'dinner'].map(meal => (
           <div key={meal} className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
             <h3 className="font-bold mb-4 capitalize border-b pb-2">{meal === 'breakfast' ? 'Nonushta' : meal === 'lunch' ? 'Tushlik' : 'Kechki ovqat'}</h3>
             <div className="space-y-1">
              {attendance.filter(a => a.meal === meal).map((child) => (
                  <div key={child.id} className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-md">
                    <span className="text-sm font-medium">{child.name}</span>
                    <select 
                      value={child.status} 
                      onChange={(e) => setAttendance(prev => prev.map(a => a.id === child.id ? {...a, status: e.target.value as any} : a))} 
                      className="text-xs border rounded p-1.5 focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                    >
                      <option value="present">Keldi</option>
                      <option value="absent">Kelmadi</option>
                      <option value="present_no_meal">Keldi (ovqatlanmaydi)</option>
                    </select>
                  </div>
              ))}
             </div>
           </div>
         ))}
      </div>

      <div className="bg-brand-depth p-8 rounded-xl text-white shadow-xl">
        <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Kunlik Hisobot</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="p-4 bg-white/10 rounded-lg text-center border border-white/5">
              <p className="text-[10px] uppercase font-bold text-white/60 mb-1">{k.replace('_', ' ')}</p>
              <p className="text-2xl font-bold">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
           <ClipboardCheck size={20} className="text-brand-primary" />
           <h3 className="font-bold text-lg">Arxiv</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-brand-muted border-b">
                <th className="pb-3 px-4">Sana</th>
                <th className="pb-3 px-4">Porsiya soni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {archive.length > 0 ? archive.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">{a.date}</td>
                  <td className="py-3 px-4 font-bold">{a.porsiya_soni}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-brand-muted italic">Arxiv hali mavjud emas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('DIRECTOR');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [kitchenTasks, setKitchenTasks] = useState<KitchenTask[]>(INITIAL_KITCHEN_TASKS);
  const [samples, setSamples] = useState<LabSample[]>(INITIAL_LAB_SAMPLES);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/api/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups in App:', error);
      }
    };
    fetchGroups();
  }, []);

  const renderView = () => {
    switch (role) {
      case 'DIRECTOR': return <DirectorView />;
      case 'NUTRITIONIST': return <NutritionistView groups={groups} />;
      case 'STOREKEEPER': return <StorekeeperView />;
      case 'KITCHEN_MANAGER': return <KitchenManagerView />;
      case 'FINANCE': return <FinanceView />;
      case 'INSPECTOR': return <InspectorView />;
      case 'PARENT': return <ParentView />;
      case 'NURSE': return <NurseView />;
      case 'LAB': return <LabView />;
      case 'OPERATOR': return <OperatorView groups={groups} setGroups={setGroups} />;
      case 'TEACHER': return <TeacherView groups={groups} />;
      case 'SUPPLY': return <SupplyView />;
      case 'PROFILES': return <ProfilesView />;
      default: return <DirectorView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-ghost font-sans text-brand-depth selection:bg-brand-primary/10">
      <Sidebar 
        currentRole={role} 
        onRoleChange={setRole} 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        <TopBar role={role} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
