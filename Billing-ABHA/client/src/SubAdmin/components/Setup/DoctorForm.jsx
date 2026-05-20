import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';

const DoctorForm = ({ specialties, onSubmit, onClose, editingDoctor }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '', // This maps to "mobile" in backend
    speciality: '',
    subSpeciality: '',
    qualification: '',
    experience: '', // This maps to "experienceYears" in backend
    doctorRegistrationNumber: '',
    charges: {
      consultationFee: '', // Maps to opdConsultation
      followUpFee: '',    // Maps to opdFollowUp
      emergencyFee: '',   // Maps to emergency
    },
    agreementAccepted: false,
  });

  const [availableSubSpecialties, setAvailableSubSpecialties] = useState([]);

  useEffect(() => {
    if (editingDoctor) {
      setFormData({
        fullName: editingDoctor.fullName || '',
        email: editingDoctor.email || '',
        phoneNumber: editingDoctor.phoneNumber || editingDoctor.mobile || '', // Handle both fields
        speciality: editingDoctor.speciality || '',
        subSpeciality: editingDoctor.subSpeciality || '',
        qualification: editingDoctor.qualification || '',
        experience: editingDoctor.experience || editingDoctor.experienceYears || '', // Handle both fields
        doctorRegistrationNumber: editingDoctor.doctorRegistrationNumber || '',
        charges: editingDoctor.charges || {
          consultationFee: '',
          followUpFee: '',
          emergencyFee: '',
        },
        agreementAccepted: editingDoctor.agreementAccepted || false,
      });
      
      if (editingDoctor.speciality) {
        const selectedSpecialty = specialties.find(s => s.name === editingDoctor.speciality);
        setAvailableSubSpecialties(selectedSpecialty?.subSpecialties || []);
      }
    }
  }, [editingDoctor, specialties]);

  const handleSpecialityChange = (e) => {
    const selectedSpeciality = e.target.value;
    setFormData({
      ...formData,
      speciality: selectedSpeciality,
      subSpeciality: ''
    });

    const selectedSpecialty = specialties.find(s => s.name === selectedSpeciality);
    setAvailableSubSpecialties(selectedSpecialty?.subSpecialties || []);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    if (!formData.speciality) {
      newErrors.speciality = 'Speciality is required';
    }

    if (!formData.doctorRegistrationNumber?.trim()) {
      newErrors.doctorRegistrationNumber = 'Registration number is required';
    }

    if (!formData.qualification?.trim()) {
      newErrors.qualification = 'Qualification is required';
    }

    if (!formData.experience) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(formData.experience) || formData.experience < 0 || formData.experience > 50) {
      newErrors.experience = 'Experience must be between 0 and 50 years';
    }

    if (!formData.charges.consultationFee) {
      newErrors.consultationFee = 'Consultation fee is required';
    }

    if (!formData.agreementAccepted) {
      newErrors.agreementAccepted = 'You must accept the agreement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');

    const result = await onSubmit(formData);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setErrors({ submit: result.message });
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('charges.')) {
      const chargeField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        charges: {
          ...prev.charges,
          [chargeField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errors.submit}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Dr. John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="doctor@hospital.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number * (10 digits)
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="9876543210"
                maxLength="10"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speciality *
              </label>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleSpecialityChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.speciality ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Speciality</option>
                {specialties.map((specialty) => (
                  <option key={specialty.name} value={specialty.name}>
                    {specialty.name}
                  </option>
                ))}
              </select>
              {errors.speciality && (
                <p className="mt-1 text-sm text-red-600">{errors.speciality}</p>
              )}
            </div>

            {availableSubSpecialties.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-Speciality (Optional)
                </label>
                <select
                  name="subSpeciality"
                  value={formData.subSpeciality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Sub-Speciality</option>
                  {availableSubSpecialties.map((subSpecialty) => (
                    <option key={subSpecialty} value={subSpecialty}>
                      {subSpecialty}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualification *
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.qualification ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MBBS, MD, etc."
              />
              {errors.qualification && (
                <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Years) *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.experience ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10"
                min="0"
                max="50"
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Registration Number *
              </label>
              <input
                type="text"
                name="doctorRegistrationNumber"
                value={formData.doctorRegistrationNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.doctorRegistrationNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter registration number"
              />
              {errors.doctorRegistrationNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.doctorRegistrationNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Fee Structure */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Structure (₹)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OPD Consultation Fee *
              </label>
              <input
                type="number"
                name="charges.consultationFee"
                value={formData.charges.consultationFee}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.consultationFee ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="500"
                min="0"
              />
              {errors.consultationFee && (
                <p className="mt-1 text-sm text-red-600">{errors.consultationFee}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OPD Follow-up Fee
              </label>
              <input
                type="number"
                name="charges.followUpFee"
                value={formData.charges.followUpFee}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="300"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Fee
              </label>
              <input
                type="number"
                name="charges.emergencyFee"
                value={formData.charges.emergencyFee}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="1000"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="agreementAccepted"
                name="agreementAccepted"
                checked={formData.agreementAccepted}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="agreementAccepted" className="text-gray-700">
                I confirm that all information provided is accurate and I have verified 
                the doctor's registration credentials. I understand that false information 
                may lead to account suspension.
              </label>
              {errors.agreementAccepted && (
                <p className="mt-1 text-red-600 text-sm">{errors.agreementAccepted}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {editingDoctor ? 'Updating...' : 'Submitting...'}
              </>
            ) : editingDoctor ? (
              'Update Doctor'
            ) : (
              'Submit for Approval'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;