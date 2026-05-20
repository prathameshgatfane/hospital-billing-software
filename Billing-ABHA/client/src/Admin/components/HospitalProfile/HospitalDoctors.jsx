import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doctorAdminApi } from "../../API/docApi";
import { adminApiService } from "../../API/adminApi";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Stethoscope,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckSquare,
  XSquare,
  FileText,
  Award,
  BadgeCheck,
  BadgeX,
  Users,
  Activity,
} from "lucide-react";

const HospitalDoctors = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch hospital details and doctors
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch hospital details
      const hospitalResponse = await adminApiService.getHospitalDetails(tenantId);
      if (!hospitalResponse.success) {
        throw new Error(hospitalResponse.message || "Failed to fetch hospital details");
      }

      const hospitalData = {
        ...hospitalResponse.client,
        ...hospitalResponse.profile,
        tenantId: tenantId,
      };
      setHospital(hospitalData);

      // Fetch doctors for this hospital
      const doctorsResponse = await doctorAdminApi.getDoctorsByHospital(tenantId);
      if (!doctorsResponse.success) {
        throw new Error(doctorsResponse.message || "Failed to fetch doctors");
      }

      setDoctors(doctorsResponse.doctors || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchData();
    }
  }, [tenantId]);

  // Handle doctor actions
  const handleApproveDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to approve this doctor?")) return;

    try {
      setActionLoading(`approve-${doctorId}`);
      await doctorAdminApi.approveDoctor(doctorId);
      alert("Doctor approved successfully!");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Doctor approval failed:", err);
      alert("Failed to approve doctor. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason || !reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      setActionLoading(`reject-${doctorId}`);
      await doctorAdminApi.rejectDoctor(doctorId, reason);
      alert("Doctor rejected successfully!");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Doctor rejection failed:", err);
      alert("Failed to reject doctor. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleDoctorStatus = async (doctorId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? "activate" : "deactivate";

    if (!window.confirm(`Are you sure you want to ${action} this doctor?`)) return;

    try {
      setActionLoading(`toggle-${doctorId}`);
      await doctorAdminApi.toggleDoctorStatus(doctorId, newStatus);
      alert(`Doctor ${action}d successfully!`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Doctor status toggle failed:", err);
      alert(`Failed to ${action} doctor. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
        label: "Pending",
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
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Filter doctors
  const filteredDoctors = doctors.filter(doctor => {
    // Search filter
    const matchesSearch = searchTerm === "" ||
      doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.doctorRegistrationNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "pending" && doctor.verificationStatus === "PENDING") ||
      (filterStatus === "approved" && doctor.verificationStatus === "APPROVED") ||
      (filterStatus === "rejected" && doctor.verificationStatus === "REJECTED") ||
      (filterStatus === "active" && doctor.isActive === true) ||
      (filterStatus === "inactive" && doctor.isActive === false);

    return matchesSearch && matchesStatus;
  });

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading doctors...</span>
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hospital Doctors</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-600">
                <span className="font-medium">{hospital?.hospitalName || "Hospital"}</span>
                <span className="mx-2">•</span>
                Tenant ID: <code className="ml-1 bg-gray-100 px-2 py-1 rounded">{tenantId}</code>
              </p>
              <span className="flex items-center gap-1 text-sm">
                <Users size={14} />
                {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={fetchData}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={actionLoading === "refresh" ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-800">{doctors.length}</p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">
                {doctors.filter(d => d.verificationStatus === "PENDING").length}
              </p>
            </div>
            <AlertCircle className="text-yellow-600" size={24} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {doctors.filter(d => d.verificationStatus === "APPROVED").length}
              </p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {doctors.filter(d => d.isActive === true).length}
              </p>
            </div>
            <Activity className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search doctors by name, speciality, or registration number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No doctors found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter"
                : "No doctors have been added to this hospital yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Doctor</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Speciality</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Registration</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Added On</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{doctor.fullName || "Unnamed Doctor"}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {doctor.email && (
                              <>
                                <Mail size={12} />
                                <span>{doctor.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-800">{doctor.speciality || "N/A"}</p>
                        {doctor.subSpeciality && (
                          <p className="text-sm text-gray-600">{doctor.subSpeciality}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <BadgeCheck size={16} className="text-gray-400" />
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {doctor.doctorRegistrationNumber || "N/A"}
                        </code>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        {getStatusBadge(doctor.verificationStatus)}
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${doctor.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={doctor.isActive ? "text-green-700" : "text-red-700"}>
                            {doctor.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDate(doctor.createdAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {/* Pending Approval Actions */}
                        {doctor.verificationStatus === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApproveDoctor(doctor._id)}
                              disabled={actionLoading?.startsWith("approve")}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 text-sm"
                            >
                              {actionLoading === `approve-${doctor._id}` ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : (
                                <CheckCircle size={12} />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectDoctor(doctor._id)}
                              disabled={actionLoading?.startsWith("reject")}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 border border-red-200 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 text-sm"
                            >
                              {actionLoading === `reject-${doctor._id}` ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : (
                                <XCircle size={12} />
                              )}
                              Reject
                            </button>
                          </>
                        )}

                        {/* Active/Inactive Toggle (for approved doctors) */}
                        {doctor.verificationStatus === "APPROVED" && (
                          <button
                            onClick={() => handleToggleDoctorStatus(doctor._id, doctor.isActive)}
                            disabled={actionLoading?.startsWith("toggle")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 text-sm ${doctor.isActive
                                ? "bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200"
                                : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                              }`}
                          >
                            {actionLoading === `toggle-${doctor._id}` ? (
                              <RefreshCw size={12} className="animate-spin" />
                            ) : doctor.isActive ? (
                              <>
                                <XSquare size={12} />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckSquare size={12} />
                                Activate
                              </>
                            )}
                          </button>
                        )}

                        {/* View Details (You can expand this) */}
                        <button
                          onClick={() => alert(`View details for ${doctor.fullName}`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          <FileText size={12} />
                          Details
                        </button>
                      </div>

                      {/* Rejection Reason */}
                      {doctor.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-xs">
                          <p className="font-medium text-red-800">Rejection Reason:</p>
                          <p className="text-red-700">{doctor.rejectionReason}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 text-sm text-gray-600">
        Showing {filteredDoctors.length} of {doctors.length} doctors
        {searchTerm && ` matching "${searchTerm}"`}
        {filterStatus !== "all" && ` with status "${filterStatus}"`}
      </div>
    </div>
  );
};

export default HospitalDoctors;