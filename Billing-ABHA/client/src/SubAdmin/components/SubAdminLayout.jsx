import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SubAdminSidebar from "./SubAdminSidebar";
import { LogOut, Loader2, Sun, Moon } from "lucide-react";
import { profileApi } from '../API/profileApi';
import VerificationBlockedOverlay from "./Profile/VerificationBlockedOverlay";
import { useTheme } from "../../Common/context/ThemeContext";

const SubAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const fetchVerificationStatus = async () => {
    try {
      const response = await profileApi.getProfile();
      if (response.success && response.profile) {
        setVerificationStatus(response.profile.verificationStatus || 'PENDING');
      } else {
        setVerificationStatus('NO_PROFILE');
      }
    } catch (err) {
      console.error("Error checking verification status:", err);
      if (err.response?.status === 404) {
        setVerificationStatus('NO_PROFILE');
      } else {
        setVerificationStatus('PENDING'); // Fallback to pending to be safe
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  // Check verification status on pathname transitions (only if not already approved)
  useEffect(() => {
    if (verificationStatus !== 'APPROVED') {
      fetchVerificationStatus();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("staffToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("registrationStage");
    localStorage.removeItem("staffUser");
    navigate("/login");
  };

  const { theme, toggleTheme } = useTheme();

  const isProfilePage = location.pathname.endsWith('/profile') || location.pathname.endsWith('/profile-completion');
  const isVerified = verificationStatus === 'APPROVED';

  return (
    <div style={{ height: '100vh', display: 'flex', background: 'var(--bg-color)', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>

      <SubAdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ height: 64, flexShrink: 0, background: 'var(--header-bg)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              marginRight: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 10,
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)',
              color: 'var(--text-color)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

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
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px', background: 'var(--bg-color)', position: 'relative' }}>
          <Outlet />

          {!isProfilePage && !isVerified && (
            loadingStatus ? (
              <div 
                className="absolute inset-0 z-50 flex items-center justify-center"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  backgroundColor: 'rgba(249, 250, 251, 0.45)',
                }}
              >
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-3" />
                  <p className="text-sm font-semibold text-gray-500">Checking Verification Status...</p>
                </div>
              </div>
            ) : (
              <VerificationBlockedOverlay 
                status={verificationStatus} 
                onRefresh={fetchVerificationStatus}
              />
            )
          )}
        </main>

      </div>
    </div>
  );
};

export default SubAdminLayout;
