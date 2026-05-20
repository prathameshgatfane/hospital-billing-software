import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012'}/api/opd/services`;

const getAuthHeader = () => {
  const token = localStorage.getItem('clientToken') || localStorage.getItem('staffToken') || localStorage.getItem('adminToken');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const opdServiceApi = {
  getServices: async () => {
    try {
      const response = await axios.get(`${API_URL}/`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addService: async (serviceData) => {
    try {
      const response = await axios.post(`${API_URL}/`, serviceData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateService: async (id, serviceData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, serviceData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteService: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  bulkAddServices: async (servicesArray) => {
    try {
      const response = await axios.post(`${API_URL}/bulk`, servicesArray, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default opdServiceApi;
