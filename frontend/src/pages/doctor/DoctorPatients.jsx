// pages/doctor/DoctorPatients.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, User, Filter, X, MapPin, Phone, Mail } from 'lucide-react';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { patientService } from '../../services/patientService';

const DoctorPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch patients and locations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [patientsData, locationsData] = await Promise.all([
          patientService.getAllPatients(),
          patientService.getLocations()
        ]);
        
        setPatients(patientsData);
        setFilteredPatients(patientsData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Handle error (show toast, etc.)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter patients based on search and location
  useEffect(() => {
    const filterPatients = async () => {
      try {
        if (searchTerm || selectedLocation) {
          const filtered = await patientService.searchPatients(searchTerm, selectedLocation);
          setFilteredPatients(filtered);
        } else {
          setFilteredPatients(patients);
        }
      } catch (error) {
        console.error('Failed to filter patients:', error);
        setFilteredPatients(patients);
      }
    };

    filterPatients();
  }, [searchTerm, selectedLocation, patients]);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
  };

  if (isLoading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-pri">My Patients</h1>
        <p className="text-gray-600 mt-1">View and manage your patient records</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-2 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none appearance-none"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            Showing {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedLocation && ` in ${selectedLocation}`}
          </div>
          
          {(searchTerm || selectedLocation) && (
            <button
              onClick={clearFilters}
              className="text-sm text-teal-600 hover:text-teal-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-brand-pri" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{calculateAge(patient.DOB)} years</div>
                    <div className="text-sm text-gray-500">{formatDate(patient.DOB)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.phone}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(patient.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewPatient(patient)}
                      className="px-3 py-1 border border-teal-600 text-teal-600 rounded hover:bg-teal-50 transition-colors font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all patients.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Patient View Modal */}
      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Patient Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Patient Header */}
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <User size={40} className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-teal-600 font-medium text-lg">{selectedPatient.gender}</p>
                  <p className="text-gray-600 text-sm">{calculateAge(selectedPatient.DOB)} years old</p>
                </div>
              </div>

              {/* Patient Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-700 w-16">Email:</span>
                      <span className="text-gray-600">{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-700 w-16">Phone:</span>
                      <span className="text-gray-600">{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-700 w-16">Location:</span>
                      <span className="text-gray-600">{selectedPatient.location}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Gender:</span>
                      <span className="text-gray-600">{selectedPatient.gender}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Age:</span>
                      <span className="text-gray-600">{formatDate(selectedPatient.age)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Medical Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Known Allergies:</span>
                      <span className={`text-sm ${selectedPatient.knownAllergies ? 'text-red-600' : 'text-gray-500'}`}>
                        {selectedPatient.knownAllergies || 'None reported'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Chronic Conditions:</span>
                      <span className={`text-sm ${selectedPatient.chronicConditions ? 'text-orange-600' : 'text-gray-500'}`}>
                        {selectedPatient.chronicConditions || 'None reported'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Joined:</span>
                      <span className="text-gray-600">{formatDate(selectedPatient.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  onClick={() => {
                    // TODO: Navigate to patient's medical records or appointment booking
                    console.log('View medical records for:', selectedPatient.id);
                  }}
                >
                  View Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
};

export default DoctorPatients;