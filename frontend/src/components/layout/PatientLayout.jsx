// components/layout/PatientLayout.jsx
import React from 'react';
import { useSidebar } from '../../context/SidebarContext';
import PatientSidebar from './PatientSidebar';
import Header from './Header';

const PatientLayout = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-white">
      {/* Patient Sidebar */}
      <PatientSidebar />
      
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

export default PatientLayout;