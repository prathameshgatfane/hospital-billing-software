// AdmitPatient.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Search,
  ChevronRight, User, Bed,
  Activity,
} from 'lucide-react';
import patientApi from '../../API/patientApi';
import { doctorApi as docApi } from '../../API/docApi';
import ipdApi from '../../API/ipdApi';

const AdmitPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchPatient, setSearchPatient] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    ward: '',
    bedNumber: '',
    doctorInCharge: '',
    reasonForAdmission: '',
    initialVitals: { temp: '', bp: '', pulse: '', spO2: '' },
    notes: '',
  });

  const wards = ['General Ward', 'Semi-Private', 'Private', 'ICU', 'ICCU', 'Emergency', 'Maternity'];

  useEffect(() => {
    (async () => {
      try {
        const res = await docApi.getMyDoctors();
        if (res.success) setDoctors(res.doctors || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (searchPatient.trim().length > 0) {
        try {
          const res = await patientApi.getPatients({ search: searchPatient, limit: 6 });
          if (res.success) setPatients(res.data || []);
        } catch (e) { console.error(e); }
      } else {
        setPatients([]);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [searchPatient]);

  const selectPatient = (p) => { setSelectedPatient(p); setSearchPatient(''); setPatients([]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return alert('Please select a patient');
    setLoading(true);
    try {
      const res = await ipdApi.admitPatient({ patientId: selectedPatient._id, ...formData });
      if (res.success) navigate('/subadmin/reception/ipd', { state: { successMessage: 'Patient admitted successfully!' } });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to admit patient');
    } finally { setLoading(false); }
  };

  const set = (key, val) => setFormData(f => ({ ...f, [key]: val }));
  const setVital = (key, val) => setFormData(f => ({ ...f, initialVitals: { ...f.initialVitals, [key]: val } }));

  /* ── shared styles ── */
  const inp = {
    width: '100%', padding: '9px 13px', fontSize: 13,
    border: '1px solid #E9ECEF', borderRadius: 8, outline: 'none',
    background: '#FAFAFA', color: '#111827',
    fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
  };
  const lbl = {
    display: 'block', fontSize: 10, fontWeight: 700, color: '#9CA3AF',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    fontFamily: "'DM Mono', monospace", marginBottom: 5,
  };
  /* KEY FIX: overflow must NOT be hidden on cards that contain the dropdown */
  const card = (overflowVisible = false) => ({
    background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14,
    padding: 24,
    /* overflow hidden clips absolutely-positioned children — use visible */
    overflow: overflowVisible ? 'visible' : 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        input:focus, select:focus, textarea:focus { border-color: #DC2626 !important; background: #fff !important; }
        select option { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => navigate('/subadmin/reception/ipd')} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #F0F0F0', borderRadius: 10, cursor: 'pointer' }}>
              <ArrowLeft size={16} color="#374151" />
            </button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Patient Admission</h1>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: '3px 0 0' }}>Register a new in-patient admission</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── 1. Patient Search ──
                overflow: visible is CRITICAL here so the dropdown isn't clipped
            */}
            <div style={card(true)}>
              <SectionTitle icon={<User size={15} color="#DC2626" />} label="Select Patient" />

              {!selectedPatient ? (
                /* position: relative on THIS wrapper, NOT on the card — avoids overflow:hidden clipping */
                <div style={{ position: 'relative', zIndex: 100 }}>
                  <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={searchPatient}
                    onChange={e => setSearchPatient(e.target.value)}
                    placeholder="Search by name, patient ID or mobile number…"
                    style={{ ...inp, paddingLeft: 36 }}
                    autoComplete="off"
                  />

                  {/* Dropdown — absolutely positioned inside the relative wrapper above */}
                  {patients.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0, right: 0,
                      background: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: 12,
                      overflow: 'hidden',
                      /* z-index higher than everything else on the page */
                      zIndex: 9999,
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 4px 10px -3px rgba(0,0,0,0.06)',
                    }}>
                      {patients.map((p, idx) => (
                        <DropdownItem
                          key={p._id}
                          patient={p}
                          isLast={idx === patients.length - 1}
                          onClick={() => selectPatient(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <PatientAvatar first={selectedPatient.firstName} last={selectedPatient.lastName} />
                    <div>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>{selectedPatient.firstName} {selectedPatient.lastName}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#DC2626', fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
                        {selectedPatient.patientId} · {selectedPatient.mobile}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSelectedPatient(null)} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#DC2626', background: '#fff', border: '1px solid #FECACA', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* ── 2+3. Two-column cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>

              {/* Admission Details */}
              <div style={card(false)}>
                <SectionTitle icon={<Bed size={15} color="#DC2626" />} label="Admission Details" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Ward">
                      <select required value={formData.ward} onChange={e => set('ward', e.target.value)} style={inp}>
                        <option value="">Select</option>
                        {wards.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </Field>
                    <Field label="Bed Number">
                      <input required type="text" value={formData.bedNumber} onChange={e => set('bedNumber', e.target.value)} style={inp} placeholder="e.g. B-12" />
                    </Field>
                  </div>
                  <Field label="Treating Doctor">
                    <select required value={formData.doctorInCharge} onChange={e => set('doctorInCharge', e.target.value)} style={inp}>
                      <option value="">Select Doctor</option>
                      {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.fullName}</option>)}
                    </select>
                  </Field>
                  <Field label="Reason for Admission">
                    <textarea required rows={3} value={formData.reasonForAdmission} onChange={e => set('reasonForAdmission', e.target.value)} style={{ ...inp, resize: 'vertical' }} placeholder="Primary diagnosis / chief complaint…" />
                  </Field>
                </div>
              </div>

              {/* Vitals & Notes */}
              <div style={card(false)}>
                <SectionTitle icon={<Activity size={15} color="#DC2626" />} label="Entry Vitals & Notes" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      { key: 'temp', label: 'Temp (°F)', ph: '98.6' },
                      { key: 'bp', label: 'BP (mmHg)', ph: '120/80' },
                      { key: 'pulse', label: 'Pulse (bpm)', ph: '72' },
                      { key: 'spO2', label: 'SpO₂ (%)', ph: '98' },
                    ].map(({ key, label, ph }) => (
                      <Field key={key} label={label}>
                        <input type="text" value={formData.initialVitals[key]} onChange={e => setVital(key, e.target.value)} style={inp} placeholder={ph} />
                      </Field>
                    ))}
                  </div>
                  <Field label="Additional Notes">
                    <textarea rows={3} value={formData.notes} onChange={e => set('notes', e.target.value)} style={{ ...inp, resize: 'vertical' }} placeholder="Allergies, emergency contact, special instructions…" />
                  </Field>
                </div>
              </div>
            </div>

            {/* ── Submit ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading || !selectedPatient}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '11px 24px', fontSize: 14, fontWeight: 700,
                  color: '#fff',
                  background: loading || !selectedPatient ? '#D1D5DB' : '#DC2626',
                  border: 'none', borderRadius: 10,
                  cursor: loading || !selectedPatient ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s',
                }}
              >
                <Save size={15} />
                {loading ? 'Processing…' : 'Confirm Admission'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

/* ─── Small helpers ───────────────────────────────────────────────────── */
const SectionTitle = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #F0F0F0' }}>
    {icon}
    <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{label}</h2>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 5 }}>
      {label}
    </label>
    {children}
  </div>
);

const PatientAvatar = ({ first = '', last = '' }) => {
  const palettes = [['#FEE2E2', '#991B1B'], ['#DBEAFE', '#1D4ED8'], ['#D1FAE5', '#065F46'], ['#EDE9FE', '#5B21B6']];
  const [bg, fg] = palettes[((first.charCodeAt(0) ?? 0) + (last.charCodeAt(0) ?? 0)) % palettes.length];
  return (
    <div style={{ width: 40, height: 40, borderRadius: '50%', background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>
      {(first[0] ?? '').toUpperCase()}{(last[0] ?? '').toUpperCase()}
    </div>
  );
};

const DropdownItem = ({ patient, isLast, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '12px 16px',
        borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
        cursor: 'pointer',
        background: hov ? '#F9FAFB' : '#fff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'background 0.1s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <PatientAvatar first={patient.firstName} last={patient.lastName} />
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{patient.firstName} {patient.lastName}</p>
          <p style={{ margin: '3px 0 0', fontSize: 11, color: '#9CA3AF', fontFamily: "'DM Mono', monospace" }}>
            {patient.patientId} · {patient.mobile}
          </p>
        </div>
      </div>
      <ChevronRight size={14} color="#D1D5DB" />
    </div>
  );
};

export default AdmitPatient;