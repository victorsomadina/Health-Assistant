// pages/dashboards/PatientDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, User, Mic } from 'lucide-react';
import PatientLayout from '../../components/layout/PatientLayout';
import PatientUpdateModal from '../../components/modals/PatientUpdateModal';
import UpdateSuccessModal from '../../components/modals/UpdateSuccessModal';

const PatientDashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate(); // Add navigation hook
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdateProfile = async (formData) => {
    try {
      console.log('📊 Received updated data:', formData);
      
      // Update user in context with the actual API response data
      await updateUser(formData);
      console.log('Profile updated successfully');
      
      // Force component to re-render with new data
      setRefreshKey(prev => prev + 1);
      
      // Show success modal after update
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  // Navigation handlers for action cards
  const handleStartChat = () => {
    navigate('/patient/chat');
  };

  const handleViewDoctors = () => {
    navigate('/patient/doctors');
  };

  const handleViewRecords = () => {
    navigate('/patient/records');
  };

  // Get the most up-to-date user data
  const currentUser = user || {};

  return (
    <PatientLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Patient Dashboard</h1>
      </div>

      {/* Main Content Grid - Responsive with Order */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" key={refreshKey}>
        
        {/* Action Cards - Shows FIRST on mobile, SECOND on desktop */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-[#F5F5F5] p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start New Chat Card - Added navigation */}
            <div 
              onClick={handleStartChat}
              className="bg-brand-pri text-white rounded-lg p-8 hover:bg-pri-hover cursor-pointer transition-colors text-center"
            >
              <div className="mb-4 flex justify-center">
                <MessageSquare size={60} className="text-brand-sec" />
              </div>
              <h3 className="text-xl font-bold mb-2">Start New Chat</h3>
              <p className="text-gray-200 text-sm">AI Symptoms Checker</p>
            </div>

            {/* View Doctors Card - Added navigation */}
            <div 
              onClick={handleViewDoctors}
              className="bg-brand-sec text-white rounded-lg p-8 hover:bg-teal-600 cursor-pointer transition-colors text-center"
            >
              <div className="mb-4 flex justify-center">
                <User size={60} className="text-brand-pri" />
              </div>
              <h3 className="text-xl font-bold mb-2">View Doctors</h3>
              <p className="text-gray-200 text-sm">Book Consultation</p>
            </div>

            {/* View Records Card - Added navigation */}
            <div 
              onClick={handleViewRecords}
              className="bg-brand-pri text-white rounded-lg p-8 hover:bg-pri-hover cursor-pointer transition-colors text-center"
            >
              <div className="mb-4 flex justify-center">
                <Mic size={60} className="text-brand-sec" />
              </div>
              <h3 className="text-xl font-bold mb-2">View Records</h3>
              <p className="text-gray-200 text-sm">Past Conversations</p>
            </div>
          </div>
        </div>

        {/* User Info + Information - Shows SECOND on mobile, FIRST on desktop */}
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          {/* User Info Card - Updated to show latest data */}
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <div className="text-center">
              {/* Profile Picture */}
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-gray-600" />
              </div>
              
              {/* User Details - Using current user data */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {currentUser.name || 'Badrudeen Abdullahi'}
              </h2>
              <p className="text-gray-600 mb-4">Age: {currentUser.age || '36'}</p>
              <button 
                onClick={() => setIsUpdateModalOpen(true)}
                className="bg-brand-sec text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Update
              </button>
            </div>
          </div>

          {/* Information Section - Updated to show latest data */}
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Information:</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-900">Gender:</span>
                <span className="ml-2 text-gray-700">{currentUser.gender || ''}</span>
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
                <span className="font-medium text-gray-900">Phone:</span>
                <span className="ml-2 text-gray-700">{currentUser.phone || ''}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Known Allergies:</span>
                <span className="ml-2 text-gray-700">{currentUser.known_allergies || currentUser.allergies || ''}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Chronic Conditions:</span>
                <span className="ml-2 text-gray-700">{currentUser.chronic_conditions || currentUser.conditions || ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <PatientUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        user={currentUser}
        onUpdate={handleUpdateProfile}
      />

      {/* Success Modal - Now with higher z-index */}
      <UpdateSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
    </PatientLayout>
  );
};

export default PatientDashboard;