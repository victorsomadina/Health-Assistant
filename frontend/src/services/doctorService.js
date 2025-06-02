import { api } from './api';

class DoctorService {
  constructor() {
    this.doctorsCache = null;
    this.cacheTimestamp = null;
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  }

  // Fetch all doctors from the single endpoint
  async getAllDoctors() {
    try {
      // Check if we have valid cached data
      if (this.doctorsCache && this.cacheTimestamp && 
          (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION) {
        return this.doctorsCache;
      }

      // Get endpoint from environment variables
      const endpoint = import.meta.env.VITE_DOCTORS_ENDPOINT || '/patient/getdoctors';
      const response = await api.get(endpoint);
      
      // Transform API response to match expected format
      const doctors = response.data.doctors.map(doctor => ({
        ...doctor,
        hospital: doctor.hospitalName || 'N/A',
        // Calculate age from DOB
        age: this.calculateAge(doctor.DOB),
        // Add missing fields with defaults
        gender: doctor.gender || 'Not specified',
        phone: doctor.phone || 'Not provided',
        recordConsent: doctor.recordConsent !== undefined ? doctor.recordConsent : true,
        rating: doctor.rating || 0,
        reviews: doctor.reviews || 0,
        available: doctor.available !== undefined ? doctor.available : true,
        nextAvailableSlot: doctor.nextAvailableSlot || 'Contact for availability'
      }));
      
      // Cache the data
      this.doctorsCache = doctors;
      this.cacheTimestamp = Date.now();
      
      return doctors;
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw new Error('Failed to load doctors. Please try again later.');
    }
  }

  // Get doctor by ID - filter from cached data
  async getDoctorById(id) {
    try {
      const doctors = await this.getAllDoctors();
      const doctor = doctors.find(doc => doc.id === id);
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      return doctor;
    } catch (error) {
      console.error('Failed to fetch doctor:', error);
      if (error.message === 'Doctor not found') {
        throw error;
      }
      throw new Error('Failed to load doctor details. Please try again later.');
    }
  }

  // Search doctors by query - filter on frontend
  async searchDoctors(query, specialty = '') {
    try {
      const doctors = await this.getAllDoctors();
      let filtered = doctors;

      // Filter by search query
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim();
        filtered = filtered.filter(doctor =>
          doctor.name.toLowerCase().includes(searchTerm) ||
          doctor.field.toLowerCase().includes(searchTerm) ||
          (doctor.hospital && doctor.hospital.toLowerCase().includes(searchTerm)) ||
          (doctor.location && doctor.location.toLowerCase().includes(searchTerm)) ||
          (doctor.professionalDescription && doctor.professionalDescription.toLowerCase().includes(searchTerm))
        );
      }

      // Filter by specialty
      if (specialty) {
        filtered = filtered.filter(doctor => doctor.field === specialty);
      }

      return filtered;
    } catch (error) {
      console.error('Failed to search doctors:', error);
      throw new Error('Failed to search doctors. Please try again later.');
    }
  }

  // Get unique specialties - extract from cached data
  async getSpecialties() {
    try {
      const doctors = await this.getAllDoctors();
      const specialties = [...new Set(doctors.map(doctor => doctor.field))].filter(Boolean);
      return specialties.sort();
    } catch (error) {
      console.error('Failed to fetch specialties:', error);
      throw new Error('Failed to load specialties. Please try again later.');
    }
  }

  // Helper method to calculate age from DOB
  calculateAge(dob) {
    if (!dob) return null;
    
    try {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      console.error('Error calculating age:', error);
      return null;
    }
  }

  // Get doctors by specialty - filter from cached data
  async getDoctorsBySpecialty(specialty) {
    try {
      const doctors = await this.getAllDoctors();
      return doctors.filter(doctor => doctor.field === specialty);
    } catch (error) {
      console.error('Failed to get doctors by specialty:', error);
      throw new Error('Failed to load doctors by specialty. Please try again later.');
    }
  }

  // Get doctors by location - filter from cached data
  async getDoctorsByLocation(location) {
    try {
      const doctors = await this.getAllDoctors();
      return doctors.filter(doctor => 
        doctor.location && doctor.location.toLowerCase().includes(location.toLowerCase())
      );
    } catch (error) {
      console.error('Failed to get doctors by location:', error);
      throw new Error('Failed to load doctors by location. Please try again later.');
    }
  }

  // Get doctors by hospital - filter from cached data
  async getDoctorsByHospital(hospital) {
    try {
      const doctors = await this.getAllDoctors();
      return doctors.filter(doctor => 
        doctor.hospital && doctor.hospital.toLowerCase().includes(hospital.toLowerCase())
      );
    } catch (error) {
      console.error('Failed to get doctors by hospital:', error);
      throw new Error('Failed to load doctors by hospital. Please try again later.');
    }
  }

  // Clear cache - useful for force refresh
  clearCache() {
    this.doctorsCache = null;
    this.cacheTimestamp = null;
  }

  // Refresh data - force fetch from API
  async refreshDoctors() {
    this.clearCache();
    return await this.getAllDoctors();
  }

  // Get statistics about doctors
  async getDoctorsStats() {
    try {
      const doctors = await this.getAllDoctors();
      
      const stats = {
        total: doctors.length,
        bySpecialty: {},
        byLocation: {},
        byHospital: {},
        averageExperience: 0
      };

      let totalExperience = 0;

      doctors.forEach(doctor => {
        // Count by specialty
        stats.bySpecialty[doctor.field] = (stats.bySpecialty[doctor.field] || 0) + 1;
        
        // Count by location
        if (doctor.location) {
          stats.byLocation[doctor.location] = (stats.byLocation[doctor.location] || 0) + 1;
        }
        
        // Count by hospital
        if (doctor.hospital) {
          stats.byHospital[doctor.hospital] = (stats.byHospital[doctor.hospital] || 0) + 1;
        }
        
        // Sum experience
        if (doctor.yearsOfExperience) {
          totalExperience += doctor.yearsOfExperience;
        }
      });

      // Calculate average experience
      stats.averageExperience = doctors.length > 0 ? Math.round(totalExperience / doctors.length) : 0;

      return stats;
    } catch (error) {
      console.error('Failed to get doctors stats:', error);
      throw new Error('Failed to load doctors statistics. Please try again later.');
    }
  }
}

export const doctorService = new DoctorService();