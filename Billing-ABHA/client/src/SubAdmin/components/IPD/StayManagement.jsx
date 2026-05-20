import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Clock, Activity,
  Stethoscope, Pill, Microscope,
  User, Bed, Calendar, FileText,
  CheckCircle, PlusCircle, Trash2,
  DollarSign, Receipt
} from 'lucide-react';
import ipdApi from '../../API/ipdApi';

const StayManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admissionData, setAdmissionData] = useState(null);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    serviceName: '',
    category: 'Medicine',
    price: '',
    quantity: 1,
    notes: ''
  });

  const categories = ["Medicine", "Investigation", "Procedure", "Nursing", "Doctor Visit", "Other"];

  useEffect(() => {
    fetchStayDetails();
  }, [id]);

  const fetchStayDetails = async () => {
    try {
      const response = await ipdApi.getAdmissionDetails(id);
      if (response.success) {
        setAdmissionData(response.data?.admission);
        setServiceRecords(response.data?.serviceRecords || []);
      }
    } catch (error) {
      console.error('Error fetching stay details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await ipdApi.addServiceRecord({
        admissionId: id,
        ...serviceForm
      });
      if (response.success) {
        setShowAddService(false);
        setServiceForm({
          serviceName: '',
          category: 'Medicine',
          price: '',
          quantity: 1,
          notes: ''
        });
        fetchStayDetails();
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service record');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F9FAFB' }}>
      <p style={{ fontFamily: "'DM Mono', monospace", color: '#9CA3AF', fontWeight: 600 }}>Loading...</p>
    </div>
  );

  if (!admissionData) return <div style={{ padding: 40, textAlign: 'center', color: '#DC2626', fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Admission record not found.</div>;

  const totalBillSoFar = serviceRecords.reduce((sum, s) => sum + s.totalAmount, 0);

  const inputStyle = { width: '100%', padding: '10px 14px', fontSize: 13, border: '1px solid #E9ECEF', borderRadius: 8, outline: 'none', background: '#FAFAFA', color: '#111827', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 6 };
  const cardStyle = { background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, overflow: 'hidden', padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
      `}</style>
      <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>

          {/* Header & Back */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => navigate('/subadmin/reception/ipd')} style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 10, padding: 8, color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' }}>
                <ArrowLeft size={18} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Stay Management</h1>
                  <span style={{
                    padding: '3px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', borderRadius: 99,
                    background: admissionData.status === 'Admitted' ? '#DC2626' : '#F3F4F6',
                    color: admissionData.status === 'Admitted' ? '#fff' : '#6B7280', textTransform: 'uppercase'
                  }}>
                    {admissionData.status === 'Admitted' ? 'Active Stay' : admissionData.status}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Recording daily treatments for {admissionData.patientId?.firstName} {admissionData.patientId?.lastName}</p>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: '0 0 2px' }}>
                  {admissionData.status === 'Admitted' ? 'Bill So Far' : 'Services Total'}
                </p>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, fontFamily: "'DM Mono', monospace" }}>₹{totalBillSoFar.toLocaleString()}</p>
              </div>
              <div style={{ width: 1, height: 32, background: '#F0F0F0' }}></div>
              {admissionData.status === 'Admitted' ? (
                <button
                  onClick={() => navigate(`/subadmin/reception/ipd/billing/view/${id}`)}
                  style={{ background: '#DC2626', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                >
                  PROCEED TO DISCHARGE
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/subadmin/reception/ipd/billing/view/${id}`)}
                  style={{ background: '#eb6a6aff', color: '#ffffffff', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                >
                  VIEW BILL
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: 20, alignItems: 'start' }}>

            {/* Left Column: Admission Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ ...cardStyle, padding: 0 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <User size={14} color="#DC2626" /> Patient Summary
                  </h3>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, background: '#FEF2F2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={20} color="#DC2626" />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>{admissionData.patientId?.firstName} {admissionData.patientId?.lastName}</p>
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', fontFamily: "'DM Mono', monospace" }}>{admissionData.patientId?.patientId}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: '#FAFAFA', border: '1px solid #F0F0F0', borderRadius: 10, padding: '12px 14px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 6px', fontFamily: "'DM Mono', monospace" }}>Ward / Bed</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, borderLeft: '2px solid #DC2626', paddingLeft: 8 }}>{admissionData.ward} - {admissionData.bedNumber}</p>
                    </div>
                    <div style={{ background: '#FAFAFA', border: '1px solid #F0F0F0', borderRadius: 10, padding: '12px 14px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 6px', fontFamily: "'DM Mono', monospace" }}>Admitted On</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, borderLeft: '2px solid #2563EB', paddingLeft: 8 }}>{new Date(admissionData.admissionDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: 10, padding: '14px 16px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#EA580C', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Stethoscope size={12} /> Primary Doctor
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#9A3412', margin: 0 }}>{admissionData.doctorInCharge?.fullName ? `Dr. ${admissionData.doctorInCharge.fullName}` : 'Not assigned'}</p>
                    <p style={{ fontSize: 11, color: '#C2410C', margin: '2px 0 0', fontWeight: 500 }}>{admissionData.doctorInCharge?.speciality}</p>
                  </div>

                  <div style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: 10, padding: '14px 16px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#2563EB', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Activity size={12} /> Initial Vitals
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                      <p style={{ fontSize: 11, color: '#1E40AF', margin: 0, fontWeight: 600 }}>Temp: <span style={{ fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{admissionData.initialVitals?.temp || '--'}°F</span></p>
                      <p style={{ fontSize: 11, color: '#1E40AF', margin: 0, fontWeight: 600 }}>BP: <span style={{ fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{admissionData.initialVitals?.bp || '--'}</span></p>
                      <p style={{ fontSize: 11, color: '#1E40AF', margin: 0, fontWeight: 600 }}>Pulse: <span style={{ fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{admissionData.initialVitals?.pulse || '--'}</span></p>
                      <p style={{ fontSize: 11, color: '#1E40AF', margin: 0, fontWeight: 600 }}>spO2: <span style={{ fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{admissionData.initialVitals?.spO2 || '--'}%</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Treatment Timeline */}
            <div style={{ ...cardStyle, padding: 0, minHeight: 600, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Clock size={14} color="#DC2626" /> Treatment Timeline
                </h3>
                {admissionData.status === 'Admitted' && (
                  <button
                    onClick={() => setShowAddService(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#DC2626', color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <PlusCircle size={14} /> ADD TREATMENT
                  </button>
                )}
              </div>

              <div style={{ flex: 1, padding: 24, position: 'relative' }}>
                {serviceRecords.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, background: '#FAFAFA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <FileText size={24} color="#D1D5DB" />
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>No records added yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {serviceRecords.map((record, index) => (
                      <div key={record._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ flex: 1, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, transition: 'all 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#FECACA'} onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                              <span style={{
                                padding: '2px 8px', borderRadius: 99, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'inline-block',
                                background: record.category === 'Medicine' ? '#DBEAFE' : record.category === 'Investigation' ? '#F3E8FF' : record.category === 'Doctor Visit' ? '#FFEDD5' : '#F3F4F6',
                                color: record.category === 'Medicine' ? '#1D4ED8' : record.category === 'Investigation' ? '#7E22CE' : record.category === 'Doctor Visit' ? '#C2410C' : '#4B5563'
                              }}>
                                {record.category}
                              </span>
                              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>{record.serviceName}</h4>
                            </div>
                            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, fontFamily: "'DM Mono', monospace" }}>₹{record.totalAmount}</p>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {new Date(record.dateAdded).toLocaleString()}</span>
                              <span>Qty: {record.quantity} @ ₹{record.price}</span>
                            </div>
                            {record.notes && <div style={{ fontSize: 11, color: '#6B7280', fontStyle: 'italic', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>"{record.notes}"</div>}
                          </div>
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

      {/* Add Service Modal */}
      {showAddService && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ background: '#DC2626', padding: '24px 30px', position: 'relative' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Add Service</h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#FECACA' }}>Log a treatment, medicine or visit for this patient</p>
              <button onClick={() => setShowAddService(false)} style={{ position: 'absolute', top: 24, right: 24, background: 'transparent', border: 'none', color: '#FECACA', cursor: 'pointer' }}>
                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>

            <form onSubmit={handleAddService} style={{ padding: 30, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={serviceForm.category} onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })} style={inputStyle}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelStyle, textAlign: 'right' }}>Quantity</label>
                  <input type="number" min="1" value={serviceForm.quantity} onChange={e => setServiceForm({ ...serviceForm, quantity: e.target.value })} style={{ ...inputStyle, textAlign: 'center', fontWeight: 700 }} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Service/Treatment Name</label>
                <input type="text" required placeholder="e.g. Paracetamol 500mg" value={serviceForm.serviceName} onChange={e => setServiceForm({ ...serviceForm, serviceName: e.target.value })} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Unit Price (₹)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input type="number" required placeholder="0.00" value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })} style={{ ...inputStyle, paddingLeft: 38, fontWeight: 700, fontFamily: "'DM Mono', monospace", fontSize: 16 }} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Notes (Optional)</label>
                <textarea rows={2} placeholder="Dosage instructions..." value={serviceForm.notes} onChange={e => setServiceForm({ ...serviceForm, notes: e.target.value })} style={inputStyle}></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAddService(false)} style={{ padding: '12px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#6B7280', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>CANCEL</button>
                <button type="submit" style={{ padding: '12px', background: '#DC2626', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>LOG RECORD</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StayManagement;
