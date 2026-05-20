import mongoose from "mongoose";

const ipdServiceRecordSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IpdAdmission",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Medicine", "Investigation", "Procedure", "Nursing", "Doctor Visit", "Other"],
      default: "Other",
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client", // Usually the sub-admin or doctor
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("IpdServiceRecord", ipdServiceRecordSchema);
