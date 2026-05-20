// PrintBill.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Printer, ArrowLeft, FileText, Phone,
  CheckCircle, Clock, AlertCircle, MapPin, Mail, Building
} from 'lucide-react';
import opdBillingApi from '../../API/opdBillingApi';
import billingSettingsApi from '../../API/billingSettingsApi';
import { profileApi } from '../../API/profileApi';

/* ─── helpers ─────────────────────────────────────────────────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
const money = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ─── DEFAULT TEMPLATE (fallback if none saved) ─────────────────────── */
const DEFAULT_TEMPLATE = {
  hospitalName: 'City Hospital',
  address: '123 Health Avenue, Medical District',
  phone: '+91 00000 00000',
  email: 'billing@hospital.com',
  accentColor: '#DC2626',
  headerBg: 'dark',
  logoUrl: '',
  logoText: '',
  showBorderTop: true,
  footerNote: 'Computer generated invoice. No signature required.',
};

/* ─── Status Badge ─────── */
const PayBadge = ({ status, mode, accentColor }) => {
  const map = {
    Paid: { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0', Icon: CheckCircle },
    Partial: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', Icon: Clock },
    Unpaid: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA', Icon: AlertCircle },
    Pending: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', Icon: Clock },
  };
  const s = map[status] ?? map.Unpaid;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
      <s.Icon size={12} /> {status}{mode ? ` · ${mode}` : ''}
    </span>
  );
};

/* ─── Bill Header ────────────────────────────────────────────────────── */
const BillHeader = ({ template, bill }) => {
  const { hospitalName, address, phone, email, accentColor, headerBg, logoUrl, logoText, showBorderTop } = template;

  const isDark = headerBg === 'dark';
  const isWhite = headerBg === 'white';
  const isColored = headerBg === 'colored';

  const bg = isDark ? '#111827' : isWhite ? '#fff' : accentColor;
  const txtColor = isWhite ? '#111827' : '#fff';
  const subTxtColor = isWhite ? '#6B7280' : 'rgba(255,255,255,0.75)';

  return (
    <div style={{
      background: bg,
      borderTop: showBorderTop ? `5px solid ${accentColor}` : 'none',
      padding: '28px 36px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        {/* Hospital Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {logoUrl ? (
            <img src={logoUrl} alt="logo" style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 10, background: isWhite ? 'transparent' : 'rgba(255,255,255,0.1)' }} />
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: isWhite ? accentColor + '15' : 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800,
              color: isWhite ? accentColor : '#fff',
            }}>
              {logoText || (hospitalName?.[0]?.toUpperCase() ?? 'H')}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: txtColor, letterSpacing: '-0.02em', fontFamily: "'DM Sans', sans-serif" }}>
              {hospitalName || 'Hospital Name'}
            </h1>
            <p style={{ fontSize: 12, margin: '3px 0 0', color: subTxtColor, fontFamily: "'DM Mono', monospace" }}>Multi-Specialty Hospital</p>
          </div>
        </div>

        {/* Bill Meta */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 10, color: subTxtColor, fontFamily: "'DM Mono', monospace", fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>OPD Bill / Tax Invoice</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: txtColor, fontFamily: "'DM Mono', monospace", margin: '0 0 8px' }}>#{bill.billNumber}</p>
          <PayBadge status={bill.paymentStatus} mode={bill.paymentMode} accentColor={accentColor} />
        </div>
      </div>

      {/* Contact Strip */}
      <div style={{ display: 'flex', gap: 20, marginTop: 18, paddingTop: 14, borderTop: `1px solid ${isWhite ? '#F0F0F0' : 'rgba(255,255,255,0.12)'}`, flexWrap: 'wrap' }}>
        {address && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: subTxtColor }}>
            <MapPin size={11} /> {address}
          </span>
        )}
        {phone && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: subTxtColor }}>
            <Phone size={11} /> {phone}
          </span>
        )}
        {email && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: subTxtColor }}>
            <Mail size={11} /> {email}
          </span>
        )}
      </div>
    </div>
  );
};

