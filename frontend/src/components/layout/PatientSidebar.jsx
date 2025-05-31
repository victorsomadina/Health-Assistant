// components/layout/PatientSidebar.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Settings, Bell, HelpCircle, Users, AudioLines } from 'lucide-react';
import wehelp_logo from '../../assets/images/wehelp_logo.png';

const PatientSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Patient menu items
  const menuItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
    { name: 'Chat', path: '/patient/chat', icon: MessageSquare },
    { name: 'View Doctors', path: '/patient/doctors', icon: Users },
    { name: 'Records', path: '/patient/records', icon: AudioLines }
  ];

  // Common items for patients
  const commonMenuItems = [
    { name: 'Notifications', path: '/patient/notifications', icon: Bell, badge: '2' },
    { name: 'Help', path: '/patient/help', icon: HelpCircle },
    { name: 'Settings', path: '/patient/settings', icon: Settings }
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-[#F5F5F5] shadow-sm border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <img src={wehelp_logo} alt="WeHelp Logo" className="w-full h-8 object-contain" />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 flex flex-col justify-between">
        {/* Patient Menu Items */}
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent size={20} className="mr-3" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Common Menu Items for Patients */}
        <ul className="space-y-2">
          {commonMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-left rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <IconComponent size={20} className="mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default PatientSidebar;