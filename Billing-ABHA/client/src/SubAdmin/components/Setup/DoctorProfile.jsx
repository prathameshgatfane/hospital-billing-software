import React, { useState, useEffect } from 'react';
import { 
  Plus, Users, UserCheck, UserX, Clock, 
  CheckCircle, XCircle, Edit2, Trash2, Filter,
  Search, Stethoscope, Award, ShieldAlert, AlertCircle,
  Loader2, FileText, Mail, Phone, Calendar, MapPin
} from 'lucide-react';
import { doctorApi } from '../../API/docApi';
import DoctorForm from './DoctorForm';

const DoctorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorApi.getMyDoctors();
      if (response.success) {
        setDoctors(response.doctors || []);
        calculateStats(response.doctors || []);
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

  const fetchSpecialties = async () => {
    try {
      const response = await doctorApi.getSpecialties();
      if (response.success) {
        setSpecialties(response.specialties || []);
      }
    } catch (error) {
      console.error('Fetch specialties error:', error);
    }
  };

  const calculateStats = (doctorsList) => {
    const stats = {
      total: doctorsList.length,
      approved: doctorsList.filter(d => d.verificationStatus === 'APPROVED').length,
      pending: doctorsList.filter(d => d.verificationStatus === 'PENDING').length,
      rejected: doctorsList.filter(d => d.verificationStatus === 'REJECTED').length
    };
    setStats(stats);
  };

  const handleAddDoctor = async (doctorData) => {
    try {
      const response = await doctorApi.addDoctor(doctorData);
      if (response.success) {
        setShowForm(false);
        fetchDoctors();
        return { success: true, message: 'Doctor submitted for approval' };
      } else {
        return { success: false, message: response.message || 'Failed to add doctor' };
      }
    } catch (error) {
      console.error('Add doctor error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add doctor' 
      };
    }
  };

  const handleEditDoctor = (doctor) => {
    // Map backend data to frontend form fields
    const mappedDoctor = {
      ...doctor,
      phoneNumber: doctor.mobile, // Map mobile to phoneNumber
      experience: doctor.experienceYears, // Map experienceYears to experience
      charges: doctor.charges || {
        consultationFee: '',
        followUpFee: '',
        emergencyFee: '',
      }
    };
    setEditingDoctor(mappedDoctor);
    setShowForm(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to remove this doctor?')) return;
    // Implement delete functionality when API is ready
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

  const filteredDoctors = doctors.filter(doctor => {
    if (filterStatus !== 'ALL' && doctor.verificationStatus !== filterStatus) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        doctor.fullName?.toLowerCase().includes(query) ||
        doctor.speciality?.toLowerCase().includes(query) ||
        doctor.doctorRegistrationNumber?.toLowerCase().includes(query) ||
        doctor.email?.toLowerCase().includes(query) ||
        doctor.mobile?.toLowerCase().includes(query) // Search by mobile too
      );
    }
    
    return true;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-gray-600">Add and manage doctors in your hospital</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Doctor
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
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <UserCheck className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
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
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === 'ALL' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Doctors
            </button>
            <button
              onClick={() => setFilterStatus('APPROVED')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === 'APPROVED' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('REJECTED')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Rejected
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name, specialty, or ID..."
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
              {doctors.length === 0 ? 'No Doctors Added' : 'No Doctors Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {doctors.length === 0 
                ? 'Get started by adding your first doctor to the system.'
                : 'Try adjusting your filters or search query.'}
            </p>
            {doctors.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Add First Doctor
              </button>
            )}
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
                    Registration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                              {doctor.mobile || 'No phone'} {/* Display mobile field */}
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
                            {doctor.experienceYears ? `${doctor.experienceYears} years` : 'Experience not specified'} {/* Display experienceYears */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doctor.doctorRegistrationNumber || 'Not provided'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Registration
                          </p>
                          {doctor.qualification && (
                            <p className="text-sm text-gray-600 mt-1">{doctor.qualification}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                            {statusBadge.icon}
                            <span className="ml-1">{statusBadge.label}</span>
                          </div>
                          {doctor.rejectionReason && doctor.verificationStatus === 'REJECTED' && (
                            <div className="ml-2 text-xs text-red-600" title={doctor.rejectionReason}>
                              <AlertCircle className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        {doctor.verifiedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Approved on: {new Date(doctor.verifiedAt).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {doctor.verificationStatus === 'PENDING' && (
                            <button
                              onClick={() => handleEditDoctor(doctor)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteDoctor(doctor._id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Doctor Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DoctorForm
              specialties={specialties}
              onSubmit={handleAddDoctor}
              onClose={() => {
                setShowForm(false);
                setEditingDoctor(null);
              }}
              editingDoctor={editingDoctor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;