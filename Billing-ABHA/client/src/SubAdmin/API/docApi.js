import axios from 'axios';

const API_URL = 'http://localhost:5012/api/doctor'; // Adjust based on your backend

// Create axios instance for doctor operations
const doctorAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
doctorAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("clientToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const doctorApi = {
  // Get all doctor specialties
  getSpecialties: async () => {
    const response = await doctorAxios.get('/specialties');
    return response.data;
  },

  // Add a new doctor
  addDoctor: async (data) => {
    // Map frontend fields to backend schema
    const mappedData = {
      fullName: data.fullName,
      mobile: data.phoneNumber, // Map phoneNumber to mobile
      email: data.email,
      doctorRegistrationNumber: data.doctorRegistrationNumber,
      experienceYears: parseInt(data.experience) || 0, // Map experience to experienceYears
      speciality: data.speciality,
      subSpeciality: data.subSpeciality,
      qualification: data.qualification,
      // Map charges structure to match backend schema
      charges: {
        opdConsultation: parseFloat(data.charges.consultationFee) || 0,
        opdFollowUp: parseFloat(data.charges.followUpFee) || 0,
        emergency: parseFloat(data.charges.emergencyFee) || 0,
        ipdVisit: 0 // Default value
      },
      agreementAccepted: data.agreementAccepted,
      // You might want to handle document uploads separately
      documents: {
        degreeCertificates: [],
        registrationCertificate: '',
        profilePhoto: ''
      }
    };

    const response = await doctorAxios.post('/add', mappedData);
    return response.data;
  },


  // Get my doctors (for logged-in hospital)
  getMyDoctors: async () => {
    const response = await doctorAxios.get('/my');
    return response.data;
  },

  // Get active doctors for billing
  getActiveDoctors: async () => {
    const response = await doctorAxios.get('/active');
    return response.data;
  },

  // Client (SubAdmin) toggle doctor status
  toggleDoctorStatus: async (doctorId, isActive) => {
    const response = await doctorAxios.patch(`/toggle/${doctorId}`, { isActive });
    return response.data;
  }
};