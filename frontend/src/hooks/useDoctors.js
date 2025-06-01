import { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [doctorsData, specialtiesData] = await Promise.all([
          doctorService.getAllDoctors(),
          doctorService.getSpecialties()
        ]);
        
        setDoctors(doctorsData);
        setSpecialties(specialtiesData);
      } catch (err) {
        setError(err.message || 'Failed to fetch doctors');
        console.error('Failed to fetch doctors:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const searchDoctors = async (searchTerm, specialty) => {
    try {
      setError(null);
      const results = await doctorService.searchDoctors(searchTerm, specialty);
      return results;
    } catch (err) {
      setError(err.message || 'Failed to search doctors');
      return doctors; // Fallback to original data
    }
  };

  const getDoctorById = async (id) => {
    try {
      setError(null);
      const doctor = await doctorService.getDoctorById(id);
      return doctor;
    } catch (err) {
      setError(err.message || 'Failed to fetch doctor');
      throw err;
    }
  };

  return {
    doctors,
    specialties,
    isLoading,
    error,
    searchDoctors,
    getDoctorById
  };
};