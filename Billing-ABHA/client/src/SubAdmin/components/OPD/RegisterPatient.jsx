// RegisterPatient.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Save, User, Phone, Mail,
  MapPin, Heart, AlertCircle, Weight,
  Ruler, FileText, Shield, Plus, Trash2,
  CheckCircle2, Receipt, Fingerprint, Check, RefreshCw
} from 'lucide-react';
import patientApi from '../../API/patientApi';
import abdmApi from '../../API/abdmApi';
import { useAuth } from '../../../Common/context/AuthContext';

/* ─── Smaller Reusable UI Helpers ─── */
const SectionTitle = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, borderBottom: '1px solid var(--card-border)', paddingBottom: 14 }}>
    {icon}
    <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-color)', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{label}</h2>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 5 }}>
      {label}
    </label>
    {children}
  </div>
);

const card = {
  background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14,
  padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
};

const inp = {
  width: '100%', padding: '9px 13px', fontSize: 13,
  border: '1px solid var(--input-border)', borderRadius: 8, outline: 'none',
  background: 'var(--input-bg)', color: 'var(--input-text)',
  fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box'
};

const RegisterPatient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = !!id;
  const { user } = useAuth();
  const fromOpdBilling = location.state?.fromOpdBilling === true;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '', email: '', mobile: '',
    address: { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India' },
    emergencyContact: { name: '', relation: '', mobile: '', email: '' },
    chronicConditions: '', knownAllergies: [''],
    billingDetails: { isInsured: false, insuranceProvider: '', policyNumber: '', policyHolder: '', validTill: '' },
    bloodGroup: '', height: '', weight: '', notes: '',
    abhaNumber: '', abhaAddress: ''
  });

  // ABHA flow state variables
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [txnId, setTxnId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verifyingAbha, setVerifyingAbha] = useState(false);
  const [abhaError, setAbhaError] = useState('');
  const [abhaSuccess, setAbhaSuccess] = useState('');

  const handleRequestOtp = async () => {
    setAbhaError('');
    setAbhaSuccess('');
    if (aadhaarNumber.length !== 12) {
      setAbhaError('Aadhaar number must be exactly 12 digits');
      return;
    }
    setVerifyingAbha(true);
    try {
      const res = await abdmApi.requestOtp(aadhaarNumber);
      if (res.success) {
        setTxnId(res.txnId);
        setOtpSent(true);
        setAbhaSuccess(res.isMock ? 'Sandbox Mode: OTP requested! Enter 123456 to verify.' : 'OTP sent successfully to your Aadhaar-linked mobile!');
      } else {
        setAbhaError(res.message || 'Failed to request OTP');
      }
    } catch (err) {
      setAbhaError(err.message || 'Error occurred while requesting OTP');
    } finally {
      setVerifyingAbha(false);
    }
  };

  const handleVerifyOtp = async () => {
    setAbhaError('');
    setAbhaSuccess('');
    if (!otpValue) {
      setAbhaError('Please enter the OTP received');
      return;
    }
    setVerifyingAbha(true);
    try {
      const res = await abdmApi.verifyOtp(txnId, otpValue);
      if (res.success && res.profile) {
        const profile = res.profile;
        setFormData(prev => ({
          ...prev,
          firstName: profile.firstName || prev.firstName,
          lastName: profile.lastName || prev.lastName,
          gender: profile.gender || prev.gender,
          dateOfBirth: profile.dateOfBirth || prev.dateOfBirth,
          mobile: profile.mobile || prev.mobile,
          abhaNumber: profile.abhaNumber || '',
          abhaAddress: profile.abhaAddress || '',
          address: {
            ...prev.address,
            addressLine1: profile.address?.addressLine1 || prev.address.addressLine1,
            city: profile.address?.city || prev.address.city,
            state: profile.address?.state || prev.address.state,
            pincode: profile.address?.pincode || prev.address.pincode,
          }
        }));
        setAbhaSuccess(`ABHA verified successfully! Number: ${profile.abhaNumber}`);
        // Reset Aadhaar form
        setOtpSent(false);
        setAadhaarNumber('');
        setOtpValue('');
      } else {
        setAbhaError(res.message || 'OTP verification failed');
      }
    } catch (err) {
      setAbhaError(err.message || 'Error occurred during OTP verification');
    } finally {
      setVerifyingAbha(false);
    }
  };

  useEffect(() => {
    if (isEditMode) fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const response = await patientApi.getById(id);
      if (response.success) {
        const p = response.data;
        setFormData({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
          gender: p.gender || '',
          email: p.email || '',
          mobile: p.mobile || '',
          address: {
            addressLine1: p.address?.addressLine1 || '',
            addressLine2: p.address?.addressLine2 || '',
            city: p.address?.city || '',
            state: p.address?.state || '',
            pincode: p.address?.pincode || '',
            country: p.address?.country || 'India'
          },
          emergencyContact: {
            name: p.emergencyContact?.name || '',
            relation: p.emergencyContact?.relation || '',
            mobile: p.emergencyContact?.mobile || '',
            email: p.emergencyContact?.email || ''
          },
          chronicConditions: p.chronicConditions || '',
          knownAllergies: p.knownAllergies?.length > 0 ? p.knownAllergies : [''],
          billingDetails: {
            isInsured: p.billingDetails?.isInsured || false,
            insuranceProvider: p.billingDetails?.insuranceProvider || '',
            policyNumber: p.billingDetails?.policyNumber || '',
            policyHolder: p.billingDetails?.policyHolder || '',
            validTill: p.billingDetails?.validTill ? p.billingDetails.validTill.split('T')[0] : '',
          },
          bloodGroup: p.bloodGroup || '',
          height: p.height || '',
          weight: p.weight || '',
          notes: p.notes || '',
          abhaNumber: p.abhaNumber || '',
          abhaAddress: p.abhaAddress || ''
        });
      }
    } catch (error) {
      console.error(error);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const setNested = (s, k, v) => setFormData(p => ({ ...p, [s]: { ...p[s], [k]: v } }));

  const validateForm = () => {
    const errs = [];
    if (!formData.firstName.trim()) errs.push('First name is required');
    if (!formData.lastName.trim()) errs.push('Last name is required');
    if (!formData.dateOfBirth) errs.push('Date of birth is required');
    if (!formData.gender) errs.push('Gender is required');
    if (!formData.mobile.trim()) errs.push('Mobile number is required');

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.push('Invalid email format');
    if (formData.mobile && !/^[+]?[0-9\s\-\(\)]{10,15}$/.test(formData.mobile)) errs.push('Invalid mobile format');
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validateForm();
    if (errs.length > 0) return setError(errs.join(', '));

    setLoading(true);
    try {
      if (!isEditMode) {
        const check = await patientApi.checkDuplicate({
          firstName: formData.firstName, lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth, mobile: formData.mobile, email: formData.email
        });
        if (check.isDuplicate) {
          setError('Patient with similar details already exists. Please verify.');
          setLoading(false); return;
        }
      }

      const res = isEditMode ? await patientApi.update(id, formData) : await patientApi.register(formData);
      if (res.success) {
        if (!isEditMode && fromOpdBilling) {
          // ← Came from OPD billing dashboard: open billing for this new patient
          const newPatient = res.data || res.patient;
          navigate('/subadmin/reception/opd/billing/create', {
            state: {
              patientId: newPatient?._id,
              patientName: `${formData.firstName} ${formData.lastName}`
            }
          });
        } else {
          navigate(`/subadmin/patients`, {
            state: { successMessage: isEditMode ? 'Patient updated!' : 'Patient registered!' }
          });
        }
      } else {
        setError(res.message || 'Action failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        input:focus, select:focus, textarea:focus { border-color: #DC2626 !important; background: var(--card-bg) !important; color: var(--input-text) !important; }
        
        @media (max-width: 1024px) {
          .rp-container { padding: 12px !important; }
        }
        @media (max-width: 640px) {
          .rp-header { flex-direction: column; align-items: flex-start !important; }
          .rp-btn-group { width: 100%; margin-top: 10px; }
          .rp-btn-group button { flex: 1; justify-content: center; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--bg-color)', fontFamily: "'DM Sans', sans-serif" }}>
        <div className="rp-container" style={{ maxWidth: 1400, margin: '0 auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Header ── */}
          <div className="rp-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-color)', margin: 0, letterSpacing: '-0.02em' }}>
                  {isEditMode ? 'Update Patient' : 'Register New Patient'}
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '3px 0 0' }}>
                  {isEditMode
                    ? 'Modify an existing patient profile'
                    : fromOpdBilling
                      ? 'Billing will open automatically after registration'
                      : 'Add a new patient to your healthcare system'
                  }
                </p>
              </div>
            </div>

            <div className="rp-btn-group" style={{ display: 'flex', gap: 10 }}>
              {!isEditMode && (
                <button type="button" onClick={() => navigate('/subadmin/reception/opd/check-duplicate')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-color)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  <CheckCircle2 size={14} color="var(--text-muted)" /> Check Duplicate
                </button>
              )}
              <button onClick={handleSubmit} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', background: loading ? '#D1D5DB' : '#DC2626', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s' }}>
                <Save size={14} />
                {loading ? 'Processing…' : isEditMode ? 'Save Changes' : fromOpdBilling ? 'Register & Open Billing' : 'Register Patient'}
              </button>
            </div>
          </div>

          {/* OPD Billing info banner */}
          {fromOpdBilling && !isEditMode && (
            <div style={{ padding: '12px 16px', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Receipt size={15} color="#7C3AED" />
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#5B21B6', fontFamily: "'DM Sans', sans-serif" }}>
                After registration, billing will automatically open for this patient — you can add services and generate the bill right away.
              </p>
            </div>
          )}

          {error && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={16} color="#DC2626" />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#991B1B' }}>{error}</p>
            </div>
          )}

          {/* 🪪 ABHA (ABDM) Aadhaar Verification Panel */}
          {!isEditMode && (
            <div style={{
              background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(220, 38, 38, 0.03) 100%)',
              border: '1px dashed #DC2626',
              borderRadius: 14,
              padding: 24,
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.05)',
              fontFamily: "'DM Sans', sans-serif"
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, borderBottom: '1px solid var(--card-border)', paddingBottom: 14, marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#FEF2F2', padding: 8, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Fingerprint size={20} color="#DC2626" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-color)', margin: 0 }}>ABHA (ABDM) Integration</h2>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>Verify patient details instantly via Aadhaar OTP</p>
                  </div>
                </div>
                {formData.abhaNumber && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    <Check size={12} /> ABHA VERIFIED
                  </div>
                )}
              </div>

              {/* Status alerts inside the widget */}
              {abhaError && (
                <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <AlertCircle size={14} color="#DC2626" />
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#991B1B' }}>{abhaError}</p>
                </div>
              )}
              {abhaSuccess && (
                <div style={{ padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Check size={14} color="#15803D" />
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#166534' }}>{abhaSuccess}</p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {!otpSent ? (
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 5 }}>
                        Aadhaar Number
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="Enter 12-digit Aadhaar number"
                        value={aadhaarNumber}
                        onChange={e => setAadhaarNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        style={inp}
                        disabled={verifyingAbha}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={verifyingAbha || aadhaarNumber.length !== 12}
                      style={{
                        padding: '9px 18px',
                        background: verifyingAbha || aadhaarNumber.length !== 12 ? '#E5E7EB' : '#DC2626',
                        color: verifyingAbha || aadhaarNumber.length !== 12 ? '#9CA3AF' : '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: verifyingAbha || aadhaarNumber.length !== 12 ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        height: 38,
                        boxSizing: 'border-box'
                      }}
                    >
                      {verifyingAbha && <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />}
                      Get Aadhaar OTP
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 5 }}>
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otpValue}
                        onChange={e => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                        style={inp}
                        disabled={verifyingAbha}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={verifyingAbha || !otpValue}
                        style={{
                          padding: '9px 18px',
                          background: verifyingAbha || !otpValue ? '#E5E7EB' : '#DC2626',
                          color: verifyingAbha || !otpValue ? '#9CA3AF' : '#fff',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: verifyingAbha || !otpValue ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          height: 38,
                          boxSizing: 'border-box'
                        }}
                      >
                        {verifyingAbha && <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />}
                        Verify & Auto-Fill
                      </button>
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtpValue(''); setAbhaError(''); setAbhaSuccess(''); }}
                        style={{
                          padding: '9px 14px',
                          background: 'var(--card-bg)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-color)',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          height: 38,
                          boxSizing: 'border-box'
                        }}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {/* Show details when ABHA details are linked in form */}
                {formData.abhaNumber && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 10,
                    background: 'var(--input-bg)',
                    padding: 14,
                    borderRadius: 10,
                    border: '1px dashed var(--card-border)',
                    marginTop: 8
                  }}>
                    <div>
                      <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)' }}>ABHA NUMBER</span>
                      <strong style={{ fontSize: 13, color: 'var(--text-color)' }}>{formData.abhaNumber}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)' }}>ABHA ADDRESS</span>
                      <strong style={{ fontSize: 13, color: 'var(--text-color)' }}>{formData.abhaAddress}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>

            {/* ── Left Column ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Personal Info */}
              <div style={card}>
                <SectionTitle icon={<User size={15} color="#DC2626" />} label="Personal Information" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="First Name *">
                    <input type="text" required value={formData.firstName} onChange={e => set('firstName', e.target.value)} style={inp} />
                  </Field>
                  <Field label="Last Name *">
                    <input type="text" required value={formData.lastName} onChange={e => set('lastName', e.target.value)} style={inp} />
                  </Field>
                  <Field label="Date of Birth *">
                    <input type="date" required value={formData.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} style={inp} />
                  </Field>
                  <Field label="Gender *">
                    <select required value={formData.gender} onChange={e => set('gender', e.target.value)} style={inp}>
                      <option value="">Select</option>
                      {genders.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="Mobile Number *">
                    <div style={{ position: 'relative' }}>
                      <Phone size={13} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 11 }} />
                      <input type="tel" required value={formData.mobile} onChange={e => set('mobile', e.target.value)} placeholder="+91 9876543210" style={{ ...inp, paddingLeft: 34 }} />
                    </div>
                  </Field>
                  <Field label="Email Address">
                    <div style={{ position: 'relative' }}>
                      <Mail size={13} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 11 }} />
                      <input type="email" value={formData.email} onChange={e => set('email', e.target.value)} placeholder="patient@mail.com" style={{ ...inp, paddingLeft: 34 }} />
                    </div>
                  </Field>
                  <Field label="ABHA Number">
                    <input type="text" value={formData.abhaNumber} onChange={e => set('abhaNumber', e.target.value)} placeholder="e.g. 91-1234-5678-9012" style={inp} />
                  </Field>
                  <Field label="ABHA Address">
                    <input type="text" value={formData.abhaAddress} onChange={e => set('abhaAddress', e.target.value)} placeholder="e.g. patient@sbx" style={inp} />
                  </Field>
                </div>
              </div>

              {/* Address */}
              <div style={card}>
                <SectionTitle icon={<MapPin size={15} color="#DC2626" />} label="Address Details" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Field label="Address Line 1">
                    <input type="text" value={formData.address.addressLine1} onChange={e => setNested('address', 'addressLine1', e.target.value)} style={inp} placeholder="Street, Sector..." />
                  </Field>
                  <Field label="Address Line 2">
                    <input type="text" value={formData.address.addressLine2} onChange={e => setNested('address', 'addressLine2', e.target.value)} style={inp} placeholder="Apt, Suite..." />
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="City"><input type="text" value={formData.address.city} onChange={e => setNested('address', 'city', e.target.value)} style={inp} /></Field>
                    <Field label="State"><input type="text" value={formData.address.state} onChange={e => setNested('address', 'state', e.target.value)} style={inp} /></Field>
                    <Field label="Pincode"><input type="text" value={formData.address.pincode} onChange={e => setNested('address', 'pincode', e.target.value)} style={inp} /></Field>
                    <Field label="Country"><input type="text" value={formData.address.country} onChange={e => setNested('address', 'country', e.target.value)} style={inp} /></Field>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div style={card}>
                <SectionTitle icon={<FileText size={15} color="#DC2626" />} label="Medical Information" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Field label="Chronic Conditions">
                    <textarea rows="3" value={formData.chronicConditions} onChange={e => set('chronicConditions', e.target.value)} style={{ ...inp, resize: 'vertical' }} placeholder="Diabetes, Hypertension, etc." />
                  </Field>
                  <Field label="Known Allergies">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {formData.knownAllergies.map((allergy, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8 }}>
                          <input type="text" value={allergy} onChange={e => {
                            const arr = [...formData.knownAllergies]; arr[i] = e.target.value; set('knownAllergies', arr);
                          }} style={{ ...inp, flex: 1 }} placeholder="e.g. Peanuts, Penicillin" />
                          {i > 0 && (
                            <button type="button" onClick={() => set('knownAllergies', formData.knownAllergies.filter((_, idx) => idx !== i))} style={{ width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', cursor: 'pointer' }}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <div>
                        <button type="button" onClick={() => set('knownAllergies', [...formData.knownAllergies, ''])} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, color: '#DC2626', background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "'DM Mono', monospace" }}>
                          <Plus size={12} /> ADD ALLERGY
                        </button>
                      </div>
                    </div>
                  </Field>
                </div>
              </div>

            </div>

            {/* ── Right Column ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Medical Profile */}
              <div style={card}>
                <SectionTitle icon={<Heart size={15} color="#DC2626" />} label="Physical Profile" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                  <Field label="Blood Group">
                    <select value={formData.bloodGroup} onChange={e => set('bloodGroup', e.target.value)} style={inp}>
                      <option value="">Select</option>
                      {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Height (cm)">
                      <div style={{ position: 'relative' }}>
                        <Ruler size={13} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 11 }} />
                        <input type="number" value={formData.height} onChange={e => set('height', e.target.value)} placeholder="170" style={{ ...inp, paddingLeft: 34 }} />
                      </div>
                    </Field>
                    <Field label="Weight (kg)">
                      <div style={{ position: 'relative' }}>
                        <Weight size={13} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 11 }} />
                        <input type="number" value={formData.weight} onChange={e => set('weight', e.target.value)} placeholder="65" style={{ ...inp, paddingLeft: 34 }} />
                      </div>
                    </Field>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div style={card}>
                <SectionTitle icon={<AlertCircle size={15} color="#DC2626" />} label="Emergency Contact" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Contact Name"><input type="text" value={formData.emergencyContact.name} onChange={e => setNested('emergencyContact', 'name', e.target.value)} style={inp} /></Field>
                    <Field label="Relation"><input type="text" value={formData.emergencyContact.relation} onChange={e => setNested('emergencyContact', 'relation', e.target.value)} style={inp} placeholder="Spouse..." /></Field>
                    <Field label="Mobile"><input type="tel" value={formData.emergencyContact.mobile} onChange={e => setNested('emergencyContact', 'mobile', e.target.value)} style={inp} /></Field>
                    <Field label="Email"><input type="email" value={formData.emergencyContact.email} onChange={e => setNested('emergencyContact', 'email', e.target.value)} style={inp} /></Field>
                  </div>
                </div>
              </div>

              {/* Insurance */}
              <div style={card}>
                <SectionTitle icon={<Shield size={15} color="#DC2626" />} label="Insurance Info" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Provider"><input type="text" value={formData.billingDetails.insuranceProvider} onChange={e => setNested('billingDetails', 'insuranceProvider', e.target.value)} style={inp} /></Field>
                    <Field label="Policy Number"><input type="text" value={formData.billingDetails.policyNumber} onChange={e => setNested('billingDetails', 'policyNumber', e.target.value)} style={inp} /></Field>
                    <Field label="Policy Holder"><input type="text" value={formData.billingDetails.policyHolder} onChange={e => setNested('billingDetails', 'policyHolder', e.target.value)} style={inp} /></Field>
                    <Field label="Valid Till"><input type="date" value={formData.billingDetails.validTill} onChange={e => setNested('billingDetails', 'validTill', e.target.value)} style={inp} /></Field>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div style={card}>
                <Field label="Additional Internal Notes">
                  <textarea rows="3" value={formData.notes} onChange={e => set('notes', e.target.value)} style={{ ...inp, resize: 'vertical' }} placeholder="Notes for reception / internal reference..." />
                </Field>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPatient;