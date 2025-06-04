import React from 'react';
import { X } from 'lucide-react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-600 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500">
          <div>
            <h2 className="text-xl font-semibold text-white">Privacy Policy</h2>
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
        <div className="p-6 text-white text-base space-y-4">
          <p>
            <strong>Your Privacy is our Priority:</strong> We take strong steps to ensure that every doctor-patient conversation remains secure, private, and accessible only to those directly involved. Each conversation is carefully connected to the correct doctor and patient, allowing us to manage and protect your information with care.
          </p>
          <p>
            <strong>Information We Collect:</strong> We may collect personal information such as your name, email address, health data, and usage information to provide and improve our services.
          </p>
          <p>
            <strong>Access is Tightly Controlled:</strong> Only the doctor and patient who participated in a conversation can view it. Even administrators cannot access the content unless they’ve been given special permission, in line with our privacy rules.
          </p>
          <p>
            <strong>How We Use Your Information:</strong> When we use conversation data to improve our services or support research, we make sure all personal details are removed. Smart tools help us automatically replace names, locations, and other identifying information with neutral labels to keep your identity hidden.
            Most importantly, your consent matters.
          </p>
          <p>
            <strong>Your Choices:</strong> We will always ask for your permission before using your anonymized data for any kind of research. If you choose not to give consent, your data will remain private and untouched.
          </p>
          <p>
            Before using our app, you will be prompted to consent for documentation and reference purposes.
          </p>
        </div>
        {/* Close Button */}
        <div className="flex justify-center pb-6">
          <button
            onClick={onClose}
            className="bg-brand-sec text-white px-8 py-3 rounded-md font-medium hover:bg-teal-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal; 