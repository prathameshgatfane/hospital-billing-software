import React, { useState, useEffect, useRef } from 'react';
import {
  Save, Microscope, Plus, Trash2, ChevronDown, ChevronRight, CheckCircle, AlertCircle, Building, Beaker, FileSpreadsheet, Upload, Download
} from 'lucide-react';
import * as XLSX from 'xlsx';
import investigationSettingsApi from '../../API/investigationSettingsApi';

const InvestigationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState({
    hasInhouseInvestigation: false,
    departments: []
  });
  const [expandedDepts, setExpandedDepts] = useState({});
  const [expandedCats, setExpandedCats] = useState({});
  const mountedRef = useRef(true);
  const messageTimerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    fetchSettings();

    return () => {
      mountedRef.current = false;
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  const fetchSettings = async () => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      showStatus('error', 'Session expired. Please login again.');
      setFetching(false);
      return;
    }

    setFetching(true);
    try {
      const res = await investigationSettingsApi.getSettings();
      if (!mountedRef.current) return;

      if (res.success && res.data) {
        setSettings({
          hasInhouseInvestigation: res.data.hasInhouseInvestigation || false,
          departments: res.data.departments || []
        });
        if (res.data.departments?.length > 0) {
          setExpandedDepts({ 0: true });
        }
      }
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('Settings fetch error:', err?.response?.data || err.message);
      const msg = err?.response?.data?.message || 'Failed to load investigation settings';
      showStatus('error', msg);
    } finally {
      if (mountedRef.current) setFetching(false);
    }
  };

  const showStatus = (type, text) => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    setMessage({ type, text });
    messageTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setMessage({ type: '', text: '' });
    }, 5000);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('clientToken');

    if (!token) {
      showStatus('error', 'Session expired. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const response = await investigationSettingsApi.updateSettings(
        settings,
        token
      );

      if (!mountedRef.current) return;

      if (response.success) {
        showStatus('success', 'Investigation settings updated successfully');
      }
    } catch (err) {
      if (!mountedRef.current) return;

      console.error(
        'Settings update error:',
        err?.response?.data || err.message
      );

      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Failed to update settings';

      showStatus('error', msg);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Department': 'Pathology',
        'Category': 'Hematology',
        'Service Name': 'Complete Blood Count (CBC)',
        'Price': 500,
        'Description': 'Basic blood test'
      },
      {
        'Department': 'Pathology',
        'Category': 'Biochemistry',
        'Service Name': 'Blood Sugar (Fasting)',
        'Price': 100,
        'Description': 'Check fasting glucose level'
      },
      {
        'Department': 'Radiology',
        'Category': 'X-Ray',
        'Service Name': 'Chest X-Ray PA View',
        'Price': 400,
        'Description': 'Lung and chest imaging'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Investigations");
    XLSX.writeFile(wb, "Investigation_Template.xlsx");
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await investigationSettingsApi.bulkUpload(file);
      if (response.success) {
        showStatus('success', response.message || 'Bulk upload successful');
        if (response.data) {
          setSettings({
            hasInhouseInvestigation: response.data.hasInhouseInvestigation || false,
            departments: response.data.departments || []
          });
        }
      }
    } catch (err) {
      console.error('Bulk upload error:', err);
      showStatus('error', err?.response?.data?.message || 'Failed to process file');
    } finally {
      setLoading(false);
      e.target.value = ''; // Reset input
    }
  };

  const toggleDept = (idx) => {
    setExpandedDepts(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleCat = (deptIdx, catIdx) => {
    const key = `${deptIdx}-${catIdx}`;
    setExpandedCats(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addDepartment = () => {
    setSettings(prev => {
      const newDepts = [...prev.departments, { name: 'New Department', categories: [] }];
      setExpandedDepts(e => ({ ...e, [newDepts.length - 1]: true }));
      return { ...prev, departments: newDepts };
    });
  };

  const updateDeptName = (deptIdx, newName) => {
    setSettings(prev => {
      const newDepts = [...prev.departments];
      newDepts[deptIdx] = { ...newDepts[deptIdx], name: newName };
      return { ...prev, departments: newDepts };
    });
  };

  const removeDepartment = (deptIdx) => {
    setSettings(prev => ({
      ...prev,
      departments: prev.departments.filter((_, i) => i !== deptIdx)
    }));
  };

  const addCategory = (deptIdx) => {
    setSettings(prev => {
      const newDepts = [...prev.departments];
      const newCategories = [...newDepts[deptIdx].categories, { name: 'New Category', services: [] }];
      const catIdx = newCategories.length - 1;
      newDepts[deptIdx] = { ...newDepts[deptIdx], categories: newCategories };
      setExpandedCats(e => ({ ...e, [`${deptIdx}-${catIdx}`]: true }));
      return { ...prev, departments: newDepts };
    });
  };

  const updateCatName = (deptIdx, catIdx, newName) => {
    setSettings(prev => {
      const newDepts = [...prev.departments];
      const newCategories = [...newDepts[deptIdx].categories];
      newCategories[catIdx] = { ...newCategories[catIdx], name: newName };
      newDepts[deptIdx] = { ...newDepts[deptIdx], categories: newCategories };
      return { ...prev, departments: newDepts };
    });
  };

  const removeCategory = (deptIdx, catIdx) => {
    setSettings(prev => {
      const newDepts = [...prev.departments];
      newDepts[deptIdx] = {
        ...newDepts[deptIdx],
        categories: newDepts[deptIdx].categories.filter((_, i) => i !== catIdx)
      };
      return { ...prev, departments: newDepts };
    });
  };

  const addService = (deptIdx, catIdx) => {
    setSettings(prev => {
      const newDepts = [...prev.departments];
      const newCategories = [...newDepts[deptIdx].categories];
      newCategories[catIdx] = {
        ...newCategories[catIdx],
        services: [...newCategories[catIdx].services, { name: '', price: 0, description: '' }]
      };
      newDepts[deptIdx] = { ...newDepts[deptIdx], categories: newCategories };
      return { ...prev, departments: newDepts };
    });
  };

  const updateService = (deptIdx, catIdx, srvIdx, field, value) => {
    setSettings(prev => {
      const newDepts = [...prev.departments];
      const newCategories = [...newDepts[deptIdx].categories];
      const newServices = [...newCategories[catIdx].services];
      newServices[srvIdx] = { ...newServices[srvIdx], [field]: value };
      newCategories[catIdx] = { ...newCategories[catIdx], services: newServices };
      newDepts[deptIdx] = { ...newDepts[deptIdx], categories: newCategories };
      return { ...prev, departments: newDepts };
    });
  };

  const removeService = (deptIdx, catIdx, srvIdx) => {
    setSettings(prev => {
      const newDepts = [...prev.departments];
      const newCategories = [...newDepts[deptIdx].categories];
      newCategories[catIdx] = {
        ...newCategories[catIdx],
        services: newCategories[catIdx].services.filter((_, i) => i !== srvIdx)
      };
      newDepts[deptIdx] = { ...newDepts[deptIdx], categories: newCategories };
      return { ...prev, departments: newDepts };
    });
  };

  const inp = `
    width: 100%; padding: 8px 12px; font-size: 13px;
    border: 1px solid #E9ECEF; border-radius: 8px; outline: none;
    background: #fff; color: #111827;
    font-family: 'DM Sans', sans-serif; box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
  `;

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .inv-inp { ${inp} }
        .inv-inp:focus { border-color: #DC2626 !important; box-shadow: 0 0 0 3px rgba(220,38,38,0.1) !important; }
      `}</style>

      <datalist id="department-suggestions">
        <option value="Pathology" />
        <option value="Radiology" />
        <option value="Cardiology" />
        <option value="Neurology" />
      </datalist>

      <datalist id="category-suggestions">
        <option value="Hematology" />
        <option value="Biochemistry" />
        <option value="Microbiology" />
        <option value="Clinical Pathology" />
        <option value="Immunology & Serology" />
        <option value="Histopathology" />
        <option value="X-Ray" />
        <option value="Ultrasound (USG)" />
        <option value="CT Scan" />
        <option value="MRI" />
        <option value="ECG" />
      </datalist>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Microscope className="w-5 h-5 text-red-600" />
            <div>
              <h2 className="text-base font-bold text-gray-900">In-house Investigations</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage departments, categories, and lab tests offered in-house.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              Template
            </button>
            <label className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Bulk Upload
              <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleBulkUpload}
                disabled={loading}
              />
            </label>
          </div>
        </div>

        {message.text && (
          <div className={`mx-6 mt-6 p-3 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="p-6">
          {/* Toggle In-house */}
          <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${settings.hasInhouseInvestigation ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Enable In-house Investigations</h3>
                <p className="text-xs text-gray-500 mt-1">Allow your hospital to manage and bill its own lab and radiology services.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.hasInhouseInvestigation}
                onChange={(e) => setSettings(prev => ({ ...prev, hasInhouseInvestigation: e.target.checked }))}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {settings.hasInhouseInvestigation && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-gray-400" /> Departments
                </h3>
                <button type="button" onClick={addDepartment} className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Plus className="w-3 h-3" /> Add Department
                </button>
              </div>

              <div className="space-y-4">
                {settings.departments.map((dept, deptIdx) => (
                  <div key={deptIdx} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 flex items-center gap-4">
                      <button type="button" onClick={() => toggleDept(deptIdx)} className="text-gray-400 hover:text-gray-600 shrink-0">
                        {expandedDepts[deptIdx] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                      <input
                        type="text"
                        list="department-suggestions"
                        value={dept.name}
                        onChange={(e) => updateDeptName(deptIdx, e.target.value)}
                        className="inv-inp font-bold text-sm bg-transparent border-transparent hover:border-gray-300 focus:bg-white"
                        placeholder="Department Name"
                      />
                      <div className="ml-auto flex items-center gap-2 shrink-0">
                        <button type="button" onClick={() => addCategory(deptIdx)} className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Category
                        </button>
                        <button type="button" onClick={() => removeDepartment(deptIdx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {expandedDepts[deptIdx] && (
                      <div className="p-4 bg-white border-t border-gray-100 space-y-4">
                        {dept.categories.length === 0 && (
                          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-sm text-gray-400 font-medium">No categories added yet.</p>
                            <button type="button" onClick={() => addCategory(deptIdx)} className="text-xs font-bold text-red-600 mt-2 hover:underline">Add First Category</button>
                          </div>
                        )}

                        {dept.categories.map((cat, catIdx) => {
                          const catKey = `${deptIdx}-${catIdx}`;
                          return (
                            <div key={catIdx} className="border border-gray-100 rounded-lg overflow-hidden ml-6">
                              <div className="bg-gray-50/50 px-4 py-2.5 flex items-center gap-3">
                                <button type="button" onClick={() => toggleCat(deptIdx, catIdx)} className="text-gray-400 hover:text-gray-600 shrink-0">
                                  {expandedCats[catKey] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                                <input
                                  type="text"
                                  list="category-suggestions"
                                  value={cat.name}
                                  onChange={(e) => updateCatName(deptIdx, catIdx, e.target.value)}
                                  className="inv-inp text-sm font-semibold bg-transparent border-transparent hover:border-gray-200 focus:bg-white"
                                  placeholder="Category Name"
                                />
                                <div className="ml-auto flex items-center gap-2 shrink-0">
                                  <button type="button" onClick={() => addService(deptIdx, catIdx)} className="text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Service
                                  </button>
                                  <button type="button" onClick={() => removeCategory(deptIdx, catIdx)} className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {expandedCats[catKey] && (
                                <div className="p-3 bg-white border-t border-gray-50">
                                  {cat.services.length === 0 && (
                                    <p className="text-xs text-center text-gray-400 py-3">No services. Click 'Service' to add.</p>
                                  )}

                                  {cat.services.length > 0 && (
                                    <div className="grid grid-cols-[1fr_120px_40px] gap-3 mb-2 px-2">
                                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Service Name</span>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price (₹)</span>
                                      <span></span>
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                    {cat.services.map((srv, srvIdx) => (
                                      <div key={srvIdx} className="grid grid-cols-[1fr_120px_40px] gap-3 items-center">
                                        <input
                                          type="text"
                                          value={srv.name}
                                          onChange={(e) => updateService(deptIdx, catIdx, srvIdx, 'name', e.target.value)}
                                          className="inv-inp text-sm"
                                          placeholder="e.g. Complete Blood Count"
                                        />
                                        <input
                                          type="number"
                                          min="0"
                                          value={srv.price}
                                          onChange={(e) => updateService(deptIdx, catIdx, srvIdx, 'price', Number(e.target.value))}
                                          className="inv-inp text-sm"
                                          placeholder="0.00"
                                        />
                                        <button type="button" onClick={() => removeService(deptIdx, catIdx, srvIdx)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors flex justify-center">
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : 'Save Investigation Settings'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default InvestigationSettings;