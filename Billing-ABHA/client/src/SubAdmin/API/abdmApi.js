import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5012"}/api/abdm`;

const abdmApi = {
  /**
   * Request OTP to Aadhaar-linked mobile
   * @param {string} aadhaarNumber 
   */
  requestOtp: async (aadhaarNumber) => {
    try {
      const response = await axios.post(
        `${API_URL}/request-otp`,
        { aadhaarNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("clientToken") || localStorage.getItem("staffToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Verify Aadhaar OTP to create/retrieve ABHA profile
   * @param {string} txnId 
   * @param {string} otpValue 
   */
  verifyOtp: async (txnId, otpValue) => {
    try {
      const response = await axios.post(
        `${API_URL}/verify-otp`,
        { txnId, otpValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("clientToken") || localStorage.getItem("staffToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default abdmApi;
