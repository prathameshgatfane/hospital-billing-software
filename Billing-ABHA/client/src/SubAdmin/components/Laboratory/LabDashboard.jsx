import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileImage, FileText, User as UserIcon, ChevronRight } from 'lucide-react';
import patientApi from '../../API/patientApi';

/* ─── helpers ─────────────────────────────────────────────────────────── */
const init = (f = '', l = '') => `${f[0] ?? ''}${l[0] ?? ''}`.toUpperCase();

const AVATAR_PALETTES = [
  ['#FEE2E2', '#991B1B'], ['#DBEAFE', '#1D4ED8'], ['#D1FAE5', '#065F46'],
  ['#EDE9FE', '#5B21B6'], ['#FEF3C7', '#92400E'], ['#FCE7F3', '#9D174D'],
];

export const Avatar = ({ first, last, size = 34 }) => {
  const [bg, fg] = AVATAR_PALETTES[((first?.charCodeAt(0) ?? 0) + (last?.charCodeAt(0) ?? 0)) % AVATAR_PALETTES.length];
  return (
    <div style={{
      width: size, height: size, fontSize: size * 0.36, background: bg, color: fg,
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, flexShrink: 0, letterSpacing: '0.03em', userSelect: 'none',
      fontFamily: "'DM Mono', monospace",
    }}>
      {init(first, last)}
    </div>
  );
};

const PageBtn = ({ label, icon, active, disabled, onClick }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 7, border: active ? 'none' : '1px solid #E5E7EB',
    background: active ? '#4F46E5' : 'transparent', color: active ? '#fff' : '#6B7280',
    fontSize: 12, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.35 : 1, fontFamily: "'DM Mono', monospace",
  }}>{icon ?? label}</button>
);

const LabDashboard = ({ staffBasePath } = {}) => {
  const navigate = useNavigate();
  const basePath = staffBasePath || '/subadmin/reception/laboratory';
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [search, setSearch] = useState('');

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [search, pagination.page]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientApi.getPatients({
        page: pagination.page,
        limit: pagination.limit,
        search
      });
      if (response.success) {
        setPatients(response.data || []);
        if (response.pagination) {
          setPagination(p => ({ ...p, ...response.pagination, total: response.total || response.pagination.total }));
        } else {
           setPagination(p => ({ ...p, total: response.total }));
        }
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, background: '#EEF2FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileImage size={24} color="#4F46E5" />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Laboratory Reports</h1>
                <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 3, marginBottom: 0 }}>Manage, upload and view patient medical documents</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Select Patient</h2>
            <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 400 }}>
              <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                type="text" 
                placeholder="Search by name, ID or mobile..." 
                value={search} 
                onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }} 
                style={{ 
                  width: '100%', padding: '10px 14px 10px 36px', fontSize: 13, border: '1px solid #E9ECEF', 
                  borderRadius: 10, outline: 'none', background: '#FAFAFA', color: '#111827', 
                  fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' 
                }} 
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                  {['Patient Info', 'Contact', ''].map(col => (
                    <th key={col} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                      {[40, 30, 20].map((w, j) => (
                        <td key={j} style={{ padding: '14px 20px' }}>
                          <div style={{ height: 13, background: '#F3F4F6', borderRadius: 6, width: `${w}%`, animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: `${i * 0.07}s` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : patients.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '64px 20px', color: '#9CA3AF' }}>No patients found.</td></tr>
                ) : (
                  patients.map(row => {
                    const rowHover = { background: '#FAFAFA' };
                    return (
                       <tr 
                         key={row._id} 
                         onClick={() => navigate(`${basePath}/patient/${row._id}`)}
                         style={{ borderBottom: '1px solid #F9FAFB', cursor: 'pointer', background: '#fff', transition: 'background 0.1s' }}
                         onMouseEnter={e => Object.assign(e.currentTarget.style, rowHover)}
                         onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                       >
                         <td style={{ padding: '14px 20px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                             <Avatar first={row.firstName} last={row.lastName} size={38} />
                             <div>
                               <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: 14 }}>{row.firstName} {row.lastName}</p>
                               <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', fontFamily: "'DM Mono', monospace" }}>{row.patientId}</p>
                             </div>
                           </div>
                         </td>
                         <td style={{ padding: '14px 20px' }}>
                           <p style={{ fontWeight: 500, color: '#374151', margin: 0, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{row.mobile || '—'}</p>
                         </td>
                         <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                           <button onClick={(e) => { e.stopPropagation(); navigate(`${basePath}/patient/${row._id}`); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#4F46E5', background: '#EEF2FF', padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                             Open Portal <ChevronRight size={15} />
                           </button>
                         </td>
                       </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination block */}
            {!loading && patients.length > 0 && pagination.total > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: "'DM Mono', monospace" }}>
                  {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} patients
                </span>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <PageBtn icon={<ChevronRight size={13} style={{ transform: 'rotate(180deg)' }} />} disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} />
                  {Array.from({ length: Math.min(pagination.pages || Math.ceil(pagination.total / pagination.limit), 7) }, (_, i) => i + 1).map(p => (
                    <PageBtn key={p} label={p} active={p === pagination.page} onClick={() => setPagination(prev => ({ ...prev, page: p }))} />
                  ))}
                  <PageBtn icon={<ChevronRight size={13} />} disabled={pagination.page === (pagination.pages || Math.ceil(pagination.total / pagination.limit))} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default LabDashboard;
