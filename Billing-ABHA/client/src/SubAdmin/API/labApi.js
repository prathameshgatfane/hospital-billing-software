import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('clientToken') || localStorage.getItem('staffToken');
  return {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
  };
};

const labApi = {
  // Upload document (multipart/form-data)
  uploadDocument: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/api/lab/upload`, formData, {
        headers: getHeaders(true)
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all documents for a patient
  getPatientDocuments: async (patientId) => {
    try {
      const response = await axios.get(`${API_URL}/api/lab/patient/${patientId}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete document
  deleteDocument: async (documentId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/lab/${documentId}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default labApi;
