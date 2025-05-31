// pages/patient/PatientChat.jsx
import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminReports = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Report</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Admin report interface goes here...</p>
          <p>This page is ONLY for admins!</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;