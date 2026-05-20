import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012'}/api/opd/consultation`;

const getAuthHeader = () => {
  const token = localStorage.getItem('clientToken') || localStorage.getItem('staffToken') || localStorage.getItem('adminToken');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const opdConsultationApi = {
  // Get waiting queue for a specific doctor
  getQueue: async (doctorId) => {
    const res = await axios.get(`${BASE_URL}/queue/${doctorId}`, { headers: getAuthHeader() });
    return res.data;
  },

  // Expire a patient's session in the queue
  expireBill: async (billId) => {
    const res = await axios.put(`${BASE_URL}/expire/${billId}`, {}, { headers: getAuthHeader() });
    return res.data;
  },

  // Save new consultation
  saveConsultation: async (data) => {
    const res = await axios.post(`${BASE_URL}/save`, data, { headers: getAuthHeader() });
    return res.data;
  },

  // Get single consultation details
  getDetails: async (id) => {
    const res = await axios.get(`${BASE_URL}/details/${id}`, { headers: getAuthHeader() });
    return res.data;
  },

  // Get patient medical history
  getHistory: async (patientId) => {
    const res = await axios.get(`${BASE_URL}/history/${patientId}`, { headers: getAuthHeader() });
    return res.data;
  }
};
