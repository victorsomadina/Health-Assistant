// components/layout/SuperAdminLayout.jsx
import React from 'react';
import { useSidebar } from '../../context/SidebarContext';
import SuperAdminSidebar from './SuperAdminSidebar';
import Header from './Header';

const SuperAdminLayout = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SuperAdmin Sidebar */}
      <SuperAdminSidebar />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className={`transition-all duration-300 pt-20 ${
        isOpen ? 'ml-0 lg:ml-64' : 'ml-0'
      }`}>
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;