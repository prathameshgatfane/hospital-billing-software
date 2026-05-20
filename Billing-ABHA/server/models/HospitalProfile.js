import mongoose from "mongoose";

const hospitalProfileSchema = new mongoose.Schema(
  {
    /* 🔗 MULTI-TENANT LINK */
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },

    /* 🏥 HOSPITAL TYPE */
    serviceType: {
      type: String,
      enum: ["OPD", "IPD", "BOTH"],
      required: true,
    },

    /* 👤 PURCHASE / OWNER INFO */
    purchaseName: String,

    /* 📞 CONTACT INFO */
    secondaryMobile: String,

    alternateEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },

    /* 📍 ADDRESS & LOCATION */
    address: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    latitude: Number,
    longitude: Number,

    /* 🏥 REGISTRATION DETAILS */
    hospitalRegistrationNumber: String,
    doctorRegistrationNumber: String,

    /* 📄 CERTIFICATES */
    hospitalCertificates: [String],
    doctorCertificates: [String],

    /* 🖼️ HOSPITAL PHOTOS */
    hospitalImages: [String],

    /* 🧯 SOFT DELETE */
    isActive: {
      type: Boolean,
      default: true,
    },

    rejectionReason: String,

    /* 📑 LEGAL */
    agreementAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    verifiedByAdmin: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,

    verificationConversation: [
      {
        sender: {
          type: String,
          enum: ["ADMIN", "CLIENT"],
          required: true,
        },

        message: {
          type: String, // optional text
        },

        attachments: [
          {
            fileUrl: {
              type: String, // ImageKit / Cloudinary URL
            },
            fileType: {
              type: String,
              enum: ["IMAGE", "PDF", "OTHER"],
            },
            fileName: String,
          },
        ],

        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("HospitalProfile", hospitalProfileSchema);
