import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bed, UserPlus, Search, 
  Activity, User as UserIcon, 
  ChevronRight, Calendar
} from 'lucide-react';
import ipdApi from '../../API/ipdApi';

/* ─── helpers ─────────────────────────────────────────────────────────── */
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
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

const StatCard = ({ label, value, sub, accent, icon: Icon }) => (
  <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: accent, borderRadius: '14px 0 0 14px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 6, marginTop: 0 }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 700, color: '#111827', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1, margin: 0 }}>{value}</p>
      </div>
      {Icon && <div style={{ background: `${accent}15`, color: accent, padding: 8, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={20} /></div>}
    </div>
    {sub && <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 10, marginBottom: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{sub}</p>}
  </div>
);

const IpdDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'discharged'
  const [activeAdmissions, setActiveAdmissions] = useState([]);
  const [dischargedAdmissions, setDischargedAdmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { 
    fetchActiveAdmissions();
    fetchDischargedAdmissions();
  }, []);

  const fetchActiveAdmissions = async () => {
    setLoading(true);
    try {
      const response = await ipdApi.getActiveAdmissions();
      if (response.success) setActiveAdmissions(response.data || []);
    } catch (error) { console.error('Error fetching active admissions:', error); } 
    finally { setLoading(false); }
  };

  const fetchDischargedAdmissions = async () => {
    setLoading(true);
    try {
      const response = await ipdApi.getDischargedAdmissions();
      if (response.success) setDischargedAdmissions(response.data || []);
    } catch (error) { console.error('Error fetching discharged admissions:', error); } 
    finally { setLoading(false); }
  };

  const currentList = activeTab === 'active' ? activeAdmissions : dischargedAdmissions;

  const filteredAdmissions = currentList.filter(a => {
    const q = searchQuery.toLowerCase();
    return (a.patientId?.firstName?.toLowerCase().includes(q)) ||
           (a.patientId?.lastName?.toLowerCase().includes(q)) ||
           (a.patientId?.patientId?.toLowerCase().includes(q));
  });

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
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>IPD Management</h1>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 3, marginBottom: 0 }}>Manage hospital admissions, daily treatments, and discharges</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => navigate('/subadmin/reception/ipd/admit')} 
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', 
                  fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 9, 
                  background: '#DC2626', color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" 
                }}
              >
                <UserPlus size={14} /> Admit New Patient
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            <StatCard 
              label="Active Admissions" 
              value={activeTab === 'active' ? activeAdmissions.length.toString() : '--'} 
              sub="Currently admitted in wards" 
              accent="#DC2626" 
              icon={Bed} 
            />
            <StatCard 
              label="Discharged Patients" 
              value={dischargedAdmissions.length.toString()} 
              sub="Total past admissions" 
              accent="#2563EB" 
              icon={UserIcon} 
            />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #E5E7EB' }}>
            <button 
              onClick={() => { setActiveTab('active'); setSearchQuery(''); }} 
              style={{ 
                padding: '10px 18px', fontSize: 13, fontWeight: 600, border: 'none', 
                borderBottom: `2px solid ${activeTab === 'active' ? '#DC2626' : 'transparent'}`, 
                background: 'transparent', color: activeTab === 'active' ? '#DC2626' : '#6B7280', 
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.15s' 
              }}
            >
              Active Admissions
            </button>
            <button 
              onClick={() => { setActiveTab('discharged'); setSearchQuery(''); }} 
              style={{ 
                padding: '10px 18px', fontSize: 13, fontWeight: 600, border: 'none', 
                borderBottom: `2px solid ${activeTab === 'discharged' ? '#DC2626' : 'transparent'}`, 
                background: 'transparent', color: activeTab === 'discharged' ? '#DC2626' : '#6B7280', 
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.15s' 
              }}
            >
              Discharged/Inactive
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                type="text" 
                placeholder="Search patients by name or ID..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                style={{ 
                  width: '100%', padding: '8px 12px 8px 32px', fontSize: 13, border: '1px solid #E9ECEF', 
                  borderRadius: 8, outline: 'none', background: '#FAFAFA', color: '#111827', 
                  fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' 
                }} 
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>
                {activeTab === 'active' ? 'Currently Admitted' : 'Past Admissions'}
              </h2>
              {activeTab === 'active' ? (
                <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>LIVE</span>
              ) : (
                <span style={{ background: '#F3F4F6', color: '#6B7280', padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>INACTIVE</span>
              )}
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                  {['Patient', 'Admission Info', activeTab === 'active' ? 'Admitted On' : 'Discharged On', 'Doctor', ''].map(col => (
                    <th key={col} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                      {[40, 30, 20, 20, 10].map((w, j) => (
                        <td key={j} style={{ padding: '14px 16px' }}>
                          <div style={{ height: 13, background: '#F3F4F6', borderRadius: 6, width: `${w}%`, animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: `${i * 0.07}s` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredAdmissions.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '54px 16px', color: '#9CA3AF' }}>No {activeTab} admissions found.</td></tr>
                ) : (
                  filteredAdmissions.map(adm => {
                    const rowHover = { background: '#FAFAFA' };
                    return (
                       <tr 
                         key={adm._id} 
                         onClick={() => navigate(`/subadmin/reception/ipd/stay/${adm._id}`)}
                         style={{ borderBottom: '1px solid #F9FAFB', cursor: 'pointer', background: '#fff', transition: 'background 0.1s' }}
                         onMouseEnter={e => Object.assign(e.currentTarget.style, rowHover)}
                         onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                       >
                         <td style={{ padding: '12px 16px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                             <Avatar first={adm.patientId?.firstName} last={adm.patientId?.lastName} size={34} />
                             <div>
                               <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: 13 }}>{adm.patientId?.firstName} {adm.patientId?.lastName}</p>
                               <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0', fontFamily: "'DM Mono', monospace" }}>{adm.patientId?.patientId}</p>
                             </div>
                           </div>
                         </td>
                         <td style={{ padding: '12px 16px' }}>
                           <p style={{ fontWeight: 600, color: '#374151', margin: 0, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{adm.ward || 'General'}</p>
                           <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>Bed: {adm.bedNumber}</p>
                         </td>
                         <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', fontFamily: "'DM Mono', monospace" }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                             <Calendar size={13} color="#9CA3AF" /> {fmt(activeTab === 'active' ? adm.admissionDate : (adm.dischargeDate || adm.updatedAt))}
                           </div>
                         </td>
                         <td style={{ padding: '12px 16px' }}>
                           <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', margin: 0 }}>{adm.doctorInCharge?.fullName ? `Dr. ${adm.doctorInCharge.fullName}` : 'Assigned soon'}</p>
                         </td>
                         <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                           <button 
                             onClick={(e) => { e.stopPropagation(); navigate(`/subadmin/reception/ipd/stay/${adm._id}`); }} 
                             style={{ 
                               display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, 
                               color: activeTab === 'active' ? '#DC2626' : '#2563EB', 
                               background: activeTab === 'active' ? '#FEF2F2' : '#EFF6FF', 
                               padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" 
                             }}
                            >
                             {activeTab === 'active' ? 'Manage' : 'View'} <ChevronRight size={14} />
                           </button>
                         </td>
                       </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

export default IpdDashboard;
