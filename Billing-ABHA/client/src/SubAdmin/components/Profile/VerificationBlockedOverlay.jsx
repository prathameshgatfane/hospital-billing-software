import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Clock, XCircle, ArrowRight, 
  RefreshCw, LogOut, FileText, Lock
} from 'lucide-react';
import { useAuth } from '../../../Common/context/AuthContext';

const VerificationBlockedOverlay = ({ status, onRefresh }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getStatusContent = () => {
    switch (status) {
      case 'PENDING':
        return {
          icon: <Clock className="w-10 h-10 text-amber-500 animate-pulse" />,
          title: "Verification Pending Review",
          description: "Your hospital profile has been submitted and is currently being reviewed by the administration. This process usually takes 24-48 hours. Once verified, all billing and clinical operations will unlock.",
          badge: (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 mr-2 rounded-full bg-amber-500 animate-ping"></span>
              Under Review
            </span>
          ),
          buttonText: "View Profile Status",
          buttonColor: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="w-10 h-10 text-red-500" />,
          title: "Verification Rejected",
          description: "Your hospital profile was not approved. Please review the submitted details, update any incorrect documents or information, and resubmit your profile.",
          badge: (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
              <span className="w-2 h-2 mr-2 rounded-full bg-red-500"></span>
              Action Required
            </span>
          ),
          buttonText: "Update & Resubmit Profile",
          buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      case 'NO_PROFILE':
      default:
        return {
          icon: <ShieldAlert className="w-10 h-10 text-rose-500" />,
          title: "Hospital Profile Required",
          description: "To comply with healthcare billing regulations, you must complete your hospital profile setup. Please fill in your hospital details, doctor registration numbers, and upload verification certificates to activate your account.",
          badge: (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
              <span className="w-2 h-2 mr-2 rounded-full bg-rose-500"></span>
              Setup Incomplete
            </span>
          ),
          buttonText: "Complete Profile Setup",
          buttonColor: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
        };
    }
  };

  const content = getStatusContent();

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center p-6 transition-all duration-300"
      style={{
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        backgroundColor: 'rgba(249, 250, 251, 0.45)',
        backgroundImage: 'radial-gradient(at 50% 50%, rgba(220, 38, 38, 0.03) 0px, transparent 50%)',
      }}
    >
      <div 
        className="w-full max-w-md bg-white/80 border border-gray-200/60 rounded-3xl p-8 text-center transition-all duration-300 transform scale-100"
        style={{
          boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        {/* Glow behind icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2.5xl bg-gray-50 border border-gray-100 mb-6 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-500/5 to-transparent rounded-2.5xl pointer-events-none" />
          {content.icon}
        </div>

        <div className="mb-4">
          {content.badge}
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
          {content.title}
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed mb-8 px-2">
          {content.description}
        </p>

        {/* Action Group */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/subadmin/profile')}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-white rounded-2xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${content.buttonColor}`}
          >
            <FileText size={16} />
            {content.buttonText}
            <ArrowRight size={16} />
          </button>

          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all focus:outline-none"
            >
              <RefreshCw size={14} className="text-gray-500" />
              Refresh Status
            </button>

            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-red-600 bg-red-50/50 border border-red-100 rounded-xl hover:bg-red-50 hover:text-red-700 active:bg-red-100/70 transition-all focus:outline-none"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Small security footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
          <Lock size={12} className="text-gray-400" />
          <span>Secured Healthcare Workspace</span>
        </div>
      </div>
    </div>
  );
};

export default VerificationBlockedOverlay;
