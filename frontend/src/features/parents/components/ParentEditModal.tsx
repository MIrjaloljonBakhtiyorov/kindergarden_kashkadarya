import React, { useState } from 'react';
import { X, Save, Lock, User } from 'lucide-react';

interface ParentEditModalProps {
  parent: any;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<void>;
}

export const ParentEditModal: React.FC<ParentEditModalProps> = ({ parent, onClose, onSave }) => {
  const [login, setLogin] = useState(parent.login);
  const [password, setPassword] = useState('********');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(parent.id, { login, password });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 bg-black/5">
      <div className="bg-white w-full max-w-md rounded-[10px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-brand-depth">Hisobni tahrirlash</h3>
            <p className="text-xs font-bold text-brand-muted mt-1 uppercase tracking-widest">{parent.childName} ota-onasi</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white border border-brand-border rounded-full flex items-center justify-center text-brand-depth hover:bg-rose-50 hover:text-rose-500 hover:rotate-90 transition-all active:scale-95"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] ml-1">Login</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
                <User size={16} />
              </div>
              <input 
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-brand-depth focus:border-brand-primary focus:bg-white transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] ml-1">Yangi Parol</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
                <Lock size={16} />
              </div>
              <input 
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-brand-depth focus:border-brand-primary focus:bg-white transition-all outline-none"
                placeholder="Parolni o'zgartirish uchun yozing..."
              />
            </div>
            <p className="text-[10px] text-brand-muted font-medium italic ml-1">
              * Parolni o'zgartirishni xohlamasangiz '********' holatida qoldiring.
            </p>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Saqlash
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
