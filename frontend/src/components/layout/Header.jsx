// components/layout/Header.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'patient': 'Patient',
      'doctor': 'Doctor', 
      'admin': 'Hospital Admin',
      'superadmin': 'Super Admin'
    };
    return roleNames[role] || 'User';
  };

  const getGreeting = () => {
    const firstName = user?.name?.split(' ')[0] || user?.hospitalName || user?.role || 'User';
    return `Hello, ${firstName}!`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      weekday: 'long' 
    };
    const formattedDate = today.toLocaleDateString('en-US', options);
    // Convert "Friday, May 30, 2025" to "30, May 2025, Friday"
    const parts = formattedDate.split(', ');
    const weekday = parts[0];
    const monthDay = parts[1];
    const year = parts[2];
    return `${monthDay}, ${year}, ${weekday}`;
  };

  return (
    <header className="bg-white shadow-sm border-b fixed top-0 left-64 right-0 z-10">
      <div className="px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left Side - Greeting and Date */}
          <div className="flex flex-col">
            <span className="text-gray-700 text-lg font-medium">{getGreeting()}</span>
            <span className="text-gray-500 text-sm">{getCurrentDate()}</span>
          </div>

          {/* Right Side - User Info and Dropdown */}
          <div className="flex items-center space-x-4">
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-brand-sec rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-gray-700 font-medium hidden sm:block">
                  {user?.name || user?.hospitalName || user?.role || 'User'}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role)}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        // Navigate to settings
                        window.location.href = '/settings';
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} className="mr-3" />
                      Settings
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;