// pages/dashboards/AdminDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Users, Building2 } from 'lucide-react';

const AdminDashboard = () => {
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
              <span className="text-gray-600">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                  <Building2 size={16} className="text-white" />
                </div>
                <span className="text-gray-700">Getwell Hospital</span>
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
            Hello, Admin (Getwell Hospital)!
          </h1>
          <p className="text-gray-600">21, May 2025, Wednesday</p>
        </div>

        {/* Hospital Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
              <Building2 size={32} className="text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Getwell Hospital</h2>
              <p className="text-gray-600">VI, Lagos</p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-teal-600 text-white rounded-lg p-6 hover:bg-teal-700 cursor-pointer transition-colors">
            <UserPlus size={48} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Register a Doctor</h3>
            <p className="text-teal-100">Add a new Doctor</p>
          </div>

          <div className="bg-teal-500 text-white rounded-lg p-6 hover:bg-teal-600 cursor-pointer transition-colors">
            <Users size={48} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">View Doctors</h3>
            <p className="text-teal-100">Manage Registered Doctors</p>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-medium">Name:</span> {user?.hospitalName || 'Getwell Hospital'}</p>
              <p><span className="font-medium">Location:</span> {user?.location || 'VI, Lagos'}</p>
            </div>
            <div>
              <p><span className="font-medium">Email:</span> {user?.email || 'getwell_hospital@gmail.com'}</p>
              <p><span className="font-medium">Phone:</span> {user?.phone || '+234 801 234 5000'}</p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Active Doctors</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">248</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1,234</div>
            <div className="text-sm text-gray-600">Total Consultations</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.9</div>
            <div className="text-sm text-gray-600">Hospital Rating</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Dr. Victor Somadina registered</p>
                <p className="text-sm text-gray-600">Gynaecologist • 2 hours ago</p>
              </div>
              <span className="text-green-600 text-sm">New</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">New patient consultation completed</p>
                <p className="text-sm text-gray-600">Abdullah Badrudeen • 4 hours ago</p>
              </div>
              <span className="text-blue-600 text-sm">Completed</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Monthly report generated</p>
                <p className="text-sm text-gray-600">System • 1 day ago</p>
              </div>
              <span className="text-gray-600 text-sm">Report</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;