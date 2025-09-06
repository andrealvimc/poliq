'use client';

import React from 'react';
import { PublicHeader } from '../public/PublicHeader';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};
