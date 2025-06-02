// pages/patient/PatientDoctors.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, User, Filter, X, AlertCircle } from 'lucide-react';
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
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(10);

  // Fetch doctors and specialties on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch doctors from single endpoint
        const doctorsData = await doctorService.getAllDoctors();
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        
        // Extract specialties from doctors data
        const uniqueSpecialties = [...new Set(doctorsData.map(doctor => doctor.field))].filter(Boolean);
        setSpecialties(uniqueSpecialties.sort());
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.message || 'Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter doctors based on search and specialty (client-side filtering)
  useEffect(() => {
    const filterDoctors = () => {
      let filtered = doctors;

      // Filter by search term
      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(doctor =>
          (doctor.name && doctor.name.toLowerCase().includes(searchLower)) ||
          (doctor.field && doctor.field.toLowerCase().includes(searchLower)) ||
          (doctor.hospital && doctor.hospital.toLowerCase().includes(searchLower)) ||
          (doctor.location && doctor.location.toLowerCase().includes(searchLower)) ||
          (doctor.professionalDescription && doctor.professionalDescription.toLowerCase().includes(searchLower))
        );
      }

      // Filter by specialty
      if (selectedSpecialty) {
        filtered = filtered.filter(doctor => doctor.field === selectedSpecialty);
      }

      setFilteredDoctors(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    };

    // Set searching state
    setIsSearching(true);
    
    // Debounce the filtering for better performance
    const debounceTimer = setTimeout(() => {
      filterDoctors();
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedSpecialty, doctors]);

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    try {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      return 'N/A';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('');
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const endIndex = startIndex + doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const retryFetch = () => {
    window.location.reload(); // Simple retry by reloading
  };

  if (isLoading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  if (error) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center max-w-md">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Doctors</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={retryFetch}
              className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
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
      <div className="bg-gradient-to-r from-[#F0FDFA] to-[#C3E9ED] rounded-lg shadow-sm p-6 mb-6">
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
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
              </div>
            )}
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

        {/* Results Count and Pagination Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredDoctors.length)} of {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
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
              {currentDoctors.map(doctor => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-brand-pri" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doctor.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{doctor.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.field || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.hospital || doctor.hospitalName || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{doctor.location || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {doctor.yearsOfExperience ? `${doctor.yearsOfExperience} years` : 'N/A'}
                    </div>
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
        {filteredDoctors.length === 0 && !isSearching && (
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

      {/* Pagination */}
      {filteredDoctors.length > doctorsPerPage && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            {/* Mobile pagination */}
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredDoctors.length)}</span> of{' '}
                <span className="font-medium">{filteredDoctors.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((pageNumber, index) => (
                  <span key={index}>
                    {pageNumber === '...' ? (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNumber === currentPage
                            ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )}
                  </span>
                ))}

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

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
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedDoctor.name || 'N/A'}</h2>
                  <p className="text-teal-600 font-medium text-lg">{selectedDoctor.field || 'N/A'}</p>
                </div>
              </div>

              {/* Doctor Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Email:</span>
                      <span className="text-gray-600">{selectedDoctor.email || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Phone:</span>
                      <span className="text-gray-600">{selectedDoctor.phone || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Gender:</span>
                      <span className="text-gray-600">{selectedDoctor.gender || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Age:</span>
                      <span className="text-gray-600">
                        {selectedDoctor.age || calculateAge(selectedDoctor.DOB) || 'N/A'} 
                        {(selectedDoctor.age || calculateAge(selectedDoctor.DOB)) && ' years'}
                      </span>
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
                      <span className="text-gray-600">{selectedDoctor.hospital || selectedDoctor.hospitalName || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Location:</span>
                      <span className="text-gray-600">{selectedDoctor.location || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Experience:</span>
                      <span className="text-gray-600">
                        {selectedDoctor.yearsOfExperience ? `${selectedDoctor.yearsOfExperience} years` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Specialty:</span>
                      <span className="text-gray-600">{selectedDoctor.field || 'N/A'}</span>
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