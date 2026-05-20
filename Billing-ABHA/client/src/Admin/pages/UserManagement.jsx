import React, { useState, useEffect } from "react";
import { adminApiService } from "../API/adminApi";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
  AlertCircle,
  Users,
  Shield,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  Phone,
  Building,
  Download,
  Clock,
  Home,
  CheckSquare,
  XSquare,
  Activity,
} from "lucide-react";

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const navigate = useNavigate();

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0,
  });

  // Fetch all hospitals
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both pending and approved hospitals
      const [pendingResponse, approvedResponse] = await Promise.all([
        adminApiService.getPendingHospitals(),
        adminApiService.getApprovedHospitals(),
      ]);

      // Combine all hospitals
      const allHospitals = [
        ...(pendingResponse.profiles || []),
        ...(approvedResponse.hospitals || []),
      ];

      setHospitals(allHospitals);
      updateStats(allHospitals);
      
    } catch (err) {
      console.error("Failed to fetch hospitals:", err);
      setError("Failed to load hospital data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data) => {
    const statsData = {
      total: data.length,
      pending: data.filter(h => h.verificationStatus === "PENDING").length,
      approved: data.filter(h => h.verificationStatus === "APPROVED").length,
      rejected: data.filter(h => h.verificationStatus === "REJECTED").length,
      active: data.filter(h => h.accountStatus === "ACTIVE").length,
    };
    setStats(statsData);
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Handle hospital actions
  const handleApprove = async (tenantId) => {
    if (!window.confirm("Are you sure you want to approve this hospital?")) return;

    try {
      setActionLoading(`approve-${tenantId}`);
      await adminApiService.approveHospital(tenantId);
      
      // Update the specific hospital's status
      setHospitals(prev => prev.map(h => 
        h.tenantId === tenantId 
          ? { ...h, verificationStatus: "APPROVED", accountStatus: "ACTIVE" }
          : h
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
        active: prev.active + 1,
      }));
      
      alert("Hospital approved successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve hospital. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (tenantId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason || !reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      setActionLoading(`reject-${tenantId}`);
      await adminApiService.rejectHospital(tenantId, reason);
      
      // Update the specific hospital's status
      setHospitals(prev => prev.map(h => 
        h.tenantId === tenantId 
          ? { ...h, verificationStatus: "REJECTED" }
          : h
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
      }));
      
      alert("Hospital rejected successfully!");
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Failed to reject hospital. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (tenantId) => {
    if (!window.confirm("Are you sure you want to delete this hospital? This action cannot be undone.")) return;

    try {
      setActionLoading(`delete-${tenantId}`);
      await adminApiService.deleteHospital(tenantId);
      
      // Remove hospital from list
      const hospitalToDelete = hospitals.find(h => h.tenantId === tenantId);
      
      setHospitals(prev => prev.filter(h => h.tenantId !== tenantId));
      
      // Update stats based on the deleted hospital's status
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        pending: hospitalToDelete?.verificationStatus === "PENDING" ? prev.pending - 1 : prev.pending,
        approved: hospitalToDelete?.verificationStatus === "APPROVED" ? prev.approved - 1 : prev.approved,
        rejected: hospitalToDelete?.verificationStatus === "REJECTED" ? prev.rejected - 1 : prev.rejected,
        active: hospitalToDelete?.accountStatus === "ACTIVE" ? prev.active - 1 : prev.active,
      }));
      
      alert("Hospital deleted successfully!");
    } catch (err) {
      console.error("Deletion failed:", err);
      alert("Failed to delete hospital. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (tenantId) => {
    navigate(`/admin/hospital/${tenantId}`);
  };

  // In HospitalManagement component, replace the handleToggleStatus function:
const handleToggleStatus = async (tenantId, currentStatus) => {
  const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  const action = newStatus === "ACTIVE" ? "activate" : "deactivate";
  
  if (!window.confirm(`Are you sure you want to ${action} this hospital?`)) return;

  try {
    setActionLoading(`status-${tenantId}`);
    await adminApiService.toggleHospitalStatus(tenantId);
    
    // Update the specific hospital's status
    setHospitals(prev => prev.map(h => 
      h.tenantId === tenantId 
        ? { ...h, accountStatus: newStatus }
        : h
    ));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      active: newStatus === "ACTIVE" ? prev.active + 1 : prev.active - 1,
    }));
    
    alert(`Hospital ${action}d successfully!`);
  } catch (err) {
    console.error("Status toggle failed:", err);
    alert(`Failed to ${action} hospital. Please try again.`);
  } finally {
    setActionLoading(null);
  }
};

  // Filter hospitals based on search and status
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = 
      hospital.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.tenantId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      selectedStatus === "ALL" || 
      hospital.verificationStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get verification status badge
  const getVerificationBadge = (status) => {
    const statusConfig = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
      APPROVED: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Approved",
      },
      REJECTED: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        icon: <XCircle className="w-3 h-3" />,
        label: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Get account status badge
  const getAccountStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
        icon: <Activity className="w-3 h-3" />,
        label: "Active",
      },
      INACTIVE: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-200",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Inactive",
      },
      SUSPENDED: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-200",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Suspended",
      },
    };

    const config = statusConfig[status] || statusConfig.INACTIVE;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading hospitals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hospital Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all hospital registrations and accounts
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={fetchHospitals}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hospitals</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-red-200 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by hospital name, email, or ID..."
                className="w-full pl-10 pr-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-600" />
              <select
                className="border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent min-w-[140px]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Hospitals Table */}
      <div className="bg-white rounded-lg border border-red-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-red-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-red-800">Hospital</th>
                <th className="text-left p-4 text-sm font-semibold text-red-800">Contact</th>
                <th className="text-left p-4 text-sm font-semibold text-red-800">Verification</th>
                <th className="text-left p-4 text-sm font-semibold text-red-800">Account</th>
                <th className="text-left p-4 text-sm font-semibold text-red-800">Registered</th>
                <th className="text-left p-4 text-sm font-semibold text-red-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Home className="w-12 h-12 text-gray-300 mb-2" />
                      <p>No hospitals found</p>
                      {searchTerm && (
                        <p className="text-sm mt-1">Try adjusting your search criteria</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHospitals.map((hospital) => (
                  <tr key={hospital.tenantId} className="border-b border-red-100 hover:bg-red-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Building size={20} className="text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{hospital.hospitalName || "Unnamed Hospital"}</p>
                          <p className="text-xs text-gray-500">ID: {hospital.tenantId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm truncate max-w-[180px]">{hospital.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-sm">{hospital.contactNumber || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getVerificationBadge(hospital.verificationStatus)}
                    </td>
                    <td className="p-4">
                      {getAccountStatusBadge(hospital.accountStatus || "INACTIVE")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm">{formatDate(hospital.createdAt)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(hospital.tenantId)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {/* Show approve/reject buttons only for pending hospitals */}
                        {hospital.verificationStatus === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(hospital.tenantId)}
                              disabled={actionLoading === `approve-${hospital.tenantId}`}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              {actionLoading === `approve-${hospital.tenantId}` ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(hospital.tenantId)}
                              disabled={actionLoading === `reject-${hospital.tenantId}`}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              {actionLoading === `reject-${hospital.tenantId}` ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <XCircle size={16} />
                              )}
                            </button>
                          </>
                        )}

                        {/* Show status toggle for approved hospitals */}
                        {hospital.verificationStatus === "APPROVED" && (
                          <button
                            onClick={() => handleToggleStatus(hospital.tenantId, hospital.accountStatus || "INACTIVE")}
                            disabled={actionLoading === `status-${hospital.tenantId}`}
                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                              (hospital.accountStatus || "INACTIVE") === "ACTIVE" 
                                ? "text-orange-600 hover:bg-orange-50" 
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={(hospital.accountStatus || "INACTIVE") === "ACTIVE" ? "Deactivate" : "Activate"}
                          >
                            {actionLoading === `status-${hospital.tenantId}` ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (hospital.accountStatus || "INACTIVE") === "ACTIVE" ? (
                              <XSquare size={16} />
                            ) : (
                              <CheckSquare size={16} />
                            )}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(hospital.tenantId)}
                          disabled={actionLoading === `delete-${hospital.tenantId}`}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {actionLoading === `delete-${hospital.tenantId}` ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredHospitals.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {filteredHospitals.length} of {hospitals.length} hospitals
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-red-200 rounded-lg text-sm text-gray-700 hover:bg-red-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-red-200 rounded-lg text-sm text-gray-700 hover:bg-red-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-red-200 rounded-lg text-sm text-gray-700 hover:bg-red-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalManagement;