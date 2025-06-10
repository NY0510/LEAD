import React, {createContext, useContext, useState} from 'react';

type DemoContextType = {
  isDemoMode: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
};

const DemoContext = createContext<DemoContextType>({
  isDemoMode: false,
  enableDemoMode: () => {},
  disableDemoMode: () => {},
});

export const useDemo = () => useContext(DemoContext);

export const DemoProvider = ({children}: {children: React.ReactNode}) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const enableDemoMode = () => {
    console.log('[DemoProvider] Demo mode enabled');
    setIsDemoMode(true);
  };

  const disableDemoMode = () => {
    console.log('[DemoProvider] Demo mode disabled');
    setIsDemoMode(false);
  };

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        enableDemoMode,
        disableDemoMode,
      }}>
      {children}
    </DemoContext.Provider>
  );
};
