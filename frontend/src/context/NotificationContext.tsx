import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
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

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

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
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <AnimatePresence>
        {notification && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4 pointer-events-none">
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
    </NotificationContext.Provider>
  );
};
