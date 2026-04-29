import React, { useState } from 'react';
import { ShieldCheck, User, Key, Save, Lock, AlertCircle, Eye, EyeOff, ShieldAlert, CheckCircle2, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';

export const SecuritySection = ({ credentials, setCredentials, isSaving, onUpdate }: any) => {
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const passwordStrength = credentials.newPassword.length === 0 ? 0 : 
                          credentials.newPassword.length < 6 ? 1 : 
                          credentials.newPassword.length < 10 ? 2 : 3;

  const strengthLabel = ['Bo\'sh', 'Zaif', 'Yaxshi', 'Kuchli'];
  const strengthColor = ['bg-slate-200', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
      {/* Premium Header Card */}
      <div className="relative p-8 md:p-12 bg-brand-depth rounded-[2.5rem] md:rounded-[4rem] text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center shadow-2xl shrink-0 group">
            <ShieldCheck size={40} md:size={48} className="text-brand-primary group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="space-y-3">
            <h4 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">Xavfsizlik Markazi</h4>
            <p className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" /> Hisobingiz himoyalangan
            </p>
          </div>
          <div className="md:ml-auto flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
            <ShieldAlert size={24} className="text-amber-400" />
            <div className="text-left">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Xavfsizlik darajasi</p>
              <p className="text-base font-black uppercase tracking-tighter">{strengthLabel[passwordStrength]}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={onUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Main Configuration Form */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-brand-border shadow-xl shadow-slate-200/50 space-y-8 md:space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
              <Lock size={200} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black text-brand-depth uppercase tracking-[0.3em]">Login / Username</label>
                <span className="text-[9px] font-black text-brand-primary uppercase bg-brand-primary/5 px-3 py-1 rounded-full">Tizimga kirish uchun</span>
              </div>
              <div className="relative group">
                <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-brand-muted group-focus-within:text-brand-primary group-focus-within:bg-brand-primary/10 transition-all duration-300">
                  <User size={20} md:size={24} />
                </div>
                <input 
                  type="text" 
                  value={credentials.login}
                  onChange={(e) => setCredentials({...credentials, login: e.target.value})}
                  className="w-full pl-20 md:pl-24 pr-8 py-5 md:py-7 bg-slate-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-[1.8rem] md:rounded-[2.5rem] font-black text-base md:text-xl text-brand-depth outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-brand-depth uppercase tracking-[0.3em] px-2">Yangi Parol</label>
                <div className="relative group">
                  <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-brand-muted group-focus-within:text-brand-primary group-focus-within:bg-brand-primary/10 transition-all duration-300">
                    <Lock size={20} md:size={24} />
                  </div>
                  <input 
                    type={showNewPass ? "text" : "password"} 
                    value={credentials.newPassword}
                    onChange={(e) => setCredentials({...credentials, newPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-20 md:pl-24 pr-16 py-5 md:py-7 bg-slate-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-[1.8rem] md:rounded-[2.5rem] font-black text-base md:text-xl text-brand-depth outline-none transition-all shadow-inner"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-lg transition-colors text-brand-muted"
                  >
                    {showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-brand-depth uppercase tracking-[0.3em] px-2">Tasdiqlash</label>
                <div className="relative group">
                  <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-brand-muted group-focus-within:text-brand-primary group-focus-within:bg-brand-primary/10 transition-all duration-300">
                    <Key size={20} md:size={24} />
                  </div>
                  <input 
                    type={showConfirmPass ? "text" : "password"} 
                    value={credentials.confirmPassword}
                    onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-20 md:pl-24 pr-16 py-5 md:py-7 bg-slate-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-[1.8rem] md:rounded-[2.5rem] font-black text-base md:text-xl text-brand-depth outline-none transition-all shadow-inner"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-lg transition-colors text-brand-muted"
                  >
                    {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black text-brand-depth uppercase tracking-widest">Parol kuchi</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${strengthColor[passwordStrength].replace('bg-', 'text-')}`}>
                  {strengthLabel[passwordStrength]}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 h-2">
                <div className={`rounded-full transition-all duration-500 ${passwordStrength >= 1 ? strengthColor[1] : 'bg-slate-200'}`} />
                <div className={`rounded-full transition-all duration-500 ${passwordStrength >= 2 ? strengthColor[2] : 'bg-slate-200'}`} />
                <div className={`rounded-full transition-all duration-500 ${passwordStrength >= 3 ? strengthColor[3] : 'bg-slate-200'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions & Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 space-y-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-2">
              <AlertCircle size={24} />
            </div>
            <h5 className="text-lg font-black text-amber-900 tracking-tight uppercase leading-none">Muhim ma'lumot</h5>
            <p className="text-xs font-bold text-amber-800/70 leading-relaxed uppercase tracking-wider">
              Loginni o'zgartirgandan so'ng, keyingi safar yangi login bilan tizimga kirishingiz kerak bo'ladi. Parolni ham eslab qoling.
            </p>
          </div>

          <button 
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-4 py-8 bg-brand-depth text-white font-black rounded-[2.5rem] shadow-2xl shadow-brand-depth/30 hover:bg-brand-primary hover:scale-[1.02] transition-all disabled:opacity-50 uppercase text-sm tracking-[0.2em] relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            {isSaving ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={24} className="group-hover:rotate-12 transition-transform" />
                Saqlash va Yangilash
              </>
            )}
          </button>

          <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col items-center text-center space-y-4">
             <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-muted">
                <Fingerprint size={32} />
             </div>
             <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest leading-relaxed">Ikki bosqichli autentifikatsiya yaqin orada ishga tushadi</p>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

