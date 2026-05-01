import React, { useState, useEffect } from 'react';
import { ChefSanitaryCheck } from '../../features/chef/components/ChefSanitaryCheck';
import { ChefMenuDashboard } from '../../features/chef/components/ChefMenuDashboard';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import { Loader2 } from 'lucide-react';

const ChefView: React.FC = () => {
  const { user } = useAuth();
  const [isSanitaryPassed, setIsSanitaryPassed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, [user]);

  const checkStatus = async () => {
    if (!user) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await apiClient.get(`/chef/sanitary-check/status/${user.id}/${today}`);
      setIsSanitaryPassed(res.data.passed);
    } catch (err) {
      console.error("Status check error:", err);
      setIsSanitaryPassed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSanitaryComplete = () => {
    setIsSanitaryPassed(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      {!isSanitaryPassed ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] shadow-2xl">
            <ChefSanitaryCheck onComplete={handleSanitaryComplete} />
          </div>
        </div>
      ) : (
        <ChefMenuDashboard />
      )}
    </div>
  );
};

export default ChefView;
