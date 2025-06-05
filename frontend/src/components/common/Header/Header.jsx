import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import logo from '../../../assets/images/wehelp_logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Determine dashboard path for authenticated users
  let dashboardPath = '/';
if (user?.role) {
  if (user.role === 'patient') dashboardPath = '/patient/dashboard';
  else if (user.role === 'doctor') dashboardPath = '/doctor/dashboard';
  else if (user.role === 'admin') dashboardPath = '/admin/dashboard';
}

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/') }>
              <img 
                src={logo}
                alt="WeHelp Logo" 
                className="h-8 lg:h-10 w-auto"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            {!user ? (
              <ul className="flex space-x-8">
                <li>
                  <a 
                    href="#home" 
                    className="text-gray-700 hover:text-teal-500 font-medium transition-colors duration-300 relative group"
                  >
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#about" 
                    className="text-gray-700 hover:text-teal-500 font-medium transition-colors duration-300 relative group"
                  >
                    About
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#services" 
                    className="text-gray-700 hover:text-teal-500 font-medium transition-colors duration-300 relative group"
                  >
                    Services
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    className="text-gray-700 hover:text-teal-500 font-medium transition-colors duration-300 relative group"
                  >
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              </ul>
            ) : (
              <button
                className="text-gray-700 hover:text-teal-500 font-medium transition-colors duration-300 px-4 py-2 rounded-md bg-white/80 hover:bg-teal-50 border border-teal-100"
                onClick={() => navigate(dashboardPath)}
              >
                Back to Dashboard
              </button>
            )}
          </nav>

          {/* Auth Buttons - Desktop */}
          {!user && (
            <div className="hidden md:flex items-center space-x-4">
              <button className="btn-secondary text-sm px-5 py-2" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="btn-primary text-sm px-5 py-2" onClick={() => navigate('/signup')}>
                Sign up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-500 hover:bg-gray-100 transition-colors duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-teal-100 bg-white/98 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a 
                href="#home" 
                className="block px-3 py-2 text-gray-700 hover:text-teal-500 hover:bg-teal-50 rounded-md font-medium transition-colors duration-300"
              >
                Home
              </a>
              <a 
                href="#about" 
                className="block px-3 py-2 text-gray-700 hover:text-teal-500 hover:bg-teal-50 rounded-md font-medium transition-colors duration-300"
              >
                About
              </a>
              <a 
                href="#services" 
                className="block px-3 py-2 text-gray-700 hover:text-teal-500 hover:bg-teal-50 rounded-md font-medium transition-colors duration-300"
              >
                Services
              </a>
              <a 
                href="#contact" 
                className="block px-3 py-2 text-gray-700 hover:text-teal-500 hover:bg-teal-50 rounded-md font-medium transition-colors duration-300"
              >
                Contact
              </a>
            </div>
            {!user && (
              <div className="px-5 py-4 border-t border-teal-100 space-y-3">
                <button className="btn-secondary w-full justify-center text-sm" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="btn-primary w-full justify-center text-sm" onClick={() => navigate('/signup')}>
                  Sign up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;