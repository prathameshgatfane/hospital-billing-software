import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012'}/api/staff`;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('clientToken')}`,
});

const staffApi = {
  getStaff: async () => {
    const res = await axios.get(`${BASE_URL}/`, { headers: getAuthHeader() });
    return res.data;
  },

  createStaff: async (data) => {
    const res = await axios.post(`${BASE_URL}/`, data, { headers: getAuthHeader() });
    return res.data;
  },

  updateStaff: async (id, data) => {
    const res = await axios.put(`${BASE_URL}/${id}`, data, { headers: getAuthHeader() });
    return res.data;
  },

  deleteStaff: async (id) => {
    const res = await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
    return res.data;
  },

  login: async (email, password) => {
    const res = await axios.post(`${BASE_URL}/login`, { email, password });
    return res.data;
  },
};

export default staffApi;
