// pages/patient/PatientSettings.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Bell, Shield, HelpCircle, LogOut, Eye, EyeOff } from 'lucide-react';
import PatientLayout from '../../components/layout/PatientLayout';

const PatientSettings = () => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    location: user?.location || '',
    known_allergies: user?.known_allergies || user?.allergies || '',
    chronic_conditions: user?.chronic_conditions || user?.conditions || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    healthTips: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle notification changes
  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Save profile changes
  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      await updateUser(profileForm);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save password changes
  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      // Here you would make an API call to change password
      console.log('Password change request:', passwordForm);
      setSuccessMessage('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render profile settings
  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={profileForm.name}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={profileForm.email}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={profileForm.phone}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={profileForm.age}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={profileForm.gender}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={profileForm.location}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Known Allergies
        </label>
        <textarea
          name="known_allergies"
          value={profileForm.known_allergies}
          onChange={handleProfileChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          placeholder="List any known allergies..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chronic Conditions
        </label>
        <textarea
          name="chronic_conditions"
          value={profileForm.chronic_conditions}
          onChange={handleProfileChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          placeholder="List any chronic conditions..."
        />
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleProfileSave}
          disabled={isLoading}
          className="bg-brand-pri text-white px-6 py-2 rounded-md hover:bg-pri-hover transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  // Render security settings
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-sm text-yellow-800">
          For your security, please enter your current password to make changes.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pri"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handlePasswordSave}
          disabled={isLoading}
          className="bg-brand-pri text-white px-6 py-2 rounded-md hover:bg-pri-hover transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );

  // Render notification settings
  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
            <div>
              <h4 className="font-medium text-gray-900">
                {key === 'emailNotifications' && 'Email Notifications'}
                {key === 'smsNotifications' && 'SMS Notifications'}
                {key === 'appointmentReminders' && 'Appointment Reminders'}
                {key === 'healthTips' && 'Health Tips'}
              </h4>
              <p className="text-sm text-gray-600">
                {key === 'emailNotifications' && 'Receive updates via email'}
                {key === 'smsNotifications' && 'Receive updates via SMS'}
                {key === 'appointmentReminders' && 'Get reminded about upcoming appointments'}
                {key === 'healthTips' && 'Receive personalized health tips'}
              </p>
            </div>
            <button
              onClick={() => handleNotificationChange(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-brand-pri' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Render privacy settings
  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-900 mb-2">Data Privacy</h4>
        <p className="text-sm text-blue-800">
          Your personal health information is encrypted and securely stored. We follow strict privacy guidelines.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">Download Your Data</h4>
          <p className="text-sm text-gray-600 mb-3">
            Request a copy of all your personal data stored in our system.
          </p>
          <button className="bg-brand-sec text-white px-4 py-2 rounded-md text-sm hover:bg-teal-600 transition-colors">
            Request Data Export
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">Delete Account</h4>
          <p className="text-sm text-gray-600 mb-3">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  // Render help settings
  const renderHelpSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
          <p className="text-sm text-gray-600 mb-3">
            Get help with your account or technical issues.
          </p>
          <button className="bg-brand-pri text-white px-4 py-2 rounded-md text-sm hover:bg-pri-hover transition-colors">
            Contact Support
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">FAQ</h4>
          <p className="text-sm text-gray-600 mb-3">
            Find answers to commonly asked questions.
          </p>
          <button className="bg-brand-sec text-white px-4 py-2 rounded-md text-sm hover:bg-teal-600 transition-colors">
            View FAQ
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">User Guide</h4>
          <p className="text-sm text-gray-600 mb-3">
            Learn how to use all features of the platform.
          </p>
          <button className="bg-brand-pri text-white px-4 py-2 rounded-md text-sm hover:bg-pri-hover transition-colors">
            View Guide
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">Report Issue</h4>
          <p className="text-sm text-gray-600 mb-3">
            Report bugs or suggest improvements.
          </p>
          <button className="bg-brand-sec text-white px-4 py-2 rounded-md text-sm hover:bg-teal-600 transition-colors">
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PatientLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brand-pri text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {tab.label}
                </button>
              );
            })}
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors mt-6"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {activeTab === 'profile' && renderProfileSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'privacy' && renderPrivacySettings()}
            {activeTab === 'help' && renderHelpSettings()}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientSettings;