import mongoose from "mongoose";

const opdConsultationSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OpdBilling",
      required: true,
    },
    vitals: {
      height: Number, // cm
      weight: Number, // kg
      bmi: Number,
      temp: Number,   // F
      pulse: Number,  // bpm
      bp: {
        systolic: Number,
        diastolic: Number
      },
      spo2: Number,   // %
      rr: Number,     // breaths/min
    },
    clinicalNotes: {
      chiefComplaints: String,
      history: String,
      examination: String,
      diagnosis: String,
      remarks: String
    },
    prescription: [
      {
        medicineName: String,
        dosage: String,      // e.g. "500mg"
        frequency: String,   // e.g. "1-0-1" or "TDS"
        duration: String,    // e.g. "5 days"
        instructions: String // e.g. "After food"
      }
    ],
    suggestedInvestigations: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "OpdService",
          default: null
        },
        testCode: {
          type: String,
          default: null
        },
        name: {
          type: String,
          required: true
        },
        category: String,
        notes: String
      }
    ],
    status: {
      type: String,
      enum: ["Draft", "Completed", "Follow-up"],
      default: "Completed"
    },
    nextFollowUpDate: Date,
  },
  { timestamps: true }
);

// Index for quick history lookup
opdConsultationSchema.index({ patientId: 1, createdAt: -1 });
opdConsultationSchema.index({ doctorId: 1, createdAt: -1 });

export default mongoose.model("OpdConsultation", opdConsultationSchema);
