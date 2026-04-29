/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useAuth } from './context/AuthContext';
import LoginView from './components/views/LoginView';

// --- Layout Components ---
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

// --- View Components ---
import DirectorView from './components/views/DirectorView';
import OperatorView from './components/views/OperatorView';
import StorekeeperView from './components/views/StorekeeperView';
import ChefView from './components/views/ChefView';
import KitchenManagerView from './components/views/KitchenManagerView';
import LabView from './components/views/LabView';
import TeacherView from './components/views/TeacherView';
import NurseView from './components/views/NurseView';
import InspectorView from './components/views/InspectorView';
import SupplyView from './components/views/SupplyView';
import FinanceView from './components/views/FinanceView';

// --- Mock Data & Constants ---
import { UserRole } from './types';
import { useGroups } from './features/groups/hooks/useGroups';

const App: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole>('DIRECTOR');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { groups } = useGroups();

  useEffect(() => {
    if (user) {
      // Admin bo'lsa, automatik ravishda Operator sectioniga o'tkazamiz
      if (user.role === 'ADMIN') {
        setCurrentRole('OPERATOR');
      } else {
        setCurrentRole(user.role);
      }
    }
  }, [user]);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderCurrentView = () => {
    switch (currentRole) {
      case 'DIRECTOR':
        return <DirectorView />;
      case 'ADMIN':
        // Admin uchun default ko'rinishni OperatorView qilamiz
        return <OperatorView groups={groups} />;
      case 'OPERATOR':
        return <OperatorView groups={groups} />;
      case 'STOREKEEPER':
        return <StorekeeperView />;
      case 'KITCHEN_MANAGER':
        return <KitchenManagerView />;
      case 'CHEF':
        return <ChefView />;
      case 'LAB_CONTROLLER':
        return <LabView />;
      case 'TEACHER':
        return <TeacherView groups={groups} />;
      case 'NURSE':
        return <NurseView />;
      case 'INSPECTOR':
        return <InspectorView />;
      case 'SUPPLY':
        return <SupplyView />;
      case 'FINANCE':
        return <FinanceView />;
      default:
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Ruxsat etilmagan</h1>
            <p className="text-brand-muted mt-2">Sizning rolingiz: {currentRole}</p>
          </div>
        );
    }
  };

  const isParent = currentRole === 'PARENT';

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-brand-depth">
      {/* Sidebar - Hidden for Parents */}
      {!isParent && (
        <>
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-[55] lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {/* Sidebar container */}
          <div className={`
            fixed inset-y-0 left-0 z-[60] w-72 bg-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <Sidebar 
              activeRole={currentRole} 
              onRoleChange={(role) => {
                setCurrentRole(role as UserRole);
                setIsSidebarOpen(false); // Close on selection on mobile
              }} 
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {!isParent && (
          <TopBar 
            role={currentRole} 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
        )}
        
        <main className={`flex-1 overflow-y-auto ${isParent ? 'p-0' : 'p-4 sm:p-6 lg:p-10'}`}>
          <div className={`${isParent ? 'w-full' : 'max-w-[1600px] mx-auto'}`}>
            <AnimatePresence mode="wait">
              <div key={currentRole}>
                {renderCurrentView()}
              </div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
