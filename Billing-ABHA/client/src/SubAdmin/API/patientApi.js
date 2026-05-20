import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012'}/api/opd/patient`;

const patientApi = {
  getPatients: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Get patient by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Register new patient
  register: async (patientData) => {
    try {
      const response = await axios.post(`${API_URL}/`, patientData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update patient
  update: async (id, patientData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, patientData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete patient (soft delete)
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search patients
  search: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get patient statistics
  getStats: async (period = 'month') => {
    try {
      const response = await axios.get(`${API_URL}/stats`, {
        params: { period },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check for duplicate patient
  checkDuplicate: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/check-duplicate`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export patients data
  exportPatients: async (format, filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/export`, {
        params: { format, ...filters },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`
        },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get patients by hospital
  adminGetByHospital: async (clientId, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/admin/hospital/${clientId}`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Toggle patient status
  adminToggleStatus: async (patientId, statusData) => {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/toggle/${patientId}`,
        statusData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('clientToken') || localStorage.getItem('staffToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default patientApi;