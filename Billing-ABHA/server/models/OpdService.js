import mongoose from "mongoose";

const opdServiceSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    category: {
      type: String,
      enum: ["Consultation", "Investigation", "Procedure", "Nursing", "Pharmacy", "Doctor Fees", "Pathology", "Diagnostic", "Day Care", "Other"],
      default: "Consultation",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
opdServiceSchema.index({ tenantId: 1, name: 1 }, { unique: true });

export default mongoose.model("OpdService", opdServiceSchema);
