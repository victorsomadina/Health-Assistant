// pages/patient/PatientChat.jsx
import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminDoctors = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Manage Doctors</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Admin Doctors interface goes here...</p>
          <p>This page is ONLY for admins!</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDoctors;