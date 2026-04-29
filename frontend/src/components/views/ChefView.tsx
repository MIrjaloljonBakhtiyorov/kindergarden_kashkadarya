import React, { useState, useEffect } from 'react';
import { ChefSanitaryCheck } from '../../features/chef/components/ChefSanitaryCheck';
import { ChefMenuDashboard } from '../../features/chef/components/ChefMenuDashboard';

const ChefView: React.FC = () => {
  const [isSanitaryPassed, setIsSanitaryPassed] = useState<boolean>(() => {
    const saved = localStorage.getItem('chef_sanitary_passed_date');
    const today = new Date().toISOString().split('T')[0];
    return saved === today;
  });

  const handleSanitaryComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('chef_sanitary_passed_date', today);
    setIsSanitaryPassed(true);
  };

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

export default ChefView;
