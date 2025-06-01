// components/modals/UpdateSuccessModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import check from "../../assets/icons/check.png";

const UpdateSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[50] p-2">
      <div className="bg-gradient-to-b from-gradient-pri-start to-gradient-pri-end rounded-md shadow-xl max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal content */}
        <div className="p-8 text-center">
          {/* Success Icon - Circular checkmark */}
          <div className="mx-auto flex items-center justify-center w-20 h-20 mb-2">
            <img src={check} alt="Checkmark" className="w-20 h-20" />
          </div>

          {/* Success Title */}
          <h2 className="text-4xl font-semibold text-gray-900 mb-1">Updated!</h2>
          
          {/* Success Message */}
          <p className="text-gray-600 text-sm mb-8">
            Your profile has been updated successfully.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="bg-brand-sec hover:bg-teal-600 text-white font-semibold py-2 px-8 w-1/2 rounded transition-colors"
            >
              Continue
            </button>
            <button
              onClick={onClose}
              className="bg-transparent border-2 border-brand-sec hover:bg-gray-50 text-gray-700 font-semibold py-2 px-8 w-1/2 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSuccessModal;