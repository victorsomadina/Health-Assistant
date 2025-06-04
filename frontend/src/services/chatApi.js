// services/chatApi.js
import { api } from './api';

class ChatApiService {
  constructor() {
    this.symptomsEndpoint = import.meta.env.VITE_SYMPTOMS_AGENT_ENDPOINT || '/assistant/chatassistant';
    this.converseEndpoint = import.meta.env.VITE_CONVERSE_AGENT_ENDPOINT || '/assistant/chatassistant';
    this.doctorsEndpoint = import.meta.env.VITE_DOCTORS_LIST_ENDPOINT || '/patient/getconversedoctors';
  }

  // Send message to symptoms agent
  async sendToSymptomsAgent(query) {
    try {
      console.log('🩺 Sending to symptoms agent:', query);
      
      const response = await api.post(this.symptomsEndpoint, {
        question: query,  // Changed from 'query' to 'question'
        converse: false   // Added this required field
      });

      console.log('✅ Symptoms agent response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Symptoms agent error:', error);
      throw new Error('Failed to get symptoms analysis');
    }
  }

  // Send message to converse agent
  async sendToConverseAgent({ question, doctorName }) {
    try {
        console.log('👨‍⚕️ Sending to converse agent:', { question, converse: true, doctorName });

        const response = await api.post(this.converseEndpoint, {
        question,
        converse: true,
        doctorName
        });

        console.log('✅ Converse agent response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Converse agent error:', error);
        throw new Error('Failed to get doctor consultation');
    }
    }


  // Get list of doctors for conversation
  async getConverseDoctors(patientId) {
    try {
      console.log('👨‍⚕️ Fetching converse doctors for patient:', patientId);
      
      const response = await api.post(this.doctorsEndpoint, {
        patientId
      });

      console.log('✅ Doctors list response:', response.data);
      return response.data.doctors || [];
    } catch (error) {
      console.error('❌ Get doctors error:', error);
      throw new Error('Failed to fetch doctors list');
    }
  }
}

export const chatApiService = new ChatApiService();