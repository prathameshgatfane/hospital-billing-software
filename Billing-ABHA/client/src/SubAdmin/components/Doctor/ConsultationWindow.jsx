import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Save, Plus, Trash2, Activity, Clipboard,
  Pill, Microscope, FileText, CheckCircle, Info, Printer, RefreshCw, Search, X
} from 'lucide-react';
import { opdConsultationApi } from '../../API/opdConsultationApi';
import opdServiceApi from '../../API/opdServiceApi';
import investigationSettingsApi from '../../API/investigationSettingsApi';
import PrintPrescription from './PrintPrescription';

/* ─── Design tokens ──────────────────────────────────────────────── */
const T = {
  red: '#C0392B',
  redLight: '#FEF2F2',
  redMid: '#FECACA',
  redDark: '#991B1B',
  ink: '#111827',
  inkMid: '#374151',
  inkLight: '#6B7280',
  border: '#F0F0F0',
  surface: '#FAFAFA',
  white: '#FFFFFF',
  dark: '#0F172A',
  darkCard: '#1E293B',
  darkBorder: '#334155',
};

const inputSx = {
  width: '100%',
  padding: '9px 13px',
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  border: `1px solid ${T.border}`,
  borderRadius: 10,
  outline: 'none',
  background: T.white,
  color: T.ink,
  boxSizing: 'border-box',
  transition: 'border-color .15s',
};

const labelSx = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  color: T.inkLight,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 6,
  fontFamily: "'DM Mono', monospace",
};

