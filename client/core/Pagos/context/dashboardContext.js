import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [state, setState] = useState({
    selectedYear: null,
    montoConfig: null,
    refreshCounter: 0
  });

  const handleYearChange = (year, monto) => {
    setState(prev => ({
      ...prev,
      selectedYear: year,
      montoConfig: monto,
      refreshCounter: prev.refreshCounter + 1
    }));
  };

  return (
    <DashboardContext.Provider value={{
      ...state,
      handleYearChange
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard debe usarse dentro de DashboardProvider');
  }
  return context;
};