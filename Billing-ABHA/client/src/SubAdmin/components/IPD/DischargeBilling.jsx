import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Receipt, Calendar, 
  User, Bed, Clock, Calculator,
  DollarSign, FileText, CheckCircle,
  AlertCircle, Building, Users
} from 'lucide-react';
import ipdApi from '../../API/ipdApi';
import billingSettingsApi from '../../API/billingSettingsApi';

const DischargeBilling = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [admissionData, setAdmissionData] = useState(null);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [billData, setBillData] = useState(null);
  
  const [billingForm, setBillingForm] = useState({
    dischargeDate: new Date().toISOString().split('T')[0],
    bedRate: 0,
    tax: 0,
    discount: 0,
    paymentMode: 'Cash',
    notes: ''
  });

  useEffect(() => {
    fetchStayDetails();
    fetchDefaultSettings();
  }, [id]);

  const fetchStayDetails = async () => {
    try {
      const response = await ipdApi.getAdmissionDetails(id);
      if (response.success) {
        setAdmissionData(response.data?.admission);
        setServiceRecords(response.data?.serviceRecords || []);
        if (response.data?.bill) {
           setBillData(response.data.bill);
           setBillingForm({
             dischargeDate: new Date(response.data.bill.billDate).toISOString().split('T')[0],
             bedRate: response.data.bill.bedCharges.rate,
             tax: response.data.bill.tax,
             discount: response.data.bill.discount,
             paymentMode: response.data.bill.paymentMode,
             notes: response.data.bill.notes
           });
        }
      }
    } catch (error) {
      console.error('Error fetching stay details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultSettings = async () => {
    try {
      const response = await billingSettingsApi.getSettings();
      if (response.success) {
        setBillingForm(prev => ({
          ...prev,
          tax: response.data.defaultTax || 0,
          discount: response.data.defaultDiscount || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching defaults:', error);
    }
  };

  const calculateStayDuration = () => {
    if (!admissionData) return 1;
    const d1 = new Date(admissionData.admissionDate);
    const d2 = new Date(billingForm.dischargeDate);
    const diffTime = Math.abs(d2 - d1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const stayDays = billData ? billData.bedCharges.days : calculateStayDuration();
  const serviceTotal = billData ? billData.services.reduce((sum, s) => sum + s.total, 0) : serviceRecords.reduce((sum, s) => sum + s.totalAmount, 0);
  const bedTotal = billData ? billData.bedCharges.total : stayDays * (Number(billingForm.bedRate) || 0);
  const subTotal = billData ? billData.subTotal : serviceTotal + bedTotal;
  const taxAmount = billData ? (billData.subTotal * billData.tax) / 100 : (subTotal * (Number(billingForm.tax) || 0)) / 100;
  const totalAmount = billData ? billData.totalAmount : subTotal + taxAmount - (Number(billingForm.discount) || 0);

  const isFinalized = admissionData?.status === 'Discharged' || billData;

  const handleDischarge = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await ipdApi.dischargePatient(id, billingForm);
      if (response.success) {
        alert('Patient discharged and invoice generated!');
        navigate('/subadmin/reception/ipd');
      }
    } catch (error) {
      console.error('Discharge error:', error);
      alert('Failed to process discharge');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F9FAFB' }}>
      <p style={{ fontFamily: "'DM Mono', monospace", color: '#9CA3AF', fontWeight: 600 }}>Loading...</p>
    </div>
  );

  const inputStyle = { width: '100%', padding: '10px 14px', fontSize: 13, border: '1px solid #E9ECEF', borderRadius: 8, outline: 'none', background: '#FAFAFA', color: '#111827', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 6 };
  const cardStyle = { background: '#fff', border: '1px solid #F0F0F0', borderRadius: 14, overflow: 'hidden', padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
      `}</style>
      <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, padding: 20 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <button onClick={() => navigate(-1)} style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 10, padding: 8, color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowLeft size={18} />
             </button>
             <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                   <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Discharge & Final Billing</h1>
                   <span style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', fontFamily: "'DM Mono', monospace" }}>
                     ID: {admissionData.admissionNumber}
                   </span>
                </div>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Generate final hospital invoice for {admissionData.patientId?.firstName} {admissionData.patientId?.lastName}</p>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 340px', gap: 24, alignItems: 'start' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
               <div style={cardStyle}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
                     <div>
                        <label style={labelStyle}>Discharge Date</label>
                        <div style={{ position: 'relative' }}>
                           <Calendar size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                           <input 
                              type="date"
                              disabled={isFinalized}
                              style={{ ...inputStyle, paddingLeft: 38, background: isFinalized ? '#F3F4F6' : '#FAFAFA', color: isFinalized ? '#9CA3AF' : '#111827', fontWeight: 700 }}
                              value={billingForm.dischargeDate}
                              onChange={(e) => setBillingForm({...billingForm, dischargeDate: e.target.value})}
                           />
                        </div>
                     </div>
                     <div>
                        <label style={labelStyle}>Bed Rate (Per Day)</label>
                        <div style={{ position: 'relative' }}>
                           <DollarSign size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                           <input 
                              type="number"
                              disabled={isFinalized}
                              style={{ ...inputStyle, paddingLeft: 38, background: isFinalized ? '#F3F4F6' : '#FAFAFA', color: isFinalized ? '#9CA3AF' : '#111827', fontWeight: 700, fontSize: 15 }}
                              placeholder="0"
                              value={billingForm.bedRate}
                              onChange={(e) => setBillingForm({...billingForm, bedRate: e.target.value})}
                           />
                        </div>
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 30 }}>
                     <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 16, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                           <p style={{ fontSize: 10, fontWeight: 700, color: '#F87171', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: '0 0 6px' }}>Stay Duration</p>
                           <p style={{ fontSize: 24, fontWeight: 700, color: '#7F1D1D', margin: 0 }}>{stayDays} <span style={{ fontSize: 13, fontWeight: 600 }}>Days</span></p>
                        </div>
                        <Clock size={40} color="#FCA5A5" style={{ opacity: 0.5 }} />
                     </div>
                     <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 16, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                           <p style={{ fontSize: 10, fontWeight: 700, color: '#60A5FA', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", margin: '0 0 6px' }}>Ward Info</p>
                           <p style={{ fontSize: 18, fontWeight: 700, color: '#1E3A8A', margin: 0 }}>{admissionData.ward}</p>
                           <p style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', margin: '2px 0 0' }}>Bed: {admissionData.bedNumber}</p>
                        </div>
                        <Bed size={40} color="#93C5FD" style={{ opacity: 0.5 }} />
                     </div>
                  </div>

                  <div style={{ border: '1px solid #F0F0F0', borderRadius: 12, overflow: 'hidden' }}>
                     <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                        <thead style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                           <tr>
                              <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Service/Item</th>
                              <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", textAlign: 'center' }}>Qty</th>
                              <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", textAlign: 'right' }}>Amount</th>
                           </tr>
                        </thead>
                        <tbody>
                           {serviceRecords.map(item => (
                              <tr key={item._id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                 <td style={{ padding: '14px 16px', fontWeight: 600, color: '#374151' }}>{item.serviceName}</td>
                                 <td style={{ padding: '14px 16px', fontWeight: 500, color: '#6B7280', textAlign: 'center', fontFamily: "'DM Mono', monospace" }}>{item.quantity}</td>
                                 <td style={{ padding: '14px 16px', fontWeight: 700, color: '#111827', textAlign: 'right', fontFamily: "'DM Mono', monospace" }}>₹{item.totalAmount}</td>
                              </tr>
                           ))}
                           {serviceRecords.length === 0 && (
                              <tr><td colSpan={3} style={{ padding: '30px 16px', textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic' }}>No specific services recorded.</td></tr>
                           )}
                           <tr style={{ background: '#FAFAFA' }}>
                              <td style={{ padding: '14px 16px', fontWeight: 700, color: '#DC2626' }}>Bed Charges ({stayDays} Days @ ₹{billingForm.bedRate})</td>
                              <td style={{ padding: '14px 16px', fontWeight: 500, color: '#6B7280', textAlign: 'center', fontFamily: "'DM Mono', monospace" }}>1</td>
                              <td style={{ padding: '14px 16px', fontWeight: 700, color: '#111827', textAlign: 'right', fontFamily: "'DM Mono', monospace" }}>₹{bedTotal}</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
               <div style={{ ...cardStyle, padding: 0 }}>
                  <div style={{ padding: '18px 20px', background: '#111827', color: '#fff', borderBottom: '1px solid #1F2937' }}>
                     <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>
                        <Calculator size={14} color="#EF4444" /> Payment Summary
                     </h3>
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>Subtotal</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#111827', fontFamily: "'DM Mono', monospace" }}>₹{subTotal.toLocaleString()}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>Tax (%)</span>
                        <input 
                           type="number" 
                           disabled={isFinalized}
                           value={billingForm.tax} 
                           onChange={e => setBillingForm({...billingForm, tax: e.target.value})} 
                           style={{ width: 60, padding: '4px 8px', textAlign: 'right', border: '1px solid #E5E7EB', borderRadius: 8, background: isFinalized ? '#FAFAFA' : '#fff', color: isFinalized ? '#9CA3AF' : '#111827', fontWeight: 700, fontFamily: "'DM Mono', monospace", outline: 'none' }} 
                        />
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>Discount (₹)</span>
                        <input 
                           type="number" 
                           disabled={isFinalized}
                           value={billingForm.discount} 
                           onChange={e => setBillingForm({...billingForm, discount: e.target.value})} 
                           style={{ width: 80, padding: '4px 8px', textAlign: 'right', border: '1px solid #E5E7EB', borderRadius: 8, background: isFinalized ? '#FAFAFA' : '#fff', color: isFinalized ? '#9CA3AF' : '#DC2626', fontWeight: 700, fontFamily: "'DM Mono', monospace", outline: 'none' }} 
                        />
                     </div>

                     <div style={{ borderTop: '1px dashed #E5E7EB', margin: '4px 0', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grand Total</span>
                        <span style={{ fontSize: 28, fontWeight: 700, color: '#DC2626', fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>₹{totalAmount.toLocaleString()}</span>
                     </div>

                     <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                        <div>
                           <label style={labelStyle}>Payment Mode</label>
                           <select disabled={isFinalized} value={billingForm.paymentMode} onChange={e => setBillingForm({...billingForm, paymentMode: e.target.value})} style={{ ...inputStyle, background: isFinalized ? '#F3F4F6' : '#FAFAFA', color: isFinalized ? '#9CA3AF' : '#111827', fontWeight: 600 }}>
                              <option>Cash</option>
                              <option>UPI</option>
                              <option>Card</option>
                              <option>Insurance</option>
                              <option>Other</option>
                           </select>
                        </div>
                        <textarea 
                           disabled={isFinalized}
                           value={billingForm.notes}
                           onChange={e => setBillingForm({...billingForm, notes: e.target.value})}
                           placeholder="Closing notes..."
                           rows={2}
                           style={{ ...inputStyle, background: isFinalized ? '#F3F4F6' : '#FAFAFA', color: isFinalized ? '#9CA3AF' : '#111827' }}
                        ></textarea>
                     </div>

                     {isFinalized ? (
                        <button onClick={() => window.print()} style={{ marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'} onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}>
                           <Receipt size={18} /> PRINT FINAL BILL
                        </button>
                     ) : (
                        <button onClick={handleDischarge} disabled={submitting} style={{ marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', background: submitting ? '#FCA5A5' : '#DC2626', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => {if(!submitting) e.currentTarget.style.background = '#B91C1C'}} onMouseLeave={e => {if(!submitting) e.currentTarget.style.background = '#DC2626'}}>
                           {submitting ? 'PROCESSING...' : <><CheckCircle size={18} /> FINALIZE DISCHARGE</>}
                        </button>
                     )}
                  </div>
               </div>

               {isFinalized ? (
                  <div style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                     <CheckCircle size={20} color="#2563EB" style={{ flexShrink: 0 }} />
                     <p style={{ margin: 0, fontSize: 12, color: '#1E40AF', fontWeight: 500, lineHeight: 1.4 }}>This patient has been discharged and the bill finalized. You cannot make any updates to the payment structure.</p>
                  </div>
               ) : (
                  <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                     <AlertCircle size={20} color="#EA580C" style={{ flexShrink: 0 }} />
                     <p style={{ margin: 0, fontSize: 12, color: '#9A3412', fontWeight: 500, lineHeight: 1.4 }}>This action will mark the patient as discharged and free the bed. A final invoice will be generated and stored.</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DischargeBilling;