const Card = ({ children, style = {} }) => (
  <div style={{
    background: T.white,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
);

const CardHeader = ({ icon, title, action }) => (
  <div style={{
    padding: '14px 20px',
    borderBottom: `1px solid ${T.border}`,
    background: T.surface,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {icon}
      <span style={{ fontSize: 13, fontWeight: 700, color: T.ink, fontFamily: "'DM Sans', sans-serif" }}>
        {title}
      </span>
    </div>
    {action}
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label style={labelSx}>{label}</label>
    {children}
  </div>
);

const ClinicalInput = ({ style = {}, ...props }) => (
  <input
    {...props}
    style={{ ...inputSx, ...style }}
    onFocus={e => (e.target.style.borderColor = T.red)}
    onBlur={e => (e.target.style.borderColor = T.border)}
  />
);

const ClinicalTextarea = ({ style = {}, ...props }) => (
  <textarea
    {...props}
    style={{ ...inputSx, resize: 'vertical', lineHeight: 1.5, ...style }}
    onFocus={e => (e.target.style.borderColor = T.red)}
    onBlur={e => (e.target.style.borderColor = T.border)}
  />
);

const ClinicalSelect = ({ children, style = {}, ...props }) => (
  <select
    {...props}
    style={{ ...inputSx, ...style }}
    onFocus={e => (e.target.style.borderColor = T.red)}
    onBlur={e => (e.target.style.borderColor = T.border)}
  >
    {children}
  </select>
);

const VitalBox = ({ label, value, onChange, placeholder, unit }) => (
  <div style={{
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: '12px 14px',
  }}>
    <div style={{ fontSize: 9, fontWeight: 700, color: T.inkLight, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>
      {label}
    </div>
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: 20,
        fontWeight: 700,
        color: T.ink,
        fontFamily: "'DM Mono', monospace",
      }}
    />
    {unit && (
      <div style={{ fontSize: 10, color: T.inkLight, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{unit}</div>
    )}
  </div>
);

/* ─── Main ───────────────────────────────────────────────────────── */


const ConsultationWindow = ({ visit, onClose }) => {
  const printRef = useRef();
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [services, setServices] = useState([]);
  const [showPrintView, setShowPrintView] = useState(false);
  const [lastConsultation, setLastConsultation] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedGroup, setSelectedGroup] = useState('Pathology');
  const [selectedCategory, setSelectedCategory] = useState('Hematology');
  const [pathologySearch, setPathologySearch] = useState('');
  const [radiologySearch, setRadiologySearch] = useState('');
  const [otherServiceSearch, setOtherServiceSearch] = useState('');
  const [viewingHistoryDetails, setViewingHistoryDetails] = useState(null);

  const [vitals, setVitals] = useState({
    height: '', weight: '', temp: '', bp_sys: '', bp_dia: '', pulse: '', spo2: '', rr: '',
  });
  const [clinicalNotes, setClinicalNotes] = useState({
    chiefComplaints: '', history: '', examination: '', diagnosis: '', remarks: '',
  });
  const [prescription, setPrescription] = useState([
    { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' },
  ]);
  const [investigations, setInvestigations] = useState([]);
  const [hasInhouse, setHasInhouse] = useState(false);
  const [hospitalDepts, setHospitalDepts] = useState([]);
  const [suggestionMode, setSuggestionMode] = useState(false);
  const [suggestedService, setSuggestedService] = useState({ name: '', notes: '' });

  useEffect(() => {
    fetchHistory();
    fetchServices();
    fetchInvestigationSettings();
  }, []);

  const fetchInvestigationSettings = async () => {
    try {
      const res = await investigationSettingsApi.getSettings();
      if (res.success && res.data) {
        setHasInhouse(res.data.hasInhouseInvestigation || false);
        setHospitalDepts(res.data.departments || []);
        if (res.data.departments?.length > 0) {
          setSelectedGroup(res.data.departments[0].name);
          if (res.data.departments[0].categories?.length > 0) {
            setSelectedCategory(res.data.departments[0].categories[0].name);
          }
        }
      }
    } catch (e) {
      console.error('Error fetching investigation settings:', e);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await opdConsultationApi.getHistory(visit.patient._id);
      if (res.success) setHistory(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchServices = async () => {
    try {
      const res = await opdServiceApi.getServices();
      setServices(res.data.filter(s =>
        ['Pathology', 'Diagnostic', 'Investigation'].includes(s.category)
      ));
    } catch (e) { console.error(e); }
  };

  const addPrescriptionRow = () =>
    setPrescription([...prescription, { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);

  const removePrescriptionRow = (i) =>
    setPrescription(prescription.filter((_, idx) => idx !== i));

  const updatePrescription = (i, field, val) => {
    const next = [...prescription];
    next[i][field] = val;
    setPrescription(next);
  };

  const handleSuggestInvestigation = (svc) => {
    if (!investigations.find(i => i.serviceId === svc._id)) {
      setInvestigations([...investigations, { serviceId: svc._id, name: svc.name, notes: '' }]);
    }
  };

  const handleSelectPredefinedTest = (test, category) => {
    const testCode = test.id || test.name; // Use name if id is missing (for hospital tests)
    const existingIndex = investigations.findIndex(i => i.testCode === testCode);

    if (existingIndex === -1) {
      setInvestigations([...investigations, {
        serviceId: test._id || null,
        testCode: testCode,
        name: test.name,
        category: category,
        notes: ''
      }]);
    } else {
      setInvestigations(investigations.filter((_, i) => i !== existingIndex));
    }
  };

  const handleAddSuggestedService = () => {
    if (suggestedService.name.trim()) {
      setInvestigations([...investigations, {
        serviceId: `suggested-${Date.now()}`,
        testCode: `suggested-${Date.now()}`,
        name: suggestedService.name.trim(),
        category: 'Suggested',
        notes: suggestedService.notes,
        isSuggested: true
      }]);
      setSuggestedService({ name: '', notes: '' });
      setSuggestionMode(false);
    }
  };

  const handleSave = async (shouldPrint = false) => {
    setSaving(true);
    try {
      const doctorId = visit.doctor?._id || visit.doctorId || visit.patient.doctorId;
      if (!doctorId) {
        alert('Doctor ID is missing. Please refresh and try again.');
        setSaving(false);
        return;
      }

      const data = {
        patientId: visit.patient._id,
        doctorId: doctorId,
        billId: visit.billId,
        vitals: {
          height: parseFloat(vitals.height),
          weight: parseFloat(vitals.weight),
          temp: parseFloat(vitals.temp),
          pulse: parseInt(vitals.pulse),
          bp: { systolic: parseInt(vitals.bp_sys), diastolic: parseInt(vitals.bp_dia) },
          spo2: parseInt(vitals.spo2),
          rr: parseInt(vitals.rr),
        },
        clinicalNotes,
        prescription: prescription.filter(p => p.medicineName),
        suggestedInvestigations: investigations,
      };
      const res = await opdConsultationApi.saveConsultation(data);
      if (res.success) {
        if (shouldPrint) {
          setLastConsultation(data);
          setShowPrintView(true);
          setTimeout(() => { window.print(); onClose(); }, 500);
        } else {
          onClose();
        }
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save consultation');
    } finally {
      setSaving(false);
    }
  };

  if (showPrintView) {
    return (
      <div style={{ background: T.white, minHeight: '100vh' }}>
        <PrintPrescription
          ref={printRef}
          consultation={lastConsultation}
          patient={visit.patient}
          doctor={visit.doctor || { name: 'Medical Practitioner' }}
        />
        <div className="no-print" style={{ position: 'fixed', bottom: 32, right: 32, display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={{ background: T.ink, color: '#fff', padding: '12px 28px', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 13 }}>Close</button>
          <button onClick={() => window.print()} style={{ background: T.red, color: '#fff', padding: '12px 28px', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 13 }}>Print Again</button>
        </div>
      </div>
    );
  }

  const patientName = `${visit.patient.firstName} ${visit.patient.lastName}`;
  const patientAge = new Date().getFullYear() - new Date(visit.patient.dateOfBirth).getFullYear();

  const tabs = [
    { id: 'notes', label: 'Clinical Notes', icon: <Clipboard size={14} /> },
    { id: 'rx', label: 'Prescription', icon: <Pill size={14} /> },
    { id: 'tests', label: 'Investigations', icon: <Microscope size={14} /> },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .cw-fade { animation: fadeIn .2s ease; }
        .cw-tab { padding: 8px 16px; border-radius: 9px; border: none; cursor: pointer; font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; transition: all .15s; }
        .cw-tab.active { background: #C0392B; color: #fff; }
        .cw-tab:not(.active) { background: transparent; color: #6B7280; }
        .cw-tab:not(.active):hover { background: #FEF2F2; color: #C0392B; }
        .queue-item:hover { transform: translateX(4px); background: #FEF2F2; }
        .hist-item:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.2) !important; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .2s ease; }
        .modal-content { background: #fff; width: 100%; max-width: 800px; max-height: 90vh; border-radius: 24px; display: flex; flexDirection: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        @media print { .no-print { display: none !important; } }
        @media (max-width: 1024px) { .cw-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) {
          .cw-topbar { flex-direction: column; align-items: flex-start !important; gap: 12px !important; }
          .cw-topbar-actions { width: 100%; }
          .vital-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .rx-row { flex-direction: column !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Top Bar ── */}
        <div
          className="no-print"
          style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${T.border}`,
            padding: '12px 24px',
          }}
        >
          <div className="cw-topbar" style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <button
                onClick={onClose}
                style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${T.border}`, background: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <ArrowLeft size={16} color={T.inkMid} />
              </button>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: T.red, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>
                {patientName.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: T.ink, margin: 0 }}>{patientName}</h2>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.red, background: '#FEF2F2', padding: '2px 8px', borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>
                    #{visit.patient.patientId}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: T.inkLight, margin: '2px 0 0', fontFamily: "'DM Mono', monospace" }}>
                  {visit.patient.gender} · {patientAge} yrs · {visit.patient.bloodGroup || 'Blood N/A'}
                </p>
              </div>
            </div>

            <div className="cw-topbar-actions" style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 20px', borderRadius: 10,
                  border: `1px solid ${T.border}`, background: T.white,
                  fontSize: 13, fontWeight: 700, color: T.inkMid,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1, fontFamily: "'DM Sans', sans-serif",
                  transition: 'all .15s',
                }}
              >
                {saving ? <RefreshCw size={15} style={{ animation: 'spin .7s linear infinite' }} /> : <Save size={15} />}
                Save
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 20px', borderRadius: 10,
                  border: 'none', background: T.red,
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1, fontFamily: "'DM Sans', sans-serif",
                  boxShadow: '0 4px 14px rgba(192,57,43,0.3)',
                  transition: 'all .15s',
                }}
              >
                {saving ? <RefreshCw size={15} style={{ animation: 'spin .7s linear infinite' }} /> : <Printer size={15} />}
                Save & Print Rx
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1360, margin: '0 auto', padding: '20px 24px 40px' }}>
          <div className="cw-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

            {/* ════ LEFT COLUMN ════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>

              {/* ── Vitals ── */}
              <Card>
                <CardHeader icon={<Activity size={15} color={T.red} />} title="Physical Vitals" />
                <div style={{ padding: 18 }}>
                  <div className="vital-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    <VitalBox label="Temperature" value={vitals.temp} onChange={e => setVitals({ ...vitals, temp: e.target.value })} placeholder="98.4" unit="°F" />
                    <VitalBox label="Pulse" value={vitals.pulse} onChange={e => setVitals({ ...vitals, pulse: e.target.value })} placeholder="72" unit="bpm" />
                    <VitalBox label="SpO₂" value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: e.target.value })} placeholder="98" unit="%" />
                    <VitalBox label="Resp. Rate" value={vitals.rr} onChange={e => setVitals({ ...vitals, rr: e.target.value })} placeholder="16" unit="/min" />
                    <VitalBox label="Weight" value={vitals.weight} onChange={e => setVitals({ ...vitals, weight: e.target.value })} placeholder="70" unit="kg" />
                    <VitalBox label="Height" value={vitals.height} onChange={e => setVitals({ ...vitals, height: e.target.value })} placeholder="170" unit="cm" />
                    <div style={{ gridColumn: 'span 2', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px 14px' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: T.inkLight, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>Blood Pressure</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="number" value={vitals.bp_sys} onChange={e => setVitals({ ...vitals, bp_sys: e.target.value })} placeholder="120" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 20, fontWeight: 700, color: T.ink, fontFamily: "'DM Mono', monospace", width: '100%' }} />
                        <span style={{ fontSize: 18, color: T.inkLight, fontWeight: 300 }}>/</span>
                        <input type="number" value={vitals.bp_dia} onChange={e => setVitals({ ...vitals, bp_dia: e.target.value })} placeholder="80" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 20, fontWeight: 700, color: T.ink, fontFamily: "'DM Mono', monospace", width: '100%' }} />
                        <span style={{ fontSize: 10, color: T.inkLight, fontFamily: "'DM Mono', monospace" }}>mmHg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* ── Tabs ── */}
              <div style={{ display: 'flex', gap: 4, padding: '4px', background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, width: 'fit-content' }}>
                {tabs.map(t => (
                  <button
                    key={t.id}
                    className={`cw-tab${activeTab === t.id ? ' active' : ''}`}
                    onClick={() => setActiveTab(t.id)}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* ── Tab: Clinical Notes ── */}
              {activeTab === 'notes' && (
                <Card style={{ animation: 'fadeIn .18s ease' }}>
                  <CardHeader icon={<Clipboard size={15} color={T.red} />} title="Clinical Notes" />
                  <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Field label="Chief Complaints">
                      <ClinicalTextarea
                        rows={2}
                        value={clinicalNotes.chiefComplaints}
                        onChange={e => setClinicalNotes({ ...clinicalNotes, chiefComplaints: e.target.value })}
                        placeholder="Describe the patient's symptoms…"
                      />
                    </Field>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <Field label="Patient History">
                        <ClinicalTextarea
                          rows={3}
                          value={clinicalNotes.history}
                          onChange={e => setClinicalNotes({ ...clinicalNotes, history: e.target.value })}
                          placeholder="Diabetes, Hypertension, surgery…"
                        />
                      </Field>
                      <Field label="Examination Findings">
                        <ClinicalTextarea
                          rows={3}
                          value={clinicalNotes.examination}
                          onChange={e => setClinicalNotes({ ...clinicalNotes, examination: e.target.value })}
                          placeholder="Physical signs and observations…"
                        />
                      </Field>
                    </div>
                    <Field label="Diagnosis / Impression">
                      <ClinicalInput
                        type="text"
                        value={clinicalNotes.diagnosis}
                        onChange={e => setClinicalNotes({ ...clinicalNotes, diagnosis: e.target.value })}
                        placeholder="Enter final diagnosis…"
                        style={{ fontWeight: 700, color: T.redDark }}
                      />
                    </Field>
                    <Field label="Remarks / Follow-up">
                      <ClinicalTextarea
                        rows={2}
                        value={clinicalNotes.remarks}
                        onChange={e => setClinicalNotes({ ...clinicalNotes, remarks: e.target.value })}
                        placeholder="Follow-up in 7 days, dietary advice…"
                      />
                    </Field>
                  </div>
                </Card>
              )}

              {/* ── Tab: Prescription ── */}
              {activeTab === 'rx' && (
                <Card style={{ animation: 'fadeIn .18s ease' }}>
                  <CardHeader
                    icon={<Pill size={15} color={T.red} />}
                    title="Digital Prescription"
                    action={
                      <button
                        onClick={addPrescriptionRow}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '6px 12px', borderRadius: 8,
                          border: `1px solid ${T.redMid}`, background: T.redLight,
                          fontSize: 11, fontWeight: 700, color: T.red,
                          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        <Plus size={12} /> Add Medicine
                      </button>
                    }
                  />
                  <div style={{ padding: 18 }}>
                    {/* Column headers */}
                    <div className="rx-row" style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      {['Medicine Name', 'Dosage', 'Frequency', 'Duration', 'Timing', ''].map((h, i) => (
                        <div key={i} style={{ flex: i === 0 ? 2 : 1, fontSize: 9, fontWeight: 700, color: T.inkLight, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace", paddingLeft: 4 }}>{h}</div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {prescription.map((med, idx) => (
                        <div
                          key={idx}
                          className="rx-row"
                          style={{ display: 'flex', gap: 8, padding: '10px 12px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, alignItems: 'center' }}
                        >
                          <div style={{ flex: 2 }}>
                            <ClinicalInput type="text" value={med.medicineName} onChange={e => updatePrescription(idx, 'medicineName', e.target.value)} placeholder="Medicine name" style={{ background: T.white }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <ClinicalInput type="text" value={med.dosage} onChange={e => updatePrescription(idx, 'dosage', e.target.value)} placeholder="500mg" style={{ background: T.white }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <ClinicalSelect value={med.frequency} onChange={e => updatePrescription(idx, 'frequency', e.target.value)} style={{ background: T.white }}>
                              <option value="">Freq.</option>
                              <option>1-0-1</option>
                              <option>1-1-1</option>
                              <option>1-0-0</option>
                              <option>0-0-1</option>
                              <option>TDS</option>
                              <option value="SOS">SOS</option>
                            </ClinicalSelect>
                          </div>
                          <div style={{ flex: 1 }}>
                            <ClinicalInput type="text" value={med.duration} onChange={e => updatePrescription(idx, 'duration', e.target.value)} placeholder="5 Days" style={{ background: T.white }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <ClinicalSelect value={med.instructions} onChange={e => updatePrescription(idx, 'instructions', e.target.value)} style={{ background: T.white }}>
                              <option value="">Timing</option>
                              <option>After Meal</option>
                              <option>Empty Stomach</option>
                              <option>Before Sleep</option>
                              <option>With Milk</option>
                            </ClinicalSelect>
                          </div>
                          <button
                            onClick={() => removePrescriptionRow(idx)}
                            style={{ width: 30, height: 30, border: 'none', borderRadius: 7, background: 'transparent', color: T.inkLight, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = T.red; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.inkLight; }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* ── Tab: Investigations ── */}
              {activeTab === 'tests' && (
                <div style={{ animation: 'fadeIn .18s ease', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {hasInhouse ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '240px 1fr 1fr 300px',
                      gap: 1,
                      background: T.border,
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: `1px solid ${T.border}`,
                      height: 600,
                    }}>
                      {/* Col 1: Departments */}
                      <div style={{ background: T.surface, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '12px 16px', background: T.white, borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 800, color: T.ink, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Departments
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {hospitalDepts.map(dept => (
                            <button
                              key={dept.name}
                              onClick={() => {
                                setSelectedGroup(dept.name);
                                if (dept.categories?.length > 0) setSelectedCategory(dept.categories[0].name);
                              }}
                              style={{
                                padding: '10px 12px',
                                borderRadius: 10,
                                border: 'none',
                                background: selectedGroup === dept.name ? T.red : 'transparent',
                                color: selectedGroup === dept.name ? T.white : T.inkMid,
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: 700,
                                transition: 'all .15s',
                              }}
                            >
                              {dept.name}
                            </button>
                          ))}
                          <div style={{ marginTop: 'auto', padding: '10px 0' }}>
                            <button
                              onClick={() => setSuggestionMode(true)}
                              style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: 10,
                                border: `1px dashed ${T.red}`,
                                background: T.redLight,
                                color: T.red,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8
                              }}
                            >
                              <Plus size={14} /> Suggest Service
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Col 2: Categories */}
                      <div style={{ background: T.white, display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${T.border}` }}>
                        <div style={{ padding: '12px 16px', background: T.surface, borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 800, color: T.ink, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Categories
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {hospitalDepts.find(d => d.name === selectedGroup)?.categories.map(cat => (
                            <button
                              key={cat.name}
                              onClick={() => setSelectedCategory(cat.name)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: 10,
                                border: 'none',
                                background: selectedCategory === cat.name ? T.redLight : 'transparent',
                                color: selectedCategory === cat.name ? T.red : T.inkMid,
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: 12,
                                fontWeight: 700,
                                transition: 'all .15s',
                              }}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Col 3: Services */}
                      <div style={{ background: T.white, display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${T.border}` }}>
                        <div style={{ padding: '12px 16px', background: T.surface, borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 800, color: T.ink, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Services
                        </div>
                        <div style={{ padding: '10px', borderBottom: `1px solid ${T.border}` }}>
                          <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.inkLight }} />
                            <input
                              type="text"
                              placeholder="Search services..."
                              value={pathologySearch}
                              onChange={(e) => setPathologySearch(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px 10px 8px 30px',
                                fontSize: 12,
                                borderRadius: 8,
                                border: `1px solid ${T.border}`,
                                outline: 'none',
                                fontFamily: "'DM Sans', sans-serif"
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {hospitalDepts
                            .find(d => d.name === selectedGroup)
                            ?.categories.find(c => c.name === selectedCategory)
                            ?.services.filter(s => s.name.toLowerCase().includes(pathologySearch.toLowerCase()))
                            .map(svc => {
                              const isSelected = investigations.some(i => i.name === svc.name);
                              return (
                                <button
                                  key={svc.name}
                                  onClick={() => handleSelectPredefinedTest(svc, selectedCategory)}
                                  style={{
                                    padding: '10px 12px',
                                    borderRadius: 12,
                                    border: `1px solid ${isSelected ? T.redMid : T.border}`,
                                    background: isSelected ? T.redLight : T.white,
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all .15s',
                                  }}
                                >
                                  <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? T.red : T.ink }}>{svc.name}</div>
                                  <div style={{ fontSize: 10, color: T.inkLight }}>₹{svc.price}</div>
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* Col 4: Selected */}
                      <div style={{ background: T.surface, display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${T.border}` }}>
                        <div style={{ padding: '12px 16px', background: T.white, borderBottom: `1px solid ${T.border}`, fontSize: 10, fontWeight: 700, color: T.red, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                          Selected ({investigations.length})
                          {investigations.length > 0 && <button onClick={() => setInvestigations([])} style={{ border: 'none', background: 'none', color: T.inkLight, fontSize: 10, cursor: 'pointer', fontWeight: 700 }}>Clear</button>}
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {investigations.map((inv, idx) => (
                            <div key={idx} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, flex: 1 }}>{inv.name}</div>
                                <button onClick={() => setInvestigations(investigations.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'none', color: T.inkLight, cursor: 'pointer', padding: 4 }}><X size={14} /></button>
                              </div>
                              <input
                                type="text"
                                placeholder="Instructions..."
                                value={inv.notes}
                                onChange={(e) => {
                                  const next = [...investigations];
                                  next[idx].notes = e.target.value;
                                  setInvestigations(next);
                                }}
                                style={{ width: '100%', border: 'none', borderBottom: `1px solid ${T.border}`, fontSize: 10, padding: '4px 0', outline: 'none', color: T.inkMid, fontStyle: 'italic' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 320px',
                      gap: 20,
                      height: 600
                    }}>
                      <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 40 }}>
                        <div style={{ background: T.redLight, width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                          <Microscope size={32} color={T.red} />
                        </div>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: T.ink, marginBottom: 10 }}>In-house Investigations Disabled</h3>
                        <p style={{ fontSize: 14, color: T.inkLight, maxWidth: 400, lineHeight: 1.6, marginBottom: 30 }}>
                          The hospital has not enabled in-house investigations. You can still suggest investigations by manually typing them below.
                        </p>
                        <div style={{ width: '100%', maxWidth: 500, position: 'relative' }}>
                          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: T.inkLight }} />
                          <input
                            type="text"
                            placeholder="Type investigation name and press Enter..."
                            value={pathologySearch}
                            onChange={(e) => setPathologySearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && pathologySearch.trim()) {
                                handleSelectPredefinedTest({ name: pathologySearch.trim() }, 'Manual');
                                setPathologySearch('');
                              }
                            }}
                            style={{
                              width: '100%',
                              padding: '16px 20px 16px 48px',
                              fontSize: 16,
                              borderRadius: 16,
                              border: `2px solid ${T.border}`,
                              outline: 'none',
                              fontFamily: "'DM Sans', sans-serif",
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                              transition: 'all .2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = T.red}
                            onBlur={(e) => e.target.style.borderColor = T.border}
                          />
                        </div>
                        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                          {['Complete Blood Count', 'X-Ray Chest', 'Serum Creatinine'].map(suggestion => (
                            <button
                              key={suggestion}
                              onClick={() => handleSelectPredefinedTest({ name: suggestion }, 'Manual')}
                              style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.white, color: T.inkMid, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              + {suggestion}
                            </button>
                          ))}
                        </div>
                      </Card>

                      {/* Selected Column (Right) */}
                      <div style={{ background: T.surface, display: 'flex', flexDirection: 'column', borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
                        <div style={{ padding: '12px 16px', background: T.white, borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 800, color: T.red, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                          Selected Tests ({investigations.length})
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {investigations.map((inv, idx) => (
                            <div key={idx} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, flex: 1 }}>{inv.name}</div>
                                <button onClick={() => setInvestigations(investigations.filter((_, i) => i !== idx))} style={{ border: 'none', background: 'none', color: T.inkLight, cursor: 'pointer' }}><X size={14} /></button>
                              </div>
                              <input
                                type="text"
                                placeholder="Notes..."
                                value={inv.notes}
                                onChange={(e) => {
                                  const next = [...investigations];
                                  next[idx].notes = e.target.value;
                                  setInvestigations(next);
                                }}
                                style={{ width: '100%', border: 'none', borderBottom: `1px solid ${T.border}`, fontSize: 10, padding: '4px 0', outline: 'none', color: T.inkMid }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggest Service Modal/Section */}
                  {suggestionMode && (
                    <div className="modal-overlay" onClick={() => setSuggestionMode(false)}>
                      <div className="modal-content" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h3 style={{ fontSize: 16, fontWeight: 800, color: T.ink, margin: 0 }}>Suggest New Service</h3>
                          <button onClick={() => setSuggestionMode(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <Field label="Service Name">
                            <ClinicalInput
                              value={suggestedService.name}
                              onChange={e => setSuggestedService({ ...suggestedService, name: e.target.value })}
                              placeholder="e.g. Advanced DNA Profile"
                            />
                          </Field>
                          <Field label="Why is this needed? (Notes)">
                            <ClinicalTextarea
                              value={suggestedService.notes}
                              onChange={e => setSuggestedService({ ...suggestedService, notes: e.target.value })}
                              placeholder="Patient requires specialized testing not in current list..."
                              rows={3}
                            />
                          </Field>
                          <button
                            onClick={handleAddSuggestedService}
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: 12,
                              border: 'none',
                              background: T.red,
                              color: '#fff',
                              fontWeight: 800,
                              fontSize: 14,
                              cursor: 'pointer',
                              marginTop: 10
                            }}
                          >
                            Add to Prescription
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ════ RIGHT COLUMN: History ════ */}
              <div style={{ position: 'sticky', top: 76 }}>
                <div style={{ background: T.dark, borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={15} color="#F87171" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#F87171', fontFamily: "'DM Sans', sans-serif" }}>Medical History</span>
                    {history.length > 0 && (
                      <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace", background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 5 }}>
                        {history.length} visits
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '14px 16px', maxHeight: 520, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {history.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 16px', opacity: 0.25 }}>
                        <Info size={28} color="#fff" style={{ display: 'block', margin: '0 auto 10px' }} />
                        <p style={{ color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>No previous visits</p>
                      </div>
                    ) : (
                      history.map((h, i) => (
                        <div
                          key={i}
                          className="hist-item"
                          onClick={() => setViewingHistoryDetails(h)}
                          style={{
                            padding: '12px 14px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 12,
                            cursor: 'pointer',
                            transition: 'all .15s',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>
                              {new Date(h.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, fontFamily: "'DM Mono', monospace" }}>
                              {h.doctorId?.fullName || 'Doctor'}
                            </span>
                          </div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {h.clinicalNotes?.diagnosis || '—'}
                          </p>
                          {h.clinicalNotes?.chiefComplaints && (
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {h.clinicalNotes.chiefComplaints}
                            </p>
                          )}
                          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {h.prescription?.slice(0, 2).map((rx, j) => (
                                <span key={j} style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4, fontFamily: "'DM Mono', monospace" }}>
                                  {rx.medicineName}
                                </span>
                              ))}
                            </div>
                            <span style={{ fontSize: 9, fontWeight: 700, color: '#F87171', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>View Details →</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* History Details Modal */}
                {viewingHistoryDetails && (
                  <div className="modal-overlay" onClick={() => setViewingHistoryDetails(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                      {/* Modal Header */}
                      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.surface }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: T.red, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>
                            Historical Visit Record
                          </div>
                          <h3 style={{ fontSize: 18, fontWeight: 800, color: T.ink, margin: 0 }}>
                            {new Date(viewingHistoryDetails.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </h3>
                          <p style={{ fontSize: 12, color: T.inkLight, margin: '4px 0 0' }}>
                            Consulted by <span style={{ fontWeight: 700, color: T.ink }}>Dr. {viewingHistoryDetails.doctorId?.fullName}</span> • {viewingHistoryDetails.doctorId?.speciality}
                          </p>
                        </div>
                        <button
                          onClick={() => setViewingHistoryDetails(null)}
                          style={{ width: 40, height: 40, borderRadius: 12, border: 'none', background: '#FEE2E2', color: T.red, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .15s' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Modal Scrollable Body */}
                      <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Vitals Summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                          {Object.entries({
                            'Temp': viewingHistoryDetails.vitals?.temp ? `${viewingHistoryDetails.vitals.temp}°F` : null,
                            'Pulse': viewingHistoryDetails.vitals?.pulse ? `${viewingHistoryDetails.vitals.pulse} bpm` : null,
                            'BP': (viewingHistoryDetails.vitals?.bp?.systolic && viewingHistoryDetails.vitals?.bp?.diastolic) ? `${viewingHistoryDetails.vitals.bp.systolic}/${viewingHistoryDetails.vitals.bp.diastolic}` : null,
                            'SpO2': viewingHistoryDetails.vitals?.spo2 ? `${viewingHistoryDetails.vitals.spo2}%` : null,
                            'Weight': viewingHistoryDetails.vitals?.weight ? `${viewingHistoryDetails.vitals.weight} kg` : null,
                          }).map(([k, v]) => v && (
                            <div key={k} style={{ padding: '10px 14px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: T.inkLight, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{k}</div>
                              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: "'DM Mono', monospace" }}>{v}</div>
                            </div>
                          ))}
                        </div>

                        {/* Clinical Notes */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                              <label style={labelSx}>Chief Complaints</label>
                              <div style={{ fontSize: 13, color: T.inkMid, lineHeight: 1.6, background: T.surface, padding: '12px 16px', borderRadius: 12, border: `1px solid ${T.border}` }}>
                                {viewingHistoryDetails.clinicalNotes?.chiefComplaints || 'None recorded'}
                              </div>
                            </div>
                            <div>
                              <label style={labelSx}>Patient History</label>
                              <div style={{ fontSize: 13, color: T.inkMid, lineHeight: 1.6, background: T.surface, padding: '12px 16px', borderRadius: 12, border: `1px solid ${T.border}` }}>
                                {viewingHistoryDetails.clinicalNotes?.history || 'No history recorded'}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                              <label style={labelSx}>Diagnosis</label>
                              <div style={{ fontSize: 13, fontWeight: 700, color: T.redDark, lineHeight: 1.6, background: T.redLight, padding: '12px 16px', borderRadius: 12, border: `1px solid ${T.redMid}` }}>
                                {viewingHistoryDetails.clinicalNotes?.diagnosis || 'No diagnosis recorded'}
                              </div>
                            </div>
                            <div>
                              <label style={labelSx}>Examination Findings</label>
                              <div style={{ fontSize: 13, color: T.inkMid, lineHeight: 1.6, background: T.surface, padding: '12px 16px', borderRadius: 12, border: `1px solid ${T.border}` }}>
                                {viewingHistoryDetails.clinicalNotes?.examination || 'None recorded'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Medicines */}
                        <div>
                          <label style={{ ...labelSx, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Pill size={12} /> Prescribed Medicines
                          </label>
                          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                              <thead>
                                <tr style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
                                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: T.inkLight }}>Medicine</th>
                                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: T.inkLight }}>Dosage</th>
                                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: T.inkLight }}>Freq.</th>
                                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: T.inkLight }}>Duration</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {viewingHistoryDetails.prescription?.length > 0 ? viewingHistoryDetails.prescription.map((med, idx) => (
                                  <tr key={idx}>
                                    <td style={{ padding: '12px 16px' }}>
                                      <div style={{ fontWeight: 700, color: T.ink }}>{med.medicineName}</div>
                                      <div style={{ fontSize: 10, color: T.red, fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>{med.instructions}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center', color: T.inkMid }}>{med.dosage}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>{med.frequency}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', color: T.inkMid }}>{med.duration}</td>
                                  </tr>
                                )) : (
                                  <tr>
                                    <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: T.inkLight, fontStyle: 'italic' }}>No medicines prescribed</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Suggested Tests */}
                        {viewingHistoryDetails.suggestedInvestigations?.length > 0 && (
                          <div>
                            <label style={{ ...labelSx, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Microscope size={12} /> Suggested Investigations
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {viewingHistoryDetails.suggestedInvestigations.map((inv, idx) => (
                                <div key={idx} style={{ padding: '6px 12px', background: T.redLight, border: `1px solid ${T.redMid}`, borderRadius: 10, fontSize: 11, fontWeight: 700, color: T.red }}>
                                  {inv.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Modal Footer */}
                      <div style={{ padding: '16px 24px', background: T.surface, borderTop: `1px solid ${T.border}` }}>
                        <button
                          onClick={() => setViewingHistoryDetails(null)}
                          style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: T.ink, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                        >
                          Close Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick stats strip */}
                {(investigations.length > 0 || prescription.filter(p => p.medicineName).length > 0) && (
                  <div style={{ marginTop: 14, background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 12 }}>
                    {prescription.filter(p => p.medicineName).length > 0 && (
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <p style={{ fontSize: 20, fontWeight: 800, color: T.ink, margin: 0, fontFamily: "'DM Mono', monospace" }}>
                          {prescription.filter(p => p.medicineName).length}
                        </p>
                        <p style={{ fontSize: 10, color: T.inkLight, margin: '2px 0 0', fontFamily: "'DM Mono', monospace" }}>Medicines</p>
                      </div>
                    )}
                    {investigations.length > 0 && (
                      <div style={{ flex: 1, textAlign: 'center', borderLeft: prescription.filter(p => p.medicineName).length > 0 ? `1px solid ${T.border}` : 'none', paddingLeft: 12 }}>
                        <p style={{ fontSize: 20, fontWeight: 800, color: T.red, margin: 0, fontFamily: "'DM Mono', monospace" }}>
                          {investigations.length}
                        </p>
                        <p style={{ fontSize: 10, color: T.inkLight, margin: '2px 0 0', fontFamily: "'DM Mono', monospace" }}>Tests</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div >

    </>
  );
};

export default ConsultationWindow; 