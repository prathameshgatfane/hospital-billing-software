import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { clientAuthApi } from "../../SubAdmin/API/clientApi";
import { adminApiService } from "../../Admin/API/adminApi";
import staffApi from "../../SubAdmin/API/staffApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  let logoutTimer = null;

  /* ================= AUTO LOGOUT TIMER ================= */
  const startAutoLogoutTimer = (token) => {
    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000 - Date.now();

      if (expiryTime <= 0) {
        logout();
        return;
      }

      logoutTimer = setTimeout(() => {
        logout();
      }, expiryTime);
    } catch {
      logout();
    }
  };

  /* ================= CHECK AUTH ON LOAD ================= */
  useEffect(() => {
    checkAuthStatus();
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);

  const checkAuthStatus = () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const clientToken = localStorage.getItem("clientToken");

      /* ===== ADMIN ===== */
      if (adminToken) {
        const decoded = jwtDecode(adminToken);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("adminToken");
        } else {
          setUser({
            token: adminToken,
            role: "admin",
          });
          setIsAuthenticated(true);
          startAutoLogoutTimer(adminToken);
          return;
        }
      }

      /* ===== CLIENT (SubAdmin) or STAFF ===== */
      const token = clientToken || localStorage.getItem("staffToken");
      if (token) {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({
            token,
            tenantId: decoded.tenantId,
            type: decoded.type,
            role: decoded.role || (clientToken ? "client" : "staff"),
            doctorId: decoded.doctorId,
            registrationStage: localStorage.getItem("registrationStage"),
          });

          setIsAuthenticated(true);
          startAutoLogoutTimer(token);
          return;
        }
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLIENT LOGIN ================= */
  const login = async (email, password) => {
    try {
      const response = await clientAuthApi.login({ email, password });
      const decoded = jwtDecode(response.token);

      localStorage.setItem("clientToken", response.token);
      localStorage.setItem("tenantId", decoded.tenantId);
      localStorage.setItem(
        "registrationStage",
        response.registrationStage || "BASIC"
      );

      setUser({
        token: response.token,
        tenantId: decoded.tenantId,
        type: decoded.type,
        role: decoded.role || "staff",
        doctorId: decoded.doctorId,
        email,
        registrationStage: response.registrationStage || "BASIC",
      });

      setIsAuthenticated(true);
      startAutoLogoutTimer(response.token);

      return {
        success: true,
        registrationStage: response.registrationStage,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  /* ================= STAFF LOGIN ================= */
  const staffLogin = async (email, password) => {
    try {
      const response = await staffApi.login(email, password);
      const decoded = jwtDecode(response.token);

      localStorage.setItem("staffToken", response.token);
      localStorage.setItem("staffUser", JSON.stringify(response.staff));

      setUser({
        token: response.token,
        tenantId: decoded.tenantId,
        type: decoded.type,
        role: decoded.role || "staff",
        doctorId: decoded.doctorId,
        name: response.staff.name,
        email: response.staff.email,
        permissions: response.staff.permissions,
      });

      setIsAuthenticated(true);
      startAutoLogoutTimer(response.token);

      return {
        success: true,
        staff: response.staff,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Staff login failed",
      };
    }
  };

  /* ================= REGISTER ================= */
  const register = async (hospitalData) => {
    try {
      const response = await clientAuthApi.register(hospitalData);
      return {
        success: true,
        message: response.message,
        email: hospitalData.email,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  /* ================= OTP ================= */
  const verifyOTP = async (email, otp) => {
    try {
      const response = await clientAuthApi.verifyOtp({ email, otp });
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "OTP verification failed",
      };
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await clientAuthApi.resendOtp({ email });
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to resend OTP",
      };
    }
  };

  /* ================= PASSWORD ================= */
  const forgotPassword = async (email) => {
    try {
      const response = await clientAuthApi.forgotPassword({ email });
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send reset OTP",
      };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await clientAuthApi.resetPassword({
        email,
        otp,
        newPassword,
      });
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Password reset failed",
      };
    }
  };

  /* ================= ADMIN LOGIN ================= */
  const adminLogin = async (email, password) => {
    try {
      const response = await adminApiService.login({ email, password });

      localStorage.setItem("adminToken", response.token);

      setUser({
        token: response.token,
        role: "admin",
        email,
      });

      setIsAuthenticated(true);
      startAutoLogoutTimer(response.token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Admin login failed",
      };
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("staffToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("registrationStage");
    localStorage.removeItem("staffUser");

    if (logoutTimer) clearTimeout(logoutTimer);

    setUser(null);
    setIsAuthenticated(false);

    window.location.href = "/login";
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    staffLogin,
    register,
    logout,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    adminLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
