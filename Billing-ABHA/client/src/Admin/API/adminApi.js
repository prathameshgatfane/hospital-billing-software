import axios from "axios";

const API_URL = "http://localhost:5012/api";

// Create axios instance for admin
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach admin token automatically
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const adminApiService = {
  /* =======================
     AUTH
  ======================= */

  login: async (data) => {
    const response = await adminApi.post("/admin/login", data);
    return response.data;
  },

  logout: async () => {
    const response = await adminApi.post("/admin/logout");
    return response.data;
  },

  /* =======================
     HOSPITAL PROFILE ACTIONS
  ======================= */
 getApprovedHospitals: async () => {
    const response = await adminApi.get("/profile/approved");
    return response.data;
  },
  getPendingHospitals: async () => {
    const response = await adminApi.get("/profile/admin/pending");
    return response.data;
  },

  getHospitalDetails: async (tenantId) => {
    const response = await adminApi.get(`/profile/admin/view/${tenantId}`);
    return response.data;
  },

  approveHospital: async (tenantId) => {
    const response = await adminApi.post(
      `/profile/admin/approve/${tenantId}`
    );
    return response.data;
  },

  rejectHospital: async (tenantId, reason) => {
    const response = await adminApi.post(
      `/profile/admin/reject/${tenantId}`,
      { reason }
    );
    return response.data;
  },

  deleteHospital: async (tenantId) => {
    const response = await adminApi.delete(`/profile/admin/${tenantId}`);
    return response.data;
  },
    toggleHospitalStatus: async (tenantId) => {
    const response = await adminApi.patch(`/profile/admin/toggle/${tenantId}`);
    return response.data;
  },
};
