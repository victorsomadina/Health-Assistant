// pages/patient/PatientChat.jsx
import React from 'react';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';

const SuperAdminHospitals = () => {
  return (
    <SuperAdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Hospitals</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Patient chat interface goes here...</p>
          <p>This page is ONLY for patients!</p>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminHospitals;