// pages/patient/PatientRecords.jsx
import React from 'react';
import PatientLayout from '../../components/layout/PatientLayout';

const PatientRecords = () => {
  return (
    <PatientLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Medical Records</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Patient medical records go here...</p>
          <p>This page is ONLY for patients!</p>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientRecords;