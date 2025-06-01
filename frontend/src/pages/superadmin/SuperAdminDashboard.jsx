// pages/dashboards/SuperAdminDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, Building2, User, TrendingUp, X } from 'lucide-react';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { api } from '../../services/api';
import wehelp_logo from '../../assets/images/wehelp_logo.png';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Registration form state
  const [formData, setFormData] = useState({
    hospitalName: '',
    location: '',
    email: '',
    password: '',
    fieldErrors: {}
  });

  // Navigation handlers
  const handleRegisterHospital = () => {
    setShowRegisterModal(true);
    setError('');
    setSuccess('');
  };

  const handleViewHospitals = () => {
    navigate('/superadmin/hospitals'); // Route to view hospitals page
  };

  const handleViewAnalytics = () => {
    navigate('/superadmin/analytics'); // Route to analytics page
  };

  const handleCloseModal = () => {
    setShowRegisterModal(false);
    setFormData({ 
      hospitalName: '', 
      location: '', 
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

    // Hospital Name validation
    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital name is required';
    } else if (formData.hospitalName.trim().length < 2) {
      newErrors.hospitalName = 'Hospital name must be at least 2 characters';
    } else if (formData.hospitalName.trim().length > 100) {
      newErrors.hospitalName = 'Hospital name must be less than 100 characters';
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    } else if (formData.location.trim().length > 100) {
      newErrors.location = 'Location must be less than 100 characters';
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
      // Get endpoint from environment variables
      const registerEndpoint = import.meta.env.VITE_REGISTER_HOSPITAL_ENDPOINT || '/superadmin/register-hospital';
      
      console.log('🔄 Registering new hospital...');
      console.log('📊 Form data:', formData);

      // Call your API to register hospital
      const response = await api.post(registerEndpoint, {
        hospitalName: formData.hospitalName.trim(),
        location: formData.location.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      console.log('✅ Hospital registered successfully:', response);
      
      setSuccess('Hospital registered successfully!');
      
      // Reset form after successful registration
      setTimeout(() => {
        setFormData({ 
          hospitalName: '', 
          location: '', 
          email: '', 
          password: '',
          fieldErrors: {}
        });
        setSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Failed to register hospital:', error);
      
      // Handle different types of errors
      if (error.response?.data?.errors) {
        // Handle field-specific errors from server
        setFormData(prev => ({
          ...prev,
          fieldErrors: error.response.data.errors
        }));
      } else {
        // Set user-friendly error message
        const errorMessage = error.response?.data?.message || error.message || 'Failed to register hospital. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get the most up-to-date user data
  const currentUser = user || {};

  // Platform data with real user information
  const platformData = {
    name: 'WeHelp Platform',
    role: 'Super Administrator',
    email: currentUser.email || 'superadmin@wehelp.com'
  };

  return (
    <SuperAdminLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Super Admin Dashboard</h1>
      </div>

      {/* Main Content Grid - Responsive with Order */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" key={refreshKey}>
        
        {/* Action Cards OR Register Modal - Shows FIRST on mobile, SECOND on desktop */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {!showRegisterModal ? (
            // Action Cards
            <div className="bg-[#F5F5F5] p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Register a Hospital Card */}
              <div 
                onClick={handleRegisterHospital}
                className="bg-brand-pri text-white rounded-lg p-8 hover:bg-pri-hover cursor-pointer transition-colors text-center transform hover:scale-105 duration-200"
              >
                <div className="mb-4 flex justify-center">
                  <FileText size={60} className="text-brand-sec" />
                </div>
                <h3 className="text-xl font-bold mb-2">Register a Hospital</h3>
                <p className="text-gray-200 text-sm">Add a new Hospital</p>
              </div>

              {/* View Hospitals Card */}
              <div 
                onClick={handleViewHospitals}
                className="bg-brand-sec text-white rounded-lg p-8 hover:bg-teal-600 cursor-pointer transition-colors text-center transform hover:scale-105 duration-200"
              >
                <div className="mb-4 flex justify-center">
                  <Building2 size={60} className="text-brand-pri" />
                </div>
                <h3 className="text-xl font-bold mb-2">View Hospitals</h3>
                <p className="text-gray-200 text-sm">Manage Registered Hospitals</p>
              </div>

              {/* Analytics Card */}
              <div 
                onClick={handleViewAnalytics}
                className="bg-brand-pri text-white rounded-lg p-8 hover:bg-pri-hover cursor-pointer transition-colors text-center transform hover:scale-105 duration-200"
              >
                <div className="mb-4 flex justify-center">
                  <TrendingUp size={60} className="text-brand-sec" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analytics</h3>
                <p className="text-gray-200 text-sm">Platform Analytics</p>
              </div>
            </div>
          ) : (
            // Register Hospital Modal - Covers the action cards area with proper sizing
            <div className="bg-brand-pri rounded-lg p-6 text-white min-h-96">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Register a hospital</h2>
                  <div className="h-0.5 w-16 bg-brand-sec mt-2"></div>
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
                {/* Hospital Name Field */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:outline-none ${
                      formData.fieldErrors?.hospitalName 
                        ? 'focus:ring-2 focus:ring-red-400 border border-red-400' 
                        : 'focus:ring-2 focus:ring-teal-300'
                    }`}
                    placeholder="Enter hospital name"
                    disabled={isLoading}
                  />
                  {formData.fieldErrors?.hospitalName && (
                    <p className="mt-1 text-red-400 text-xs">{formData.fieldErrors.hospitalName}</p>
                  )}
                </div>

                {/* Location Field */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:outline-none ${
                      formData.fieldErrors?.location 
                        ? 'focus:ring-2 focus:ring-red-400 border border-red-400' 
                        : 'focus:ring-2 focus:ring-teal-300'
                    }`}
                    placeholder="Enter hospital location"
                    disabled={isLoading}
                  />
                  {formData.fieldErrors?.location && (
                    <p className="mt-1 text-red-400 text-xs">{formData.fieldErrors.location}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:outline-none ${
                      formData.fieldErrors?.email 
                        ? 'focus:ring-2 focus:ring-red-400 border border-red-400' 
                        : 'focus:ring-2 focus:ring-teal-300'
                    }`}
                    placeholder="Enter admin email"
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
                  className="bg-brand-sec text-white px-8 py-3 rounded-md font-medium hover:bg-pri-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center"
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

        {/* Platform Info + Information - Shows SECOND on mobile, FIRST on desktop */}
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          {/* Platform Info Card with WeHelp Logo */}
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <div className="text-center">
              {/* WeHelp Logo */}
              <img src={wehelp_logo} alt="WeHelp Logo" className="w-full h-16 object-contain mb-4" />
              
              {/* Platform Details */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {currentUser.name || 'Super Admin'}
              </h2>
              <p className="text-gray-600 mb-4">{platformData.role}</p>
            </div>
          </div>

          {/* Information Section - Updated to show real user data */}
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Information:</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-900">Platform:</span>
                <span className="ml-2 text-gray-700">{platformData.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Name:</span>
                <span className="ml-2 text-gray-700">{currentUser.name || 'Super Admin'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Role:</span>
                <span className="ml-2 text-gray-700">{platformData.role}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Email:</span>
                <span className="ml-2 text-gray-700">{platformData.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Access Level:</span>
                <span className="ml-2 text-gray-700">Full Platform Access</span>
              </div>
              {currentUser.createdAt && (
                <div>
                  <span className="font-medium text-gray-900">Account Created:</span>
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
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;