import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import brand_logo from "../../../assets/images/wehelp_logo.png";
import sign_up_image from "../../../assets/images/sign_up_image.png";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else if (!formData.fullName.trim().includes(' ')) {
      newErrors.fullName = 'Please enter your first and last name';
    } else if (formData.fullName.trim().split(' ').filter(name => name.length > 0).length < 2) {
      newErrors.fullName = 'Please enter both first and last name';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessModal(true);
        setFormData({ fullName: '', email: '', password: '' });
        
      } else {
        // Handle server errors
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || 'Something went wrong. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleLoginRedirect = () => {
    setShowSuccessModal(false);
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Illustration */}
        <div className="w-full lg:w-[50%] lg:min-w-[50%] lg:max-w-[50%] bg-[#EBF4F5] flex flex-col justify-center items-center p-6 sm:p-8 lg:p-16">
          <div className="max-w-md text-center w-full">
            {/* Logo */}
            <div className="mb-6 lg:mb-8 flex justify-center">
              <img src={brand_logo} alt="WeHelp Logo" className="w-32 sm:w-40 lg:w-48" />
            </div>

            {/* Illustration */}
            <div className="mb-6 lg:mb-8 relative">
              <img src={sign_up_image} alt="Sign Up Illustration" className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto" />
            </div>

            {/* Text */}
            <p className="text-gray-700 text-sm font-semibold leading-relaxed px-4 sm:px-0">
              Get quick, intelligent guidance for your health—
              <br />
              anytime, anywhere. Your assistant is just a few clicks away.
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-[50%] lg:min-w-[50%] lg:max-w-[50%] bg-brand-pri flex flex-col justify-center items-center p-6 sm:p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-white text-2xl sm:text-3xl font-bold mb-3 lg:mb-4">
                Start Your
                <br />
                Smart Health Journey
              </h1>
              <p className="text-teal-200 text-sm">
                Smart health support starts here
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* General Error Message */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {errors.general}
                </div>
              )}

              <div className="space-y-4 sm:space-y-6 mb-6 lg:mb-8">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 text-sm sm:text-base ${
                      errors.fullName 
                        ? 'focus:ring-red-400 border border-red-400' 
                        : 'focus:ring-teal-400'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-red-400 text-xs">{errors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 text-sm sm:text-base ${
                      errors.email 
                        ? 'focus:ring-red-400 border border-red-400' 
                        : 'focus:ring-teal-400'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-400 text-xs">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 pr-12 text-sm sm:text-base ${
                        errors.password 
                          ? 'focus:ring-red-400 border border-red-400' 
                          : 'focus:ring-teal-400'
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-red-400 text-xs">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Sign up button */}
              <div className="flex justify-center mb-4 lg:mb-5">
                <button 
                  type="submit"
                  className="w-1/2 sm:w-2/5 bg-brand-sec hover:bg-teal-600 text-white font-semibold py-3 rounded transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Sign up'
                  )}
                </button>
              </div>
            </form>

            {/* Login link */}
            <p className="text-center text-[#E4E4E4] text-sm mb-8 lg:mb-12">
              Already have an account?{' '}
              <a href="#" className="text-white font-bold underline hover:no-underline">
                LOG IN
              </a>
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="bg-[rgba(235,244,245,0.2)] rounded-lg p-3 sm:p-4 mb-2 h-16 sm:h-20 flex flex-col justify-center">
                  <div className="text-white text-xl sm:text-2xl font-semibold">Easy</div>
                  <div className="text-teal-200 text-xs">to use</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[rgba(235,244,245,0.2)] rounded-lg p-3 sm:p-4 mb-2 h-16 sm:h-20 flex flex-col justify-center">
                  <div className="text-white text-xl sm:text-2xl font-semibold">100%</div>
                  <div className="text-teal-200 text-xs">Secure &<br />encrypted</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[rgba(235,244,245,0.2)] rounded-lg p-3 sm:p-4 mb-2 h-16 sm:h-20 flex flex-col justify-center">
                  <div className="text-white text-xl sm:text-2xl font-semibold">24/7</div>
                  <div className="text-teal-200 text-xs">Availability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal content */}
            <div className="p-8 text-center">
              {/* Success Icon - Circular checkmark like in your design */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 mb-6">
                <svg className="w-16 h-16 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>

              {/* Success Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Successful</h2>
              
              {/* Success Message */}
              <p className="text-gray-600 mb-8">
                Welcome Abroad. Registration Successful
              </p>

              {/* Action Buttons - Matching your design */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleLoginRedirect}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}