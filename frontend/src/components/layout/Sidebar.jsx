// components/layout/Sidebar.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Settings, 
  Users, 
  UserCheck,
  Building2,
  Shield,
  TrendingUp,
  BarChart,
  Bell,
  HelpCircle
} from 'lucide-react';
import wehelp_logo from '../../assets/images/wehelp_logo.png';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Define menu items for each role
  const getMenuItems = () => {
    const role = user?.role;
    
    const menuItems = {
      patient: [
        { name: 'Dashboard', path: '/dashboard/patient', icon: Home },
        { name: 'Chat', path: '/chat', icon: MessageSquare },
        { name: 'Recordings', path: '/records', icon: FileText }
      ],
      doctor: [
        { name: 'Dashboard', path: '/dashboard/doctor', icon: Home },
        { name: 'Chat', path: '/chat', icon: MessageSquare },
        { name: 'My Patients', path: '/patients', icon: Users }
      ],
      admin: [
        { name: 'Dashboard', path: '/dashboard/admin', icon: Home },
        { name: 'Manage Doctors', path: '/doctors', icon: UserCheck },
        { name: 'Patients', path: '/patients', icon: Users },
        { name: 'Reports', path: '/reports', icon: BarChart }
      ],
      superadmin: [
        { name: 'Dashboard', path: '/dashboard/super-admin', icon: Home },
        { name: 'Hospitals', path: '/hospitals', icon: Building2 },
        { name: 'Admins', path: '/admins', icon: Shield },
        { name: 'Analytics', path: '/analytics', icon: TrendingUp }
      ]
    };

    return menuItems[role] || menuItems.patient;
  };

  // Common menu items for all users
  const commonMenuItems = [
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: '2' },
    { name: 'Help', path: '/help', icon: HelpCircle },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const menuItems = getMenuItems();

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <img src={wehelp_logo} alt="WeHelp Logo" className="w-full h-8 object-contain" />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 flex flex-col justify-between">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
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

        {/* Common Menu Items */}
        <ul className="space-y-2">
          {commonMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
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

export default Sidebar;