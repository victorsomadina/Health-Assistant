// pages/dashboards/DoctorDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, User } from 'lucide-react';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-teal-600">WeHelp</div>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">Doctor's Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <span className="text-gray-700">{user?.name || 'Victor Somadina'}</span>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hello, {user?.name || 'Victor'}!
          </h1>
          <p className="text-gray-600">21, May 2025, Wednesday</p>
        </div>

        {/* Doctor Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || 'Victor Somadina'}</h2>
              <p className="text-gray-600">Age: {user?.age || '45'}</p>
              <button className="mt-2 bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-teal-600 text-white rounded-lg p-6 hover:bg-teal-700 cursor-pointer transition-colors">
            <MessageSquare size={48} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start New Chat</h3>
            <p className="text-teal-100">AI Symptoms Checker</p>
          </div>

          <div className="bg-teal-500 text-white rounded-lg p-6 hover:bg-teal-600 cursor-pointer transition-colors">
            <User size={48} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">View Patients</h3>
            <p className="text-teal-100">Manage Patient Records</p>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-medium">Gender:</span> {user?.gender || 'Male'}</p>
              <p><span className="font-medium">Location:</span> {user?.location || 'VI, Lagos'}</p>
              <p><span className="font-medium">Email:</span> {user?.email || 'victor_soma@gmail.com'}</p>
            </div>
            <div>
              <p><span className="font-medium">Phone:</span> {user?.phone || '+234 801 234 5888'}</p>
              <p><span className="font-medium">Hospital:</span> {user?.hospital || 'Getwell Hospital'}</p>
              <p><span className="font-medium">Years of Experience:</span> {user?.experience || '15 years'}</p>
              <p><span className="font-medium">Field:</span> {user?.specialization || 'Gynaecologist'}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-teal-600">24</div>
            <div className="text-sm text-gray-600">Active Patients</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">Today's Appointments</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-gray-600">Total Consultations</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;