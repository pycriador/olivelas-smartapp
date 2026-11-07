import React from 'react';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  activeView: 'chat' | 'landing' | 'dashboard';
  onViewChange: (view: 'chat' | 'landing' | 'dashboard') => void;
  appName: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeView,
  onViewChange,
  appName,
}) => {
  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
      <AppHeader
        activeView={activeView}
        onViewChange={onViewChange}
        appName={appName}
      />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onViewChange={onViewChange} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
