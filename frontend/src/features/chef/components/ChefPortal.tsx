import React, { useState, useEffect } from 'react';
import { ChefSanitaryCheck } from './ChefSanitaryCheck';
import { ChefMenuDashboard } from './ChefMenuDashboard';
import apiClient from '../../../api/apiClient';
import { Loader2 } from 'lucide-react';

export const ChefPortal = () => {
  const [isSanitaryPassed, setIsSanitaryPassed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const chefId = 'chef_01'; // Amalda auth contextdan olinadi
      const res = await apiClient.get(`/chef/sanitary-check/status/${chefId}/${today}`);
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
    <div className="min-h-screen bg-slate-50/50">
      {!isSanitaryPassed ? (
        <ChefSanitaryCheck onComplete={handleSanitaryComplete} />
      ) : (
        <ChefMenuDashboard />
      )}
    </div>
  );
};

