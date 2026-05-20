// PatientsDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, Search, Download, BarChart3,
  UserCheck, Edit, ChevronLeft, ChevronRight,
} from 'lucide-react';
import patientApi from '../../API/patientApi';
import { useAuth } from '../../../Common/context/AuthContext';
import SearchFilters from '../Common/SearchFilters';

/* ─── helpers ─────────────────────────────────────────────────────────── */
const calcAge = (dob) => {
  if (!dob) return 'N/A';
  const b = new Date(dob), t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
  return age;
};

const initials = (first = '', last = '') =>
  `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();

const CONTENT_TYPES = {
  csv: 'text/csv',
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
};

const AVATAR_PALETTES = [
  ['#FEE2E2', '#991B1B'], ['#DBEAFE', '#1D4ED8'], ['#D1FAE5', '#065F46'],
  ['#EDE9FE', '#5B21B6'], ['#FEF3C7', '#92400E'], ['#FCE7F3', '#9D174D'],
];

/* ─── Shared Sub-components ───────────────────────────────────────────── */
export const Avatar = ({ first, last, size = 34 }) => {
  const [bg, fg] = AVATAR_PALETTES[((first?.charCodeAt(0) ?? 0) + (last?.charCodeAt(0) ?? 0)) % AVATAR_PALETTES.length];
  return (
    <div style={{
      width: size, height: size, fontSize: size * 0.36, background: bg, color: fg,
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, flexShrink: 0, letterSpacing: '0.03em', userSelect: 'none',
      fontFamily: "'DM Mono', monospace",
    }}>
      {initials(first, last)}
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const s = {
    Active: { background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0' },
    Inactive: { background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' },
    Deceased: { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
    Transferred: { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' },
  }[status] ?? { background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' };
  return (
    <span style={{ ...s, padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
      {status}
    </span>
  );
};

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: accent, borderRadius: '14px 0 0 14px' }} />
    <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 6, marginTop: 0 }}>{label}</p>
    <p style={{ fontSize: 26, fontWeight: 700, color: '#111827', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1, margin: 0 }}>{value}</p>
    {sub && <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 5, marginBottom: 0, fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>}
  </div>
);

const ActionBtn = ({ label, color, bg, border, onClick }) => (
  <button onClick={onClick} style={{
    padding: '4px 10px', fontSize: 11, fontWeight: 600, background: bg, color,
    border: `1px solid ${border}`, borderRadius: 7, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  }}>{label}</button>
);

const PageBtn = ({ label, icon, active, disabled, onClick }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 7, border: active ? 'none' : '1px solid #E5E7EB',
    background: active ? '#DC2626' : 'transparent', color: active ? '#fff' : '#6B7280',
    fontSize: 12, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.35 : 1, fontFamily: "'DM Mono', monospace",
  }}>{icon ?? label}</button>
);

/* ─── PatientRow ──────────────────────────────────────────────────────── */
const PatientRow = ({ row, onView, onBill, onEdit }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onClick={onView}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: '1px solid #F9FAFB', cursor: 'pointer', background: hovered ? '#FAFAFA' : '#fff', transition: 'background 0.1s' }}
    >
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar first={row.firstName} last={row.lastName} />
          <div>
            <p style={{ fontWeight: 600, color: hovered ? '#DC2626' : '#111827', margin: 0, fontSize: 13, transition: 'color 0.15s' }}>
              {row.firstName} {row.lastName}
            </p>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0', fontFamily: "'DM Mono', monospace" }}>{row.patientId}</p>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{row.mobile ?? '—'}</p>
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>{row.email ?? '—'}</p>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0, fontFamily: "'DM Mono', monospace" }}>{row.bloodGroup ?? '—'}</p>
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>{row.gender} · {calcAge(row.dateOfBirth)} yrs</p>
      </td>
      <td style={{ padding: '12px 16px' }}><StatusBadge status={row.status} /></td>
      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <ActionBtn label="View" color="#2563EB" bg="#EFF6FF" border="#BFDBFE" onClick={onView} />
          <ActionBtn label="Bill" color="#16A34A" bg="#F0FDF4" border="#BBF7D0" onClick={onBill} />
          <button onClick={onEdit} title="Edit" style={{
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #E5E7EB', borderRadius: 7, background: 'transparent', cursor: 'pointer',
          }}><Edit size={13} color="#9CA3AF" /></button>
        </div>
      </td>
    </tr>
  );
};

/* ─── Main Dashboard ──────────────────────────────────────────────────── */
const PatientsDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await patientApi.getPatients({ page: pagination.page, limit: pagination.limit, search: searchQuery, ...selectedFilters });
      if (res.success) { setPatients(res.data ?? []); setPagination(p => ({ ...p, ...(res.pagination ?? {}) })); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [pagination.page, pagination.limit, searchQuery, selectedFilters]);

  const fetchStats = useCallback(async () => {
    try { const res = await patientApi.getStats(); if (res.success) setStats(res.data); }
    catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSearch = (q) => { setSearchQuery(q); setPagination(p => ({ ...p, page: 1 })); };
  const handleFilterChange = (f) => { setSelectedFilters(f); setPagination(p => ({ ...p, page: 1 })); };
  const handleExport = async (format) => {
    try {
      const res = await patientApi.exportPatients(format, selectedFilters);
      if (!res) return;
      const url = window.URL.createObjectURL(new Blob([res], { type: CONTENT_TYPES[format] }));
      const a = Object.assign(document.createElement('a'), { href: url, download: `patients_${Date.now()}.${format}` });
      document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); document.body.removeChild(a);
    } catch (err) { console.error(err); }
  };

  const maleCount = stats?.genderDistribution?.find(g => g._id === 'male')?.count ?? 0;
  const femaleCount = stats?.genderDistribution?.find(g => g._id === 'female')?.count ?? 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Patient Management</h1>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 3, marginBottom: 0 }}>Manage all patient records and information</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleExport('csv')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 13, fontWeight: 500, border: '1px solid #E5E7EB', borderRadius: 9, background: '#fff', color: '#374151', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                <Download size={14} /> Export
              </button>
              <button onClick={() => navigate('/subadmin/patients/register')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 9, background: '#DC2626', color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                <UserPlus size={14} /> Add Patient
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <StatCard label="Total Patients" value={stats.total} sub={`+${stats.new ?? 0} this month`} accent="#DC2626" />
              <StatCard label="Active Patients" value={stats.active} sub={`${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}% of total`} accent="#16A34A" />
              <StatCard label="Gender Split" value={`${maleCount}M / ${femaleCount}F`} sub="male · female" accent="#2563EB" />
              <StatCard label="Average Age" value="42 yrs" sub="across all patients" accent="#7C3AED" />
            </div>
          )}

          {/* Search */}
          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input type="text" placeholder="Search by name, ID, phone, or email…" value={searchQuery} onChange={e => handleSearch(e.target.value)} style={{ width: '100%', padding: '8px 12px 8px 32px', fontSize: 13, border: '1px solid #E9ECEF', borderRadius: 8, outline: 'none', background: '#FAFAFA', color: '#111827', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }} />
            </div>
            <SearchFilters
              filters={[
                { key: 'gender', label: 'Gender', options: ['Male', 'Female', 'Other'].map(v => ({ value: v, label: v })) },
                { key: 'bloodGroup', label: 'Blood Group', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(v => ({ value: v, label: v })) },
                { key: 'status', label: 'Status', options: ['Active', 'Inactive', 'Deceased', 'Transferred'].map(v => ({ value: v, label: v })) },
              ]}
              onFilterChange={handleFilterChange}
            />
            <button onClick={() => navigate('/subadmin/reception/opd/stats')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', fontSize: 13, fontWeight: 500, border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', color: '#6B7280', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              <BarChart3 size={14} /> Stats
            </button>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                  {['Patient', 'Contact', 'Medical Info', 'Status', 'Actions'].map(col => (
                    <th key={col} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 13, fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 7 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                      {[70, 55, 45, 30, 60].map((w, j) => (
                        <td key={j} style={{ padding: '14px 16px' }}>
                          <div style={{ height: 13, background: '#F3F4F6', borderRadius: 6, width: `${w}%`, animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: `${i * 0.07}s` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                  : patients.length === 0
                    ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '64px 16px', color: '#9CA3AF', fontSize: 16 }}>No patients found. Add your first patient to get started.</td></tr>
                    : patients.map(row => (
                      <PatientRow
                        key={row._id} row={row}
                        onView={() => navigate(`/subadmin/patients/view/${row._id}`)}
                        onBill={() => navigate('/subadmin/reception/opd/billing/create', { state: { patientId: row._id } })}
                        onEdit={() => navigate(`/subadmin/patients/edit/${row._id}`)}
                      />
                    ))
                }
              </tbody>
            </table>

            {!loading && patients.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', borderTop: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: "'DM Mono', monospace" }}>
                  {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} patients
                </span>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <PageBtn icon={<ChevronLeft size={13} />} disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} />
                  {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                    <PageBtn key={p} label={p} active={p === pagination.page} onClick={() => setPagination(prev => ({ ...prev, page: p }))} />
                  ))}
                  <PageBtn icon={<ChevronRight size={13} />} disabled={pagination.page === pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} />
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { to: '/subadmin/reception/opd/check-duplicate', icon: <UserCheck size={16} color="#2563EB" />, bg: '#EFF6FF', title: 'Check Duplicate', desc: 'Verify before registration' },
              { to: '/subadmin/reception/opd/export', icon: <Download size={16} color="#16A34A" />, bg: '#F0FDF4', title: 'Bulk Export', desc: 'CSV, Excel, or PDF format' },
              { to: '/subadmin/reception/opd/search', icon: <Search size={16} color="#7C3AED" />, bg: '#F5F3FF', title: 'Advanced Search', desc: 'Filter by advanced criteria' },
            ].map(({ to, icon, bg, title, desc }) => (
              <button key={title} onClick={() => navigate(to)} style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#F0F0F0'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 34, height: 34, background: bg, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{icon}</div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>{title}</p>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{desc}</p>
              </button>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default PatientsDashboard;