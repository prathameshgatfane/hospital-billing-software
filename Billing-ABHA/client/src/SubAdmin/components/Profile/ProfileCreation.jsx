import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Phone, Mail, FileText, Upload, 
  Shield, CheckCircle, XCircle, ArrowRight, Loader2,
  Hospital, Stethoscope, Target, Camera, Clock, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../Common/context/AuthContext';
import { profileApi } from '../../API/profileApi';
import imagekit from "../../utils/imagekit";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '300px', borderRadius: '0.5rem' };
const defaultCenter = { lat: 20.5937, lng: 78.9629 };

const ProfileCreation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileStatus, setProfileStatus] = useState(null);

  // Form state based on your schema
  const [formData, setFormData] = useState({
    // Step 1: Hospital Type & Contact
    serviceType: 'BOTH',
    purchaseName: '',
    secondaryMobile: '',
    alternateEmail: '',
    
    // Step 2: Address & Location
    address: '',
    pincode: '',
    latitude: '',
    longitude: '',
    
    // Step 3: Registration Details
    hospitalRegistrationNumber: '',
    doctorRegistrationNumber: '',
    
    // Step 4: Documents (File uploads)
    hospitalCertificates: [],
    doctorCertificates: [],
    hospitalImages: [],
    
    // Step 5: Agreement
    agreementAccepted: false
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBhNU-t1t7p3OLL-CNoi1D2BwhcKHqYk3Q',
    libraries
  });

  const [geocoding, setGeocoding] = useState(false);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    geocodeLocation(lat, lng);
  };

  const geocodeLocation = (lat, lng) => {
    if (!window.google) return;
    setGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setGeocoding(false);
      if (status === 'OK' && results[0]) {
        // Find pincode if available
        let newPincode = formData.pincode;
        let addressComponents = results[0].address_components;
        if (addressComponents) {
          const postalCodeObj = addressComponents.find(c => c.types.includes('postal_code'));
          if (postalCodeObj) newPincode = postalCodeObj.long_name;
        }
        setFormData(prev => ({ 
          ...prev, 
          address: results[0].formatted_address,
          pincode: newPincode
        }));
        if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
      }
    });
  };

  // Fetch existing profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await profileApi.getProfile();
      if (response.success) {
        if (response.profile) {
          // Merge existing data
          setFormData(prev => ({
            ...prev,
            ...response.profile,
            // Handle arrays safely
            hospitalCertificates: response.profile.hospitalCertificates || [],
            doctorCertificates: response.profile.doctorCertificates || [],
            hospitalImages: response.profile.hospitalImages || []
          }));
          
          // Set profile status
          setProfileStatus({
            verificationStatus: response.profile.verificationStatus || 'PENDING',
            verifiedByAdmin: response.profile.verifiedByAdmin || false,
            verifiedAt: response.profile.verifiedAt
          });
          
          // If already approved, redirect to dashboard
          if (response.profile.verificationStatus === 'APPROVED') {
            navigate('/dashboard');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!formData.serviceType) {
        newErrors.serviceType = 'Service type is required';
      }
      if (formData.secondaryMobile && !/^\d{10}$/.test(formData.secondaryMobile)) {
        newErrors.secondaryMobile = 'Mobile number must be 10 digits';
      }
      if (formData.alternateEmail && !/\S+@\S+\.\S+/.test(formData.alternateEmail)) {
        newErrors.alternateEmail = 'Email is invalid';
      }
    }

    if (stepNum === 2) {
      if (!formData.address?.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.pincode?.trim()) {
        newErrors.pincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must be 6 digits';
      }
    }

    if (stepNum === 3) {
      if (!formData.hospitalRegistrationNumber?.trim()) {
        newErrors.hospitalRegistrationNumber = 'Hospital registration number is required';
      }
      if (!formData.doctorRegistrationNumber?.trim()) {
        newErrors.doctorRegistrationNumber = 'Doctor registration number is required';
      }
    }

    if (stepNum === 4) {
      if (formData.hospitalCertificates.length === 0) {
        newErrors.hospitalCertificates = 'At least one hospital certificate is required';
      }
      if (formData.doctorCertificates.length === 0) {
        newErrors.doctorCertificates = 'At least one doctor certificate is required';
      }
      if (formData.hospitalImages.length === 0) {
        newErrors.hospitalImages = 'At least one hospital image is required';
      }
    }

    if (stepNum === 5) {
      if (!formData.agreementAccepted) {
        newErrors.agreementAccepted = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setApiError('');
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
    setApiError('');
  };

const handleFileUpload = async (field, files) => {
  try {
    const uploadedUrls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5012/api/upload/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`, // VERY IMPORTANT
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      uploadedUrls.push(data.url);
    }

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...uploadedUrls],
    }));
  } catch (error) {
    console.error("Image upload failed:", error);
    alert(error.message);
  }
};


  const removeFile = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(5)) {
      return;
    }

    setSaving(true);
    setApiError('');
    
    try {
      const response = await profileApi.saveProfile(formData);
      
      if (response.success) {
        setSuccess(response.message || 'Profile submitted for admin verification!');
        setProfileStatus({
          verificationStatus: 'PENDING',
          verifiedByAdmin: false
        });
        
        // Redirect to pending verification page after 3 seconds
        setTimeout(() => {
          navigate('/subadmin');
        }, 3000);
      } else {
        setApiError(response.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      setApiError(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  // Show status message based on verification status
  const getStatusMessage = () => {
    if (!profileStatus) return null;
    
    const { verificationStatus, verifiedByAdmin, verifiedAt } = profileStatus;
    
    if (verificationStatus === 'PENDING') {
      return {
        type: 'warning',
        title: 'Pending Verification',
        message: 'Your profile is pending admin verification. You will be able to access billing features once approved.',
        icon: <Clock className="w-5 h-5" />
      };
    }
    
    if (verificationStatus === 'APPROVED' && verifiedByAdmin) {
      return {
        type: 'success',
        title: 'Profile Approved',
        message: `Your profile was approved on ${new Date(verifiedAt).toLocaleDateString()}. You can now access all features.`,
        icon: <CheckCircle className="w-5 h-5" />
      };
    }
    
    if (verificationStatus === 'REJECTED') {
      return {
        type: 'error',
        title: 'Profile Rejected',
        message: 'Your profile was rejected by admin. Please contact support for more information.',
        icon: <XCircle className="w-5 h-5" />
      };
    }
    
    return null;
  };

  const statusMessage = getStatusMessage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-4">
              <Hospital className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Hospital Profile
            </h1>
            <p className="text-gray-600">
              Please provide additional information to activate your hospital account
            </p>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`mb-6 p-4 rounded-lg border ${
              statusMessage.type === 'success' ? 'bg-green-50 border-green-200' :
              statusMessage.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start">
                <div className={`mr-3 mt-0.5 ${
                  statusMessage.type === 'success' ? 'text-green-600' :
                  statusMessage.type === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {statusMessage.icon}
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    statusMessage.type === 'success' ? 'text-green-800' :
                    statusMessage.type === 'warning' ? 'text-yellow-800' :
                    'text-red-800'
                  }`}>
                    {statusMessage.title}
                  </h3>
                  <p className={`mt-1 text-sm ${
                    statusMessage.type === 'success' ? 'text-green-700' :
                    statusMessage.type === 'warning' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {statusMessage.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div key={stepNum} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNum 
                      ? 'bg-gradient-to-r from-red-600 to-red-800 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {stepNum}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">
                    {stepNum === 1 && 'Hospital Type'}
                    {stepNum === 2 && 'Address'}
                    {stepNum === 3 && 'Registration'}
                    {stepNum === 4 && 'Documents'}
                    {stepNum === 5 && 'Agreement'}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-800 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                {apiError}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-green-800 font-medium">{success}</p>
                  <p className="text-green-700 text-sm mt-1">
                    You will be redirected to dashboard shortly. Your account is now pending admin verification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Verification Notice */}
          {profileStatus?.verificationStatus === 'PENDING' && !success && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium">Important Notice</p>
                  <p className="text-blue-700 text-sm mt-1">
                    Your hospital profile requires admin verification before you can access billing features.
                    This process typically takes 24-48 hours. You will be notified once your account is approved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Hospital Service Type</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Hospital className="w-4 h-4 inline mr-2" />
                    Service Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['OPD', 'IPD', 'BOTH'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData(prev => ({ ...prev, serviceType: type }))}
                        className={`p-4 border-2 rounded-xl text-center transition-all ${
                          formData.serviceType === type
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Stethoscope className={`w-6 h-6 mb-2 ${
                            formData.serviceType === type ? 'text-red-600' : 'text-gray-500'
                          }`} />
                          <span className="font-medium">{type}</span>
                          <span className="text-xs text-gray-500 mt-1">
                            {type === 'OPD' && 'Outpatient Department'}
                            {type === 'IPD' && 'Inpatient Department'}
                            {type === 'BOTH' && 'Both Services'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.serviceType && (
                    <p className="mt-2 text-sm text-red-600">{errors.serviceType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Name / Owner Name
                  </label>
                  <input
                    type="text"
                    name="purchaseName"
                    value={formData.purchaseName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter purchase/owner name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Secondary Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="secondaryMobile"
                      value={formData.secondaryMobile}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.secondaryMobile ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="9876543210"
                      maxLength="10"
                    />
                    {errors.secondaryMobile && (
                      <p className="mt-1 text-sm text-red-600">{errors.secondaryMobile}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Alternate Email
                    </label>
                    <input
                      type="email"
                      name="alternateEmail"
                      value={formData.alternateEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.alternateEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="alternate@example.com"
                    />
                    {errors.alternateEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.alternateEmail}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Hospital Address & Location</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter complete hospital address with landmark"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="560001"
                      maxLength="6"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                {/* Map Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Drop Pin on Map *
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Click on the map to mark your exact location and auto-fill address.</p>

                  {isLoaded ? (
                    <div className="p-1 border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={formData.latitude ? { lat: Number(formData.latitude), lng: Number(formData.longitude) } : defaultCenter}
                        zoom={formData.latitude ? 16 : 4}
                        onClick={handleMapClick}
                        options={{ streetViewControl: false, mapTypeControl: false }}
                      >
                        {formData.latitude && (
                          <Marker position={{ lat: Number(formData.latitude), lng: Number(formData.longitude) }} animation={window.google?.maps?.Animation?.DROP} />
                        )}
                      </GoogleMap>
                    </div>
                  ) : (
                    <div className="w-full h-[300px] bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-gray-500 text-sm">Loading map...</span>
                    </div>
                  )}
                  
                  {geocoding && <p className="text-sm text-blue-600 mb-2 flex items-center"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Fetching location details...</p>}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                      <input type="text" value={formData.latitude || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                      <input type="text" value={formData.longitude || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" readOnly />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg mt-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Target className="w-4 h-4 mr-2" />
                    <span>Tip: Map selection will automatically update your address and coordinates.</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Registration Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital Registration Number *
                  </label>
                  <input
                    type="text"
                    name="hospitalRegistrationNumber"
                    value={formData.hospitalRegistrationNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.hospitalRegistrationNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter hospital registration number"
                  />
                  {errors.hospitalRegistrationNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.hospitalRegistrationNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Registration Number *
                  </label>
                  <input
                    type="text"
                    name="doctorRegistrationNumber"
                    value={formData.doctorRegistrationNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.doctorRegistrationNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter doctor registration number"
                  />
                  {errors.doctorRegistrationNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.doctorRegistrationNumber}</p>
                  )}
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start text-sm text-yellow-800">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Important Notice</p>
                      <p>Registration numbers are verified for authenticity. Please ensure they are accurate and up-to-date.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Documents & Images</h2>
                
                {/* Hospital Certificates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Hospital Certificates *
                    <span className="text-gray-500 text-sm ml-2">(Max 5 files, PDF/JPEG/PNG)</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
                    errors.hospitalCertificates ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-red-300'
                  }`}>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Upload hospital registration certificates</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('hospitalCertificates', e.target.files)}
                      className="hidden"
                      id="hospitalCertificates"
                    />
                    <label
                      htmlFor="hospitalCertificates"
                      className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                    >
                      Choose Files
                    </label>
                  </div>
                  
                  {formData.hospitalCertificates.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</p>
                      <div className="space-y-2">
                        {formData.hospitalCertificates.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-500 mr-2" />
<span className="text-sm">{file.name}</span>
<a
  href={file.url}
  target="_blank"
  rel="noreferrer"
  className="text-blue-600 text-xs ml-2"
>
  View
</a>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile('hospitalCertificates', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {errors.hospitalCertificates && (
                    <p className="mt-2 text-sm text-red-600">{errors.hospitalCertificates}</p>
                  )}
                </div>

                {/* Doctor Certificates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Doctor Certificates *
                    <span className="text-gray-500 text-sm ml-2">(Max 5 files, PDF/JPEG/PNG)</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
                    errors.doctorCertificates ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-red-300'
                  }`}>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Upload doctor registration certificates</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('doctorCertificates', e.target.files)}
                      className="hidden"
                      id="doctorCertificates"
                    />
                    <label
                      htmlFor="doctorCertificates"
                      className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                    >
                      Choose Files
                    </label>
                  </div>
                  
                  {formData.doctorCertificates.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</p>
                      <div className="space-y-2">
                        {formData.doctorCertificates.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm">{file}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile('doctorCertificates', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {errors.doctorCertificates && (
                    <p className="mt-2 text-sm text-red-600">{errors.doctorCertificates}</p>
                  )}
                </div>

                {/* Hospital Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Camera className="w-4 h-4 inline mr-2" />
                    Hospital Images *
                    <span className="text-gray-500 text-sm ml-2">(Max 10 images, JPEG/PNG)</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
                    errors.hospitalImages ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-red-300'
                  }`}>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Upload photos of your hospital premises</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload('hospitalImages', e.target.files)}
                      className="hidden"
                      id="hospitalImages"
                    />
                    <label
                      htmlFor="hospitalImages"
                      className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                    >
                      Choose Images
                    </label>
                  </div>
                  
                  {formData.hospitalImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</p>
                      <div className="space-y-2">
                        {formData.hospitalImages.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <Camera className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm">{file}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile('hospitalImages', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {errors.hospitalImages && (
                    <p className="mt-2 text-sm text-red-600">{errors.hospitalImages}</p>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Terms & Agreement</h2>
                
                <div className="p-6 bg-gray-50 rounded-xl max-h-96 overflow-y-auto">
                  <h3 className="font-bold text-lg mb-4">Hospital Service Agreement</h3>
                  
                  <div className="space-y-4 text-gray-700">
                    <p>
                      By completing this profile, you agree to the following terms and conditions:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p>You certify that all information provided is accurate and up-to-date.</p>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p>You have the authority to represent the hospital mentioned in this application.</p>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p>You agree to maintain the confidentiality of patient data as per HIPAA guidelines.</p>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p>You will comply with all local healthcare regulations and requirements.</p>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p>You understand that Makvid reserves the right to verify submitted documents.</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Providing false information may result in account suspension and legal action.
                      </p>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Verification Process:</strong> Your profile will be reviewed by our admin team. 
                        This process typically takes 24-48 hours. You will be notified once your account is approved.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreementAccepted"
                      name="agreementAccepted"
                      checked={formData.agreementAccepted}
                      onChange={handleChange}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="agreementAccepted" className="text-gray-700">
                      I have read and agree to the Terms of Service and Privacy Policy. 
                      I certify that all information provided is accurate to the best of my knowledge.
                    </label>
                    {errors.agreementAccepted && (
                      <p className="mt-1 text-red-600 text-sm">{errors.agreementAccepted}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              ) : (
                <div></div> // Empty div for spacing
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting for Verification...
                    </>
                  ) : (
                    'Submit for Verification'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Step Indicator */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Step {step} of 5 • {Math.round((step / 5) * 100)}% Complete
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;