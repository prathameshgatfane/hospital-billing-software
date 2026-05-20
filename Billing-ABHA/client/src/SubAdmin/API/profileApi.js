import axios from 'axios';

const API_URL = 'http://localhost:5012/api/profile'; // Adjust based on your backend

// Create axios instance for profile
const profileAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
profileAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("clientToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const profileApi = {
  // Save hospital profile
  saveProfile: async (data) => {
    const response = await profileAxios.post('/save', data);
    return response.data;
  },

  // Get hospital profile
  getProfile: async () => {
    const response = await profileAxios.get('/me');
    return response.data;
  },

  // Upload file
  uploadFile: async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await profileAxios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update specific fields
  updateProfile: async (data) => {
    const response = await profileAxios.put('/update', data);
    return response.data;
  },

  // Delete profile (admin only)
  deleteProfile: async (tenantId) => {
    const response = await profileAxios.delete(`/admin/${tenantId}`);
    return response.data;
  }
};