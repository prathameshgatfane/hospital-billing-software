import { useState, useEffect } from "react";
import { useAuth } from "../../Common/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { CheckCircle, XCircle, ArrowLeft, Mail } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register, verifyOTP, resendOTP } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: '',
    doctorName: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Hospital name is required';
    if (!formData.doctorName.trim()) newErrors.doctorName = 'Doctor name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept terms';
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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    setApiError('');

    const result = await register({
      hospitalName: formData.hospitalName,
      doctorName: formData.doctorName,
      contactNumber: formData.contactNumber,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      setSuccessMessage(result.message || 'OTP sent to email.');
      setStep(2);
      startOTPTimer();
    } else {
      setApiError(result.message);
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrors({ otp: 'Enter 6-digit OTP' });
      return;
    }

    setLoading(true);
    setApiError('');

    const result = await verifyOTP(formData.email, otpCode);
    if (result.success) {
      alert(result.message || 'Registration successful!');
      navigate('/login');
    } else {
      setErrors({ otp: result.message });
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setLoading(true);
    const result = await resendOTP(formData.email);
    if (result.success) {
      alert('OTP resent!');
      startOTPTimer();
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  const startOTPTimer = () => {
    setOtpTimer(60);
    setCanResend(false);
  };

  useEffect(() => {
    let timer;
    if (step === 2 && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-charcoal">
        <div className="w-full max-w-2xl">
          <div
            className="relative rounded-3xl border border-white/20 shadow-2xl
              bg-white/10 backdrop-blur-xl overflow-hidden
              w-full p-6 sm:p-10
              hover:border-white/30 transition-all duration-500"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white tracking-tight">
                {step === 1 ? 'Hospital Registration' : 'Verify Your Email'}
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                {step === 1 ? 'Create your professional hospital dashboard' : `Enter code sent to ${formData.email}`}
              </p>
            </div>

            {apiError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-sm text-center">
                {apiError}
              </div>
            )}

            {step === 1 ? (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleRegisterSubmit}>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Hospital Name</label>
                  <input
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-white"
                    placeholder="City General Hospital"
                    required
                  />
                  {errors.hospitalName && <p className="text-red-400 text-[10px] ml-1">{errors.hospitalName}</p>}
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Doctor Name</label>
                  <input
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-white"
                    placeholder="Dr. John Doe"
                    required
                  />
                  {errors.doctorName && <p className="text-red-400 text-[10px] ml-1">{errors.doctorName}</p>}
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-white"
                    placeholder="admin@hospital.com"
                    required
                  />
                  {errors.email && <p className="text-red-400 text-[10px] ml-1">{errors.email}</p>}
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Contact Number</label>
                  <input
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-white"
                    placeholder="9876543210"
                    maxLength="10"
                    required
                  />
                  {errors.contactNumber && <p className="text-red-400 text-[10px] ml-1">{errors.contactNumber}</p>}
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-white"
                    placeholder="••••••••"
                    required
                  />
                  {errors.password && <p className="text-red-400 text-[10px] ml-1">{errors.password}</p>}
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-white"
                    placeholder="••••••••"
                    required
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-[10px] ml-1">{errors.confirmPassword}</p>}
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="accent-primary w-4 h-4"
                  />
                  <label className="text-xs text-gray-400 font-medium">
                    I agree to the <Link to="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="col-span-2 bg-primary text-white font-bold text-sm uppercase tracking-widest py-4 rounded-2xl
                    hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/20 transform hover:scale-[1.01] active:scale-95
                    disabled:opacity-50 mt-4"
                >
                  {loading ? "Processing..." : "Create Account"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div className="flex justify-center gap-2 sm:gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }}
                      className="w-10 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary"
                    />
                  ))}
                </div>

                <div className="text-center">
                  {otpTimer > 0 ? (
                    <p className="text-sm text-gray-400">Resend code in <span className="text-primary font-bold">{otpTimer}s</span></p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-sm text-primary font-bold hover:underline"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-bold text-sm uppercase tracking-widest py-4 rounded-2xl
                    hover:bg-primary-dark transition-all shadow-lg"
                >
                  {loading ? "Verifying..." : "Verify & Complete"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Back to Registration
                </button>
              </form>
            )}

            <div className="mt-10 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
