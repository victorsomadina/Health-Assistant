import React from 'react';
import SuperAdminSidebar from './SuperAdminSidebar';
import Header from './Header';

const SuperAdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* SuperAdmin Sidebar */}
      <SuperAdminSidebar />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="ml-64 pt-20">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;