// pages/patient/PatientDoctors.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, User, Filter, X } from 'lucide-react';
import PatientLayout from '../../components/layout/PatientLayout';
import { doctorService } from '../../services/doctorService';

const PatientDoctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch doctors and specialties on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [doctorsData, specialtiesData] = await Promise.all([
          doctorService.getAllDoctors(),
          doctorService.getSpecialties()
        ]);
        
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        setSpecialties(specialtiesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Handle error (show toast, etc.)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter doctors based on search and specialty
  useEffect(() => {
    const filterDoctors = async () => {
      try {
        if (searchTerm || selectedSpecialty) {
          const filtered = await doctorService.searchDoctors(searchTerm, selectedSpecialty);
          setFilteredDoctors(filtered);
        } else {
          setFilteredDoctors(doctors);
        }
      } catch (error) {
        console.error('Failed to filter doctors:', error);
        setFilteredDoctors(doctors);
      }
    };

    filterDoctors();
  }, [searchTerm, selectedSpecialty, doctors]);

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
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
    setSelectedSpecialty('');
  };

  if (isLoading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-pri">Find Doctors</h1>
        <p className="text-gray-600 mt-1">View qualified doctors and their profiles</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-2 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors, specialties, or hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Specialty Filter */}
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none appearance-none"
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedSpecialty && ` in ${selectedSpecialty}`}
          </div>
          
          {(searchTerm || selectedSpecialty) && (
            <button
              onClick={clearFilters}
              className="text-sm text-teal-600 hover:text-teal-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.map(doctor => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-brand-pri" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.field}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.hospital}</div>
                    <div className="text-sm text-gray-500">{doctor.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.yearsOfExperience} years</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDoctor(doctor)}
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
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all available doctors.
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

      {/* Doctor View Modal */}
      {showViewModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Doctor Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Doctor Header */}
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <User size={40} className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedDoctor.name}</h2>
                  <p className="text-teal-600 font-medium text-lg">{selectedDoctor.field}</p>
                </div>
              </div>

              {/* Doctor Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Email:</span>
                      <span className="text-gray-600">{selectedDoctor.email}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Phone:</span>
                      <span className="text-gray-600">{selectedDoctor.phone}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Gender:</span>
                      <span className="text-gray-600">{selectedDoctor.gender}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Age:</span>
                      <span className="text-gray-600">{calculateAge(selectedDoctor.DOB)} years</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Consent:</span>
                      <span className={`text-sm ${selectedDoctor.recordConsent ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedDoctor.recordConsent ? 'Recording Allowed' : 'No Recording'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Professional Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Hospital:</span>
                      <span className="text-gray-600">{selectedDoctor.hospital}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Location:</span>
                      <span className="text-gray-600">{selectedDoctor.location}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Experience:</span>
                      <span className="text-gray-600">{selectedDoctor.yearsOfExperience} years</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Specialty:</span>
                      <span className="text-gray-600">{selectedDoctor.field}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Description */}
              {selectedDoctor.professionalDescription && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">About the Doctor</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedDoctor.professionalDescription}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
};

export default PatientDoctors;