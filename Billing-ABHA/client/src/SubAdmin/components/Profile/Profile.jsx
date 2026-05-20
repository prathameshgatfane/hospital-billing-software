import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Phone, Mail, FileText, Shield, 
  CheckCircle, Clock, XCircle, Edit2, Download, 
  Camera, User, Globe, Award, FileCheck, AlertCircle,
  Verified, ExternalLink, ChevronRight
} from 'lucide-react';
import { profileApi } from '../../API/profileApi';
import { useAuth } from '../../../Common/context/AuthContext';

const MyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [basicInfo, setBasicInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await profileApi.getProfile();
      if (response.success) {
        setProfileData(response.profile || {});
        setBasicInfo(response.basicInfo || {});
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = () => {
    if (!profileData) return null;
    
    const status = profileData.verificationStatus || 'PENDING';
    const verifiedByAdmin = profileData.verifiedByAdmin || false;
    
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Verified',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <Verified className="w-4 h-4" />,
          message: 'Your hospital profile has been verified by admin',
          badgeColor: 'text-green-600'
        };
      case 'PENDING':
        return {
          label: 'Pending Verification',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-4 h-4" />,
          message: 'Your profile is under review. This may take 24-48 hours.',
          badgeColor: 'text-yellow-600'
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          message: 'Your profile was rejected. Please contact support.',
          badgeColor: 'text-red-600'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="w-4 h-4" />,
          message: 'Verification status unknown',
          badgeColor: 'text-gray-600'
        };
    }
  };

  const getServiceTypeInfo = (type) => {
    switch (type) {
      case 'OPD':
        return { label: 'OPD Only', color: 'bg-blue-100 text-blue-800' };
      case 'IPD':
        return { label: 'IPD Only', color: 'bg-purple-100 text-purple-800' };
      case 'BOTH':
        return { label: 'OPD & IPD', color: 'bg-indigo-100 text-indigo-800' };
      default:
        return { label: 'Not Specified', color: 'bg-gray-100 text-gray-800' };
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const verificationStatus = getVerificationStatus();
  const serviceTypeInfo = getServiceTypeInfo(profileData?.serviceType);

  return (
    <div className="space-y-6 p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Profile</h1>
          <p className="text-gray-600">Manage your hospital information and settings</p>
        </div>
      
      </div>

      {/* Verification Status Banner */}
      {verificationStatus && (
        <div className={`p-4 rounded-lg border ${verificationStatus.color}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`mr-3 ${verificationStatus.badgeColor}`}>
                {verificationStatus.icon}
              </div>
              <div>
                <h3 className="font-semibold">{verificationStatus.label}</h3>
                <p className="text-sm opacity-90">{verificationStatus.message}</p>
                {profileData?.verifiedAt && verificationStatus.label === 'Verified' && (
                  <p className="text-xs mt-1">Verified on: {formatDate(profileData.verifiedAt)}</p>
                )}
              </div>
            </div>
            {verificationStatus.label === 'Pending Verification' && (
              <button className="text-sm font-medium underline hover:no-underline">
                Learn more
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hospital Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center mr-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {basicInfo?.hospitalName || 'Hospital Name'}
                  </h2>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-600">Managed by</span>
                    <span className="font-medium ml-2">{basicInfo?.doctorName || 'Doctor Name'}</span>
                    {verificationStatus?.label === 'Verified' && (
                      <Verified className="w-4 h-4 text-blue-600 ml-2" />
                    )}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${serviceTypeInfo.color}`}>
                {serviceTypeInfo.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Primary Contact</p>
                    <p className="font-medium">{basicInfo?.contactNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Secondary Contact</p>
                    <p className="font-medium">{profileData?.secondaryMobile || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="font-medium">{basicInfo?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Alternate Email</p>
                    <p className="font-medium">{profileData?.alternateEmail || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Address & Location
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Complete Address</p>
                    <p className="font-medium">{profileData?.address || 'Not provided'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Pincode</p>
                      <p className="font-medium">{profileData?.pincode || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Coordinates</p>
                      <p className="font-medium">
                        {profileData?.latitude && profileData?.longitude 
                          ? `${profileData.latitude}, ${profileData.longitude}`
                          : 'Not set'
                        }
                      </p>
                    </div>
                  </div>
                  {(profileData?.latitude && profileData?.longitude) && (
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <Globe className="w-4 h-4 mr-1" />
                      View on Map
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Registration Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-gray-500" />
              Registration Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <FileCheck className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-sm text-gray-500">Hospital Registration</span>
                </div>
                <p className="font-medium text-lg">
                  {profileData?.hospitalRegistrationNumber || 'Not provided'}
                </p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-sm text-gray-500">Doctor Registration</span>
                </div>
                <p className="font-medium text-lg">
                  {profileData?.doctorRegistrationNumber || 'Not provided'}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Owner/Purchase Information</h4>
              <p className="text-gray-700">
                {profileData?.purchaseName || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Documents & Quick Stats */}
        <div className="space-y-6">
          {/* Documents Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-500" />
              Documents & Certificates
            </h3>
            
            <div className="space-y-4">
              {/* Hospital Certificates */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Hospital Certificates</span>
                  <span className="text-xs text-gray-500">
                    {profileData?.hospitalCertificates?.length || 0} files
                  </span>
                </div>
                <div className="space-y-2">
                  {profileData?.hospitalCertificates?.length > 0 ? (
                    profileData.hospitalCertificates.slice(0, 3).map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm truncate max-w-[150px]">{cert}</span>
                        </div>
                        <button className="text-red-600 hover:text-red-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No certificates uploaded</p>
                  )}
                  {profileData?.hospitalCertificates?.length > 3 && (
                    <button className="text-sm text-red-600 hover:text-red-800 flex items-center">
                      View all {profileData.hospitalCertificates.length} certificates
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>

              {/* Doctor Certificates */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Doctor Certificates</span>
                  <span className="text-xs text-gray-500">
                    {profileData?.doctorCertificates?.length || 0} files
                  </span>
                </div>
                <div className="space-y-2">
                  {profileData?.doctorCertificates?.length > 0 ? (
                    profileData.doctorCertificates.slice(0, 3).map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm truncate max-w-[150px]">{cert}</span>
                        </div>
                        <button className="text-red-600 hover:text-red-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No certificates uploaded</p>
                  )}
                  {profileData?.doctorCertificates?.length > 3 && (
                    <button className="text-sm text-red-600 hover:text-red-800 flex items-center">
                      View all {profileData.doctorCertificates.length} certificates
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>

              {/* Hospital Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Hospital Photos</span>
                  <span className="text-xs text-gray-500">
                    {profileData?.hospitalImages?.length || 0} images
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {profileData?.hospitalImages?.length > 0 ? (
                    profileData.hospitalImages.slice(0, 6).map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-400" />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic col-span-3">No images uploaded</p>
                  )}
                </div>
                {profileData?.hospitalImages?.length > 6 && (
                  <button className="text-sm text-red-600 hover:text-red-800 mt-2 flex items-center">
                    View all {profileData.hospitalImages.length} images
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">Profile Status</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-red-200">Account Status</p>
                <p className="font-bold">{basicInfo?.accountStatus || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-red-200">Registration Stage</p>
                <p className="font-bold">{basicInfo?.registrationStage || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-red-200">Profile Created</p>
                <p className="font-bold">{formatDate(profileData?.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-red-200">Last Updated</p>
                <p className="font-bold">{formatDate(profileData?.updatedAt)}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-red-500">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <div>
                  <p className="text-sm font-medium">Agreement Status</p>
                  <p className="text-sm">
                    {profileData?.agreementAccepted ? 'Accepted' : 'Not Accepted'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Update Verification Documents
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Request Profile Review
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Download All Documents
        </button>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Need Help with Verification?</h3>
            <p className="text-blue-800 text-sm mb-3">
              If your profile verification is taking longer than expected or you need to update your documents, 
              please contact our support team for assistance.
            </p>
            <button className="text-blue-700 hover:text-blue-900 font-medium">
              Contact Support Team →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;