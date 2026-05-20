import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt, Plus, History, Settings,
  Search, Calculator, Wallet, ArrowRight,
  User as UserIcon, ChevronRight, UserPlus, Users
} from 'lucide-react';
import opdBillingApi from '../../API/opdBillingApi';
import patientApi from '../../API/patientApi';

/* ─── helpers ─────────────────────────────────────────────────────────── */
const cur = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
const init = (f = '', l = '') => `${f[0] ?? ''}${l[0] ?? ''}`.toUpperCase();

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
      {init(first, last)}
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const s = {
    Paid: { background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0' },
    Pending: { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' },
    Partial: { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' },
    Unpaid: { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
  }[status] ?? { background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' };
  return (
    <span style={{ ...s, padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
      {status}
    </span>
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
      {Icon && <div style={{ background: `${accent}15`, color: accent, padding: 8, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={18} /></div>}
    </div>
    {sub && <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 10, marginBottom: 0, fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>}
  </div>
);

/* ─── Main Dashboard ──────────────────────────────────────────────────── */
const OpdBillingDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recentBills, setRecentBills] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCollections: 0,
    totalBills: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetchDashboardData();
    fetchRecentPatients();
  }, []);

  const fetchRecentPatients = async () => {
    setPatientsLoading(true);
    try {
      const res = await patientApi.getPatients({ page: 1, limit: 5, sort: '-createdAt' });
      if (res.success) setRecentPatients(res.data || []);
    } catch (err) {
      console.error('Failed to fetch recent patients:', err);
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch recent transactions
      const recentResponse = await opdBillingApi.getBills({ page: 1, limit: 5 });
      if (recentResponse.success) {
        setRecentBills(recentResponse.data);
      }

      // 2. Fetch overall bills for stats
      const statsResponse = await opdBillingApi.getBills({ limit: 500 });
      if (statsResponse.success) {
        const allBills = statsResponse.data;
        let collections = 0;
        let pending = 0;

        allBills.forEach(bill => {
          if (bill.paymentStatus === 'Paid') {
            collections += bill.totalAmount;
          } else if (bill.paymentStatus === 'Pending' || bill.paymentStatus === 'Partial' || bill.paymentStatus === 'Unpaid') {
            pending += bill.totalAmount;
          }
        });

        setStats({
          totalCollections: collections,
          totalBills: statsResponse.total || allBills.length,
          pendingPayments: pending
        });
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* After registration → open billing with patient pre-selected (Now handled in RegisterPatient.jsx) */
  const handleRegisterPatient = () => {
    navigate('/subadmin/patients/register', { state: { fromOpdBilling: true } });
  };

  const quickActions = [
    {
      title: "Register Patient",
      description: "Register new patient & start billing",
      icon: UserPlus,
      action: handleRegisterPatient,
      color: "#7C3AED", bg: "#F5F3FF"
    },
    {
      title: "New Bill",
      description: "Generate a new OPD bill for a patient",
      icon: Plus,
      path: "/subadmin/reception/opd/billing/create",
      color: "#DC2626", bg: "#FEF2F2"
    },
    {
      title: "Billing History",
      description: "View and manage previous bills",
      icon: History,
      path: "/subadmin/reception/opd/billing/history",
      color: "#2563EB", bg: "#EFF6FF"
    },
    {
      title: "Manage Services",
      description: "Configure OPD services and prices",
      icon: Settings,
      path: "/subadmin/reception/opd/services",
      color: "#16A34A", bg: "#F0FDF4"
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to { transform: rotate(360deg) } }
        
        .db-grid { display: grid; grid-template-columns: minmax(300px, 1fr) 2.5fr; gap: 16px; align-items: start; }
        .db-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
        
        @media (max-width: 1024px) {
          .db-grid { grid-template-columns: 1fr; }
          .db-container { padding: 12px !important; }
        }
        @media (max-width: 640px) {
          .db-header { flex-direction: column; align-items: flex-start !important; }
          .db-btn-group { width: 100%; margin-top: 10px; }
          .db-btn-group button { flex: 1; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif" }}>
        <div className="db-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Header */}
          <div className="db-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>OPD Billing Dashboard</h1>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 3, marginBottom: 0 }}>Manage billing, payments, and services for OPD patients</p>
            </div>
            <div className="db-btn-group" style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleRegisterPatient}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 9, background: '#7C3AED', color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                <UserPlus size={14} /> Register Patient
              </button>
              <button onClick={() => navigate('/subadmin/reception/opd/billing/create')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 9, background: '#DC2626', color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                <Plus size={14} /> New Bill
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="db-stats">
            <StatCard
              label="Total Collections"
              value={cur(stats.totalCollections)}
              sub="Calculated from paid bills"
              accent="#DC2626"
              icon={Wallet}
            />
            <StatCard
              label="Total Bills"
              value={stats.totalBills.toString()}
              sub="Total invoices generated"
              accent="#2563EB"
              icon={Receipt}
            />
            <StatCard
              label="Pending Payments"
              value={cur(stats.pendingPayments)}
              sub="Outstanding amount"
              accent="#EA580C"
              icon={Calculator}
            />
          </div>

          <div className="db-grid">
            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Quick Actions</h2>
              {quickActions.map(({ title, description, icon: Icon, path, action, color, bg }) => (
                <button
                  key={title}
                  onClick={() => action ? action() : navigate(path)}
                  style={{
                    background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14,
                    padding: '16px 18px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 2px 8px ${color}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#F0F0F0'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 42, height: 42, background: bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 3px' }}>{title}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{description}</p>
                  </div>
                  <ArrowRight size={14} color="#D1D5DB" />
                </button>
              ))}
            </div>

            {/* Right Columns */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Recent Registrations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 4 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Users size={16} color="#7C3AED" /> Recent Registrations
                  </h2>
                  <button
                    onClick={() => navigate('/subadmin/patients')}
                    style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    View All
                  </button>
                </div>

                <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                        {['Patient', 'ID', 'Gender', 'Registered', 'Action'].map(col => (
                          <th key={col} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {patientsLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                            {[35, 20, 15, 20, 10].map((w, j) => (
                              <td key={j} style={{ padding: '14px 16px' }}>
                                <div style={{ height: 13, background: '#F3F4F6', borderRadius: 6, width: `${w}%`, animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: `${i * 0.07}s` }} />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : recentPatients.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px 16px', color: '#9CA3AF' }}>No patients registered yet.</td></tr>
                      ) : (
                        recentPatients.map(p => (
                          <tr
                            key={p._id}
                            style={{ borderBottom: '1px solid #F9FAFB', background: '#fff', transition: 'background 0.1s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                          >
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Avatar first={p.firstName} last={p.lastName} size={32} />
                                <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: 13 }}>{p.firstName} {p.lastName}</p>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 11, color: '#9CA3AF', fontFamily: "'DM Mono', monospace" }}>{p.patientId}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, color: '#374151' }}>{p.gender || '—'}</td>
                            <td style={{ padding: '12px 16px', fontSize: 11, color: '#9CA3AF', fontFamily: "'DM Mono', monospace" }}>{fmt(p.createdAt)}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <button
                                onClick={() => navigate('/subadmin/reception/opd/billing/create', { state: { patientId: p._id } })}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 5,
                                  padding: '5px 12px', fontSize: 11, fontWeight: 700,
                                  background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
                                  borderRadius: 7, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                  transition: 'all 0.15s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                              >
                                <Receipt size={11} /> Bill Now
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Recent Transactions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 4 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Recent Transactions</h2>
                  <button
                    onClick={() => navigate('/subadmin/reception/opd/billing/history')}
                    style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    View All
                  </button>
                </div>

                <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                        {['Patient', 'Bill Info', 'Amount', 'Status'].map(col => (
                          <th key={col} style={{ padding: '11px 16px', textAlign: col === 'Amount' ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                            {[40, 30, 20, 15].map((w, j) => (
                              <td key={j} style={{ padding: '14px 16px' }}>
                                <div style={{ height: 13, background: '#F3F4F6', borderRadius: 6, width: `${w}%`, animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: `${i * 0.07}s` }} />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : recentBills.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '54px 16px', color: '#9CA3AF' }}>No transactions found.</td></tr>
                      ) : (
                        recentBills.map(bill => {
                          const rowHover = { background: '#FAFAFA' };
                          return (
                            <tr
                              key={bill._id}
                              onClick={() => navigate(`/subadmin/reception/opd/billing/view/${bill._id}`)}
                              style={{ borderBottom: '1px solid #F9FAFB', cursor: 'pointer', background: '#fff', transition: 'background 0.1s' }}
                              onMouseEnter={e => Object.assign(e.currentTarget.style, rowHover)}
                              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            >
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <Avatar first={bill.patient?.firstName} last={bill.patient?.lastName} size={34} />
                                  <div>
                                    <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: 13 }}>{bill.patient?.firstName} {bill.patient?.lastName}</p>
                                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0', fontFamily: "'DM Mono', monospace" }}>{bill.patient?.patientId}</p>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <p style={{ fontWeight: 600, color: '#374151', margin: 0, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{bill.billNumber}</p>
                                <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0', fontFamily: "'DM Mono', monospace" }}>{fmt(bill.billDate)}</p>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#111827', fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
                                {cur(bill.totalAmount)}
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <StatusBadge status={bill.paymentStatus} />
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
          </div>

        </div>
      </div>
    </>
  );
};

export default OpdBillingDashboard;
