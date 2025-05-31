import React from 'react';
import AdminSidebar from './AdminSidebar';
import Header from './Header';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Admin Sidebar */}
      <AdminSidebar />
      
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

export default AdminLayout;