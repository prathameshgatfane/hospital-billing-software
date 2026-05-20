import mongoose from "mongoose";

const opdBillingSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    billNumber: {
      type: String,
      unique: true,
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "OpdService",
        },
        name: String,
        category: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
        total: Number,
      },
    ],
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
      enum: ["Pending", "Paid", "Partial", "Refunded"],
      default: "Paid",
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Online"],
      default: "Cash",
    },
    billDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    status: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active",
    },
    notes: String,
  },
  { timestamps: true }
);

// Generate Bill Number before validating
opdBillingSchema.pre("validate", async function () {
  if (!this.billNumber) {
    const today = new Date();
    const prefix = "BILL";
    const dateStr = today.getFullYear().toString() + (today.getMonth() + 1).toString().padStart(2, "0") + today.getDate().toString().padStart(2, "0");
    
    // Count total bills for this hospital to get sequential number
    const count = await this.constructor.countDocuments({ tenantId: this.tenantId });
    this.billNumber = `${prefix}-${dateStr}-${(count + 1).toString().padStart(4, "0")}`;
  }
});

export default mongoose.model("OpdBilling", opdBillingSchema);
