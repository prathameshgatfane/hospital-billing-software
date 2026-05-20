// PatientDetails.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit, AlertCircle, UserCircle, Calendar,
  Phone, Mail, MapPin, Heart, Weight, Ruler, FileText,
  Shield, Receipt, Bed, FlaskConical, ChevronRight,
  User, Activity, Droplets,
} from 'lucide-react';
import patientApi from '../../API/patientApi';
import opdBillingApi from '../../API/opdBillingApi';
import labApi from '../../API/labApi';
import ipdApi from '../../API/ipdApi';

/* ─── helpers ─────────────────────────────────────────────────────────── */
const calcAge = (dob) => {
  if (!dob) return 'N/A';
  const b = new Date(dob), t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
  return age;
};
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
const cur = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;
const init = (f = '', l = '') => `${f[0] ?? ''}${l[0] ?? ''}`.toUpperCase();

const PALETTE = [
  ['#FEE2E2', '#991B1B'], ['#DBEAFE', '#1D4ED8'], ['#D1FAE5', '#065F46'],
  ['#EDE9FE', '#5B21B6'], ['#FEF3C7', '#92400E'], ['#FCE7F3', '#9D174D'],
];

const TABS = [
  { key: 'profile', label: 'Profile', Icon: User },
  { key: 'opd', label: 'OPD Billing', Icon: Receipt },
  { key: 'ipd', label: 'IPD History', Icon: Bed },
  { key: 'lab', label: 'Lab Reports', Icon: FlaskConical },
];

