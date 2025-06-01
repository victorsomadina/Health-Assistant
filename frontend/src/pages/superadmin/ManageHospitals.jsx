// pages/superadmin/ManageHospitals.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Search, Plus, MapPin, Users, Calendar } from 'lucide-react';

const ManageHospitals = () => {
  const { logout } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock hospitals data - replace with real API call
  const hospitals = [
    {
      id: 1,
      name: 'Getwell Hospital',
      location: 'Victoria Island, Lagos',
      email: 'admin@getwell.com',
      phone: '+234 801 234 5000',
      doctors: 12,
      patients: 248,
      adminName: 'Hospital Admin',
      status: 'Active',
      joinDate: '2020-01-15',
      totalConsultations: 1234
    },
    {
      id: 2,
      name: 'Lifecare Medical Center',
      location: 'Ikeja, Lagos',
      email: 'admin@lifecare.com',
      phone: '+234 801 234 5001',
      doctors: 8,
      patients: 156,
      adminName: 'Medical Admin',
      status: 'Active',
      joinDate: '2021-06-20',
      totalConsultations: 890
    },
    {
      id: 3,
      name: 'Sacred Heart Hospital',
      location: 'Wuse, Abuja',
      email: 'admin@sacredheart.com',
      phone: '+234 801 234 5002',
      doctors: 15,
      patients: 320,
      adminName: 'Heart Admin',
      status: 'Under Review',
      joinDate: '2022-03-10',
      totalConsultations: 567
    },
    {
      id: 4,
      name: 'Unity Medical Hospital',
      location: 'GRA, Port Harcourt',
      email: 'admin@unity.com',
      phone: '+234 801 234 5003',
      doctors: 6,
      patients: 89,
      adminName: 'Unity Admin',
      status: 'Active',
      joinDate: '2023-08-15',
      totalConsultations: 234
    }
  ];

  const totalStats = {
    hospitals: hospitals.length,
    doctors: hospitals.reduce((sum, h) => sum + h.doctors, 0),
    patients: hospitals.reduce((sum, h) => sum + h.patients, 0),
    consultations: hospitals.reduce((sum, h) => sum + h.totalConsultations, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-teal-600">WeHelp</div>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">Platform Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-teal-600 font-semibold">Super Admin</div>
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
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Hospitals</h1>
            <p className="text-gray-600">Oversee all registered hospitals on the platform</p>
          </div>
          
          <div className="flex space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search hospitals..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            {/* Add Hospital Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Register Hospital</span>
            </button>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Building2 className="text-teal-600" size={32} />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalStats.hospitals}</div>
                <div className="text-sm text-gray-600">Total Hospitals</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="text-blue-600" size={32} />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalStats.doctors}</div>
                <div className="text-sm text-gray-600">Total Doctors</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="text-green-600" size={32} />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalStats.patients}</div>
                <div className="text-sm text-gray-600">Total Patients</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Calendar className="text-purple-600" size={32} />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalStats.consultations}</div>
                <div className="text-sm text-gray-600">Total Consultations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hospitals Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Hospitals Registry</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Building2 size={20} className="text-teal-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{hospital.name}</div>
                          <div className="text-sm text-gray-500">Joined: {hospital.joinDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin size={14} className="mr-2 text-gray-400" />
                        {hospital.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{hospital.email}</div>
                      <div className="text-sm text-gray-500">{hospital.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Doctors: {hospital.doctors}</div>
                        <div>Patients: {hospital.patients}</div>
                        <div className="text-gray-500">Consultations: {hospital.totalConsultations}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        hospital.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {hospital.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-teal-600 hover:text-teal-900 mr-4">
                        View Details
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        Analytics
                      </button>
                      {hospital.status === 'Under Review' && (
                        <button className="text-green-600 hover:text-green-900 mr-4">
                          Approve
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-900">
                        Suspend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Register Hospital Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Register New Hospital</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="General Hospital Lagos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Lagos, Nigeria"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Email</label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="admin@hospital.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Hospital Administrator"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                      Register Hospital
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageHospitals;