import axios from "axios";

const API_URL = "http://localhost:5012/api/client";

// Create axios instance
const clientApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===========================
   REQUEST INTERCEPTOR
   Attach token automatically
   =========================== */
clientApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("clientToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===========================
   RESPONSE INTERCEPTOR
   AUTO LOGOUT ON TOKEN EXPIRY
   =========================== */
clientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 🔐 Token expired or invalid
      localStorage.removeItem("clientToken");
      localStorage.removeItem("clientData");

      // Optional alert or toast
      alert("Session expired. Please login again.");

      // Redirect to login
      window.location.href = "/client-login";
    }

    return Promise.reject(error);
  }
);

export const clientAuthApi = {
  register: async (data) => {
    const response = await clientApi.post("/register", data);
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await clientApi.post("/verify-otp", data);
    return response.data;
  },

  resendOtp: async (data) => {
    const response = await clientApi.post("/resend-otp", data);
    return response.data;
  },

  login: async (data) => {
    const response = await clientApi.post("/login", data);
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await clientApi.post("/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await clientApi.post("/reset-password", data);
    return response.data;
  },
};
