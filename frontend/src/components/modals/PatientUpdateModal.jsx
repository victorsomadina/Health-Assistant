// components/modals/PatientUpdateModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../../services/api';

const PatientUpdateModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    gender: user?.gender || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    allergies: user?.allergies || '',
    conditions: user?.conditions || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      const endpointTemplate = import.meta.env.VITE_PATIENT_UPDATE_ENDPOINT || '/patient/updateprofile/{id}';
      const userId = user?.id || user?._id || user?.userId;
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }
      
      const updateEndpoint = endpointTemplate.replace('{id}', userId);
      
      console.log('🔄 Updating patient profile...');
      console.log('👤 User ID:', userId);
      console.log('📊 Form data:', formData);

      // Call your API to update patient profile
      const response = await api.post(updateEndpoint, {
        location: formData.location || null,
        gender: formData.gender || null,
        date_of_birth: formData.dateOfBirth || null,
        phone: formData.phone || null,
        known_allergies: formData.allergies || null,
        chronic_conditions: formData.conditions || null
      });

      console.log('✅ Profile updated successfully:', response);

      // Update user in parent component (this will also show success modal)
      if (onUpdate) {
        await onUpdate(response.data?.doctor || formData); // Use response.data.doctor based on your API response
      }

      console.log('✅ Patient profile updated successfully!');
      
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

            {/* Date of Birth */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Known Allergies */}
            <div className="md:col-span-2">
              <label className="block text-white text-sm font-medium mb-2">
                Known Allergies
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
                placeholder="Enter any known allergies (e.g., Penicillin, Shellfish, peanuts, etc.)"
              />
            </div>

            {/* Chronic Conditions */}
            <div className="md:col-span-2">
              <label className="block text-white text-sm font-medium mb-2">
                Chronic Conditions
              </label>
              <input
                type="text"
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-brand-sec focus:outline-none"
                placeholder="Enter any chronic conditions (e.g., Hypertension, Diabetes, asthma, etc.)"
              />
            </div>
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

export default PatientUpdateModal;