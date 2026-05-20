import mongoose from "mongoose";

const ipdAdmissionSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    admissionNumber: {
      type: String,
      unique: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    dischargeDate: {
      type: Date,
    },
    ward: {
      type: String,
      required: true,
    },
    bedNumber: {
      type: String,
      required: true,
    },
    doctorInCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    reasonForAdmission: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Admitted", "Discharged", "Cancelled"],
      default: "Admitted",
    },
    initialVitals: {
      temp: String,
      bp: String,
      pulse: String,
      spO2: String,
    },
    notes: String,
  },
  { timestamps: true }
);

// Auto-generate Admission Number
// Fixed: Removed 'next' parameter as async functions in Mongoose pre-save hooks 
// should return a promise (which async functions do automatically) instead of using next().
ipdAdmissionSchema.pre("save", async function () {
  if (!this.admissionNumber) {
    const date = new Date();
    const prefix = "ADM";
    const year = date.getFullYear();

    // Use this.constructor to access the model within the pre-save hook
    const count = await this.constructor.countDocuments({ tenantId: this.tenantId });
    this.admissionNumber = `${prefix}-${year}-${(count + 1).toString().padStart(4, "0")}`;
  }
});

export default mongoose.model("IpdAdmission", ipdAdmissionSchema);
