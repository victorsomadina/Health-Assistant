// components/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import brand_logo from "../../assets/images/wehelp_logo.png";
import login_img from "../../assets/images/login_img.png";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, getDashboardRoute } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || getDashboardRoute();
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state, getDashboardRoute]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

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
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Navigation is handled by useEffect hook
        const redirectTo = location.state?.from?.pathname || getDashboardRoute();
        navigate(redirectTo, { replace: true });
      } else {
        setErrors({ 
          general: result.error || 'Invalid credentials. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    const signupUrl = import.meta.env.VITE_SIGNUP_URL || '/signup';
    navigate(signupUrl);
  };

  return (
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
            <img src={login_img} alt="Login Illustration" className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto" />
          </div>

          {/* Text */}
          <p className="text-gray-700 text-sm font-semibold leading-relaxed px-4 sm:px-0">
            Continue monitoring your health, reviewing reports,
            <br />
            and receiving personalized care with advanced AI
            <br />
            tools.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[50%] lg:min-w-[50%] lg:max-w-[50%] bg-brand-pri flex flex-col justify-center items-center p-6 sm:p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-white text-2xl sm:text-3xl font-bold mb-3 lg:mb-4">
              Welcome Back to
              <br />
              <span className="text-brand-sec">WeHelp</span>
            </h1>
            <p className="text-teal-200 text-sm">
              Your AI-powered assistant is ready to help
              <br />
              just sign in to continue.
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
                  type="email"
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

            {/* Login button */}
            <div className="flex justify-center mb-4 lg:mb-5">
              <button 
                type="submit"
                className="w-1/2 sm:w-2/5 bg-brand-sec hover:bg-teal-700 text-white font-semibold py-3 rounded transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          {/* Signup link */}
          <p className="text-center text-[#E4E4E4] text-sm mb-8 lg:mb-12">
            Don't have an account?{' '}
            <button 
              onClick={handleSignupRedirect}
              className="text-white font-bold underline hover:no-underline cursor-pointer bg-transparent border-none"
            >
              SIGN UP
            </button>
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
  );
}