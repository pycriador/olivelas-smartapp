import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '../ui/CommandPalette';
import { Entity360Drawer } from '@/features/inspector360/Entity360Drawer';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-loft-bg text-loft-dark font-sans antialiased">
      <Header />

      <div className="flex-1 flex flex-row items-stretch min-w-0">
        <Sidebar />

        <main className="flex-1 min-w-0 px-6 py-6 md:px-8 md:py-7 w-full transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>

      <CommandPalette />
      <Entity360Drawer />
    </div>
  );
};
