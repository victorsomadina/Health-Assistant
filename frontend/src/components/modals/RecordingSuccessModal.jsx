// components/modals/RecordingSuccessModal.jsx
import React from 'react';
import { X, CheckCircle, Clock, User, MessageSquare } from 'lucide-react';

const RecordingSuccessModal = ({ 
  isOpen, 
  onClose, 
  recordingData = {},
  onViewRecords
}) => {
  if (!isOpen) return null;

  const {
    purpose = '',
    doctorName = '',
    duration = '',
    timestamp = new Date().toLocaleString(),
    notes = ''
  } = recordingData;

  const handleViewRecords = () => {
    if (onViewRecords) {
      onViewRecords();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-600 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500">
          <div>
            <h2 className="text-xl font-semibold text-white">Recording Saved Successfully!</h2>
            <div className="h-1 w-16 bg-brand-sec mt-2"></div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Icon and Message */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Your recording has been successfully saved!
            </h3>
            <p className="text-gray-300 text-sm">
              The audio has been processed and added to your medical records.
            </p>
          </div>

          {/* Recording Details */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <MessageSquare size={18} />
              Recording Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Purpose */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Purpose:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                  {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                </span>
              </div>

              {/* Doctor */}
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-400">Doctor:</span>
                <span className="text-white">{doctorName}</span>
              </div>

              {/* Duration */}
              {duration && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{duration}</span>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Saved:</span>
                <span className="text-white">{timestamp}</span>
              </div>
            </div>

            {/* Notes if provided */}
            {notes && (
              <div className="mt-4 pt-3 border-t border-gray-600">
                <span className="text-gray-400 text-sm block mb-1">Notes:</span>
                <p className="text-white text-sm bg-gray-800 p-2 rounded">
                  {notes}
                </p>
              </div>
            )}
          </div>

          {/* What happens next */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-blue-800 font-medium mb-2">What happens next?</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Your recording will be transcribed and processed</li>
              <li>• The transcript will be added to your medical records</li>
              {/* <li>• Your healthcare provider will have access to review the session</li> */}
              <li>• You can view all your recordings in the Medical Records section</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 border border-gray-400 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleViewRecords}
              className="flex-1 sm:flex-none bg-brand-sec text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              View All Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingSuccessModal;