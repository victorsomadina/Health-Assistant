// components/modals/DoctorSelectionModal.jsx
import React, { useState, useEffect } from 'react';
import { X, User, Loader2 } from 'lucide-react';
import { chatApiService } from '../../services/chatApi';
import { useAuth } from '../../context/AuthContext';

const DoctorSelectionModal = ({ isOpen, onClose, onSelectDoctor }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch doctors when modal opens
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchDoctors();
    }
  }, [isOpen, user]);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const doctorsList = await chatApiService.getConverseDoctors(user.id);
      setDoctors(doctorsList);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctor = (doctor) => {
    onSelectDoctor(doctor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Select a Doctor</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-brand-sec" />
              <span className="ml-2 text-gray-600">Loading doctors...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchDoctors}
                className="px-4 py-2 bg-brand-sec text-white rounded-md hover:bg-teal-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No doctors available for conversation.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {doctors.map((doctor, index) => (
                <button
                  key={doctor.id || index}
                  onClick={() => handleSelectDoctor(doctor)}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-brand-sec transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Dr. {doctor}
                      </h3>
                      {doctor.specialization && (
                        <p className="text-sm text-gray-600">
                          {doctor.specialization}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Select a doctor to start a conversation
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorSelectionModal;