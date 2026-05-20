import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012';

const ipdApi = {
  admitPatient: async (admissionData) => {
    const token = localStorage.getItem('clientToken');
    const response = await axios.post(`${API_URL}/api/ipd/admissions`, admissionData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getActiveAdmissions: async () => {
    const token = localStorage.getItem('clientToken');
    const response = await axios.get(`${API_URL}/api/ipd/admissions/active`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getDischargedAdmissions: async () => {
    const token = localStorage.getItem('clientToken');
    const response = await axios.get(`${API_URL}/api/ipd/admissions/discharged`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getAdmissionDetails: async (id) => {
    const token = localStorage.getItem('clientToken');
    const response = await axios.get(`${API_URL}/api/ipd/admissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  addServiceRecord: async (serviceData) => {
    const token = localStorage.getItem('clientToken');
    const response = await axios.post(`${API_URL}/api/ipd/services`, serviceData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  dischargePatient: async (id, dischargeData) => {
    const token = localStorage.getItem('clientToken');
    const response = await axios.post(`${API_URL}/api/ipd/discharge/${id}`, dischargeData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default ipdApi;
