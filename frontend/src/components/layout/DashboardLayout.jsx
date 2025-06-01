// components/layout/DashboardLayout.jsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Full height, fixed position */}
      <Sidebar />
      
      {/* Header - Fixed at top, starts after sidebar */}
      <Header />
      
      {/* Main Content - Starts after sidebar and header */}
      <main className="ml-64 pt-20">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;