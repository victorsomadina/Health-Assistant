// components/modals/DoctorUpdateModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../../services/api';

const DoctorUpdateModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    gender: user?.gender || '',
    phone: user?.phone || '',
    DOB: user?.DOB ? user.DOB.split('T')[0] : '',
    professionalDescription: user?.professionalDescription || '',
    field: user?.field || '',
    yearsOfExperience: user?.yearsOfExperience || '',
    recordConsent: user?.recordConsent || false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Get endpoint from environment variables and replace {id} with actual user ID
      const endpointTemplate = import.meta.env.VITE_DOCTOR_UPDATE_ENDPOINT || '/doctor/updateprofile/{id}';
      const userId = user?.id || user?._id || user?.userId;
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }
      
      const updateEndpoint = endpointTemplate.replace('{id}', userId);
      
      console.log('🔄 Updating doctor profile...');
      console.log('👤 User ID:', userId);
      console.log('📊 Form data:', formData);

      // Call your API to update doctor profile
      const response = await api.post(updateEndpoint, {
        location: formData.location || null,
        gender: formData.gender || null,
        date_of_birth: formData.DOB || null,
        phone: formData.phone || null,
        professional_description: formData.professionalDescription || null,
        field: formData.field || null,
        years_of_experience: formData.yearsOfExperience || null,
        record_consent: formData.recordConsent || false
      });

      console.log('✅ Profile updated successfully:', response);

      // Update user in parent component (this will also show success modal)
      if (onUpdate) {
        await onUpdate(response.data?.doctorData || response.data?.doctor || formData);
      }

      console.log('✅ Doctor profile updated successfully!');
      
      // Close update modal
      onClose();
      
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      
      // Set user-friendly error message
      const errorMessage = error.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      
      // Don't close modal so user can retry
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-600 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500">
          <div>
            <h2 className="text-xl font-semibold text-white">Update your Information</h2>
            <div className="h-1 w-16 bg-brand-sec mt-2"></div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-600 text-white rounded-md text-sm">
            <p>❌ {error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
                placeholder="Enter your location"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Hospital - Remove this section since it's not in the doctor data */}

            {/* Years of Experience */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
                placeholder="Enter years of experience"
                min="0"
                max="60"
              />
            </div>

            {/* Field/Specialty */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Medical Specialty
              </label>
              <input
                type="text"
                name="field"
                value={formData.field}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
                placeholder="Enter your medical specialty (e.g., Cardiology, Pediatrics, etc.)"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Professional Description */}
            <div className="md:col-span-2">
              <label className="block text-white text-sm font-medium mb-2">
                Professional Description
              </label>
              <textarea
                name="professionalDescription"
                value={formData.professionalDescription}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none resize-none"
                placeholder="Brief description of your medical background, expertise, and approach to patient care..."
                maxLength={500}
              />
              <div className="text-gray-300 text-xs mt-1">
                {formData.professionalDescription.length}/500 characters
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="mt-6">
            <label className="flex items-start space-x-3 text-white text-sm">
              <input
                type="checkbox"
                name="recordConsent"
                checked={formData.recordConsent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-brand-sec focus:ring-brand-sec border-gray-300 rounded"
              />
              <span>
                I hereby consent to the conversation recording for documentation and reference purposes. I understand that the recording will be stored securely and used in accordance with applicable privacy laws and medical confidentiality requirements.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-brand-sec text-white px-8 py-3 rounded-md font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorUpdateModal;