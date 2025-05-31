import React from 'react';
import DoctorSidebar from './DoctorSidebar';
import Header from './Header';

const DoctorLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Doctor Sidebar */}
      <DoctorSidebar />
      
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

export default DoctorLayout;