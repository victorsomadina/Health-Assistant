// pages/dashboards/PatientDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { MessageSquare, User, Mic } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Patient Dashboard</h1>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <User size={32} className="text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name || 'Abdullah Badrudeen'}</h2>
            <p className="text-gray-600">Age: {user?.age || '36'}</p>
            <button className="mt-2 bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700">
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-teal-600 text-white rounded-lg p-6 hover:bg-teal-700 cursor-pointer transition-colors">
          <MessageSquare size={48} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">Start New Chat</h3>
          <p className="text-teal-100">AI Symptoms Checker</p>
        </div>

        <div className="bg-teal-500 text-white rounded-lg p-6 hover:bg-teal-600 cursor-pointer transition-colors">
          <User size={48} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">View Doctors</h3>
          <p className="text-teal-100">Book Consultation</p>
        </div>

        <div className="bg-teal-700 text-white rounded-lg p-6 hover:bg-teal-800 cursor-pointer transition-colors">
          <Mic size={48} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">View Records</h3>
          <p className="text-teal-100">Past Conversations</p>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Information:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-medium">Gender:</span> {user?.gender || 'Male'}</p>
            <p><span className="font-medium">Location:</span> {user?.location || 'Yaba, Lagos'}</p>
            <p><span className="font-medium">Email:</span> {user?.email || 'abdullahi_badru@gmail.com'}</p>
          </div>
          <div>
            <p><span className="font-medium">Phone:</span> {user?.phone || '+234 801 234 5678'}</p>
            <p><span className="font-medium">Known Allergies:</span> {user?.allergies || 'Penicillin, Shellfish'}</p>
            <p><span className="font-medium">Chronic Conditions:</span> {user?.conditions || 'Hypertension (2020)'}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;