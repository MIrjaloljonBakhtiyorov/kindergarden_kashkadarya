import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InspectionContextType {
  progress: number;
  setProgress: (val: number) => void;
  canSubmit: boolean;
  setCanSubmit: (val: boolean) => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export const InspectionProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);

  return (
    <InspectionContext.Provider value={{ progress, setProgress, canSubmit, setCanSubmit }}>
      {children}
    </InspectionContext.Provider>
  );
};

export const useInspection = () => {
  const context = useContext(InspectionContext);
  if (!context) throw new Error('useInspection must be used within InspectionProvider');
  return context;
};
