// pages/dashboards/SuperAdminDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Users, UserPlus, BarChart3, Shield, TrendingUp } from 'lucide-react';


const SuperAdminDashboard = () => {
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
              <span className="text-gray-600">Super Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                  <div className="text-white text-xs font-bold">SA</div>
                </div>
                <span className="text-gray-700">Super Admin</span>
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
            Hello, Super Admin!
          </h1>
          <p className="text-gray-600">21, May 2025, Wednesday</p>
        </div>

        {/* WeHelp Brand Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-center">
          <div className="text-4xl font-bold text-teal-600 mb-2">WeHelp</div>
          <p className="text-gray-600">Healthcare Platform Administration</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-teal-600 text-white rounded-lg p-6 hover:bg-teal-700 cursor-pointer transition-colors">
            <UserPlus size={48} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Register a Hospital</h3>
            <p className="text-teal-100">Add a new Hospital</p>
          </div>

          <div className="bg-teal-500 text-white rounded-lg p-6 hover:bg-teal-600 cursor-pointer transition-colors">
            <Building2 size={48} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">View Hospitals</h3>
            <p className="text-teal-100">Manage Registered Hospitals</p>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Building2 size={32} className="mx-auto text-teal-600 mb-2" />
            <div className="text-2xl font-bold text-teal-600">25</div>
            <div className="text-sm text-gray-600">Hospitals</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Shield size={32} className="mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">48</div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Users size={32} className="mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">342</div>
            <div className="text-sm text-gray-600">Doctors</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Users size={32} className="mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-purple-600">12,450</div>
            <div className="text-sm text-gray-600">Patients</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <TrendingUp size={32} className="mx-auto text-orange-600 mb-2" />
            <div className="text-2xl font-bold text-orange-600">45,678</div>
            <div className="text-sm text-gray-600">Consultations</div>
          </div>
        </div>

        {/* Platform Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Growth Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="mr-2 text-teal-600" size={20} />
              Platform Growth
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Hospitals This Month</span>
                <span className="font-semibold text-green-600">+3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Doctors This Month</span>
                <span className="font-semibold text-blue-600">+24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Patients This Month</span>
                <span className="font-semibold text-purple-600">+1,245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Active Users</span>
                <span className="font-semibold text-teal-600">8,934</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="mr-2 text-green-600" size={20} />
              System Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Server Uptime</span>
                <span className="font-semibold text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold text-green-600">200ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Sessions</span>
                <span className="font-semibold text-blue-600">2,341</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Storage Used</span>
                <span className="font-semibold text-orange-600">67%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Platform Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Building2 size={20} className="text-teal-600" />
                <div>
                  <p className="font-medium">New hospital registered</p>
                  <p className="text-sm text-gray-600">Lifecare Medical Center • Lagos • 1 hour ago</p>
                </div>
              </div>
              <span className="text-green-600 text-sm font-medium">New</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield size={20} className="text-blue-600" />
                <div>
                  <p className="font-medium">Admin account created</p>
                  <p className="text-sm text-gray-600">Sacred Heart Hospital • Abuja • 3 hours ago</p>
                </div>
              </div>
              <span className="text-blue-600 text-sm font-medium">Admin</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp size={20} className="text-green-600" />
                <div>
                  <p className="font-medium">Monthly analytics report generated</p>
                  <p className="text-sm text-gray-600">System automated report • 6 hours ago</p>
                </div>
              </div>
              <span className="text-gray-600 text-sm font-medium">Report</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-purple-600" />
                <div>
                  <p className="font-medium">Platform milestone reached</p>
                  <p className="text-sm text-gray-600">10,000+ patients milestone • Yesterday</p>
                </div>
              </div>
              <span className="text-purple-600 text-sm font-medium">Milestone</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;