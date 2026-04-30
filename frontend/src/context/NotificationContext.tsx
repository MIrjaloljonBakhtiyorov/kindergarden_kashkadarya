import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type NotificationType = 'success' | 'error' | 'info';

interface ConfirmState {
  message: string;
  resolve: (value: boolean) => void;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
  confirm: (message: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ message, resolve });
    });
  }, []);

  const handleConfirm = (value: boolean) => {
    if (confirmState) {
      confirmState.resolve(value);
      setConfirmState(null);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} />;
      case 'error': return <AlertCircle size={20} />;
      case 'info': return <Info size={20} />;
    }
  };

  const getColor = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-rose-500';
      case 'info': return 'bg-blue-500';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, confirm }}>
      {children}
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {notification && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] w-full max-w-md px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`${getColor(notification.type)} text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between pointer-events-auto`}
            >
              <div className="flex items-center gap-3 font-bold">
                {getIcon(notification.type)}
                {notification.message}
              </div>
              <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {confirmState && (
          <div className="fixed inset-0 z-[310] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-slate-200"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <HelpCircle size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-brand-depth mb-2">Tasdiqlash</h3>
                  <p className="text-brand-muted font-bold leading-relaxed">{confirmState.message}</p>
                </div>
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => handleConfirm(false)}
                    className="flex-1 py-4 bg-slate-100 text-brand-muted rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                  >
                    Yo'q
                  </button>
                  <button
                    onClick={() => handleConfirm(true)}
                    className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Ha, albatta
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};
