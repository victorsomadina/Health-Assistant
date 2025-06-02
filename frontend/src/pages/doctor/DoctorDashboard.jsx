// pages/dashboards/DoctorDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Users, User } from 'lucide-react';
import DoctorLayout from '../../components/layout/DoctorLayout';
import DoctorUpdateModal from '../../components/modals/DoctorUpdateModal';
import UpdateSuccessModal from '../../components/modals/UpdateSuccessModal';

const DoctorDashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdateProfile = async (formData) => {
    try {
      console.log('📊 Received updated doctor data:', formData);
      
      // Update user in context with the actual API response data
      await updateUser(formData);
      console.log('Doctor profile updated successfully');
      
      // Force component to re-render with new data
      setRefreshKey(prev => prev + 1);
      
      // Show success modal after update
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Failed to update doctor profile:', error);
      throw error;
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  // Navigation handlers
  const handleStartNewChat = () => {
    navigate('/doctor/chat'); // Adjust route based on your routing structure
  };

  const handleViewPatients = () => {
    navigate('/doctor/patients'); // Route to the DoctorPatients component
  };

  // Get the most up-to-date user data
  const currentUser = user || {};


  return (
    <DoctorLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Doctor's Dashboard</h1>
      </div>

      {/* Main Content Grid - Responsive with Order */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" key={refreshKey}>
        
        {/* Action Cards - Shows FIRST on mobile, SECOND on desktop */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-[#F5F5F5] p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start New Chat Card */}
            <div 
              onClick={handleStartNewChat}
              className="bg-brand-pri text-white rounded-lg p-8 hover:bg-pri-hover cursor-pointer transition-colors text-center transform hover:scale-105 duration-200"
            >
              <div className="mb-4 flex justify-center">
                <MessageSquare size={60} className="text-brand-sec" />
              </div>
              <h3 className="text-xl font-bold mb-2">Start New Chat</h3>
              <p className="text-gray-200 text-sm">AI Symptoms Checker</p>
            </div>

            {/* View Patients Card */}
            <div 
              onClick={handleViewPatients}
              className="bg-brand-sec text-white rounded-lg p-8 hover:bg-teal-600 cursor-pointer transition-colors text-center transform hover:scale-105 duration-200"
            >
              <div className="mb-4 flex justify-center">
                <Users size={60} className="text-brand-pri" />
              </div>
              <h3 className="text-xl font-bold mb-2">View Patients</h3>
              <p className="text-gray-200 text-sm">Manage Your Patients</p>
            </div>
          </div>
        </div>

        {/* Doctor Info + Information - Shows SECOND on mobile, FIRST on desktop */}
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          {/* Doctor Info Card - Updated to show latest data */}
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <div className="text-center">
              {/* Profile Picture */}
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-gray-600" />
              </div>
              
              {/* Doctor Details - Using current user data */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {currentUser.name || 'Doctor Name'}
              </h2>
              <p className="text-gray-600 mb-4">Age: {currentUser.age || 'N/A'}</p>
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
                <span className="font-medium text-gray-900">Hospital:</span>
                <span className="ml-2 text-gray-700">{currentUser.hospitalName || ''}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Years of Experience:</span>
                <span className="ml-2 text-gray-700">{currentUser.yearsOfExperience || currentUser.years_of_experience || ''}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Field/Specialty:</span>
                <span className="ml-2 text-gray-700">{currentUser.field || currentUser.specialty || ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <DoctorUpdateModal
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
    </DoctorLayout>
  );
};

export default DoctorDashboard;