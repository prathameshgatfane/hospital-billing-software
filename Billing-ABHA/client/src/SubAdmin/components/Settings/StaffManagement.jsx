import React, { useState, useEffect } from 'react';
import {
  UserPlus, Trash2, Edit, CheckCircle, XCircle,
  Mail, Phone, Shield, Users, RefreshCw
} from 'lucide-react';
import staffApi from '../../API/staffApi';

const PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'patients', label: 'Patients' },
  { key: 'opd', label: 'OPD Billing' },
  { key: 'ipd', label: 'IPD' },
  { key: 'laboratory', label: 'Laboratory' },
  { key: 'documents', label: 'Documents' },
  { key: 'doctor', label: 'Doctor Dashboard' },
  { key: 'settings', label: 'Settings' },
];

const defaultForm = { name: '', email: '', mobile: '', permissions: [] };

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await staffApi.getStaff();
      if (res.success) setStaffList(res.data);
    } catch (e) {
      setError('Failed to load staff list.');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (key) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter(p => p !== key)
        : [...f.permissions, key]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editingId) {
        await staffApi.updateStaff(editingId, form);
        setSuccessMsg('Staff updated successfully!');
      } else {
        await staffApi.createStaff(form);
        setSuccessMsg(`Staff created! Credentials sent to ${form.email}.`);
      }
      setShowForm(false);
      setForm(defaultForm);
      setEditingId(null);
      fetchStaff();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to save staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, email: s.email, mobile: s.mobile, permissions: s.permissions });
    setEditingId(s._id);
    setShowForm(true);
    setSuccessMsg('');
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this staff member?')) return;
    try {
      await staffApi.deleteStaff(id);
      fetchStaff();
    } catch (e) {
      setError('Failed to delete staff member.');
    }
  };

  const handleToggleActive = async (s) => {
    try {
      await staffApi.updateStaff(s._id, { isActive: !s.isActive });
      fetchStaff();
    } catch (e) {
      setError('Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" /> Staff Login Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Create logins for your staff. Each person receives their credentials by email.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setForm(defaultForm); setEditingId(null); setSuccessMsg(''); setError(''); }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Create Login
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3">
          <CheckCircle className="w-5 h-5" /> {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3">
          <XCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Staff Member' : 'Create New Staff Login'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. priya@hospital.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  disabled={!!editingId}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={form.mobile}
                  onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Shield className="w-4 h-4 text-red-500" /> Module Access (tick what this person can see)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PERMISSIONS.map(p => (
                  <label
                    key={p.key}
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      form.permissions.includes(p.key)
                        ? 'bg-red-50 border-red-400 text-red-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-red-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.permissions.includes(p.key)}
                      onChange={() => togglePermission(p.key)}
                      className="accent-red-600"
                    />
                    <span className="text-sm font-medium">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                {editingId ? 'Save Changes' : 'Create & Send Credentials'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(defaultForm); setEditingId(null); }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : staffList.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-900 font-semibold">No staff members yet</p>
            <p className="text-gray-500 text-sm">Create a login to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Contact</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Permissions</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staffList.map(s => (
                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{s.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600"><Mail className="w-3 h-3" /> {s.email}</div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5"><Phone className="w-3 h-3" /> {s.mobile}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(!s.permissions || s.permissions.length === 0)
                        ? <span className="text-gray-400 text-xs">No access</span>
                        : s.permissions.map(p => (
                          <span key={p} className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium capitalize">
                            {PERMISSIONS.find(x => x.key === p)?.label || p}
                          </span>
                        ))
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(s)}
                      className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full transition-colors ${
                        s.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {s.isActive ? <><CheckCircle className="w-3 h-3" /> Active</> : <><XCircle className="w-3 h-3" /> Disabled</>}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(s)} className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
