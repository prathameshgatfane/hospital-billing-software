import mongoose from "mongoose";

const ipdBillingSchema = new mongoose.Schema(
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
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    billNumber: {
      type: String,
      unique: true,
    },
    billDate: {
      type: Date,
      default: Date.now,
    },
    services: [
      {
        serviceName: String,
        price: Number,
        quantity: Number,
        total: Number,
        date: Date,
      },
    ],
    bedCharges: {
      rate: Number,
      days: Number,
      total: Number,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Partially Paid"],
      default: "Pending",
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Insurance", "Other"],
    },
    transactionId: String,
    notes: String,
  },
  { timestamps: true }
);

// Auto-generate Bill Number
ipdBillingSchema.pre("save", async function () {
  if (!this.billNumber) {
    const date = new Date();
    const prefix = "IPD-INV";
    const year = date.getFullYear();

    const count = await mongoose
      .model("IpdBilling")
      .countDocuments({ tenantId: this.tenantId });

    this.billNumber = `${prefix}-${year}-${(count + 1)
      .toString()
      .padStart(4, "0")}`;
  }
});

export default mongoose.model("IpdBilling", ipdBillingSchema);
