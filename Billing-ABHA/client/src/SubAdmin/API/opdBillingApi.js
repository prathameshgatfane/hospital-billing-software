import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012'}/api/opd/billing`;

const opdBillingApi = {
  getBills: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getBillById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createBill: async (billData) => {
    try {
      const response = await axios.post(`${API_URL}/`, billData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateBill: async (id, billData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, billData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default opdBillingApi;
