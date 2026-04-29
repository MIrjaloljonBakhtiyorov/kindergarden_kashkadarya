import React, { useState } from 'react';
import { UserCircle, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const LoginView: React.FC = () => {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isParent, setIsParent] = useState(false);
  
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isParent ? '/auth/parent-login' : '/auth/login';
      const response = await apiClient.post(endpoint, { login: loginInput, password });
      
      login(response.data);
      showNotification(`Xush kelibsiz, ${response.data.full_name}!`, 'success');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Kirishda xatolik yuz berdi';
      showNotification(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-screen h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[10px] shadow-2xl shadow-brand-primary/5 border border-brand-border p-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
             <UserCircle size={32} />
          </div>
          <h1 className="text-3xl font-black text-brand-depth">KinderFlow</h1>
          <p className="text-brand-muted text-sm font-bold uppercase tracking-widest">Tizimga kirish</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-brand-muted uppercase ml-1 tracking-widest">Login</label>
            <div className="relative">
              <input 
                type="text" 
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                required
                className="w-full bg-slate-50 border border-brand-border rounded-2xl py-4 px-6 pl-12 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-bold" 
                placeholder="Loginni kiriting"
              />
              <UserCircle className="absolute left-4 top-4 text-brand-slate" size={20} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-brand-muted uppercase ml-1 tracking-widest">Parol</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-brand-border rounded-2xl py-4 px-6 pl-12 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-bold" 
                placeholder="********"
              />
              <Lock className="absolute left-4 top-4 text-brand-slate" size={20} />
            </div>
          </div>

          <div className="flex items-center gap-2 px-2">
            <input 
              type="checkbox" 
              id="isParent" 
              checked={isParent}
              onChange={(e) => setIsParent(e.target.checked)}
              className="w-4 h-4 accent-brand-primary rounded" 
            />
            <label htmlFor="isParent" className="text-xs font-bold text-brand-slate cursor-pointer">Ota-ona sifatida kirish</label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-white rounded-2xl py-4 font-black shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                Tizimga kirish 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-50">
           <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">QASHQADARYO VILOYATI MAKTABGACHA TALIM TIZIMI</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;
