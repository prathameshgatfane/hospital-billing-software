import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../Common/context/AuthContext'; // Use AuthContext instead of direct API

const Login = () => {
  const navigate = useNavigate();
  const { login, resendOTP, verifyOTP } = useAuth(); // Get auth methods from context

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1); // 1: Enter OTP, 2: Success
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setApiError('');

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Redirect based on registration stage
        if (result.registrationStage === 'BASIC') {
          navigate('/subadmin/profile'); // Redirect to profile completion
        } else {
          navigate('/subadmin'); // Redirect to dashboard
        }
      } else {
        const errorMessage = result.message || 'Login failed. Please check your credentials.';
        setApiError(errorMessage);

        // Check if error is about email not verified
        if (errorMessage.includes('Email not verified') || errorMessage.includes('verify OTP')) {
          setVerificationEmail(formData.email);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setShowVerificationModal(true);
    startOTPTimer();

    try {
      // Resend OTP for verification
      await resendOTP(formData.email);
    } catch (error) {
      console.error('Resend OTP error:', error);
      // Don't show error - we'll show the modal anyway
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

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      await resendOTP(verificationEmail || formData.email);
      startOTPTimer();
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`verify-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`verify-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(verificationEmail || formData.email, otpCode);

      if (result.success) {
        setVerificationStep(2); // Show success message

        // Auto-close modal after 2 seconds
        setTimeout(() => {
          setShowVerificationModal(false);
          setVerificationStep(1);
          setOtp(['', '', '', '', '', '']);
          setApiError(''); // Clear any previous error
        }, 2000);
      } else {
        setApiError(result.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setApiError('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Hospital Login</h2>
          <p className="text-gray-600 mt-2">Welcome back! Please sign in to continue.</p>
        </div>

        {apiError && (
          <div className={`mb-4 p-4 rounded-lg ${apiError.includes('Email not verified') ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm flex items-center ${apiError.includes('Email not verified') ? 'text-yellow-800' : 'text-red-600'}`}>
              {apiError.includes('Email not verified') ? (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  {apiError}
                  <button
                    onClick={handleVerifyEmail}
                    className="ml-2 text-red-600 hover:text-red-800 font-medium underline"
                  >
                    Verify Now
                  </button>
                </>
              ) : (
                apiError
              )}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="hospital@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-red-600 hover:text-red-800"
            >
              Forgot Password?
            </Link>
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
                Logging in...
              </span>
            ) : 'Login'}
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-600 hover:text-red-800 font-medium">
              Register here
            </Link>
          </p>
        </form>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center">
                {verificationStep === 1 ? 'Verify Your Email' : 'Email Verified!'}
              </h3>
              <p className="text-center text-red-100 text-sm mt-2">
                {verificationStep === 1
                  ? 'Enter the OTP sent to your email'
                  : 'Your email has been verified successfully!'}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {verificationStep === 1 ? (
                <>
                  <div className="text-center mb-6">
                    <p className="text-gray-600">
                      We've sent a 6-digit verification code to
                      <br />
                      <span className="font-semibold text-gray-900">
                        {verificationEmail || formData.email}
                      </span>
                    </p>
                  </div>

                  {/* OTP Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                      6-Digit Verification Code
                    </label>
                    <div className="flex justify-center space-x-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`verify-otp-${index}`}
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
                  </div>

                  {/* Timer and Resend */}
                  <div className="text-center mb-6">
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
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Resend verification code
                      </button>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Didn't receive the email? Check your spam folder
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={loading || otp.join('').length !== 6}
                      className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify Email'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowVerificationModal(false);
                        setOtp(['', '', '', '', '', '']);
                      }}
                      className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                /* Success Message */
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Email Verified Successfully!
                  </h4>
                  <p className="text-gray-600">
                    You can now login with your credentials.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowVerificationModal(false)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;