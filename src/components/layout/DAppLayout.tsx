import React from 'react';
import type { DAppLayoutProps } from '../../types/ui';
import DAppHeader from './DAppHeader';
import { BottomNav } from '../dapp/ui/BottomNav';

export const DAppLayout: React.FC<DAppLayoutProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <DAppHeader />

      {/* Page header */}
      {(title || description) && (
        <div className="bg-gradient-to-r from-white to-forest/5 border-b border-forest/10">
          <div className="container mx-auto px-4 py-8">
            {title && <h1 className="text-2xl font-bold text-forest">{title}</h1>}
            {description && <p className="mt-1 text-slate">{description}</p>}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-forest/10">
        <div className="container mx-auto px-4 py-6 text-center text-slate text-sm">
          <div className="flex items-center justify-center mb-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 text-electric" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span className="text-forest font-medium">Decycle</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Decycle. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
};
