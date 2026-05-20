import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus, Trash2, Search, ArrowLeft,
  CreditCard, Banknote, Smartphone,
  ChevronRight, Save, User as UserIcon,
  Calculator, Receipt, Microscope, Stethoscope,
  ScanLine, BedDouble, LayoutGrid, CheckCircle2,
  AlertCircle, UserPlus, FileText, BriefcaseMedical
} from 'lucide-react';
import patientApi from '../../API/patientApi';
import opdServiceApi from '../../API/opdServiceApi';
import opdBillingApi from '../../API/opdBillingApi';
import billingSettingsApi from '../../API/billingSettingsApi';
import investigationSettingsApi from '../../API/investigationSettingsApi';
import { opdConsultationApi } from '../../API/opdConsultationApi';
import { doctorApi as docApi } from '../../API/docApi';

/* ─── Service Category Config ─────────────────────────────────────── */
const SERVICE_CATEGORIES = [
  { id: 'All', label: 'All', icon: LayoutGrid, color: '#6B7280', bg: '#F3F4F6' },
  { id: 'Doctor Fees', label: 'Doctor Fees', icon: Stethoscope, color: '#DC2626', bg: '#FEF2F2' },
  { id: 'Pathology', label: 'Pathology', icon: Microscope, color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'Diagnostic', label: 'Diagnostic', icon: ScanLine, color: '#2563EB', bg: '#EFF6FF' },
  { id: 'Day Care', label: 'Day Care', icon: BedDouble, color: '#16A34A', bg: '#F0FDF4' },
  { id: 'Consultation', label: 'Consultation', icon: UserIcon, color: '#EA580C', bg: '#FFF7ED' },
  { id: 'Investigation', label: 'Investigation', icon: Search, color: '#9333EA', bg: '#F5F3FF' },
  { id: 'Procedure', label: 'Procedure', icon: BriefcaseMedical, color: '#DB2777', bg: '#FDF2F8' },
  { id: 'Nursing', label: 'Nursing', icon: UserPlus, color: '#059669', bg: '#ECFDF5' },
  { id: 'Pharmacy', label: 'Pharmacy', icon: Receipt, color: '#D97706', bg: '#FFFBEB' },
  { id: 'Other', label: 'Other', icon: Plus, color: '#0891B2', bg: '#F0F9FF' },
];

/* ─── Helpers ─────────────────────────────────────────────────────── */
const inp = {
  width: '100%', padding: '9px 12px', fontSize: 13,
  border: '1px solid #E9ECEF', borderRadius: 8, outline: 'none',
  background: '#FAFAFA', color: '#111827',
  fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
};

/* ─── Avatar (mini) ─── */
const InitAvatar = ({ name = '', size = 32, color = '#DC2626' }) => {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color + '15', color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 800, fontFamily: "'DM Mono', monospace", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};

