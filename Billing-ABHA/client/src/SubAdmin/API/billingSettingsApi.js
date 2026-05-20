import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012';

const billingSettingsApi = {
  getSettings: async () => {
    const token = localStorage.getItem('clientToken');
    const response = await axios.get(`${API_URL}/api/opd/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateSettings: async (settingsData) => {
    const token = localStorage.getItem('clientToken');
    const response = await axios.post(`${API_URL}/api/opd/settings`, settingsData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default billingSettingsApi;
