import mongoose from "mongoose";

const billTemplateSchema = new mongoose.Schema({
  hospitalName: { type: String, default: '' },
  address:      { type: String, default: '' },
  phone:        { type: String, default: '' },
  email:        { type: String, default: '' },
  accentColor:  { type: String, default: '#DC2626' },
  headerBg:     { type: String, enum: ['dark', 'white', 'colored'], default: 'dark' },
  logoUrl:      { type: String, default: '' },
  logoText:     { type: String, default: '' },
  showBorderTop:{ type: Boolean, default: true },
  footerNote:   { type: String, default: 'Computer generated invoice. No signature required.' },
}, { _id: false });

const billingSettingsSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    defaultTax: {
      type: Number,
      default: 0,
    },
    defaultDiscount: {
      type: Number,
      default: 0,
    },
    billTemplate: {
      type: billTemplateSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

export default mongoose.model("BillingSettings", billingSettingsSchema);
