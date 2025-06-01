// pages/dashboards/AdminDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, Users, User, X } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Registration form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    fieldErrors: {}
  });

  // Navigation handlers
  const handleRegisterDoctor = () => {
    setShowRegisterModal(true);
    setError('');
    setSuccess('');
  };

  const handleViewDoctors = () => {
    navigate('/admin/doctors'); // Route to view doctors page
  };

  const handleViewPatients = () => {
    navigate('/admin/reports'); // Route to view patients page
  };

  const handleCloseModal = () => {
    setShowRegisterModal(false);
    setFormData({ 
      name: '', 
      email: '', 
      password: '',
      fieldErrors: {}
    });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (error || formData.fieldErrors?.[name]) {
      setError('');
      setFormData(prev => ({
        ...prev,
        fieldErrors: {
          ...prev.fieldErrors,
          [name]: ''
        }
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Doctor name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Doctor name must be at least 2 characters';
    } else if (!formData.name.trim().includes(' ')) {
      newErrors.name = 'Please enter the doctor\'s first and last name';
    } else if (formData.name.trim().split(' ').filter(name => name.length > 0).length < 2) {
      newErrors.name = 'Please enter both first and last name';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Doctor name must be less than 100 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 255) {
      newErrors.email = 'Email must be less than 255 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password must be less than 128 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Store field errors in formData for individual field highlighting
    setFormData(prev => ({
      ...prev,
      fieldErrors: newErrors
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get endpoint from environment variables and replace {id} with actual admin ID
      const endpointTemplate = import.meta.env.VITE_REGISTER_DOCTOR_ENDPOINT || '/admin/signupdoctor/{id}';
      const adminId = user?.id || user?._id || user?.adminId;
      
      if (!adminId) {
        throw new Error('Admin ID not found. Please log in again.');
      }
      
      const registerEndpoint = endpointTemplate.replace('{id}', adminId);
      
      console.log('🔄 Registering new doctor...');
      console.log('👤 Admin ID:', adminId);
      console.log('📊 Form data:', formData);

      // Call your API to register doctor
      const response = await api.post(registerEndpoint, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      console.log('✅ Doctor registered successfully:', response);
      
      setSuccess('Doctor registered successfully!');
      
      // Reset form after successful registration
      setTimeout(() => {
        setFormData({ 
          name: '', 
          email: '', 
          password: '',
          fieldErrors: {}
        });
        setSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Failed to register doctor:', error);
      
      // Handle different types of errors
      if (error.response?.data?.errors) {
        // Handle field-specific errors from server
        setFormData(prev => ({
          ...prev,
          fieldErrors: error.response.data.errors
        }));
      } else {
        // Set user-friendly error message
        const errorMessage = error.response?.data?.message || error.message || 'Failed to register doctor. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get the most up-to-date user data
  const currentUser = user || {};

  return (
    <AdminLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Main Content Grid - Responsive with Order */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" key={refreshKey}>
        
        {/* Action Cards OR Register Modal - Shows FIRST on mobile, SECOND on desktop */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {!showRegisterModal ? (
            // Action Cards
            <div className="bg-[#F5F5F5] p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Register a Doctor Card */}
              <div 
                onClick={handleRegisterDoctor}
                className="bg-brand-pri text-white rounded-lg p-8 hover:bg-pri-hover cursor-pointer transition-colors text-center transform hover:scale-105 duration-200"
              >
                <div className="mb-4 flex justify-center">
                  <FileText size={60} className="text-brand-sec" />
                </div>
                <h3 className="text-xl font-bold mb-2">Register a Doctor</h3>
                <p className="text-gray-200 text-sm">Add a new Doctor</p>
              </div>

              {/* View Doctors Card */}
              <div 
                onClick={handleViewDoctors}
                className="bg-brand-sec text-white rounded-lg p-8 hover:bg-teal-600 cursor-pointer transition-colors text-center transform hover:scale-105 duration-200"
              >
                <div className="mb-4 flex justify-center">
                  <Users size={60} className="text-brand-pri" />
                </div>
                <h3 className="text-xl font-bold mb-2">View Doctors</h3>
                <p className="text-gray-200 text-sm">Manage Registered Doctors</p>
              </div>

              {/* Reports Card */}
              <div 
                onClick={handleViewPatients}
                className="bg-brand-pri text-white rounded-lg p-8 hover:bg-pri-hover cursor-pointer transition-colors text-center transform hover:scale-105 duration-200"
              >
                <div className="mb-4 flex justify-center">
                  <Users size={60} className="text-brand-sec" />
                </div>
                <h3 className="text-xl font-bold mb-2">Reports</h3>
                <p className="text-gray-200 text-sm">Check Doctors Performance</p>
              </div>
            </div>
          ) : (
            // Register Doctor Modal - Covers the action cards area with proper sizing
            <div className="bg-brand-pri rounded-lg p-6 text-white min-h-96">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Register a doctor</h2>
                  <div className="h-0.5 w-16 bg-teal-400 mt-2"></div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-600 text-white rounded-md text-sm max-w-md">
                  ✅ {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-600 text-white rounded-md text-sm max-w-md">
                  ❌ {error}
                </div>
              )}

              {/* Registration Form - Left aligned with limited width */}
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                {/* Name Field */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:outline-none ${
                      formData.fieldErrors?.name 
                        ? 'focus:ring-2 focus:ring-red-400 border border-red-400' 
                        : 'focus:ring-2 focus:ring-teal-300'
                    }`}
                    placeholder="Enter doctor's full name"
                    disabled={isLoading}
                  />
                  {formData.fieldErrors?.name && (
                    <p className="mt-1 text-red-400 text-xs">{formData.fieldErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:outline-none ${
                      formData.fieldErrors?.email 
                        ? 'focus:ring-2 focus:ring-red-400 border border-red-400' 
                        : 'focus:ring-2 focus:ring-teal-300'
                    }`}
                    placeholder="Enter doctor's email"
                    disabled={isLoading}
                  />
                  {formData.fieldErrors?.email && (
                    <p className="mt-1 text-red-400 text-xs">{formData.fieldErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:outline-none ${
                      formData.fieldErrors?.password 
                        ? 'focus:ring-2 focus:ring-red-400 border border-red-400' 
                        : 'focus:ring-2 focus:ring-teal-300'
                    }`}
                    placeholder="Enter temporary password"
                    disabled={isLoading}
                  />
                  {formData.fieldErrors?.password && (
                    <p className="mt-1 text-red-400 text-xs">{formData.fieldErrors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-brand-sec text-white px-8 py-3 rounded-md font-medium hover:bg-teal-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Admin/Hospital Info + Information - Shows SECOND on mobile, FIRST on desktop */}
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          {/* Admin Info Card - Updated to show latest data */}
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <div className="text-center">
              {/* Profile Picture */}
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-gray-600" />
              </div>
              
              {/* Admin Details - Using current user data */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {currentUser.hospitalName || currentUser.name || 'Hospital Admin'}
              </h2>
              <p className="text-gray-600 mb-4">{currentUser.location || 'Location not specified'}</p>
            </div>
          </div>

          {/* Information Section - Updated to show latest data */}
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Information:</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-900">Hospital Name:</span>
                <span className="ml-2 text-gray-700">{currentUser.hospitalName || currentUser.name || ''}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Location:</span>
                <span className="ml-2 text-gray-700">{currentUser.location || ''}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Email:</span>
                <span className="ml-2 text-gray-700">{currentUser.email || ''}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Role:</span>
                <span className="ml-2 text-gray-700">{currentUser.role === 'admin' ? 'Hospital Admin' : currentUser.role || ''}</span>
              </div>
              {currentUser.createdAt && (
                <div>
                  <span className="font-medium text-gray-900">Joined:</span>
                  <span className="ml-2 text-gray-700">
                    {new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;