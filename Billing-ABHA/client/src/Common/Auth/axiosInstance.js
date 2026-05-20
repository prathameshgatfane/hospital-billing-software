import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 🔐 Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
const clientToken = localStorage.getItem("clientToken");

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (clientToken) {
    config.headers.Authorization = `Bearer ${clientToken}`;
  }

  return config;
});

export default axiosInstance;
