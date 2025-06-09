import React from 'react';
import { Web3Provider } from './Web3Provider';
import { NotificationProvider } from './NotificationProvider';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <Web3Provider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </Web3Provider>
  );
};
