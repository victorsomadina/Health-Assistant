import { api } from './api';
import { mockDoctors } from '../data/mockDoctors';

class DoctorService {
  // Fetch all doctors - replace with real API call
  async getAllDoctors() {
    try {
      // TODO: Replace with real API call
      // const response = await api.get('/doctors');
      // return response.data;

      // For now, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockDoctors;
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw error;
    }
  }

  // Get doctor by ID - replace with real API call
  async getDoctorById(id) {
    try {
      // TODO: Replace with real API call
      // const response = await api.get(`/doctors/${id}`);
      // return response.data;

      // For now, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      const doctor = mockDoctors.find(doc => doc.id === id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      return doctor;
    } catch (error) {
      console.error('Failed to fetch doctor:', error);
      throw error;
    }
  }

  // Search doctors by query - replace with real API call
  async searchDoctors(query, specialty = '') {
    try {
      // TODO: Replace with real API call
      // const response = await api.get(`/doctors/search?q=${query}&specialty=${specialty}`);
      // return response.data;

      // For now, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filtered = mockDoctors;

      if (query) {
        filtered = filtered.filter(doctor =>
          doctor.name.toLowerCase().includes(query.toLowerCase()) ||
          doctor.field.toLowerCase().includes(query.toLowerCase()) ||
          doctor.hospital.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (specialty) {
        filtered = filtered.filter(doctor => doctor.field === specialty);
      }

      return filtered;
    } catch (error) {
      console.error('Failed to search doctors:', error);
      throw error;
    }
  }

  // Get unique specialties - replace with real API call
  async getSpecialties() {
    try {
      // TODO: Replace with real API call
      // const response = await api.get('/doctors/specialties');
      // return response.data;

      // For now, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      const specialties = [...new Set(mockDoctors.map(doctor => doctor.field))];
      return specialties.sort();
    } catch (error) {
      console.error('Failed to fetch specialties:', error);
      throw error;
    }
  }
}

export const doctorService = new DoctorService();