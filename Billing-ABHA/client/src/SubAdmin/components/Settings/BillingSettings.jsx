import React, { useState, useEffect, useRef } from 'react';
import {
  Save, Receipt, Info, CheckCircle,
  AlertCircle, ArrowLeft, Percent, Calculator,
  Palette, Upload, Eye, Building, Phone, Mail,
  MapPin, FileText, X, Check, Image, LayoutTemplate,
  Printer, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import billingSettingsApi from '../../API/billingSettingsApi';
import { profileApi } from '../../API/profileApi';

/* ─── Bill Template Live Preview ──── */
const BillPreview = ({ template }) => {
  const {
    hospitalName, address, phone, email,
    accentColor, headerBg, logoUrl, logoText,
    showBorderTop, footerNote
  } = template;

  const headerStyle = {
    background: headerBg === 'dark' ? '#111827' : headerBg === 'white' ? '#fff' : accentColor,
    color: headerBg === 'white' ? '#111827' : '#fff',
    padding: '20px 24px',
    borderTop: showBorderTop ? `4px solid ${accentColor}` : 'none',
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', fontSize: 11, fontFamily: "'DM Sans', sans-serif", boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          {/* Hospital branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {logoUrl ? (
              <img src={logoUrl} alt="logo" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8 }} />
            ) : (
              <div style={{
                width: 40, height: 40, background: headerBg === 'colored' ? 'rgba(255,255,255,0.2)' : accentColor + '20',
                borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: headerBg === 'white' ? accentColor : '#fff'
              }}>
                {logoText || (hospitalName?.[0] ?? 'H')}
              </div>
            )}
            <div>
              <p style={{ fontWeight: 800, fontSize: 13, margin: 0, color: headerBg === 'white' ? '#111827' : '#fff' }}>{hospitalName || 'Hospital Name'}</p>
              <p style={{ fontSize: 9, margin: '2px 0 0', color: headerBg === 'white' ? '#6B7280' : 'rgba(255,255,255,0.7)', fontFamily: "'DM Mono', monospace" }}>Multi-Specialty Hospital</p>
            </div>
          </div>
          {/* Bill meta */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 9, color: headerBg === 'white' ? '#9CA3AF' : 'rgba(255,255,255,0.6)', fontFamily: "'DM Mono', monospace", margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>OPD Bill / Tax Invoice</p>
            <p style={{ fontSize: 12, fontWeight: 700, margin: 0, color: headerBg === 'white' ? '#111827' : '#fff', fontFamily: "'DM Mono', monospace" }}>#OPD-2026-0001</p>
          </div>
        </div>
        {/* Contact strip */}
        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          {address && <span style={{ fontSize: 9, color: headerBg === 'white' ? '#6B7280' : 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={9} /> {address}</span>}
          {phone && <span style={{ fontSize: 9, color: headerBg === 'white' ? '#6B7280' : 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={9} /> {phone}</span>}
          {email && <span style={{ fontSize: 9, color: headerBg === 'white' ? '#6B7280' : 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={9} /> {email}</span>}
        </div>
      </div>

      {/* Bill body stub */}
      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {['Billed To', 'Bill Info'].map(lbl => (
            <div key={lbl} style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 12px' }}>
              <p style={{ fontSize: 8, color: '#9CA3AF', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'DM Mono', monospace" }}>{lbl}</p>
              <div style={{ height: 8, background: '#E5E7EB', borderRadius: 4, width: '60%', marginBottom: 4 }} />
              <div style={{ height: 7, background: '#F3F4F6', borderRadius: 4, width: '40%' }} />
            </div>
          ))}
        </div>

        {/* Services table */}
        <div style={{ border: '1px solid #F0F0F0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: '#FAFAFA', padding: '6px 12px', display: 'flex', gap: 12 }}>
            {['Description', 'Qty', 'Rate', 'Amount'].map(h => (
              <span key={h} style={{ fontSize: 8, fontWeight: 700, color: '#9CA3AF', flex: h === 'Description' ? 1 : 0, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'DM Mono', monospace", minWidth: h !== 'Description' ? 32 : undefined }}>{h}</span>
            ))}
          </div>
          {[1, 2].map(i => (
            <div key={i} style={{ padding: '5px 12px', display: 'flex', gap: 12, borderTop: '1px solid #F9FAFB' }}>
              <div style={{ flex: 1, height: 7, background: '#F3F4F6', borderRadius: 4 }} />
              {[32, 32, 32].map((w, j) => <div key={j} style={{ height: 7, background: '#F3F4F6', borderRadius: 4, width: w }} />)}
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: '#111827', borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <span style={{ fontSize: 8, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Grand Total</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: accentColor, fontFamily: "'DM Mono', monospace" }}>₹1,200.00</span>
          </div>
        </div>

        {/* Footer */}
        {footerNote && (
          <p style={{ fontSize: 8, color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic', marginTop: 4, paddingTop: 8, borderTop: '1px dashed #E5E7EB' }}>
            {footerNote}
          </p>
        )}
      </div>
    </div>
  );
};

/* ─── Color Swatch ── */
const ColorSwatch = ({ color, label, selected, onSelect }) => (
  <button
    onClick={() => onSelect(color)}
    title={label}
    style={{
      width: 32, height: 32, borderRadius: '50%', background: color,
      border: selected ? '3px solid #111827' : '3px solid transparent',
      cursor: 'pointer', outline: 'none', boxShadow: selected ? '0 0 0 2px #fff inset' : 'none',
      transition: 'all 0.12s', position: 'relative'
    }}
  >
    {selected && <Check size={13} color="#fff" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />}
  </button>
);

/* ─── Main Settings ── */
const BillingSettings = ({ defaultTab = 'defaults' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState(location.state?.tab || defaultTab);
  const [previewOpen, setPreviewOpen] = useState(true);

  /* ── Billing defaults ── */
  const [settings, setSettings] = useState({ defaultTax: 0, defaultDiscount: 0 });

  /* ── Bill template ── */
  const [template, setTemplate] = useState({
    hospitalName: '',
    address: '',
    phone: '',
    email: '',
    accentColor: '#DC2626',
    headerBg: 'dark',          // 'dark' | 'white' | 'colored'
    logoUrl: '',
    logoText: '',
    showBorderTop: true,
    footerNote: 'Computer generated invoice. No signature required.',
  });

  const ACCENT_COLORS = [
    { color: '#DC2626', label: 'Red' },
    { color: '#2563EB', label: 'Blue' },
    { color: '#16A34A', label: 'Green' },
    { color: '#7C3AED', label: 'Purple' },
    { color: '#EA580C', label: 'Orange' },
    { color: '#0891B2', label: 'Cyan' },
    { color: '#DB2777', label: 'Pink' },
    { color: '#D97706', label: 'Amber' },
    { color: '#111827', label: 'Dark' },
  ];

  const HEADER_STYLES = [
    { value: 'dark', label: 'Dark', desc: 'Black header', preview: '#111827' },
    { value: 'white', label: 'Light', desc: 'White header', preview: '#F9FAFB' },
    { value: 'colored', label: 'Colored', desc: 'Brand color header', preview: 'ACCENT' },
  ];

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setFetching(true);
    try {
      // Load billing defaults
      const res = await billingSettingsApi.getSettings();
      if (res.success) {
        setSettings({
          defaultTax: res.data.defaultTax || 0,
          defaultDiscount: res.data.defaultDiscount || 0,
        });
        // Load template if saved inside billing settings
        if (res.data.billTemplate) {
          setTemplate(prev => ({ ...prev, ...res.data.billTemplate }));
        }
      }
      // Load hospital profile for address/name
      try {
        const profile = await profileApi.getProfile();
        if (profile?.data) {
          const p = profile.data;
          setTemplate(prev => ({
            ...prev,
            hospitalName: p.hospitalName || p.name || '',
            address: [p.address?.addressLine1, p.address?.city, p.address?.state, p.address?.pincode].filter(Boolean).join(', ') || '',
            phone: p.phone || p.mobile || '',
            email: p.email || '',
            logoUrl: prev.logoUrl || p.logoUrl || '',
          }));
        }
      } catch { /* profile not required */ }
    } catch (err) {
      console.error('Settings fetch error:', err);
      showStatus('error', 'Failed to load settings');
    } finally {
      setFetching(false);
    }
  };

  const showStatus = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSaveDefaults = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await billingSettingsApi.updateSettings(settings);
      if (response.success) showStatus('success', 'Default billing settings updated successfully');
    } catch (err) {
      showStatus('error', err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create a clean template object without the locked profile fields
      const { hospitalName, address, phone, email, ...cleanTemplate } = template;
      const payload = { ...settings, billTemplate: cleanTemplate };
      const response = await billingSettingsApi.updateSettings(payload);
      if (response.success) showStatus('success', 'Bill template saved successfully! Branding changes will reflect on all new bills.');
      else showStatus('error', 'Failed to save template');
    } catch (err) {
      showStatus('error', err.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showStatus('error', 'Logo must be under 2MB'); return; }
    try {
      const res = await profileApi.uploadFile(file, 'logo');
      if (res.url || res.data?.url) {
        setTemplate(prev => ({ ...prev, logoUrl: res.url || res.data.url }));
        showStatus('success', 'Logo uploaded successfully');
      }
    } catch (err) {
      // Fallback: use FileReader for local preview
      const reader = new FileReader();
      reader.onload = (ev) => setTemplate(prev => ({ ...prev, logoUrl: ev.target.result }));
      reader.readAsDataURL(file);
      showStatus('success', 'Logo loaded (local preview)');
    }
  };

  const tmpl = (k, v) => setTemplate(prev => ({ ...prev, [k]: v }));

  const inp = `
    width: 100%; padding: 9px 13px; font-size: 13px;
    border: 1px solid #E9ECEF; border-radius: 8px; outline: none;
    background: #FAFAFA; color: #111827;
    font-family: 'DM Sans', sans-serif; box-sizing: border-box;
    transition: border-color 0.15s, background 0.15s;
  `;

  if (fetching) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64vh' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #DC262620', borderTopColor: '#DC2626', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        .bs-inp { ${inp} }
        .bs-inp:focus { border-color: #DC2626 !important; background: #fff !important; }
        .bs-tab { padding: 9px 18px; font-size: 13px; font-weight: 600; border: none; border-radius: 9px; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
        .bs-tab.active { background: #111827; color: #fff; }
        .bs-tab:not(.active) { background: transparent; color: #6B7280; }
        .bs-tab:not(.active):hover { background: #F3F4F6; color: #111827; }
        .hdr-opt { padding: 12px 16px; border-radius: 10px; border: 2px solid #E5E7EB; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.15s; background: #fff; }
        .hdr-opt.selected { border-color: #111827; background: #F9FAFB; }
      `}</style>

      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 0 40px', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, border: '1px solid #E5E7EB', borderRadius: 9, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Billing Settings</h1>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>Configure defaults and bill template for OPD invoices</p>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#F3F4F6', padding: 4, borderRadius: 12 }}>
            {[{ id: 'defaults', label: 'Defaults', icon: Calculator }, { id: 'template', label: 'Bill Template', icon: LayoutTemplate }].map(({ id, label, icon: Icon }) => (
              <button key={id} className={`bs-tab${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Status message */}
        {message.text && (
          <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${message.type === 'success' ? '#86EFAC' : '#FECACA'}` }}>
            {message.type === 'success' ? <CheckCircle size={16} color="#16A34A" /> : <AlertCircle size={16} color="#DC2626" />}
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: message.type === 'success' ? '#166534' : '#991B1B' }}>{message.text}</p>
          </div>
        )}

        {/* ── TAB: DEFAULTS ── */}
        {activeTab === 'defaults' && (
          <form onSubmit={handleSaveDefaults}>
            <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Receipt size={18} color="#DC2626" />
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Default Billing Values</h2>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>Pre-filled when creating any new OPD bill</p>
                </div>
              </div>
              <div style={{ padding: '28px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'DM Mono', monospace" }}>Default Tax (%)</label>
                  <div style={{ position: 'relative' }}>
                    <Percent size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 11 }} />
                    <input type="number" step="0.01" min="0" max="100" value={settings.defaultTax} onChange={e => setSettings({ ...settings, defaultTax: e.target.value })} className="bs-inp" style={{ paddingLeft: 36 }} placeholder="0.00" />
                  </div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}><Info size={11} /> Applied to subtotal of services</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'DM Mono', monospace" }}>Default Discount (₹)</label>
                  <div style={{ position: 'relative' }}>
                    <Calculator size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 11 }} />
                    <input type="number" min="0" value={settings.defaultDiscount} onChange={e => setSettings({ ...settings, defaultDiscount: e.target.value })} className="bs-inp" style={{ paddingLeft: 36 }} placeholder="0" />
                  </div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}><Info size={11} /> Numerical deduction from final bill</p>
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid #F0F0F0', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', border: 'none', borderRadius: 10, background: loading ? '#D1D5DB' : '#DC2626', color: '#fff', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  {loading ? <div style={{ width: 14, height: 14, border: '2px solid #fff4', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <Save size={14} />}
                  {loading ? 'Saving…' : 'Update Defaults'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 16, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Info size={16} color="#92400E" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
                Changing defaults only affects <strong>newly created bills</strong>. Previously generated bills remain unchanged. Staff can still manually adjust values per bill.
              </p>
            </div>
          </form>
        )}

        {/* ── TAB: TEMPLATE ── */}
        {activeTab === 'template' && (
          <form onSubmit={handleSaveTemplate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'flex-start' }}>

              {/* Left: Settings Panels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Hospital Info */}
                <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 22px', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Building size={16} color="#DC2626" />
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Hospital Information</h3>
                    <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: "'DM Mono', monospace", marginLeft: 4 }}>Pulled from profile — edit here to override on bill</span>
                  </div>
                  <div style={{ padding: '20px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>Hospital Name</label>
                      <input className="bs-inp" type="text" value={template.hospitalName} readOnly style={{ background: '#F3F4F6', cursor: 'not-allowed', color: '#6B7280' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>Address</label>
                      <input className="bs-inp" type="text" value={template.address} readOnly style={{ background: '#F3F4F6', cursor: 'not-allowed', color: '#6B7280' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>Phone</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={13} color="#9CA3AF" style={{ position: 'absolute', left: 11, top: 10 }} />
                        <input className="bs-inp" type="tel" value={template.phone} readOnly style={{ paddingLeft: 30, background: '#F3F4F6', cursor: 'not-allowed', color: '#6B7280' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>Email</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={13} color="#9CA3AF" style={{ position: 'absolute', left: 11, top: 10 }} />
                        <input className="bs-inp" type="email" value={template.email} readOnly style={{ paddingLeft: 30, background: '#F3F4F6', cursor: 'not-allowed', color: '#6B7280' }} />
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                      <p style={{ fontSize: 11, color: '#DC2626', margin: 0, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                        <Info size={12} /> These details are locked to your Hospital Profile.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 22px', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Image size={16} color="#DC2626" />
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Hospital Logo</h3>
                  </div>
                  <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 20 }}>
                    {/* Preview */}
                    <div style={{ width: 72, height: 72, border: '2px dashed #E5E7EB', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#FAFAFA', flexShrink: 0 }}>
                      {template.logoUrl ? (
                        <img src={template.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <Image size={24} color="#D1D5DB" />
                      )}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                      <button type="button" onClick={() => logoInputRef.current.click()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', border: '1px solid #E5E7EB', borderRadius: 9, background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: 'fit-content' }}>
                        <Upload size={14} /> Upload Logo
                      </button>
                      {template.logoUrl && (
                        <button type="button" onClick={() => tmpl('logoUrl', '')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid #FECACA', borderRadius: 9, background: '#FEF2F2', fontSize: 12, fontWeight: 600, color: '#DC2626', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: 'fit-content' }}>
                          <X size={12} /> Remove Logo
                        </button>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>Logo Text (if no image)</label>
                        <input className="bs-inp" type="text" value={template.logoText} onChange={e => tmpl('logoText', e.target.value)} placeholder="H+" style={{ width: 80 }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color & Style */}
                <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 22px', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Palette size={16} color="#DC2626" />
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Color & Style</h3>
                  </div>
                  <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Accent color */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'DM Mono', monospace", display: 'block', marginBottom: 12 }}>Accent / Brand Color</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        {ACCENT_COLORS.map(ac => (
                          <ColorSwatch key={ac.color} color={ac.color} label={ac.label} selected={template.accentColor === ac.color} onSelect={(c) => tmpl('accentColor', c)} />
                        ))}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
                          <label style={{ fontSize: 11, color: '#6B7280', fontFamily: "'DM Mono', monospace" }}>Custom:</label>
                          <input type="color" value={template.accentColor} onChange={e => tmpl('accentColor', e.target.value)}
                            style={{ width: 36, height: 36, border: '2px solid #E5E7EB', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'none' }} />
                        </div>
                      </div>
                    </div>

                    {/* Header style */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'DM Mono', monospace", display: 'block', marginBottom: 12 }}>Bill Header Style</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {HEADER_STYLES.map(hs => (
                          <button
                            key={hs.value}
                            type="button"
                            className={`hdr-opt${template.headerBg === hs.value ? ' selected' : ''}`}
                            onClick={() => tmpl('headerBg', hs.value)}
                          >
                            <div style={{ width: 52, height: 28, borderRadius: 6, background: hs.preview === 'ACCENT' ? template.accentColor : hs.preview, border: '1px solid #E5E7EB' }} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', fontFamily: "'DM Sans', sans-serif" }}>{hs.label}</span>
                            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{hs.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'DM Mono', monospace" }}>Options</label>
                      {[
                        { key: 'showBorderTop', label: 'Show colored top border on bill' },
                      ].map(({ key, label }) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                          <div
                            onClick={() => tmpl(key, !template[key])}
                            style={{
                              width: 38, height: 22, borderRadius: 99,
                              background: template[key] ? template.accentColor : '#D1D5DB',
                              position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                            }}
                          >
                            <div style={{
                              width: 16, height: 16, borderRadius: '50%', background: '#fff',
                              position: 'absolute', top: 3, left: template[key] ? 19 : 3,
                              transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                            }} />
                          </div>
                          <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 22px', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileText size={16} color="#DC2626" />
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Footer Note</h3>
                  </div>
                  <div style={{ padding: '20px 22px' }}>
                    <textarea
                      className="bs-inp"
                      rows="2"
                      value={template.footerNote}
                      onChange={e => tmpl('footerNote', e.target.value)}
                      placeholder="Computer generated invoice. No signature required."
                      style={{ resize: 'vertical', fontFamily: "'DM Sans', sans-serif" }}
                    />
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}><Info size={11} /> Appears at the bottom of every bill</p>
                  </div>
                </div>

                {/* Save button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', border: 'none', borderRadius: 11, background: loading ? '#D1D5DB' : '#111827', color: '#fff', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: loading ? 'none' : '0 4px 12px rgba(0,0,0,0.15)' }}>
                    {loading ? <div style={{ width: 15, height: 15, border: '2px solid #fff4', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <Save size={15} />}
                    {loading ? 'Saving Template…' : 'Save Bill Template'}
                  </button>
                </div>
              </div>

              {/* Right: Live Preview */}
              <div style={{ position: 'sticky', top: 20 }}>
                <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Eye size={15} color="#DC2626" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Live Preview</span>
                    </div>
                    <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: "'DM Mono', monospace" }}>Updates instantly</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <BillPreview template={template} />
                  </div>
                  <div style={{ padding: '10px 16px', borderTop: '1px solid #F0F0F0', background: '#FAFAFA' }}>
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Mono', monospace" }}>
                      <Printer size={12} /> This is how your printed bill will look
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default BillingSettings;
