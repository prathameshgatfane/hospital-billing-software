import React from 'react';

const PrintPrescription = React.forwardRef(({ consultation, patient, doctor }, ref) => {
  if (!consultation || !patient) return null;

  const vitals = consultation.vitals || {};
  const clinicalNotes = consultation.clinicalNotes || {};
  const prescription = consultation.prescription || [];

  return (
    <div ref={ref} className="p-8 max-w-4xl mx-auto bg-white text-gray-900 prescription-print">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { padding: 0 !important; margin: 0 !important; }
          .prescription-print { padding: 20mm !important; }
        }
      `}</style>

      {/* Hospital Header */}
      <div className="flex justify-between items-start border-b-2 border-red-600 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-red-600 uppercase tracking-tighter">BHELE HOSPITAL</h1>
          <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">Multi-speciality & Intensive Care Unit</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Date</p>
          <p className="text-sm font-black">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Patient & Doctor Header */}
      <div className="grid grid-cols-2 gap-8 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Patient Details</p>
          <p className="text-lg font-bold text-gray-900">{patient.firstName} {patient.lastName}</p>
          <p className="text-xs font-medium text-gray-500">{patient.gender} • {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} Years • ID: {patient.patientId}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Consulting Doctor</p>
          <p className="text-lg font-bold text-gray-900">Dr. {doctor?.fullName || doctor?.name || 'Medical Practitioner'}</p>
          <p className="text-xs font-medium text-gray-500">{doctor?.speciality || 'OPD'}</p>
        </div>
      </div>

      {/* Vitals Row */}
      <div className="flex items-center gap-6 px-4 py-3 bg-red-50/50 border-y border-red-100 mb-8 overflow-hidden rounded-lg">
        {vitals.temp && <div className="flex items-center gap-1.5"><span className="text-[10px] font-bold text-gray-400">TEMP:</span> <span className="text-xs font-black">{vitals.temp}°F</span></div>}
        {vitals.pulse && <div className="flex items-center gap-1.5"><span className="text-[10px] font-bold text-gray-400">PULSE:</span> <span className="text-xs font-black">{vitals.pulse} bpm</span></div>}
        {vitals.bp && <div className="flex items-center gap-1.5"><span className="text-[10px] font-bold text-gray-400">BP:</span> <span className="text-xs font-black">{vitals.bp.systolic}/{vitals.bp.diastolic}</span></div>}
        {vitals.spo2 && <div className="flex items-center gap-1.5"><span className="text-[10px] font-bold text-gray-400">SPO2:</span> <span className="text-xs font-black">{vitals.spo2}%</span></div>}
        {vitals.weight && <div className="flex items-center gap-1.5"><span className="text-[10px] font-bold text-gray-400">WEIGHT:</span> <span className="text-xs font-black">{vitals.weight} kg</span></div>}
      </div>

      {/* Clinical Notes Section */}
      <div className="grid grid-cols-3 gap-12 mb-10">
        <div className="col-span-1 space-y-6">
          {clinicalNotes.chiefComplaints && (
            <div>
              <h4 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-2">Complaints</h4>
              <p className="text-xs leading-relaxed text-gray-700 whitespace-pre-wrap">{clinicalNotes.chiefComplaints}</p>
            </div>
          )}
          {clinicalNotes.history && (
            <div>
              <h4 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-2">History</h4>
              <p className="text-xs leading-relaxed text-gray-700 whitespace-pre-wrap">{clinicalNotes.history}</p>
            </div>
          )}
          {clinicalNotes.examination && (
            <div>
              <h4 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-2">Examination</h4>
              <p className="text-xs leading-relaxed text-gray-700 whitespace-pre-wrap">{clinicalNotes.examination}</p>
            </div>
          )}
          {clinicalNotes.diagnosis && (
            <div className="bg-red-50 p-3 border-l-4 border-red-600 rounded">
              <h4 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-1">Diagnosis</h4>
              <p className="text-sm font-black text-gray-900">{clinicalNotes.diagnosis}</p>
            </div>
          )}
        </div>

        {/* Rx Section */}
        <div className="col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl font-black text-red-600 font-serif">R<span className="text-2xl">x</span></span>
            <div className="h-px flex-1 bg-gray-100"></div>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2 text-[10px] uppercase font-bold text-gray-400">Medicine & Strength</th>
                <th className="py-2 text-[10px] uppercase font-bold text-gray-400 text-center">Dosage</th>
                <th className="py-2 text-[10px] uppercase font-bold text-gray-400 text-center">Frequency</th>
                <th className="py-2 text-[10px] uppercase font-bold text-gray-400 text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {prescription.map((med, idx) => (
                <tr key={idx}>
                  <td className="py-4">
                    <div className="text-sm font-black text-gray-900">{med.medicineName}</div>
                    <div className="text-[11px] text-red-600 font-bold uppercase mt-0.5">{med.instructions}</div>
                  </td>
                  <td className="py-4 text-xs font-medium text-center text-gray-600">{med.dosage}</td>
                  <td className="py-4 text-xs font-black text-center text-gray-900">{med.frequency}</td>
                  <td className="py-4 text-xs font-medium text-right text-gray-600">{med.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {consultation.suggestedInvestigations?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-dashed border-gray-200">
              <h4 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-3">Suggested Investigations</h4>
              <div className="flex flex-wrap gap-2">
                {consultation.suggestedInvestigations.map((inv, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                    {inv.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-end">
        <div className="text-[10px] text-gray-400 max-w-xs uppercase font-bold leading-relaxed">
          This prescription is valid for 7 days from the date of issue.
          For emergency, please visit the casualty department.
        </div>
        <div className="text-center">
          <div className="w-32 h-px bg-gray-300 mb-2 mx-auto"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Dr. {doctor?.fullName || doctor?.name}</p>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Digital Signature</p>
        </div>
      </div>
    </div>
  );
});

export default PrintPrescription;
