import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2, Mail, Phone, Lock, Eye, EyeOff,
  ArrowLeft, CheckCircle, XCircle, User, Shield,
  BarChart3,
  FileText
} from 'lucide-react';
import { clientAuthApi } from '../../API/clientApi'; // Adjust path based on your structure

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: '',
    doctorName: '', // Changed from contactPerson to doctorName
    email: '',
    contactNumber: '', // Changed from phone to contactNumber
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital name is required';
    }

    if (!formData.doctorName.trim()) { // Changed from contactPerson
      newErrors.doctorName = 'Doctor name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.contactNumber.trim()) { // Changed from phone
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep1()) {
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      // Prepare data for backend
      const registrationData = {
        hospitalName: formData.hospitalName,
        doctorName: formData.doctorName,
        contactNumber: formData.contactNumber,
        email: formData.email,
        password: formData.password
      };

      // Call register API
      const response = await clientAuthApi.register(registrationData);

      setSuccessMessage(response.message || 'OTP sent to email. Please verify to continue.');
      setStep(2);
      startOTPTimer();
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrors({ otp: 'Please enter 6-digit OTP' });
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await clientAuthApi.verifyOtp({
        email: formData.email,
        otp: otpCode
      });

      // Show success message and redirect to login
      alert(response.message || 'Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrors({ otp: error.response?.data?.message || 'Invalid OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const response = await clientAuthApi.resendOtp({
        email: formData.email
      });

      alert(response.message || 'OTP resent successfully');
      startOTPTimer();
    } catch (error) {
      console.error('Resend OTP error:', error);
      alert(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const startOTPTimer = () => {
    setOtpTimer(60);
    setCanResend(false);

    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Clear OTP error
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: 'gray' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const strength = (score / 5) * 100;

    if (strength < 40) return { strength, label: 'Weak', color: 'red' };
    if (strength < 70) return { strength, label: 'Fair', color: 'yellow' };
    if (strength < 90) return { strength, label: 'Good', color: 'blue' };
    return { strength, label: 'Strong', color: 'green' };
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center ">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-white hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>
      </div>

      <div className="w-full  bg-white  overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Illustration/Info */}
          <div className="md:w-2/5 bg-gradient-to-br from-red-600 to-red-800 p-8 text-white hidden md:flex flex-col justify-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Hospital Billing Solution</h1>
              <p className="text-red-100">
                Join thousands of hospitals using Mapvon for seamless billing and financial management.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">HIPAA Compliant</h3>
                  <p className="text-sm text-red-100">Secure patient data handling</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Easy Integration</h3>
                  <p className="text-sm text-red-100">Works with your existing systems</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Analytics</h3>
                  <p className="text-sm text-red-100">Monitor financial performance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-3/5 p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">Mapvon</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {step === 1 ? 'Hospital Registration' : 'Verify Email'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {step === 1
                    ? 'Create your hospital account to get started'
                    : `Enter OTP sent to ${formData.email}`
                  }
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Step {step} of 2
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-800 transition-all duration-500"
                  style={{ width: step === 1 ? '50%' : '100%' }}
                ></div>
              </div>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  {apiError}
                </p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && step === 2 && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {successMessage}
                </p>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                {/* Hospital Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.hospitalName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter hospital name"
                  />
                  {errors.hospitalName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.hospitalName}
                    </p>
                  )}
                </div>

                {/* Doctor Name (changed from Contact Person) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.doctorName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter doctor name"
                  />
                  {errors.doctorName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.doctorName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="hospital@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Contact Number (changed from Phone) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Contact Number *
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      <span className="text-gray-600">+91</span>
                    </div>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.contactNumber ? 'border-red-500 border-l-0' : 'border-gray-300 border-l-0'
                        }`}
                      placeholder="9876543210"
                      maxLength="10"
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Password strength:</span>
                        <span className={`font-medium ${strength.color === 'red' ? 'text-red-600' :
                          strength.color === 'yellow' ? 'text-yellow-600' :
                            strength.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                          }`}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color === 'red' ? 'bg-red-500' :
                            strength.color === 'yellow' ? 'bg-yellow-500' :
                              strength.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${strength.strength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}

                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                      {formData.password.length >= 8 ? <CheckCircle className="w-4 h-4 mr-2" /> : <span className="w-4 h-4 mr-2">•</span>}
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      {/[a-z]/.test(formData.password) ? <CheckCircle className="w-4 h-4 mr-2" /> : <span className="w-4 h-4 mr-2">•</span>}
                      One lowercase letter
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      {/[A-Z]/.test(formData.password) ? <CheckCircle className="w-4 h-4 mr-2" /> : <span className="w-4 h-4 mr-2">•</span>}
                      One uppercase letter
                    </li>
                    <li className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
                      {/\d/.test(formData.password) ? <CheckCircle className="w-4 h-4 mr-2" /> : <span className="w-4 h-4 mr-2">•</span>}
                      One number
                    </li>
                  </ul>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="text-gray-700">
                      I agree to the{' '}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Terms of Service
                      </a>

                      {' '}and{' '}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Privacy Policy
                      </a>

                      *
                    </label>
                    {errors.termsAccepted && (
                      <p className="mt-1 text-red-600 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.termsAccepted}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Continue to Verification'
                  )}
                </button>

                {/* Login Link */}
                <p className="text-center text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-red-600 hover:text-red-800 font-medium">
                    Sign in here
                  </Link>
                </p>
              </form>
            ) : (
              /* Step 2: OTP Verification */
              <form onSubmit={handleOtpSubmit}>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
                  <p className="text-gray-600 mt-2">
                    We've sent a 6-digit verification code to
                    <br />
                    <span className="font-semibold text-gray-900">{formData.email}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Please enter the code below to verify your email address
                  </p>
                </div>

                {/* OTP Input */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                    6-Digit Verification Code
                  </label>
                  <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  {errors.otp && (
                    <p className="mt-2 text-center text-sm text-red-600">
                      {errors.otp}
                    </p>
                  )}
                </div>

                {/* Timer and Resend */}
                <div className="text-center mb-8">
                  {otpTimer > 0 ? (
                    <p className="text-gray-600">
                      Resend code in{' '}
                      <span className="font-semibold text-red-600">
                        00:{otpTimer.toString().padStart(2, '0')}
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={!canResend || loading}
                      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                    >
                      Resend verification code
                    </button>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Didn't receive the email? Check your spam folder
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      'Verify & Complete Registration'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                    Back to Registration
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Wrong email?{' '}
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Change email address
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;