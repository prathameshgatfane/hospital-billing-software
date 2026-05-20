import React, { useState, useEffect } from 'react';
import { 
  UserPlus, CheckCircle, XCircle, Mail, Phone, 
  Stethoscope, Shield, RefreshCw, Key, UserCheck
} from 'lucide-react';
import { doctorApi } from '../../API/docApi';
import staffApi from '../../API/staffApi';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorApi.getMyDoctors();
      if (res.success) {
        setDoctors(res.doctors);
      }
    } catch (e) {
      setError('Failed to load doctor list.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (doc) => {
    setProcessingId(doc._id);
    try {
      const res = await doctorApi.toggleDoctorStatus(doc._id, !doc.isActive);
      if (res.success) {
        setSuccessMsg(`Doctor ${!doc.isActive ? 'activated' : 'deactivated'} successfully!`);
        fetchDoctors();
      }
    } catch (e) {
      setError('Failed to update doctor status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreateLogin = async (doc) => {
    if (!window.confirm(`Create a clinical login for Dr. ${doc.fullName}?`)) return;
    
    setProcessingId(doc._id);
    setError('');
    try {
      // Create a Staff record with role 'doctor' linked to this doctorId
      const staffData = {
        name: `Dr. ${doc.fullName}`,
        email: doc.email,
        mobile: doc.mobile,
        role: 'doctor',
        doctorId: doc._id,
        permissions: ['dashboard', 'patients', 'opd', 'doctor'] // Default permissions for doctor
      };

      const res = await staffApi.createStaff(staffData);
      if (res.success) {
        setSuccessMsg(`Login credentials sent to ${doc.email}!`);
        fetchDoctors();
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create doctor login.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <style>{`
        .glass-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px); border: 1px solid rgba(229, 231, 235, 0.5); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between fade-in">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl text-red-600 shadow-sm border border-red-100">
              <Stethoscope className="w-6 h-6" />
            </div>
            Doctor Portal Management
          </h2>
          <p className="text-gray-500 text-sm mt-1 ml-11">
            Activate doctors and manage their clinical portal access.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {(successMsg || error) && (
        <div className="fade-in">
          {successMsg && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">{successMsg}</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 shadow-sm">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Doctor Cards / Table */}
      <div className="glass-card rounded-2xl shadow-sm overflow-hidden fade-in" style={{ animationDelay: '0.1s' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm font-medium">Fetching doctor records...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Stethoscope className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-900 font-bold text-lg">No Doctors Found</p>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
              You haven't added any doctors to your hospital yet. Use the "Add Doctor" section to register them first.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-[10px]">Doctor Profile</th>
                  <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-[10px]">Speciality</th>
                  <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-[10px]">Contact Info</th>
                  <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-[10px]">Portal Access</th>
                  <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-[10px]">Hospital Status</th>
                  <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-right text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {doctors.map((doc, idx) => (
                  <tr key={doc._id} className="hover:bg-red-50/10 transition-colors duration-200" style={{ animationDelay: `${0.1 + idx * 0.05}s` }}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-600 font-bold border border-red-200">
                          {doc.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 leading-tight mb-0.5">Dr. {doc.fullName}</div>
                          <div className="text-[11px] text-gray-400 font-mono tracking-tighter uppercase">{doc.doctorRegistrationNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100 uppercase tracking-tight">
                        {doc.speciality}
                      </span>
                    </td>
                    <td className="px-6 py-5 space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Mail className="w-3 h-3 text-gray-400" /> 
                        <span className="text-xs truncate max-w-[150px]">{doc.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">{doc.mobile}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {doc.hasLogin ? (
                        <div className="flex items-center gap-1.5 text-green-700 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg w-fit border border-green-100 shadow-sm">
                          <UserCheck className="w-3.5 h-3.5" />
                          LOGIN CREATED
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-400 font-medium text-xs bg-gray-50 px-2 py-1 rounded-lg w-fit border border-gray-100">
                          <Key className="w-3.5 h-3.5" />
                          NO PORTAL LOGIN
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleToggleStatus(doc)}
                        style={{ color: doc.isActive ? '#16A34A' : '#9CA3AF' }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 ${
                          doc.isActive ? 'bg-green-50 hover:bg-green-100 border border-green-100' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${doc.isActive ? 'bg-green-500 shadow-[0_0_8px_#16A34A]' : 'bg-gray-400'}`}></div>
                        {doc.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {!doc.hasLogin ? (
                        <button
                          onClick={() => handleCreateLogin(doc)}
                          disabled={processingId === doc._id}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                          {processingId === doc._id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                          CREATE LOGIN
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Login configured</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;
