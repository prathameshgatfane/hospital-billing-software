// SubAdminSidebar.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCircle, UserPlus,
  Stethoscope, Receipt, Bed, UserCog, FileText,
  Settings, User, ChevronDown, ShieldAlert, Activity,
  LogOut, Bell,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────────────────── */
const isPathActive = (pathname, path) =>
  pathname === path || pathname.startsWith(path + '/');

/* ─── All hover via CSS classes — zero JS hover state = zero lag ──────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600&display=swap');

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #F3F4F6; border-radius: 99px; }
  ::-webkit-scrollbar-track { background: transparent; }

  /* top-level nav link */
  .sb-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 14px; border-radius: 10px;
    font-size: 15px; font-weight: 500; color: #6B7280;
    background: transparent; text-decoration: none;
    transition: color 0.1s, background 0.1s;
    position: relative; margin-bottom: 2px;
    font-family: 'DM Sans', sans-serif;
  }
  .sb-link:hover:not(.active) { color: #111827; background: #F9FAFB; }
  .sb-link.active {
    color: #DC2626 !important;
    background: #FEF2F2 !important;
    font-weight: 700;
  }
  /* red left bar — only on active top-level links */
  .sb-link.active::before {
    content: ''; position: absolute;
    left: 0; top: 22%; bottom: 22%;
    width: 3px; background: #DC2626;
    border-radius: 0 3px 3px 0;
  }

  /* sub-item link */
  .sb-sub {
    display: flex; align-items: center; gap: 9px;
    padding: 6px 12px 6px 40px; border-radius: 8px;
    font-size: 14px; font-weight: 500; color: #9CA3AF;
    background: transparent; text-decoration: none;
    transition: color 0.1s, background 0.1s;
    margin-bottom: 1px; font-family: 'DM Sans', sans-serif;
  }
  .sb-sub:hover:not(.active) { color: #374151; background: #F9FAFB; }
  .sb-sub.active {
    color: #DC2626 !important;
    background: #FEF2F2 !important;
    font-weight: 700;
  }

  /* dropdown trigger button */
  .sb-trigger {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 9px 14px; border-radius: 10px; border: none;
    font-size: 15px; font-weight: 600; color: #6B7280;
    background: transparent; cursor: pointer; margin-bottom: 2px;
    font-family: 'DM Sans', sans-serif; transition: color 0.1s, background 0.1s;
  }
  .sb-trigger:hover { color: #111827; background: #F9FAFB; }
  /* when a child is active AND closed → highlight trigger */
  .sb-trigger.child-active { color: #DC2626; background: #FEF2F2; }
  /* when open, revert to neutral hover look */
  .sb-trigger.open { color: #111827; background: #F9FAFB; }

  /* logout icon button */
  .sb-logout {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid #F3F4F6;
    border-radius: 8px; cursor: pointer; flex-shrink: 0;
    transition: background 0.1s, border-color 0.1s;
  }
  .sb-logout:hover { background: #FEF2F2; border-color: #FECACA; }
`;

/* ─── LinkItem ────────────────────────────────────────────────────────── */
const LinkItem = ({ item, isSubItem = false }) => (
  <NavLink
    to={item.path}
    end={!!item.end}
    className={({ isActive }) =>
      (isSubItem ? 'sb-sub' : 'sb-link') + (isActive ? ' active' : '')
    }
  >
    <item.icon size={isSubItem ? 13 : 15} style={{ flexShrink: 0 }} />
    <span>{item.name}</span>
  </NavLink>
);

/* ─── DropdownItem ────────────────────────────────────────────────────── */
const DropdownItem = ({ item }) => {
  const { pathname } = useLocation();
  const hasActive = item.subItems.some(s => isPathActive(pathname, s.path));
  const [open, setOpen] = useState(hasActive);

  // trigger class: child-active only when closed (open overrides it)
  const triggerClass = [
    'sb-trigger',
    open ? 'open' : (hasActive ? 'child-active' : ''),
  ].filter(Boolean).join(' ');

  return (
    <div>
      <button className={triggerClass} onClick={() => setOpen(o => !o)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <item.icon size={15} style={{ flexShrink: 0 }} />
          {item.name}
        </span>
        <ChevronDown
          size={13}
          style={{
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.18s',
            flexShrink: 0,
            color: '#9CA3AF',
          }}
        />
      </button>

      {open && (
        <div style={{ position: 'relative', marginTop: 1, marginBottom: 4 }}>
          {/* vertical guide line */}
          <div style={{
            position: 'absolute', left: 22, top: 4, bottom: 4,
            width: 1, background: '#F0F0F0', borderRadius: 1,
          }} />
          {item.subItems.map((sub, i) => (
            <LinkItem key={i} item={sub} isSubItem />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Router ──────────────────────────────────────────────────────────── */
const SidebarItem = ({ item }) => {
  if (item.type === 'link') return <LinkItem item={item} />;
  if (item.type === 'dropdown') return <DropdownItem item={item} />;
  return null;
};

/* ─── Section label ───────────────────────────────────────────────────── */
const SectionLabel = ({ label }) => (
  <p style={{
    fontSize: 10, fontWeight: 700, color: '#9ea2aaff',
    letterSpacing: '0.13em', textTransform: 'uppercase',
    fontFamily: "'DM Mono', monospace",
    margin: '20px 0 6px 14px',
  }}>{label}</p>
);

/* ─── Main ────────────────────────────────────────────────────────────── */
const SubAdminSidebar = () => {
  const menu = {
    core: [
      {
        // end: true → exact match only — prevents /subadmin/patients also activating Dashboard
        name: 'Dashboard', path: '/subadmin', icon: LayoutDashboard, type: 'link', end: true,
      },
    ],
    patients: [
      {
        name: 'Patient Management', icon: Users, type: 'dropdown',
        subItems: [
          { name: 'Patient Directory', path: '/subadmin/patients', icon: UserCircle },
          { name: 'Register Patient', path: '/subadmin/patients/register', icon: UserPlus },
        ],
      },
    ],
    departments: [
      {
        name: 'Departments', icon: Stethoscope, type: 'dropdown',
        subItems: [
          { name: 'OPD Services', path: '/subadmin/reception/opd', icon: Receipt },
          { name: 'IPD Admissions', path: '/subadmin/reception/ipd', icon: Bed },
          { name: 'Laboratory', path: '/subadmin/reception/laboratory', icon: FileText },
          { name: 'Doctor Console', path: '/subadmin/reception/doctor', icon: Activity },
          { name: 'Walk-In Queue', path: '/subadmin/reception/walking', icon: Activity },
          { name: 'Doctor Setup', path: '/subadmin/reception/setup', icon: UserCog },
        ],
      },
    ],
    admin: [
      {
        name: 'Administration', icon: ShieldAlert, type: 'dropdown',
        subItems: [
          { name: 'Staff Directory', path: '/subadmin/settings/staff', icon: Users },
          { name: 'Billing Configurations', path: '/subadmin/settings/billing', icon: Receipt },
          { name: 'System Settings', path: '/subadmin/settings', icon: Settings },
        ],
      },
      { name: 'Account Profile', path: '/subadmin/profile', icon: User, type: 'link', end: true },
    ],
  };

  return (
    <>
      <style>{CSS}</style>

      <aside style={{
        width: 256, flexShrink: 0,
        background: '#fff', borderRight: '1px solid #F3F4F6',
        display: 'flex', flexDirection: 'column',
        height: '100vh', position: 'sticky', top: 0,
        fontFamily: "'DM Sans', sans-serif", zIndex: 50,
      }}>

        {/* ── Brand ── */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* red cross logo */}
            <div style={{
              width: 36, height: 36, background: '#DC2626', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, position: 'relative',
            }}>
              <div style={{ width: 15, height: 3, background: '#fff', borderRadius: 2, position: 'absolute' }} />
              <div style={{ width: 3, height: 15, background: '#fff', borderRadius: 2, position: 'absolute' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>MAPVON</h1>
              <p style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: 0 }}>Sub-Admin Portal</p>
            </div>
            <div style={{ marginLeft: 'auto', position: 'relative', cursor: 'pointer', padding: 4 }}>
              <Bell size={15} color="#9CA3AF" />
              <span style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 6, background: '#DC2626', borderRadius: '50%', border: '1.5px solid #fff' }} />
            </div>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav style={{ flex: 1, padding: '2px 10px 16px', overflowY: 'auto' }}>
          <SectionLabel label="Overview" />
          {menu.core.map((item, i) => <SidebarItem key={i} item={item} />)}

          <SectionLabel label="Patients" />
          {menu.patients.map((item, i) => <SidebarItem key={i} item={item} />)}

          <SectionLabel label="Clinical" />
          {menu.departments.map((item, i) => <SidebarItem key={i} item={item} />)}

          <SectionLabel label="Admin" />
          {menu.admin.map((item, i) => <SidebarItem key={i} item={item} />)}
        </nav>

        {/* ── Footer ── */}
        <div style={{ borderTop: '1px solid #F3F4F6', padding: '13px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: '#FEE2E2', color: '#DC2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 12, fontFamily: "'DM Mono', monospace",
            }}>SA</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>System Admin</p>
              <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Reception & Billing</p>
            </div>
            <button className="sb-logout" title="Sign out">
              <LogOut size={13} color="#9CA3AF" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};

export default SubAdminSidebar;