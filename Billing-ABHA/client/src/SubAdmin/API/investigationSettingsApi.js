import axios from 'axios';


const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012';

const getAuthHeader = () => {
  const token = localStorage.getItem('clientToken') || localStorage.getItem('staffToken') || localStorage.getItem('adminToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const investigationSettingsApi = {
  getSettings: async () => {
    const response = await axios.get(`${API_URL}/api/settings/investigation`, getAuthHeader());
    return response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await axios.put(`${API_URL}/api/settings/investigation`, settingsData, getAuthHeader());
    return response.data;
  },

  bulkUpload: async (file) => {
    const authHeader = getAuthHeader();
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/api/settings/investigation/bulk`, formData, {
      headers: {
        ...authHeader.headers,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default investigationSettingsApi;
