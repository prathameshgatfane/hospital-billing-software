import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, FileText, 
  Trash2, ExternalLink, Calendar,
  User, Activity, Image as ImageIcon
} from 'lucide-react';
import labApi from '../../API/labApi';
import patientApi from '../../API/patientApi';

const PatientLabPortal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const [uploadForm, setUploadForm] = useState({
    documentName: '',
    documentType: 'Other',
    notes: '',
    file: null
  });

  const docTypes = ["X-Ray", "CT Scan", "MRI", "Blood Report", "Urine Report", "Prescription", "Other"];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientRes, docsRes] = await Promise.all([
        patientApi.getById(id),
        labApi.getPatientDocuments(id)
      ]);
      
      if (patientRes.success) setPatient(patientRes.data);
      if (docsRes.success) setDocuments(docsRes.data);
    } catch (error) {
      console.error('Error fetching lab data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) return alert("Please select a file to upload");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('patientId', id);
      formData.append('documentName', uploadForm.documentName);
      formData.append('documentType', uploadForm.documentType);
      formData.append('notes', uploadForm.notes);
      formData.append('document', uploadForm.file); // Match router field name 'document'

      const response = await labApi.uploadDocument(formData);
      if (response.success) {
        setUploadForm({ documentName: '', documentType: 'Other', notes: '', file: null });
        fetchData(); // Refresh list
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document. Please ensure it is under 10MB.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      const response = await labApi.deleteDocument(docId);
      if (response.success) {
        setDocuments(documents.filter(d => d._id !== docId));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete document');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!patient) return <div className="p-8 text-center text-red-600 font-bold">Patient not found.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/subadmin/reception/laboratory')}
          className="mr-6 p-3 bg-white border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-gray-600 rounded-2xl transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Patient Laboratory</h1>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-black rounded-full uppercase tracking-widest">
              Portal
            </span>
          </div>
          <p className="text-gray-500 font-medium">Managing documents for {patient.firstName} {patient.lastName} ({patient.patientId})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-6 bg-indigo-600 text-white">
               <h3 className="font-black text-lg flex items-center">
                  <Upload className="w-5 h-5 mr-2" /> Upload Document
               </h3>
               <p className="text-indigo-200 text-sm mt-1">Add scans, reports, or test results</p>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-5">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Document File</label>
                <div className="relative">
                  <input 
                    type="file" 
                    required
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Document Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chest X-Ray"
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm"
                  value={uploadForm.documentName}
                  onChange={(e) => setUploadForm({...uploadForm, documentName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Document Type</label>
                <select
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm"
                  value={uploadForm.documentType}
                  onChange={(e) => setUploadForm({...uploadForm, documentType: e.target.value})}
                >
                  {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Doctor Remarks / Notes</label>
                <textarea
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                  placeholder="Optional details..."
                  rows="3"
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({...uploadForm, notes: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={uploading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 flex justify-center items-center mt-4 disabled:opacity-50"
              >
                {uploading ? 'UPLOADING...' : 'UPLOAD DOCUMENT'}
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Existing Documents Gallery */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
             <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-indigo-500" /> Document Archive
                </h3>
                <span className="px-3 py-1 bg-white text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
                   {documents.length} Files
                </span>
             </div>
             
             <div className="p-6 flex-1">
                {documents.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                         <ImageIcon className="text-gray-300 w-10 h-10" />
                      </div>
                      <div>
                         <p className="text-gray-900 font-bold text-lg">No documents found</p>
                         <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1">Upload the patient's X-Rays, Scans, or Reports using the form to archive them here.</p>
                      </div>
                   </div>
                ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc) => (
                         <div key={doc._id} className="bg-white border border-gray-200 p-4 rounded-2xl hover:shadow-xl hover:border-indigo-100 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter mb-2 inline-block ${
                                     doc.documentType === 'X-Ray' ? 'bg-blue-100 text-blue-700' :
                                     doc.documentType === 'Blood Report' ? 'bg-red-100 text-red-700' :
                                     doc.documentType === 'CT Scan' ? 'bg-purple-100 text-purple-700' :
                                     'bg-gray-100 text-gray-700'
                                  }`}>
                                     {doc.documentType}
                                  </span>
                                  <h4 className="font-bold text-gray-900 leading-tight">{doc.documentName}</h4>
                               </div>
                               <div className="flex space-x-2">
                                  <a 
                                    href={doc.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                    title="View Document"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                  <button 
                                    onClick={() => handleDelete(doc._id)}
                                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Delete Document"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                            </div>
                            
                            {doc.notes && (
                               <p className="text-xs text-gray-500 italic mb-3 bg-gray-50 p-2 rounded-lg truncate">"{doc.notes}"</p>
                            )}

                            <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-auto border-t border-gray-50 pt-3">
                               <Calendar className="w-3 h-3 mr-1" />
                               {new Date(doc.createdAt).toLocaleDateString()}
                               <span className="mx-2">•</span>
                               Uploaded by {doc.uploadedBy?.name || 'Staff'}
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientLabPortal;
