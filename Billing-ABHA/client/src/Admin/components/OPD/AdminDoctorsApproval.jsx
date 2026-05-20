import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserX, Clock, 
  CheckCircle, XCircle, Eye, Filter,
  Search, Stethoscope, Award, AlertCircle,
  Loader2, Mail, Phone, Calendar, Building,
  FileText, Shield, RefreshCw, ChevronRight
} from 'lucide-react';
import { doctorAdminApi } from '../../API/docApi';
import DoctorApprovalModal from './DoctorApprovalModal';

const AdminDoctorsApproval = () => {
  const [loading, setLoading] = useState(true);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [rejectedDoctors, setRejectedDoctors] = useState([]);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorAdminApi.getPendingDoctors();
      if (response.success) {
        const allDoctors = response.doctors || [];
        
        // Separate doctors by status
        const pending = allDoctors.filter(d => d.verificationStatus === 'PENDING');
        const approved = allDoctors.filter(d => d.verificationStatus === 'APPROVED');
        const rejected = allDoctors.filter(d => d.verificationStatus === 'REJECTED');
        
        setPendingDoctors(pending);
        setApprovedDoctors(approved);
        setRejectedDoctors(rejected);
        
        // Update stats
        setStats({
          pending: pending.length,
          approved: approved.length,
          rejected: rejected.length,
          total: allDoctors.length
        });
      } else {
        setError('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Fetch doctors error:', error);
      setError('Failed to load doctors data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDoctor = async (doctorId) => {
    try {
      const response = await doctorAdminApi.approveDoctor(doctorId);
      if (response.success) {
        // Refresh the list
        fetchAllDoctors();
        return { success: true, message: 'Doctor approved successfully' };
      } else {
        return { success: false, message: response.message || 'Failed to approve doctor' };
      }
    } catch (error) {
      console.error('Approve doctor error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to approve doctor' 
      };
    }
  };

  const handleRejectDoctor = async (doctorId, reason) => {
    try {
      const response = await doctorAdminApi.rejectDoctor(doctorId, reason);
      if (response.success) {
        fetchAllDoctors();
        return { success: true, message: 'Doctor rejected successfully' };
      } else {
        return { success: false, message: response.message || 'Failed to reject doctor' };
      }
    } catch (error) {
      console.error('Reject doctor error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reject doctor' 
      };
    }
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleAction = (doctor, type) => {
    setSelectedDoctor(doctor);
    setActionType(type);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Approved',
          color: 'bg-green-100 text-green-800',
          icon: <UserCheck className="w-4 h-4" />,
          badgeColor: 'text-green-600'
        };
      case 'PENDING':
        return {
          label: 'Pending',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="w-4 h-4" />,
          badgeColor: 'text-yellow-600'
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          color: 'bg-red-100 text-red-800',
          icon: <UserX className="w-4 h-4" />,
          badgeColor: 'text-red-600'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="w-4 h-4" />,
          badgeColor: 'text-gray-600'
        };
    }
  };

  const getDoctorsByStatus = () => {
    switch (filterStatus) {
      case 'PENDING':
        return pendingDoctors;
      case 'APPROVED':
        return approvedDoctors;
      case 'REJECTED':
        return rejectedDoctors;
      default:
        return pendingDoctors;
    }
  };

  const filteredDoctors = getDoctorsByStatus().filter(doctor => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      doctor.fullName?.toLowerCase().includes(query) ||
      doctor.speciality?.toLowerCase().includes(query) ||
      doctor.doctorRegistrationNumber?.toLowerCase().includes(query) ||
      doctor.email?.toLowerCase().includes(query) ||
      doctor.mobile?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Verification</h1>
          <p className="text-gray-600">Approve or reject doctor registrations</p>
        </div>
        <button
          onClick={fetchAllDoctors}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
          {stats.pending > 0 && (
            <p className="text-xs text-yellow-600 mt-2">
              {stats.pending} doctor{stats.pending !== 1 ? 's' : ''} waiting
            </p>
          )}
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <UserCheck className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <UserX className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilterStatus('APPROVED')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === 'APPROVED' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <UserCheck className="w-4 h-4 inline mr-2" />
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilterStatus('REJECTED')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <UserX className="w-4 h-4 inline mr-2" />
              Rejected ({stats.rejected})
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filterStatus === 'PENDING' 
                ? 'No Pending Doctors' 
                : filterStatus === 'APPROVED' 
                ? 'No Approved Doctors' 
                : 'No Rejected Doctors'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'PENDING' 
                ? 'All doctors have been processed.' 
                : `No doctors found with ${filterStatus.toLowerCase()} status.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => {
                  const statusBadge = getStatusBadge(doctor.verificationStatus);
                  return (
                    <tr key={doctor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-semibold">
                              {doctor.fullName?.charAt(0) || 'D'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doctor.fullName}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Mail className="w-3 h-3 mr-1" />
                              {doctor.email || 'No email'}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {doctor.mobile || 'No phone'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{doctor.speciality}</p>
                          {doctor.subSpeciality && (
                            <p className="text-sm text-gray-600">{doctor.subSpeciality}</p>
                          )}
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Award className="w-3 h-3 mr-1" />
                            {doctor.experienceYears || doctor.experience || 0} years
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FileText className="w-3 h-3 mr-1" />
                            {doctor.doctorRegistrationNumber || 'No registration'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <Building className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              Hospital ID: {doctor.tenantId?.slice(-6) || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            Applied: {formatDate(doctor.createdAt)}
                          </div>
                          {doctor.verificationStatus === 'REJECTED' && doctor.rejectionReason && (
                            <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                              <AlertCircle className="w-3 h-3 inline mr-1" />
                              Reason: {doctor.rejectionReason}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                            {statusBadge.icon}
                            <span className="ml-1">{statusBadge.label}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {doctor.verifiedAt ? (
                            <>
                              <CheckCircle className="w-3 h-3 inline mr-1 text-green-500" />
                              Verified: {formatDate(doctor.verifiedAt)}
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 inline mr-1 text-yellow-500" />
                              Waiting since: {formatDate(doctor.createdAt)}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleViewDetails(doctor)}
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </button>
                          
                          {doctor.verificationStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleAction(doctor, 'approve')}
                                className="flex items-center text-green-600 hover:text-green-800 text-sm"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(doctor, 'reject')}
                                className="flex items-center text-red-600 hover:text-red-800 text-sm"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </button>
                            </>
                          )}
                          
                          {doctor.verificationStatus === 'APPROVED' && (
                            <button
                              onClick={() => handleAction(doctor, 'reject')}
                              className="flex items-center text-red-600 hover:text-red-800 text-sm"
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Revoke Approval
                            </button>
                          )}
                          
                          {doctor.verificationStatus === 'REJECTED' && (
                            <button
                              onClick={() => handleAction(doctor, 'approve')}
                              className="flex items-center text-green-600 hover:text-green-800 text-sm"
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              Re-approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showModal && selectedDoctor && (
  <DoctorApprovalModal
    doctor={selectedDoctor}
    actionType={actionType}
    onApprove={handleApproveDoctor}
    onReject={handleRejectDoctor}
    onViewDetails={handleViewDetails}
    onClose={() => {
      setShowModal(false);
      setSelectedDoctor(null);
      setActionType('');
    }}
  />
)}
    </div>
  );
};

export default AdminDoctorsApproval;