/* ─── Main ────────────────────────────────────────────────────────── */
const CreateBill = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchPatient, setSearchPatient] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeCategory, setActiveCategory] = useState('All');
  const [serviceSearch, setServiceSearch] = useState('');
  const [showServiceResults, setShowServiceResults] = useState(false);
  const [suggestedInvestigations, setSuggestedInvestigations] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchDefaultSettings();
    fetchDoctors();
    if (location.state?.patientId) fetchPatientById(location.state.patientId);
  }, []);

  /* Debounce patient search */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchPatient.trim().length > 0) performSearch();
      else setPatients([]);
    }, 380);
    return () => clearTimeout(timer);
  }, [searchPatient]);

  const fetchDefaultSettings = async () => {
    try {
      const response = await billingSettingsApi.getSettings();
      if (response.success) {
        setTax(response.data.defaultTax || 0);
        setDiscount(response.data.defaultDiscount || 0);
      }
    } catch (err) { console.error('Settings fetch error:', err); }
  };

  const fetchDoctors = async () => {
    try {
      const response = await docApi.getMyDoctors();
      if (response.success) setDoctors(response.doctors || []);
    } catch (err) { console.error('Doctors fetch error:', err); }
  };

  const fetchServices = async () => {
    try {
      const [opdRes, invRes] = await Promise.all([
        opdServiceApi.getServices(),
        investigationSettingsApi.getSettings()
      ]);

      let allServices = [];

      if (opdRes.success) {
        allServices = [...opdRes.data];
      }

      if (invRes.success && invRes.data && invRes.data.hasInhouseInvestigation) {
        invRes.data.departments.forEach(dept => {
          dept.categories.forEach(cat => {
            cat.services.forEach(svc => {
              allServices.push({
                _id: svc._id,
                name: svc.name,
                category: ['Pathology', 'Diagnostic', 'Investigation'].includes(dept.name) ? dept.name : 'Investigation',
                price: svc.price,
                isInvestigation: true,
                deptName: dept.name,
                catName: cat.name,
              });
            });
          });
        });
      }

      setServices(allServices);
    } catch (err) { console.error('Services fetch error:', err); }
  };

  const performSearch = async () => {
    try {
      const response = await patientApi.getPatients({ search: searchPatient, limit: 6 });
      if (response.success) setPatients(response.data || []);
    } catch (err) { console.error('Patient search error:', err); }
  };

  const fetchPatientById = async (id) => {
    try {
      const response = await patientApi.getById(id);
      if (response.success) {
        setSelectedPatient(response.data);
        setSearchPatient('');
        setPatients([]);
        fetchSuggestedInvestigations(id);
      }
    } catch (err) { console.error('Patient fetch error:', err); }
  };

  const fetchSuggestedInvestigations = async (patientId) => {
    try {
      const response = await opdConsultationApi.getHistory(patientId);
      if (response.success && response.data && response.data.length > 0) {
        const latest = response.data[0];
        const createdAt = new Date(latest.createdAt);
        const now = new Date();
        const diffHours = (now - createdAt) / (1000 * 60 * 60);
        if (diffHours < 24 && latest.suggestedInvestigations) {
          setSuggestedInvestigations(latest.suggestedInvestigations);
        } else {
          setSuggestedInvestigations([]);
        }
      } else {
        setSuggestedInvestigations([]);
      }
    } catch (err) { console.error('Suggestions fetch error:', err); }
  };

  /* ── Service category filter ── */
  const filteredServices = services.filter(s => {
    const catMatch = activeCategory === 'All' || s.category === activeCategory;
    const searchMatch = !serviceSearch || s.name.toLowerCase().includes(serviceSearch.toLowerCase());
    return catMatch && searchMatch;
  });

  /* ── Bill line items ── */
  const addService = (service) => {
    const existing = selectedServices.find(s => s.serviceId === service._id);
    if (existing) {
      setSelectedServices(selectedServices.map(s =>
        s.serviceId === service._id
          ? { ...s, quantity: s.quantity + 1, total: (s.quantity + 1) * s.price }
          : s
      ));
    } else {
      setSelectedServices([...selectedServices, {
        serviceId: service._id,
        name: service.name,
        category: service.category,
        price: service.price,
        quantity: 1,
        total: service.price,
      }]);
    }
  };

  const removeService = (index) => setSelectedServices(selectedServices.filter((_, i) => i !== index));

  const updateQty = (index, qty) => {
    if (qty < 1) return;
    setSelectedServices(selectedServices.map((s, i) =>
      i === index ? { ...s, quantity: qty, total: qty * s.price } : s
    ));
  };

  /* ── Calculations ── */
  const subTotal = selectedServices.reduce((sum, s) => sum + s.total, 0);
  const taxAmt = (subTotal * Number(tax)) / 100;
  const totalAmt = subTotal + taxAmt - Number(discount);

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!selectedPatient) return setMessage({ type: 'error', text: 'Please select a patient' });
    if (selectedServices.length === 0) return setMessage({ type: 'error', text: 'Please add at least one service' });

    setLoading(true);
    setMessage({ type: '', text: '' });

    const billData = {
      patientId: selectedPatient._id,
      doctorId: selectedDoctor || undefined,
      services: selectedServices,
      subTotal,
      tax: taxAmt,
      discount: parseFloat(discount) || 0,
      totalAmount: totalAmt,
      paymentStatus,
      paymentMode,
      notes,
    };

    try {
      const response = await opdBillingApi.createBill(billData);
      if (response.success) {
        navigate(`/subadmin/reception/opd/billing/view/${response.data._id}`, {
          state: { successMessage: 'Bill generated successfully' },
        });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to create bill' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create bill' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNewPatient = () => {
    navigate('/subadmin/patients/register', { state: { fromOpdBilling: true } });
  };

  /* ── Shared styles ── */
  const cardStyle = {
    background: '#fff', border: '1px solid #F0F0F0',
    borderRadius: 14, overflow: 'hidden',
  };

  const sectionHeader = (title, icon) => (
    <div style={{
      padding: '13px 18px', borderBottom: '1px solid #F0F0F0',
      background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {icon}
      <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: "'DM Sans', sans-serif" }}>
        {title}
      </span>
    </div>
  );

  const isSubmitDisabled = loading || selectedServices.length === 0 || !selectedPatient;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');

        @keyframes spin { to { transform: rotate(360deg); } }

        .cb-inp:focus {
          border-color: #DC2626 !important;
          background: #fff !important;
        }

        .svc-card:hover {
          border-color: var(--cat-color) !important;
          background: var(--cat-bg) !important;
          transform: translateY(-1px);
        }

        .pat-row:hover { background: #F9FAFB !important; }

        .pm-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 6px;
          border-radius: 9px;
          border: 1.5px solid #E5E7EB;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          transition: all .15s;
          font-family: 'DM Sans', sans-serif;
        }
        .pm-btn.active { border-color: #111827; background: #111827; color: #fff; }
        .pm-btn:not(.active) { background: #fff; color: #6B7280; }

        .cat-tab {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          transition: all .15s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .cb-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 18px;
          align-items: flex-start;
        }

        .svc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 9px;
        }

        @media (max-width: 1100px) {
          .cb-grid { grid-template-columns: 1fr; }
          .cb-sidebar { position: static !important; width: 100% !important; }
        }

        @media (max-width: 640px) {
          .cb-container { padding: 10px !important; }
          .svc-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cb-header { flex-direction: column; align-items: flex-start !important; }
        }

        @media (max-width: 400px) {
          .svc-grid { grid-template-columns: 1fr 1fr !important; }
        }

        .cat-tabs-row {
          display: flex;
          gap: 6px;
          padding: 10px 14px;
          border-bottom: 1px solid #F0F0F0;
          overflow-x: auto;
          flex-wrap: nowrap;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .cat-tabs-row::-webkit-scrollbar { display: none; }

        .bill-items-scroll {
          max-height: 200px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
          scrollbar-width: thin;
          scrollbar-color: #374151 transparent;
        }

        .svc-scroll-container {
          padding: 14px;
          height: 360px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #E5E7EB transparent;
        }
      `}</style>

      {/* ── Page wrapper ── */}
      <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif" }}>
        <div
          className="cb-container"
          style={{ maxWidth: 1380, margin: '0 auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 16 }}
        >

          {/* ── Header ── */}
          <div
            className="cb-header"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}
          >
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Create OPD Bill</h1>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>
                Select patient, add services and generate bill
              </p>
            </div>
            {selectedPatient && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 14px', background: '#FEF2F2',
                border: '1px solid #FECACA', borderRadius: 10,
              }}>
                <InitAvatar name={`${selectedPatient.firstName} ${selectedPatient.lastName}`} size={28} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </p>
                  <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, fontFamily: "'DM Mono', monospace" }}>
                    {selectedPatient.patientId}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Message Banner ── */}
          {message.text && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
              background: message.type === 'error' ? '#FEF2F2' : '#F0FDF4',
              border: `1px solid ${message.type === 'error' ? '#FECACA' : '#86EFAC'}`,
            }}>
              {message.type === 'error'
                ? <AlertCircle size={15} color="#DC2626" />
                : <CheckCircle2 size={15} color="#16A34A" />
              }
              <p style={{
                margin: 0, fontSize: 13, fontWeight: 600,
                color: message.type === 'error' ? '#991B1B' : '#166534',
              }}>
                {message.text}
              </p>
            </div>
          )}

          {/* ── Two-column grid ── */}
          <div className="cb-grid">

            {/* ══════════ LEFT COLUMN ══════════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>

              {/* ── 1. Patient Selection ── */}
              <div style={cardStyle}>
                {sectionHeader('1. Select Patient', <UserIcon size={15} color="#DC2626" />)}
                <div style={{ padding: '14px 18px' }}>
                  {!selectedPatient ? (
                    <>
                      {/* Search + Register row */}
                      <div style={{ display: 'flex', gap: 9, marginBottom: 12 }}>
                        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
                          <Search
                            size={14} color="#9CA3AF"
                            style={{ position: 'absolute', left: 11, top: 10, pointerEvents: 'none' }}
                          />
                          <input
                            className="cb-inp"
                            type="text"
                            value={searchPatient}
                            onChange={e => setSearchPatient(e.target.value)}
                            style={{ ...inp, paddingLeft: 33 }}
                            placeholder="Search by name, ID or mobile…"
                          />
                        </div>
                        <button
                          onClick={handleRegisterNewPatient}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '9px 14px', border: '1px solid #E5E7EB', borderRadius: 9,
                            background: '#fff', fontSize: 12, fontWeight: 700, color: '#7C3AED',
                            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', flexShrink: 0,
                          }}
                        >
                          <UserPlus size={14} color="#7C3AED" /> Register New
                        </button>
                      </div>

                      {/* Search results */}
                      {patients.length > 0 && (
                        <div style={{
                          border: '1px solid #F0F0F0', borderRadius: 10,
                          overflow: 'hidden', maxHeight: 280, overflowY: 'auto',
                        }}>
                          {patients.map((p, i) => (
                            <div
                              key={p._id}
                              className="pat-row"
                              onClick={() => fetchPatientById(p._id)}
                              style={{
                                padding: '10px 13px', cursor: 'pointer',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderTop: i > 0 ? '1px solid #F9FAFB' : 'none',
                                background: '#fff', transition: 'background .1s',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <InitAvatar name={`${p.firstName} ${p.lastName}`} size={30} />
                                <div>
                                  <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: 13 }}>
                                    {p.firstName} {p.lastName}
                                  </p>
                                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0', fontFamily: "'DM Mono', monospace" }}>
                                    {p.patientId} · {p.mobile}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight size={14} color="#D1D5DB" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* No results state */}
                      {searchPatient && patients.length === 0 && (
                        <div style={{
                          padding: '16px', textAlign: 'center',
                          background: '#FAFAFA', borderRadius: 10, border: '1px dashed #E5E7EB',
                        }}>
                          <p style={{ margin: '0 0 8px', color: '#9CA3AF', fontSize: 13 }}>
                            No patient found for "<strong>{searchPatient}</strong>"
                          </p>
                          <button
                            onClick={handleRegisterNewPatient}
                            style={{
                              fontSize: 12, fontWeight: 700, color: '#7C3AED',
                              background: 'none', border: 'none', cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            <UserPlus size={13} /> Register as new patient
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Selected patient chip */
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '11px 14px', background: '#FEF2F2',
                      borderRadius: 10, border: '1px solid #FECACA',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <InitAvatar name={`${selectedPatient.firstName} ${selectedPatient.lastName}`} size={40} />
                        <div>
                          <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>
                            {selectedPatient.firstName} {selectedPatient.lastName}
                          </p>
                          <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0', fontFamily: "'DM Mono', monospace" }}>
                            {selectedPatient.patientId} · {selectedPatient.mobile} · {selectedPatient.gender}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedPatient(null)}
                        style={{
                          fontSize: 12, fontWeight: 700, color: '#DC2626',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {/* Doctor selection — only when patient selected */}
                  {selectedPatient && (
                    <div style={{ marginTop: 13, paddingTop: 13, borderTop: '1px solid #F9FAFB' }}>
                      <label style={{
                        fontSize: 10, fontWeight: 700, color: '#9CA3AF',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        fontFamily: "'DM Mono', monospace", display: 'block', marginBottom: 7,
                      }}>
                        Treating Doctor
                      </label>
                      <select
                        className="cb-inp"
                        value={selectedDoctor}
                        onChange={e => setSelectedDoctor(e.target.value)}
                        style={inp}
                      >
                        <option value="">Select Doctor (Optional)</option>
                        {doctors.map(d => (
                          <option key={d._id} value={d._id}>
                            Dr. {d.fullName} — {d.speciality}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* ── 2. Bill Items ── */}
              <div style={cardStyle}>
                {sectionHeader('2. Bill Items', <Receipt size={15} color="#DC2626" />)}
                
                <div style={{ padding: '16px 18px' }}>
                  {/* Doctor Recommendations Section */}
                  {suggestedInvestigations.length > 0 && (
                    <div style={{
                      marginBottom: 20, padding: '12px 15px',
                      background: '#F5F3FF', border: '1px solid #DDD6FE',
                      borderRadius: 12,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                        <BriefcaseMedical size={14} color="#7C3AED" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#5B21B6', textTransform: 'uppercase' }}>
                          Doctor's Recommendations
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {suggestedInvestigations.map((inv, idx) => {
                          const service = services.find(s => s.name === inv.serviceName || (inv.serviceId && s._id === inv.serviceId));
                          const inBill = selectedServices.some(s => s.name === (service?.name || inv.serviceName));
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (service) addService(service);
                                else {
                                  setSelectedServices([...selectedServices, {
                                    serviceId: inv.serviceId || `custom-${Date.now()}`,
                                    name: inv.serviceName,
                                    category: 'Investigation',
                                    price: 0,
                                    quantity: 1,
                                    total: 0,
                                  }]);
                                }
                              }}
                              disabled={inBill}
                              style={{
                                padding: '6px 12px', borderRadius: 8, border: '1px solid #DDD6FE',
                                background: inBill ? '#EDE9FE' : '#fff',
                                color: inBill ? '#A78BFA' : '#7C3AED',
                                fontSize: 11, fontWeight: 700, cursor: inBill ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                transition: 'all 0.15s',
                              }}
                            >
                              <Plus size={12} />
                              {inv.serviceName} {service ? `(₹${service.price})` : '(Price N/A)'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── SERVICE SELECTOR (BROWSE + SEARCH) ── */}
                  <div style={{ 
                    marginBottom: 20, padding: '14px', background: '#FAFAFA', 
                    borderRadius: 12, border: '1px solid #F0F0F0' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Browse & Select Services
                      </p>
                      <div style={{ position: 'relative', width: 280 }}>
                        <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: 10 }} />
                        <input
                          type="text"
                          value={serviceSearch}
                          onChange={e => setServiceSearch(e.target.value)}
                          placeholder="Search service name..."
                          style={{ ...inp, height: 34, paddingLeft: 30, fontSize: 12, background: '#fff' }}
                        />
                      </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="cat-tabs-row" style={{ padding: '0 0 10px 0', border: 'none', marginBottom: 10 }}>
                      {SERVICE_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          className="cat-tab"
                          onClick={() => setActiveCategory(cat.id)}
                          style={{
                            background: activeCategory === cat.id ? cat.color : '#fff',
                            color: activeCategory === cat.id ? '#fff' : '#6B7280',
                            border: activeCategory === cat.id ? 'none' : '1px solid #E5E7EB',
                            fontSize: 10, padding: '5px 10px'
                          }}
                        >
                          <cat.icon size={11} /> {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Scrollable Service List */}
                    <div style={{ 
                      maxHeight: 220, overflowY: 'auto', background: '#fff', 
                      borderRadius: 8, border: '1px solid #E5E7EB' 
                    }}>
                      {filteredServices.length === 0 ? (
                        <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>No services found.</div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#F0F0F0' }}>
                          {filteredServices.map(svc => {
                            const inBill = selectedServices.some(s => s.serviceId === svc._id);
                            return (
                              <div
                                key={svc._id}
                                onClick={() => addService(svc)}
                                style={{
                                  padding: '10px 12px', background: inBill ? '#FDF2F2' : '#fff', 
                                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between', 
                                  alignItems: 'center', transition: 'background 0.1s'
                                }}
                                onMouseEnter={e => !inBill && (e.currentTarget.style.background = '#F9FAFB')}
                                onMouseLeave={e => !inBill && (e.currentTarget.style.background = '#fff')}
                              >
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: inBill ? '#DC2626' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{svc.name}</p>
                                  <p style={{ margin: 0, fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase' }}>{svc.category}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: "'DM Mono', monospace" }}>₹{svc.price}</p>
                                  {inBill && <CheckCircle2 size={14} color="#16A34A" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Added Services Table */}
                  <div style={{ border: '1px solid #F3F4F6', borderRadius: 10, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                          <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: 11, color: '#6B7280', textTransform: 'uppercase' }}>Service Name</th>
                          <th style={{ padding: '12px 15px', textAlign: 'center', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', width: 120 }}>Quantity</th>
                          <th style={{ padding: '12px 15px', textAlign: 'right', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', width: 100 }}>Price</th>
                          <th style={{ padding: '12px 15px', textAlign: 'right', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', width: 120 }}>Total</th>
                          <th style={{ padding: '12px 15px', textAlign: 'center', width: 50 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedServices.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF' }}>
                              <Receipt size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                              <p style={{ margin: 0, fontSize: 13 }}>No services added to this bill yet.</p>
                            </td>
                          </tr>
                        ) : (
                          selectedServices.map((item, i) => (
                            <tr key={i} style={{ borderBottom: i < selectedServices.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                              <td style={{ padding: '14px 15px' }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.name}</p>
                                <span style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600 }}>{item.category}</span>
                              </td>
                              <td style={{ padding: '14px 15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                  <button
                                    onClick={() => updateQty(i, item.quantity - 1)}
                                    style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  >−</button>
                                  <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                                  <button
                                    onClick={() => updateQty(i, item.quantity + 1)}
                                    style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  >+</button>
                                </div>
                              </td>
                              <td style={{ padding: '14px 15px', textAlign: 'right', fontSize: 13, color: '#6B7280', fontFamily: "'DM Mono', monospace" }}>
                                ₹{item.price}
                              </td>
                              <td style={{ padding: '14px 15px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: "'DM Mono', monospace" }}>
                                ₹{item.total}
                              </td>
                              <td style={{ padding: '14px 15px', textAlign: 'center' }}>
                                <button
                                  onClick={() => removeService(i)}
                                  style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
                                  onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ── 3. Notes ── */}
              <div style={cardStyle}>
                {sectionHeader('3. Bill Notes (Optional)', <FileText size={15} color="#DC2626" />)}
                <div style={{ padding: '13px 18px' }}>
                  <textarea
                    className="cb-inp"
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    style={{ ...inp, resize: 'vertical' }}
                    placeholder="Add any notes or remarks for this bill…"
                  />
                </div>
              </div>

            </div>
            {/* ══════════ end LEFT COLUMN ══════════ */}

            {/* ══════════ RIGHT: BILL SUMMARY SIDEBAR ══════════ */}
            <div className="cb-sidebar" style={{ position: 'sticky', top: 16 }}>
              <div style={{ background: '#111827', borderRadius: 16, overflow: 'hidden' }}>

                {/* Sidebar header */}
                <div style={{
                  padding: '16px 18px',
                  background: 'linear-gradient(135deg, #DC2626, #991B1B)',
                  display: 'flex', alignItems: 'center', gap: 9,
                }}>
                  <Receipt size={17} color="#fff" />
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Bill Summary</h2>
                </div>

                {/* All sidebar content inside one padding wrapper */}
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Patient badge */}
                  {selectedPatient && (
                    <div style={{
                      padding: '9px 13px', background: '#1F2937',
                      borderRadius: 9, display: 'flex', alignItems: 'center', gap: 9,
                    }}>
                      <InitAvatar
                        name={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                        size={30}
                        color="#DC2626"
                      />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#F9FAFB', margin: 0 }}>
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Items count */}
                  <div style={{
                    padding: '14px', background: '#1F2937', borderRadius: 10,
                    border: '1px dashed #374151', textAlign: 'center',
                  }}>
                    <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0 }}>
                      {selectedServices.length} items added to bill
                    </p>
                  </div>

                  {/* Services list with remove buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedServices.map((svc, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', gap: 8,
                      }}>
                        <span style={{ fontSize: 12, color: '#D1D5DB', flex: 1 }}>{svc.name}</span>
                        <span style={{ fontSize: 12, color: '#F9FAFB', fontFamily: "'DM Mono', monospace" }}>
                          ₹{svc.price?.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeService(i)}
                          style={{
                            width: 22, height: 22, border: 'none', borderRadius: 5,
                            background: '#374151', color: '#6B7280', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Totals block */}
                  <div style={{ borderTop: '1px solid #374151', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#6B7280' }}>Subtotal</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#F9FAFB', fontFamily: "'DM Mono', monospace" }}>
                        ₹{subTotal.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#6B7280' }}>Tax (%)</span>
                      <input
                        type="number" value={tax} min="0" max="100"
                        onChange={e => setTax(e.target.value)}
                        style={{
                          width: 62, padding: '4px 7px', background: '#1F2937',
                          border: '1px solid #374151', borderRadius: 6, color: '#fff',
                          fontSize: 12, textAlign: 'right', outline: 'none',
                          fontFamily: "'DM Mono', monospace",
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#6B7280' }}>Discount (₹)</span>
                      <input
                        type="number" value={discount} min="0"
                        onChange={e => setDiscount(e.target.value)}
                        style={{
                          width: 62, padding: '4px 7px', background: '#1F2937',
                          border: '1px solid #374151', borderRadius: 6, color: '#fff',
                          fontSize: 12, textAlign: 'right', outline: 'none',
                          fontFamily: "'DM Mono', monospace",
                        }}
                      />
                    </div>
                    <div style={{
                      marginTop: 4, padding: '11px 14px', background: '#DC2626',
                      borderRadius: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Total Amount</span>
                      <span style={{ fontSize: 19, fontWeight: 800, color: '#fff', fontFamily: "'DM Mono', monospace" }}>
                        ₹{totalAmt.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <p style={{
                      fontSize: 10, fontWeight: 700, color: '#6B7280',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      fontFamily: "'DM Mono', monospace", margin: 0,
                    }}>
                      Payment Mode
                    </p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[
                        { mode: 'Cash', icon: Banknote },
                        { mode: 'UPI', icon: Smartphone },
                        { mode: 'Card', icon: CreditCard },
                      ].map(({ mode, icon: Icon }) => (
                        <button
                          key={mode}
                          className={`pm-btn${paymentMode === mode ? ' active' : ''}`}
                          onClick={() => setPaymentMode(mode)}
                        >
                          <Icon size={13} /> {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <p style={{
                      fontSize: 10, fontWeight: 700, color: '#6B7280',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      fontFamily: "'DM Mono', monospace", margin: 0,
                    }}>
                      Payment Status
                    </p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['Paid', 'Partial', 'Unpaid'].map(status => {
                        const isActive = paymentStatus === status;
                        const activeColor = status === 'Paid' ? '#16A34A' : status === 'Partial' ? '#D97706' : '#DC2626';
                        return (
                          <button
                            key={status}
                            onClick={() => setPaymentStatus(status)}
                            style={{
                              flex: 1, padding: '7px 4px', borderRadius: 7,
                              border: `1.5px solid ${isActive ? activeColor : '#374151'}`,
                              background: isActive ? activeColor : 'transparent',
                              color: isActive ? '#fff' : '#6B7280',
                              fontSize: 11, fontWeight: 700, cursor: 'pointer',
                              fontFamily: "'DM Sans', sans-serif", transition: 'all .15s',
                            }}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generate Bill button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                      background: isSubmitDisabled
                        ? '#374151'
                        : 'linear-gradient(135deg, #DC2626, #B91C1C)',
                      color: isSubmitDisabled ? '#6B7280' : '#fff',
                      fontSize: 13, fontWeight: 700,
                      cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: isSubmitDisabled ? 'none' : '0 4px 14px rgba(220,38,38,0.3)',
                      transition: 'all .15s',
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: 15, height: 15,
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff', borderRadius: '50%',
                          animation: 'spin 0.7s linear infinite',
                        }} />
                        Processing…
                      </>
                    ) : (
                      <><Save size={15} /> Generate &amp; Print Bill</>
                    )}
                  </button>

                </div>
                {/* end padding wrapper */}

              </div>
              {/* end dark card */}
            </div>
            {/* ══════════ end RIGHT SIDEBAR ══════════ */}

          </div>
          {/* end cb-grid */}

        </div>
        {/* end cb-container */}
      </div>
      {/* end page wrapper */}
    </>
  );
};

export default CreateBill;