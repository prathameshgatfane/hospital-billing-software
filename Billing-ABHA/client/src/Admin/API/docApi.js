import axios from 'axios';

const API_URL = 'http://localhost:5012/api/doctor';

// Create admin axios instance with admin token
const adminAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add admin token to requests
adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken"); // Admin uses different token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const doctorAdminApi = {
  // Get all pending doctors for approval
  getPendingDoctors: async () => {
    const response = await adminAxios.get('/admin/pending');
    return response.data;
  },

  // Approve a doctor
  approveDoctor: async (doctorId) => {
    const response = await adminAxios.post(`/admin/approve/${doctorId}`);
    return response.data;
  },

  // Reject a doctor
  rejectDoctor: async (doctorId, reason) => {
    const response = await adminAxios.post(`/admin/reject/${doctorId}`, { reason });
    return response.data;
  },

  // Get doctors by hospital
  getDoctorsByHospital: async (tenantId) => {
    const response = await adminAxios.get(`/admin/hospital/${tenantId}`);
    return response.data;
  },
  
  // Get doctors by hospital
getDoctorsByHospital: async (tenantId) => {
  const response = await adminAxios.get(`/admin/hospital/${tenantId}`);
  return response.data;
},
  // Toggle doctor active status
  toggleDoctorStatus: async (doctorId, isActive) => {
    const response = await adminAxios.patch(`/admin/toggle/${doctorId}`, { isActive });
    return response.data;
  },

  // Get doctor specialties (same as client)
  getSpecialties: async () => {
    const response = await adminAxios.get('/specialties');
    return response.data;
  },
};