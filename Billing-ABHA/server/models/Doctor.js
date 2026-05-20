import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    /* 🔗 HOSPITAL LINK */
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    /* 👤 BASIC INFO */
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    doctorRegistrationNumber: {
      type: String,
      required: true,
    },

    experienceYears: {
      type: Number,
      required: true,
    },

    /* 🧠 SPECIALITY */
    speciality: {
      type: String,
      required: true,
    },

    subSpeciality: {
      type: String,
    },

    /* 💰 CONSULTATION CHARGES */
    charges: {
      opdConsultation: Number,
      opdFollowUp: Number,
      ipdVisit: Number,
      emergency: Number,
    },

    /* 📄 DOCUMENTS */
    documents: {
      degreeCertificates: [String], // PDF / image URLs
      registrationCertificate: String,
      profilePhoto: String,
    },

    /* 📑 AGREEMENT */
    agreementAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },

    /* 🛂 VERIFICATION */
    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    verifiedByAdmin: {
      type: Boolean,
      default: false,
    },

    rejectionReason: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