/* ─── Main ────────────────────────────────────────────────────────────── */
const PrintBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState(null);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Load bill + template + profile in parallel
        const [billRes, settingsRes, profileRes] = await Promise.allSettled([
          opdBillingApi.getBillById(id),
          billingSettingsApi.getSettings(),
          profileApi.getProfile(),
        ]);

        if (billRes.status === 'fulfilled' && billRes.value.success) {
          setBill(billRes.value.data);
        } else {
          setError('Bill not found');
        }

        // 1. Load branding settings (colors, logo, styles)
        if (settingsRes.status === 'fulfilled' && settingsRes.value.success) {
          const saved = settingsRes.value.data?.billTemplate;
          if (saved && Object.keys(saved).length > 0) {
            setTemplate(prev => ({ ...prev, ...saved }));
          }
        }

        // 2. Load official hospital details (Name, Address, contact) - Source of truth
        if (profileRes.status === 'fulfilled' && profileRes.value.data) {
          const p = profileRes.value.data;
          setTemplate(prev => ({
            ...prev,
            hospitalName: p.hospitalName || p.name || prev.hospitalName,
            address: [p.address?.addressLine1, p.address?.city, p.address?.state, p.address?.pincode].filter(Boolean).join(', ') || prev.address,
            phone: p.phone || p.mobile || prev.phone,
            email: p.email || prev.email,
          }));
        }
      } catch { setError('Failed to load bill data'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif", flexDirection: 'column', gap: 14 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #DC262620', borderTopColor: '#DC2626', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <p style={{ color: '#9CA3AF', fontSize: 13, fontFamily: "'DM Mono', monospace", margin: 0 }}>Loading bill…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !bill) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F9FAFB', gap: 12, fontFamily: "'DM Sans', sans-serif" }}>
      <AlertCircle size={36} color="#DC2626" />
      <p style={{ color: '#111827', fontWeight: 700, fontSize: 15, margin: 0 }}>{error || 'Bill not found'}</p>
      <button onClick={() => navigate(-1)} style={{ padding: '8px 20px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Go Back</button>
    </div>
  );

  const subtotal = bill.services?.reduce((s, r) => s + (r.price * r.quantity), 0) ?? bill.subTotal ?? 0;
  const { accentColor, footerNote } = template;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        @media print {
          /* Hide EVERYTHING in the body */
          body * { visibility: hidden; }
          /* Only show the bill shell and its descendants */
          .bill-shell, .bill-shell * { visibility: visible; }
          /* Place the bill at the absolute top-left of the paper */
          .bill-shell {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          /* Remove any layout backgrounds or paddings from parents */
          body, html { background: white !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F0F2F5', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>

        {/* ── Top action bar ── */}
        <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #F0F0F0', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', background: 'transparent', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#9CA3AF', fontFamily: "'DM Mono', monospace" }}>#{bill.billNumber}</span>
            <button
              onClick={() => navigate('/subadmin/settings/billing/template')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            >
              Customize Template
            </button>
            <button onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 18px', background: accentColor, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              <Printer size={14} /> Print Bill
            </button>
          </div>
        </div>

        {/* ── Bill ── */}
        <div style={{ flex: 1, padding: '28px 24px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div className="bill-shell" style={{ width: '100%', maxWidth: 860, background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

            {/* Hospital Header */}
            <BillHeader template={template} bill={bill} />

            {/* ── Meta row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA' }}>
              {[
                { label: 'Bill Date', value: fmt(bill.billDate) },
                { label: 'Time', value: fmtTime(bill.billDate) },
                { label: 'Treating Doctor', value: bill.doctor?.fullName ? `Dr. ${bill.doctor.fullName}` : 'N/A', accent: true },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{ padding: '14px 20px', borderRight: '1px solid #F0F0F0' }}>
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: '0 0 4px' }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: accent ? accentColor : '#111827', margin: 0, fontFamily: accent ? "'DM Sans', sans-serif" : "'DM Mono', monospace" }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 28 }}>

              {/* ── Patient + Invoice info ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Patient */}
                <div style={{ background: '#FAFAFA', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 20px' }}>
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: '0 0 10px' }}>Billed To</p>
                  <p style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.01em' }}>{bill.patient?.firstName} {bill.patient?.lastName}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#6B7280' }}>
                      <FileText size={12} color="#9CA3AF" />
                      <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{bill.patient?.patientId}</span>
                    </span>
                    {bill.patient?.mobile && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#6B7280' }}>
                        <Phone size={12} color="#9CA3AF" />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{bill.patient.mobile}</span>
                      </span>
                    )}
                    {bill.patient?.gender && (
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>Gender: {bill.patient.gender}</span>
                    )}
                  </div>
                </div>

                {/* Summary numbers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Services', value: bill.services?.length ?? 0 },
                    { label: 'Subtotal', value: `₹${money(subtotal)}` },
                    { label: 'Discount', value: bill.discount > 0 ? `-₹${money(bill.discount)}` : '—', red: bill.discount > 0 },
                    { label: 'Tax', value: bill.tax > 0 ? `₹${money(bill.tax)}` : '—' },
                  ].map(({ label, value, red }) => (
                    <div key={label} style={{ background: '#FAFAFA', border: '1px solid #F0F0F0', borderRadius: 10, padding: '12px 14px' }}>
                      <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: '0 0 4px' }}>{label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: red ? accentColor : '#111827', margin: 0, fontFamily: "'DM Mono', monospace" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Services Table ── */}
              <div>
                <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: '0 0 10px' }}>Services Rendered</p>
                <div style={{ border: '1px solid #F0F0F0', borderRadius: 12, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                        {[['Description', 'left', ''], ['Qty', 'center', '72px'], ['Rate (₹)', 'right', '110px'], ['Amount (₹)', 'right', '130px']].map(([col, align, w]) => (
                          <th key={col} style={{ padding: '10px 16px', textAlign: align, fontSize: 10, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", width: w || 'auto' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bill.services?.map((s, i) => (
                        <tr key={i} style={{ borderBottom: i < bill.services.length - 1 ? '1px solid #F9FAFB' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>
                            {s.name}
                            {s.category && <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 8, fontFamily: "'DM Mono', monospace" }}>[{s.category}]</span>}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', color: '#6B7280', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{s.quantity}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', color: '#6B7280', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{money(s.price)}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#111827', fontFamily: "'DM Mono', monospace" }}>{money(s.price * s.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Grand Total ── */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: 300 }}>
                  {[
                    bill.tax > 0 && ['Tax / GST', `₹${money(bill.tax)}`, false],
                    bill.discount > 0 && ['Discount', `-₹${money(bill.discount)}`, true],
                  ].filter(Boolean).map(([label, val, red]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #F0F0F0' }}>
                      <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: red ? accentColor : '#374151', fontFamily: "'DM Mono', monospace" }}>{val}</span>
                    </div>
                  ))}
                  {/* Total box */}
                  <div style={{ marginTop: 12, background: '#111827', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Grand Total</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: accentColor, fontFamily: "'DM Mono', monospace" }}>₹{money(bill.totalAmount)}</span>
                  </div>

                  {/* Payment mode */}
                  {bill.paymentMode && (
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #F0F0F0' }}>
                      <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: "'DM Mono', monospace" }}>Payment Mode</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{bill.paymentMode}</span>
                    </div>
                  )}

                  <p style={{ textAlign: 'right', fontSize: 11, color: '#9CA3AF', marginTop: 8, fontStyle: 'italic' }}>
                    {bill.paymentStatus === 'Paid' ? '✓ Payment received in full' : bill.paymentStatus === 'Partial' ? '⚠ Partial payment received' : '✗ Payment pending'}
                  </p>
                </div>
              </div>

              {/* ── Footer ── */}
              <div style={{ borderTop: '1px dashed #E5E7EB', paddingTop: 20, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  {footerNote && <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 3px', fontStyle: 'italic' }}>{footerNote}</p>}
                  {template.email && <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>For queries: {template.email}{template.phone ? ` · ${template.phone}` : ''}</p>}
                </div>
                <div style={{ textAlign: 'center', minWidth: 160 }}>
                  <div style={{ borderBottom: '1px dashed #D1D5DB', height: 36, marginBottom: 6 }} />
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', margin: 0, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Authorized Signatory</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default PrintBill;