/* ─── Sub-components ──────────────────────────────────────────────────── */
const Avatar = ({ first, last, size = 52 }) => {
  const [bg, fg] = PALETTE[((first?.charCodeAt(0) ?? 0) + (last?.charCodeAt(0) ?? 0)) % PALETTE.length];
  return (
    <div style={{ width: size, height: size, fontSize: size * 0.36, background: bg, color: fg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontFamily: "'DM Mono', monospace", letterSpacing: '0.02em' }}>
      {init(first, last)}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const s = {
    Active: { background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0' },
    Inactive: { background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' },
    Deceased: { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
    Transferred: { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' },
  }[status] ?? { background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' };
  return <span style={{ ...s, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{status}</span>;
};

const InfoField = ({ label, value }) => (
  <div style={{ background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: 10, padding: '10px 14px' }}>
    <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: '0 0 4px' }}>{label}</p>
    <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{value || 'N/A'}</p>
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, padding: '20px 22px', ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, label, color = '#DC2626' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={14} color={color} />
    </div>
    <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{label}</h2>
  </div>
);

const Spinner = ({ color = '#DC2626' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
    <div style={{ width: 28, height: 28, border: `3px solid ${color}30`, borderTopColor: color, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  </div>
);

const EmptyState = ({ Icon, label, action, onAction }) => (
  <div style={{ textAlign: 'center', padding: '52px 16px', color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>
    <Icon size={36} style={{ margin: '0 auto 10px', opacity: 0.25 }} />
    <p style={{ fontWeight: 600, fontSize: 13, margin: '0 0 8px' }}>{label}</p>
    {action && <button onClick={onAction} style={{ fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{action}</button>}
  </div>
);

/* ─── Main ────────────────────────────────────────────────────────────── */
const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const [opdBills, setOpdBills] = useState([]);
  const [ipdAdmissions, setIpdAdmissions] = useState([]);
  const [labDocs, setLabDocs] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await patientApi.getById(id);
        if (res.success) setPatient(res.data);
        else setError('Failed to load patient');
      } catch { setError('Patient not found'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    if (!patient) return;
    (async () => {
      setTabLoading(true);
      try {
        if (activeTab === 'opd') {
          const res = await opdBillingApi.getBills({ patientId: id, limit: 50 });
          if (res.success) setOpdBills(res.data);
        } else if (activeTab === 'lab') {
          const res = await labApi.getPatientDocuments(id);
          setLabDocs(res.documents || res.data || []);
        } else if (activeTab === 'ipd') {
          const res = await ipdApi.getActiveAdmissions();
          const all = res.data || [];
          setIpdAdmissions(all.filter(a => a.patient?._id === id || a.patient === id));
        }
      } catch (e) { console.error('Tab fetch:', e); }
      finally { setTabLoading(false); }
    })();
  }, [activeTab, patient]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #DC262620', borderTopColor: '#DC2626', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  if (error || !patient) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12, fontFamily: "'DM Sans', sans-serif" }}>
      <AlertCircle size={40} color="#DC2626" />
      <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0 }}>{error || 'Patient not found'}</p>
      <button onClick={() => navigate(-1)} style={{ padding: '8px 20px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Go Back</button>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

              <Avatar first={patient.firstName} last={patient.lastName} size={52} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                    {patient.firstName} {patient.lastName}
                  </h1>
                  <StatusBadge status={patient.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 5, flexWrap: 'wrap' }}>
                  {[
                    { icon: <UserCircle size={12} />, val: patient.patientId },
                    { icon: <Calendar size={12} />, val: `${calcAge(patient.dateOfBirth)} yrs · ${patient.gender}` },
                    patient.mobile && { icon: <Phone size={12} />, val: patient.mobile },
                  ].filter(Boolean).map(({ icon, val }, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7280', fontFamily: i === 0 ? "'DM Mono', monospace" : "'DM Sans', sans-serif" }}>
                      {icon} {val}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => navigate(`/subadmin/patients/edit/${patient._id}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 9, background: '#DC2626', color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              <Edit size={14} /> Edit Patient
            </button>
          </div>

          {/* ── Tabs ── */}
          <div style={{ borderBottom: '1px solid #F0F0F0', display: 'flex', gap: 0, overflowX: 'auto' }}>
            {TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '10px 18px', fontSize: 13, fontWeight: 600,
                  border: 'none', borderBottom: `2px solid ${activeTab === key ? '#DC2626' : 'transparent'}`,
                  background: 'transparent', color: activeTab === key ? '#DC2626' : '#9CA3AF',
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.15s',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* ── Profile Tab ── */}
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                <Card>
                  <SectionTitle icon={User} label="Personal Information" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      ['Full Name', `${patient.firstName} ${patient.lastName}`],
                      ['Patient ID', patient.patientId],
                      ['Gender', patient.gender],
                      ['Date of Birth', fmt(patient.dateOfBirth)],
                      ['Age', `${calcAge(patient.dateOfBirth)} years`],
                      ['Mobile', patient.mobile],
                      ['Email', patient.email],
                      ['Blood Group', patient.bloodGroup],
                    ].map(([l, v]) => <InfoField key={l} label={l} value={v} />)}
                  </div>
                </Card>

                {patient.address && (
                  <Card>
                    <SectionTitle icon={MapPin} label="Address" color="#2563EB" />
                    <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>
                      {[patient.address.addressLine1, patient.address.addressLine2, patient.address.city, patient.address.state, patient.address.pincode].filter(Boolean).join(', ')}
                    </p>
                  </Card>
                )}

                <Card>
                  <SectionTitle icon={Heart} label="Medical Information" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <InfoField label="Height" value={patient.height ? `${patient.height} cm` : 'N/A'} />
                    <InfoField label="Weight" value={patient.weight ? `${patient.weight} kg` : 'N/A'} />
                  </div>
                  {patient.knownAllergies?.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 8, marginTop: 0 }}>Known Allergies</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {patient.knownAllergies.map((a, i) => (
                          <span key={i} style={{ background: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {patient.chronicConditions && (
                    <div style={{ marginTop: 14, background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: 10, padding: '10px 14px' }}>
                      <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: '0 0 4px' }}>Chronic Conditions</p>
                      <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{patient.chronicConditions}</p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Right sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {patient.emergencyContact?.name && (
                  <Card>
                    <SectionTitle icon={AlertCircle} label="Emergency Contact" color="#EA580C" />
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#111827', margin: '0 0 2px' }}>{patient.emergencyContact.name}</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 6px' }}>{patient.emergencyContact.relation}</p>
                    <p style={{ fontSize: 13, color: '#374151', margin: 0, fontFamily: "'DM Mono', monospace" }}>{patient.emergencyContact.mobile}</p>
                  </Card>
                )}

                {patient.billingDetails?.insuranceProvider && (
                  <Card>
                    <SectionTitle icon={Shield} label="Insurance" color="#4F46E5" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <InfoField label="Provider" value={patient.billingDetails.insuranceProvider} />
                      <InfoField label="Policy No." value={patient.billingDetails.policyNumber} />
                    </div>
                  </Card>
                )}

                <Card>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: '0 0 12px' }}>Record Info</p>
                  {[['Registered', fmt(patient.createdAt)], ['Last Updated', fmt(patient.updatedAt)]].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F9FAFB', fontSize: 12 }}>
                      <span style={{ color: '#9CA3AF' }}>{l}</span>
                      <span style={{ fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace" }}>{v}</span>
                    </div>
                  ))}
                </Card>

                {patient.notes && (
                  <Card>
                    <SectionTitle icon={FileText} label="Notes" color="#6B7280" />
                    <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{patient.notes}</p>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* ── OPD Tab ── */}
          {activeTab === 'opd' && (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F0F0F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Receipt size={15} color="#DC2626" />
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>OPD Billing History</h2>
                </div>
                <button onClick={() => navigate(`/subadmin/reception/opd/billing/create?patientId=${id}`)} style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>+ New Bill</button>
              </div>
              {tabLoading ? <Spinner /> : opdBills.length === 0 ? (
                <EmptyState Icon={Receipt} label="No OPD bills yet" />
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                      {['Bill No.', 'Date', 'Services', 'Amount', 'Status', ''].map(col => (
                        <th key={col} style={{ padding: '10px 18px', textAlign: col === 'Amount' ? 'right' : 'left', fontSize: 10, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {opdBills.map(bill => (
                      <BillRow key={bill._id} bill={bill} onView={() => navigate(`/subadmin/reception/opd/billing/view/${bill._id}`)} />
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          )}

          {/* ── IPD Tab ── */}
          {activeTab === 'ipd' && (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', borderBottom: '1px solid #F0F0F0' }}>
                <Bed size={15} color="#2563EB" />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>IPD Admission History</h2>
              </div>
              {tabLoading ? <Spinner color="#2563EB" /> : ipdAdmissions.length === 0 ? (
                <EmptyState Icon={Bed} label="No IPD admissions on record" />
              ) : (
                <div>
                  {ipdAdmissions.map(adm => (
                    <IpdRow key={adm._id} adm={adm} onView={() => navigate(`/subadmin/reception/ipd/stay/${adm._id}`)} />
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* ── Lab Tab ── */}
          {activeTab === 'lab' && (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F0F0F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FlaskConical size={15} color="#4F46E5" />
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Lab Reports & Documents</h2>
                </div>
                <button onClick={() => navigate(`/subadmin/reception/laboratory/patient/${id}`)} style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>+ Upload Report</button>
              </div>
              {tabLoading ? <Spinner color="#4F46E5" /> : labDocs.length === 0 ? (
                <EmptyState Icon={FlaskConical} label="No lab reports uploaded yet" action="Go to Lab Portal →" onAction={() => navigate(`/subadmin/reception/laboratory/patient/${id}`)} />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, padding: 16 }}>
                  {labDocs.map(doc => (
                    <LabDocCard key={doc._id} doc={doc} />
                  ))}
                </div>
              )}
            </Card>
          )}

        </div>
      </div>
    </>
  );
};

/* ─── Row Components ──────────────────────────────────────────────────── */
const BillRow = ({ bill, onView }) => {
  const [h, setH] = useState(false);
  const payStyle = {
    Paid: { bg: '#DCFCE7', color: '#166534' },
    Partial: { bg: '#FEF3C7', color: '#92400E' },
    Unpaid: { bg: '#FEE2E2', color: '#991B1B' },
  }[bill.paymentStatus] ?? { bg: '#F3F4F6', color: '#6B7280' };

  return (
    <tr style={{ borderBottom: '1px solid #F9FAFB', background: h ? '#FAFAFA' : '#fff', transition: 'background 0.1s' }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <td style={{ padding: '12px 18px', fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 12, color: '#111827' }}>{bill.billNumber}</td>
      <td style={{ padding: '12px 18px', fontSize: 12, color: '#6B7280', fontFamily: "'DM Mono', monospace" }}>{fmt(bill.billDate)}</td>
      <td style={{ padding: '12px 18px', fontSize: 12, color: '#6B7280', maxWidth: 180 }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
          {bill.services?.map(s => s.name || s.serviceName).join(', ') || '—'}
        </span>
      </td>
      <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, fontSize: 13, color: '#111827', fontFamily: "'DM Mono', monospace" }}>{cur(bill.totalAmount)}</td>
      <td style={{ padding: '12px 18px' }}>
        <span style={{ background: payStyle.bg, color: payStyle.color, padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{bill.paymentStatus}</span>
      </td>
      <td style={{ padding: '12px 18px', textAlign: 'right' }}>
        <button onClick={onView} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          View <ChevronRight size={12} />
        </button>
      </td>
    </tr>
  );
};

const IpdRow = ({ adm, onView }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #F9FAFB', background: h ? '#FAFAFA' : '#fff', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, background: '#EFF6FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bed size={17} color="#2563EB" />
        </div>
        <div>
          <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: 13 }}>{adm.ward || 'General Ward'} — Bed {adm.bedNumber || 'N/A'}</p>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: '3px 0 0', fontFamily: "'DM Mono', monospace" }}>Admitted: {fmt(adm.admissionDate)} · {adm.reason || 'N/A'}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ background: adm.status === 'Admitted' ? '#EFF6FF' : '#F3F4F6', color: adm.status === 'Admitted' ? '#1D4ED8' : '#6B7280', padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{adm.status}</span>
        <button onClick={onView} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          View <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

const LabDocCard = ({ doc }) => {
  const [h, setH] = useState(false);
  return (
    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: `1px solid ${h ? '#C7D2FE' : '#F0F0F0'}`, borderRadius: 12, textDecoration: 'none', background: h ? '#EEF2FF' : '#fff', transition: 'all 0.15s' }}>
      <div style={{ width: 34, height: 34, background: '#EEF2FF', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FileText size={15} color="#4F46E5" />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontWeight: 600, color: '#111827', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.documentType || doc.fileName || 'Report'}</p>
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '3px 0 0', fontFamily: "'DM Mono', monospace" }}>{fmt(doc.uploadedAt || doc.createdAt)}</p>
      </div>
    </a>
  );
};

export default PatientDetails;