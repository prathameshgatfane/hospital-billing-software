import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApiService } from "../../API/adminApi";
import {
  ArrowLeft,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Edit,
  Download,
  Printer,
  Trash2,
  RefreshCw,
  Activity,
  Database,
  Map,
  FileCheck,
  Image,
  FileDigit,
  CheckSquare,
  XSquare,
  Users,
} from "lucide-react";

const HospitalDetails = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch hospital details
  const fetchHospitalDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApiService.getHospitalDetails(tenantId);

      if (response.success) {
        // Combine client and profile data
        const combinedData = {
          ...response.client,
          ...response.profile,
          tenantId: tenantId,
        };
        setHospital(combinedData);
      } else {
        throw new Error(response.message || "Failed to fetch hospital details");
      }
    } catch (err) {
      console.error("Failed to fetch hospital details:", err);
      setError("Failed to load hospital details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchHospitalDetails();
    }
  }, [tenantId]);

  // Handle actions - ONLY THESE 4 FUNCTIONS EXIST IN YOUR API
  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this hospital?")) return;

    try {
      setActionLoading("approve");
      await adminApiService.approveHospital(tenantId);
      alert("Hospital approved successfully!");
      fetchHospitalDetails(); // Refresh data
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve hospital. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason || !reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      setActionLoading("reject");
      await adminApiService.rejectHospital(tenantId, reason);
      alert("Hospital rejected successfully!");
      fetchHospitalDetails(); // Refresh data
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Failed to reject hospital. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this hospital? This action cannot be undone.")) return;

    try {
      setActionLoading("delete");
      await adminApiService.deleteHospital(tenantId);
      alert("Hospital deleted successfully!");
      navigate("/admin/users"); // Go back to users list
    } catch (err) {
      console.error("Deletion failed:", err);
      alert("Failed to delete hospital. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };
  // In HospitalDetails component, add this function after handleDelete:
  const handleToggleStatus = async () => {
    if (!hospital) return;

    const currentStatus = hospital.accountStatus || "INACTIVE";
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const action = newStatus === "ACTIVE" ? "activate" : "deactivate";

    if (!window.confirm(`Are you sure you want to ${action} this hospital?`)) return;

    try {
      setActionLoading("toggle");
      await adminApiService.toggleHospitalStatus(tenantId);

      // Update hospital status
      setHospital(prev => ({
        ...prev,
        accountStatus: newStatus
      }));

      alert(`Hospital ${action}d successfully!`);
    } catch (err) {
      console.error("Status toggle failed:", err);
      alert(`Failed to ${action} hospital. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: <AlertCircle className="w-4 h-4" />,
        label: "Pending Review",
      },
      APPROVED: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Approved",
      },
      REJECTED: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        icon: <XCircle className="w-4 h-4" />,
        label: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text} ${config.border} border`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading hospital details...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 flex items-center gap-2 text-red-700 hover:text-red-800"
          >
            <ArrowLeft size={16} />
            Back to Hospital List
          </button>
        </div>
      </div>
    );
  }

  // No hospital found
  if (!hospital) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Hospital Not Found</h2>
          <p className="text-gray-600 mt-2">The hospital you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 flex items-center gap-2 mx-auto text-red-700 hover:text-red-800"
          >
            <ArrowLeft size={16} />
            Back to Hospital List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">{hospital.hospitalName || "Unnamed Hospital"}</h1>
            <p className="text-gray-600">Tenant ID: {tenantId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={fetchHospitalDetails}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={actionLoading === "refresh" ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg border ${hospital.verificationStatus === "APPROVED"
        ? "bg-green-50 border-green-200"
        : hospital.verificationStatus === "REJECTED"
          ? "bg-red-50 border-red-200"
          : "bg-yellow-50 border-yellow-200"
        }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusBadge(hospital.verificationStatus)}
            <div>
              <p className="text-sm font-medium text-gray-700">
                Account Status: <span className={`font-bold ${hospital.accountStatus === "ACTIVE" ? "text-green-700" :
                  hospital.accountStatus === "BLOCKED" ? "text-red-700" :
                    "text-yellow-700"
                  }`}>
                  {hospital.accountStatus || "N/A"}
                </span>
              </p>
            </div>
          </div>
          {hospital.verificationStatus === "APPROVED" && (
            <div className="flex items-center gap-3 mt-3 md:mt-0">
              <button
                onClick={handleToggleStatus}
                disabled={actionLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${(hospital.accountStatus || "INACTIVE") === "ACTIVE"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                {actionLoading === "toggle" ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (hospital.accountStatus || "INACTIVE") === "ACTIVE" ? (
                  <>
                    <XSquare size={16} />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckSquare size={16} />
                    Activate
                  </>
                )}
              </button>
            </div>
          )}
          {hospital.verificationStatus === "PENDING" && (
            <div className="flex items-center gap-3 mt-3 md:mt-0">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {actionLoading === "approve" ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Approve Hospital
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading === "reject" ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Reject Hospital
              </button>
            </div>
          )}
        </div>

        {hospital.rejectionReason && (
          <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
            <p className="text-red-700">{hospital.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building className="text-red-600" size={20} />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hospital Name</label>
                <p className="text-gray-800 font-medium">{hospital.hospitalName || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Doctor Name</label>
                <p className="text-gray-800 font-medium">{hospital.doctorName || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <p className="text-gray-800">{hospital.email || "N/A"}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact Number</label>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <p className="text-gray-800">{hospital.contactNumber || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Profile Details - ONLY SHOW FIELDS THAT EXIST IN RESPONSE */}
          {hospital.address || hospital.serviceType ? (
            <div className="bg-white rounded-lg border border-red-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="text-red-600" size={20} />
                Hospital Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospital.address && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Full Address</label>
                    <p className="text-gray-800">{hospital.address}</p>
                  </div>
                )}
                {hospital.serviceType && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Service Type</label>
                    <div className="flex items-center gap-2">
                      <FileCheck size={14} className="text-gray-400" />
                      <p className="text-gray-800">{hospital.serviceType}</p>
                    </div>
                  </div>
                )}
                {hospital.secondaryMobile && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Secondary Mobile</label>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <p className="text-gray-800">{hospital.secondaryMobile}</p>
                    </div>
                  </div>
                )}
                {hospital.alternateEmail && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Alternate Email</label>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <p className="text-gray-800">{hospital.alternateEmail}</p>
                    </div>
                  </div>
                )}
                {hospital.pincode && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Pincode</label>
                    <p className="text-gray-800">{hospital.pincode}</p>
                  </div>
                )}
                {hospital.purchaseName && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Purchase/Owner Name</label>
                    <p className="text-gray-800">{hospital.purchaseName}</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Registration & Certificates - ONLY SHOW IF DATA EXISTS */}
          {(hospital.hospitalRegistrationNumber || hospital.doctorRegistrationNumber ||
            hospital.hospitalCertificates?.length > 0 || hospital.doctorCertificates?.length > 0) && (
              <div className="bg-white rounded-lg border border-red-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileDigit className="text-red-600" size={20} />
                  Registration & Certificates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hospital.hospitalRegistrationNumber && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Hospital Registration Number</label>
                      <p className="text-gray-800">{hospital.hospitalRegistrationNumber}</p>
                    </div>
                  )}
                  {hospital.doctorRegistrationNumber && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Doctor Registration Number</label>
                      <p className="text-gray-800">{hospital.doctorRegistrationNumber}</p>
                    </div>
                  )}
                  {hospital.hospitalCertificates?.length > 0 && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Hospital Certificates</label>
                      <div className="space-y-1">
                        {hospital.hospitalCertificates.map((cert, index) => (
                          <a
                            key={index}
                            href={cert}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm truncate"
                          >
                            Certificate {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {hospital.doctorCertificates?.length > 0 && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Doctor Certificates</label>
                      <div className="space-y-1">
                        {hospital.doctorCertificates.map((cert, index) => (
                          <a
                            key={index}
                            href={cert}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm truncate"
                          >
                            Certificate {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Hospital Images - ONLY SHOW IF DATA EXISTS */}
          {hospital.hospitalImages?.length > 0 && (
            <div className="bg-white rounded-lg border border-red-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Image className="text-red-600" size={20} />
                Hospital Images
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hospital.hospitalImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Hospital image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <a
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center"
                    >
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                        View Full
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Agreement - ONLY SHOW IF DATA EXISTS */}
          {hospital.agreementAccepted !== undefined && (
            <div className="bg-white rounded-lg border border-red-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckSquare className="text-red-600" size={20} />
                Legal & Agreement
              </h2>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckSquare size={16} className={hospital.agreementAccepted ? "text-green-600" : "text-red-600"} />
                  <span className="text-gray-700">Agreement Accepted</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${hospital.agreementAccepted
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                  }`}>
                  {hospital.agreementAccepted ? "Yes" : "No"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          {/* Timeline Card */}
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="text-red-600" size={20} />
              Timeline
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Registration Date</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={14} className="text-gray-400" />
                  <p className="text-gray-800">{formatDate(hospital.createdAt)}</p>
                </div>
              </div>

              {hospital.verifiedAt && (
                <div>
                  <p className="text-sm text-gray-600">Verification Date</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={14} className="text-gray-400" />
                    <p className="text-gray-800">{formatDate(hospital.verifiedAt)}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={14} className="text-gray-400" />
                  <p className="text-gray-800">{formatDate(hospital.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card - ONLY ACTIONS THAT EXIST */}
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="text-red-600" size={20} />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={fetchHospitalDetails}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={actionLoading === "refresh" ? "animate-spin" : ""} />
                Refresh Data
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={actionLoading || hospital.verificationStatus !== "APPROVED"}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 ${(hospital.accountStatus || "INACTIVE") === "ACTIVE"
                  ? "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
                  : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                  }`}
              >
                {actionLoading === "toggle" ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (hospital.accountStatus || "INACTIVE") === "ACTIVE" ? (
                  <>
                    <XSquare size={16} />
                    Deactivate Hospital
                  </>
                ) : (
                  <>
                    <CheckSquare size={16} />
                    Activate Hospital
                  </>
                )}
              </button>
              {hospital.verificationStatus === "PENDING" && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === "approve" ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Approve Hospital
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === "reject" ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    Reject Hospital
                  </button>
                </>
              )}

              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white border border-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading === "delete" ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete Hospital
              </button>

              <button
                onClick={() => navigate(`/admin/hospitals/${tenantId}/doctors`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Users size={16} />
                View Doctors ({hospital.doctorCount || 0})
              </button>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Database className="text-red-600" size={20} />
              System Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tenant ID</span>
                <code className="text-sm font-mono text-red-700 bg-red-50 px-2 py-1 rounded">
                  {tenantId}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Status</span>
                <span className={`text-sm font-medium ${hospital.accountStatus === "ACTIVE" ? "text-green-700" :
                  hospital.accountStatus === "BLOCKED" ? "text-red-700" :
                    "text-yellow-700"
                  }`}>
                  {hospital.accountStatus || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Status</span>
                <span className={`text-sm font-medium ${hospital.isActive === true ? "text-green-700" : "text-red-700"
                  }`}>
                  {hospital.isActive === true ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Admin Verified</span>
                <span className={`text-sm font-medium ${hospital.verifiedByAdmin === true ? "text-green-700" : "text-red-700"
                  }`}>
                  {hospital.verifiedByAdmin === true ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* File Summary - ONLY SHOW IF FILES EXIST */}
          {(hospital.hospitalCertificates?.length > 0 || hospital.doctorCertificates?.length > 0 || hospital.hospitalImages?.length > 0) && (
            <div className="bg-white rounded-lg border border-red-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="text-red-600" size={20} />
                File Summary
              </h2>
              <div className="space-y-2">
                {hospital.hospitalCertificates?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hospital Certificates</span>
                    <span className="text-sm font-medium">
                      {hospital.hospitalCertificates.length} files
                    </span>
                  </div>
                )}
                {hospital.doctorCertificates?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Doctor Certificates</span>
                    <span className="text-sm font-medium">
                      {hospital.doctorCertificates.length} files
                    </span>
                  </div>
                )}
                {hospital.hospitalImages?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hospital Images</span>
                    <span className="text-sm font-medium">
                      {hospital.hospitalImages.length} images
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to All Hospitals
        </button>
      </div>
    </div>
  );
};

export default HospitalDetails;