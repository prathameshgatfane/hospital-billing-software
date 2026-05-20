import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SubAdminSidebar from "./SubAdminSidebar";
import { LogOut } from "lucide-react";

const SubAdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#F9FAFB', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>

      <SubAdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ height: 64, flexShrink: 0, background: '#fff', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px' }}>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
            onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        {/* Main Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#F9FAFB' }}>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SubAdminLayout;
