import {
  Plus, Search, Edit, Trash2,
  CheckCircle, AlertCircle, BriefcaseMedical,
  DollarSign, Tag, Clock, Download, Upload,
  FileSpreadsheet, Loader2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import opdServiceApi from '../../API/opdServiceApi';
import DataTable from '../Common/DataTable';
import { useEffect, useState } from 'react';

const ManageServices = () => {
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Consultation',
    price: '',
    description: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    "Consultation", "Doctor Fees", "Pathology",
    "Diagnostic", "Day Care", "Investigation",
    "Procedure", "Nursing", "Pharmacy", "Other"
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await opdServiceApi.getServices();
      if (response.success) {
        setServices(response.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      showStatus('error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        const response = await opdServiceApi.updateService(editingService._id, formData);
        if (response.success) {
          showStatus('success', 'Service updated successfully');
        }
      } else {
        const response = await opdServiceApi.addService(formData);
        if (response.success) {
          showStatus('success', 'Service added successfully');
        }
      }
      setShowModal(false);
      setEditingService(null);
      setFormData({ name: '', category: 'Consultation', price: '', description: '' });
      fetchServices();
    } catch (error) {
      showStatus('error', error.message || 'Action failed');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await opdServiceApi.deleteService(id);
        showStatus('success', 'Service deleted successfully');
        fetchServices();
      } catch (error) {
        showStatus('error', 'Failed to delete service');
      }
    }
  };

  /* ─── Bulk Upload Logic ─── */
  const handleDownloadTemplate = () => {
    const templateData = [
      { "Service Name": "Consultation (Gen)", "Category": "Consultation", "Price": 500, "Description": "General consultation charges" },
      { "Service Name": "CBC Blood Test", "Category": "Pathology", "Price": 350, "Description": "Complete Blood Count" },
      { "Service Name": "X-Ray Chest", "Category": "Diagnostic", "Price": 800, "Description": "Chest X-Ray scan" },
      { "Service Name": "I.V. Fluid Administration", "Category": "Nursing", "Price": 150, "Description": "Nursing charges for IV" }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OPD Services");

    // Set column widths
    ws['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 40 }];

    XLSX.writeFile(wb, "OPD_Services_Template.xlsx");
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);

        if (rawData.length === 0) {
          showStatus('error', 'The uploaded file is empty');
          setBulkLoading(false);
          return;
        }

        // Map column names to API structure
        const cleanedData = rawData.map(row => ({
          name: row["Service Name"] || row["name"] || row["Service"],
          category: row["Category"] || row["category"] || "Consultation",
          price: Number(row["Price"] || row["price"] || 0),
          description: row["Description"] || row["description"] || ""
        })).filter(s => s.name && s.price > 0);

        if (cleanedData.length === 0) {
          showStatus('error', 'No valid services found. Check column headers.');
          setBulkLoading(false);
          return;
        }

        const response = await opdServiceApi.bulkAddServices(cleanedData);
        if (response.success) {
          showStatus('success', `Bulk upload successful! ${cleanedData.length} services added/updated.`);
          fetchServices();
        }
      } catch (err) {
        console.error('Bulk upload processing error:', err);
        showStatus('error', 'Failed to process Excel file');
      } finally {
        setBulkLoading(false);
        e.target.value = ''; // Reset input
      }
    };
    reader.readAsBinaryString(file);
  };

  const columns = [
    {
      header: 'Service Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <BriefcaseMedical className="w-4 h-4 text-red-600" />
          </div>
          <span className="font-medium text-gray-900">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
          {row.category}
        </span>
      )
    },
    {
      header: 'Price (₹)',
      accessor: 'price',
      render: (row) => (
        <span className="font-semibold text-gray-900">₹{row.price}</span>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <span className="text-sm text-gray-500 truncate max-w-xs block">
          {row.description || '-'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleEdit(row)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage OPD Services</h1>
          <p className="text-gray-600 mt-1 text-sm">Add and manage services offered in the OPD section</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bulk Actions */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 mr-2">
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-white rounded-md flex items-center transition-all"
              title="Download Excel Template"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Template
            </button>
            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
            <label className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-700 hover:bg-white rounded-md flex items-center cursor-pointer transition-all">
              {bulkLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Bulk Upload
                  <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleBulkUpload} disabled={bulkLoading} />
                </>
              )}
            </label>
          </div>

          <button
            onClick={() => {
              setEditingService(null);
              setFormData({ name: '', category: 'Consultation', price: '', description: '' });
              setShowModal(true);
            }}
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 flex items-center shadow-sm text-sm font-bold transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-3" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-3" />
          )}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={services}
          loading={loading}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="e.g. Consultation Fee"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-24"
                  placeholder="Optional service description..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
                >
                  {editingService ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
