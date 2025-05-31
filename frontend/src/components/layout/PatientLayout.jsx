// components/layout/PatientLayout.jsx
import React from 'react';
import PatientSidebar from './PatientSidebar';
import Header from './Header'; // You can reuse the same header or create separate ones

const PatientLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Patient Sidebar */}
      <PatientSidebar />
      
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

export default PatientLayout;