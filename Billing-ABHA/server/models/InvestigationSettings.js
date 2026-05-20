import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  description: { type: String, default: '' }
}, { _id: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Hematology"
  services: [serviceSchema]
}, { _id: true });

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Pathology", "Radiology"
  categories: [categorySchema]
}, { _id: true });

const investigationSettingsSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: 'Client'
    },
    hasInhouseInvestigation: {
      type: Boolean,
      default: false
    },
    departments: [departmentSchema]
  },
  { timestamps: true }
);

export default mongoose.model("InvestigationSettings", investigationSettingsSchema);
