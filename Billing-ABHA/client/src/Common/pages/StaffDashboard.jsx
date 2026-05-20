import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, LogOut, FlaskConical, Users, FileText, Receipt, Bed } from 'lucide-react';

const MODULE_ICONS = {
  laboratory: FlaskConical,
  patients: Users,
  opd: Receipt,
  ipd: Bed,
  documents: FileText,
  dashboard: Stethoscope,
  doctor: Stethoscope,
};

const MODULE_PATHS = {
  laboratory: '/staff/laboratory',
  patients: '/staff/patients',
  opd: '/staff/opd',
  ipd: '/staff/ipd',
  documents: '/staff/documents',
  dashboard: '/staff/dashboard',
  doctor: '/staff/doctor',
};

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [staffUser, setStaffUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('staffUser');
    if (!userData) {
      navigate('/staff/login');
      return;
    }
    setStaffUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffUser');
    navigate('/staff/login');
  };

  if (!staffUser) return null;

  const permissions = [...(staffUser.permissions || [])];
  if (staffUser.role === 'doctor' && !permissions.includes('doctor')) {
    permissions.push('doctor');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">MAPVON Staff Portal</h1>
            <p className="text-xs text-gray-500">Welcome, {staffUser.name}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">Your Modules</h2>
          <p className="text-gray-500 mt-1">Select a module to get started.</p>
        </div>

        {permissions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <Stethoscope className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-900 font-semibold">No modules assigned</p>
            <p className="text-gray-500 text-sm mt-1">Contact your administrator to get access.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {permissions.map(perm => {
              const Icon = MODULE_ICONS[perm] || FileText;
              const path = MODULE_PATHS[perm] || '/staff/dashboard';
              return (
                <button
                  key={perm}
                  onClick={() => navigate(path)}
                  className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                    <Icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 capitalize text-lg">{perm === 'opd' ? 'OPD Billing' : perm}</h3>
                  <p className="text-gray-500 text-sm mt-1">Open {perm} module</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
