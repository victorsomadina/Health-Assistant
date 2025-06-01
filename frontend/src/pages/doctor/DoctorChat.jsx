// pages/patient/PatientChat.jsx
import React from 'react';
import DoctorLayout from '../../components/layout/DoctorLayout';

const DoctorChat = () => {
  return (
    <DoctorLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Chat</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Patient chat interface goes here...</p>
          <p>This page is ONLY for patients!</p>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorChat;