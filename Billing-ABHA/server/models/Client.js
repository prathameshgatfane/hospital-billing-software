import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    /* ===== BASIC INFO (STEP 1) ===== */

    hospitalName: {
      type: String,
      required: true,
    },

    doctorName: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    location: {
      lat: { type: Number },
      lng: { type: Number }
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ===== EMAIL VERIFICATION ===== */

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: String,
    emailOtpExpiry: Date,

    resetPasswordOtp: String,
    resetPasswordOtpExpiry: Date,

    pendingEmail: String,
    emailChangeOtp: String,
    emailChangeOtpExpiry: Date,

    /* ===== SAAS CONTROL ===== */

    registrationStage: {
      type: String,
      enum: ["BASIC", "COMPLETED"],
      default: "BASIC",
    },

    accountStatus: {
      type: String,
      enum: ["PENDING", "ACTIVE", "BLOCKED"],
      default: "PENDING",
    },

    /* ===== MULTI-TENANT ===== */

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return this._id;
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
