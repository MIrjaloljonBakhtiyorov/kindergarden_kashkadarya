import React, { useState, useRef } from 'react';
import { Camera, X, Check, AlertTriangle, MessageSquare, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEVERITY_LEVELS } from '../constants/inspector.constants';

interface ChecklistItemProps {
  id: number;
  question: string;
  onStatusChange?: (id: number, status: 'normal' | 'problem' | null) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ id, question, onStatusChange }) => {
  const [status, setStatus] = useState<'normal' | 'problem' | null>(null);
  const [severity, setSeverity] = useState('MEDIUM');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleStatusUpdate = (newStatus: 'normal' | 'problem') => {
    setStatus(newStatus);
    onStatusChange?.(id, newStatus);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-8 rounded-[2rem] border-2 transition-all duration-300 shadow-sm ${
        status === 'normal' ? 'border-emerald-500 shadow-emerald-500/5' : 
        status === 'problem' ? 'border-red-500 shadow-red-500/5' : 
        'border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex gap-4 flex-1">
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-colors ${
            status === 'normal' ? 'bg-emerald-500 text-white' : 
            status === 'problem' ? 'bg-red-500 text-white' : 
            'bg-slate-100 text-slate-500'
          }`}>
            {id.toString().padStart(2, '0')}
          </span>
          <div className="pt-2">
            <h4 className="font-bold text-slate-800 text-lg leading-tight">{question}</h4>
            {status && (
              <span className={`inline-flex items-center gap-1 mt-2 text-[10px] font-black uppercase tracking-wider ${
                status === 'normal' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {status === 'normal' ? <Check size={12} /> : <AlertTriangle size={12} />}
                {status === 'normal' ? "Me'yorda" : 'Muammo aniqlandi'}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex bg-slate-50 p-1.5 rounded-2xl w-full md:w-auto shadow-inner">
          <button 
            onClick={() => handleStatusUpdate('normal')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              status === 'normal' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Me’yorda
          </button>
          <button 
            onClick={() => handleStatusUpdate('problem')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              status === 'problem' ? 'bg-white text-red-600 shadow-md' : 'text-slate-500 hover:text-red-600'
            }`}
          >
            Muammo
          </button>
        </div>
      </div>

      <AnimatePresence>
        {status === 'problem' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                    <MessageSquare size={14} /> Muammo tavsifi (majburiy)
                  </label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all text-sm font-medium resize-none" 
                    placeholder="Vaziyatni batafsil tushuntiring..." 
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Jiddiylik darajasi
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SEVERITY_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSeverity(level.id)}
                        className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          severity === level.id 
                            ? level.color + ' shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                  <ImageIcon size={14} /> Dalil uchun rasm (majburiy)
                </label>
                
                {image ? (
                  <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-red-100 group">
                    <img src={image} alt="Evidence" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 transition-all"
                      >
                        <Camera size={20} />
                      </button>
                      <button 
                        onClick={() => setImage(null)}
                        className="p-3 bg-red-500 rounded-2xl text-white hover:bg-red-600 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50/30 transition-all group"
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <Camera size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-xs uppercase tracking-widest">Rasm yuklash</p>
                      <p className="text-[10px] font-medium mt-1">Kamera yoki galereyadan tanlang</p>
                    </div>
                  </button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
