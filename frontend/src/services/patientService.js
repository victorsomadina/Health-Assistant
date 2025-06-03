
import { api } from './api';
import { mockPatients } from '../data/mockPatients';

class PatientService {
  // Fetch all patients - replace with real API call
  async getAllPatients() {
    try {
      // TODO: Replace with real API call
      // const response = await api.get('/patients');
      // return response.data;

      // For now, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockPatients;
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      throw error;
    }
  }

  // Get patient by ID - replace with real API call
  async getPatientById(id) {
    try {
      // TODO: Replace with real API call
      // const response = await api.get(`/patients/${id}`);
      // return response.data;

      // For now, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      const patient = mockPatients.find(p => p.id === id);
      if (!patient) {
        throw new Error('Patient not found');
      }
      return patient;
    } catch (error) {
      console.error('Failed to fetch patient:', error);
      throw error;
    }
  }

  // Search patients by query - replace with real API call
  async searchPatients(query, location = '') {
    try {
      // TODO: Replace with real API call
      // const response = await api.get(`/patients/search?q=${query}&location=${location}`);
      // return response.data;

      // For now, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filtered = mockPatients;

      if (query) {
        filtered = filtered.filter(patient =>
          patient.name.toLowerCase().includes(query.toLowerCase()) ||
          patient.email.toLowerCase().includes(query.toLowerCase()) ||
          patient.phone.toLowerCase().includes(query.toLowerCase()) ||
          patient.location.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (location) {
        filtered = filtered.filter(patient => patient.location === location);
      }

      return filtered;
    } catch (error) {
      console.error('Failed to search patients:', error);
      throw error;
    }
  }

  // Get unique locations - replace with real API call
  async getLocations() {
    try {
      // TODO: Replace with real API call
      // const response = await api.get('/patients/locations');
      // return response.data;

      // For now, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      const locations = [...new Set(mockPatients.map(patient => patient.location))];
      return locations.sort();
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      throw error;
    }
  }

  // Get patient's medical records - replace with real API call
  async getPatientRecords(patientId) {
    try {
      // TODO: Replace with real API call
      // const response = await api.get(`/patients/${patientId}/records`);
      // return response.data;

      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        appointments: [],
        diagnoses: [],
        prescriptions: [],
        testResults: []
      };
    } catch (error) {
      console.error('Failed to fetch patient records:', error);
      throw error;
    }
  }
}

export const patientService = new PatientService();