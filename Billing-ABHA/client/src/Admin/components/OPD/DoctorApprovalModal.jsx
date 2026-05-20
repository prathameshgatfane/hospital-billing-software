import React, { useState } from 'react';
import {
  X, UserCheck, UserX, AlertCircle,
  Shield, FileText, Mail, Phone,
  Award, Calendar, Building, Loader2
} from 'lucide-react';

const DoctorApprovalModal = ({ 
  doctor, 
  actionType, 
  onApprove, 
  onReject, 
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Guard clause for undefined doctor
  if (!doctor) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-6">No doctor data available</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    setLoading(true);
    setError('');
    
    const result = await onApprove(doctor._id);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() && actionType === 'reject') {
      setError('Please provide a rejection reason');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await onReject(doctor._id, rejectionReason);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionTitle = () => {
    switch (actionType) {
      case 'approve':
        return doctor.verificationStatus === 'REJECTED' 
          ? 'Re-approve Doctor' 
          : 'Approve Doctor';
      case 'reject':
        return doctor.verificationStatus === 'APPROVED'
          ? 'Revoke Approval'
          : 'Reject Doctor';
      default:
        return 'Doctor Details';
    }
  };

  // Safe access to doctor properties with fallbacks
  const doctorId = doctor?._id || 'N/A';
  const fullName = doctor?.fullName || 'Not Available';
  const registrationNumber = doctor?.doctorRegistrationNumber || 'Not Available';
  const email = doctor?.email || 'Not Available';
  const mobile = doctor?.mobile || 'Not Available';
  const speciality = doctor?.speciality || 'Not Available';
  const experienceYears = doctor?.experienceYears || doctor?.experience || 0;
  const qualification = doctor?.qualification || 'Not Available';
  const verificationStatus = doctor?.verificationStatus || 'UNKNOWN';
  const tenantId = doctor?.tenantId || 'N/A';
  const createdAt = doctor?.createdAt;
  const verifiedAt = doctor?.verifiedAt;
  const rejectionReasonFromDoctor = doctor?.rejectionReason || '';
  const charges = doctor?.charges || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${
                actionType === 'approve' 
                  ? 'bg-green-100 text-green-600'
                  : actionType === 'reject'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {actionType === 'approve' 
                  ? <UserCheck className="w-6 h-6" />
                  : actionType === 'reject'
                  ? <UserX className="w-6 h-6" />
                  : <Shield className="w-6 h-6" />
                }
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getActionTitle()}</h2>
                <p className="text-sm text-gray-600">ID: {doctorId.slice(-8)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {success}
              </p>
            </div>
          )}

          {/* Doctor Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <p className="font-medium text-gray-900">{fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Registration Number
                </label>
                <p className="font-medium text-gray-900">{registrationNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Mail className="w-3 h-3 inline mr-1" />
                  Email
                </label>
                <p className="font-medium text-gray-900">{email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Phone className="w-3 h-3 inline mr-1" />
                  Mobile
                </label>
                <p className="font-medium text-gray-900">{mobile}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Speciality
                </label>
                <p className="font-medium text-gray-900">{speciality}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Award className="w-3 h-3 inline mr-1" />
                  Experience
                </label>
                <p className="font-medium text-gray-900">{experienceYears} years</p>
              </div>
            </div>

            {/* Qualification */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Qualification
              </label>
              <p className="font-medium text-gray-900">{qualification}</p>
            </div>

            {/* Hospital Info */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Hospital Information
              </h4>
              <p className="text-sm text-gray-600">
                Hospital ID: <span className="font-medium">{tenantId}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Submitted on: <span className="font-medium">{formatDate(createdAt)}</span>
              </p>
            </div>

            {/* Fee Structure */}
            {charges && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Fee Structure</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">OPD Consultation</p>
                    <p className="font-medium">₹{charges.opdConsultation || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">OPD Follow-up</p>
                    <p className="font-medium">₹{charges.opdFollowUp || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Emergency</p>
                    <p className="font-medium">₹{charges.emergency || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Status */}
            <div className={`p-4 rounded-lg mb-4 ${
              verificationStatus === 'APPROVED' ? 'bg-green-50 border border-green-200' :
              verificationStatus === 'REJECTED' ? 'bg-red-50 border border-red-200' :
              'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center">
                {verificationStatus === 'APPROVED' 
                  ? <UserCheck className="w-5 h-5 text-green-600 mr-2" />
                  : verificationStatus === 'REJECTED'
                  ? <UserX className="w-5 h-5 text-red-600 mr-2" />
                  : <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                }
                <div>
                  <h4 className="font-semibold">Current Status: {verificationStatus}</h4>
                  {rejectionReasonFromDoctor && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Reason: </span>
                      {rejectionReasonFromDoctor}
                    </p>
                  )}
                  {verifiedAt && (
                    <p className="text-sm mt-1">
                      Verified on: {formatDate(verifiedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Reason Input */}
          {(actionType === 'reject' || (actionType === 'reject' && verificationStatus === 'APPROVED')) && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {verificationStatus === 'APPROVED' 
                  ? 'Revocation Reason *' 
                  : 'Rejection Reason *'
                }
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (error) setError('');
                }}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={`Enter reason for ${verificationStatus === 'APPROVED' ? 'revoking approval' : 'rejection'}...`}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This reason will be visible to the hospital.
              </p>
            </div>
          )}

          {/* Confirmation Message */}
          {actionType && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium">Confirm Action</p>
                  <p className="text-blue-700 text-sm mt-1">
                    {actionType === 'approve'
                      ? `You are about to approve Dr. ${fullName}. This will allow them to start accepting patients.`
                      : `You are about to ${verificationStatus === 'APPROVED' ? 'revoke approval for' : 'reject'} Dr. ${fullName}.`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            
            {actionType === 'approve' && (
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    {verificationStatus === 'REJECTED' ? 'Re-approve' : 'Approve Doctor'}
                  </>
                )}
              </button>
            )}
            
            {actionType === 'reject' && (
              <button
                onClick={handleReject}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 mr-2" />
                    {verificationStatus === 'APPROVED' ? 'Revoke Approval' : 'Reject Doctor'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorApprovalModal;