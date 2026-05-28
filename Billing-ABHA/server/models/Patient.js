import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const patientSchema = new mongoose.Schema(
  {
    // 🔗 Hospital/Tenant Link
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalProfile",
      required: true,
      index: true,
    },

    // 👤 Basic Information
    patientId: {
      type: String,
      unique: true,
      index: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Ms", "Miss", "Dr"],
      default: "Mr",
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    age: {
      years: Number,
      months: Number,
      days: Number,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"],
      default: "Unknown",
    },
    height: Number,
    weight: Number,

    // 📞 Contact Information
    mobile: {
      type: String,
      required: true,
      index: true,
    },
    alternateMobile: String,
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    emergencyContact: {
      name: String,
      relation: String,
      mobile: String,
      email: String,
    },

    // 📍 Address Information
    address: {
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: String,
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: "India",
      },
    },

    // 👥 Family Information
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed", "Separated"],
      default: "Single",
    },
    spouseName: String,
    fatherName: String,
    motherName: String,

    // 🏥 Medical Information
    knownAllergies: [String],
    chronicConditions: String,
    currentMedications: [String],
    previousSurgeries: [{
      name: String,
      year: Number,
    }],

    // 📋 Identification
    identification: {
      type: {
        type: String,
        enum: ["Aadhaar", "PAN", "Driving License", "Passport", "Voter ID", "Other"],
      },
      number: String,
      fileUrl: String,
    },

    // 💼 Occupation
    occupation: String,
    employer: String,

    // 🎯 Patient Category
    patientType: {
      type: String,
      enum: ["General", "Corporate", "Insurance", "Government", "Staff"],
      default: "General",
    },
    reference: {
      type: String,
      enum: ["Doctor", "Friend", "Advertisement", "Website", "Other"],
    },
    referredBy: String,

    // 📝 Additional Information
    notes: String,
    preferredLanguage: {
      type: String,
      default: "English",
    },

    // 🏷️ Billing Information
    billingDetails: {
      isInsured: {
        type: Boolean,
        default: false,
      },
      insuranceProvider: String,
      policyNumber: String,
      sumInsured: Number,
      validTill: Date,
      corporateId: String,
      companyName: String,
    },

    // 📄 Documents
    documents: {
      profilePhoto: String,
      identityProof: String,
      addressProof: String,
      insuranceCard: String,
    },

    // 🪪 ABHA Details
    abhaNumber: {
      type: String,
      index: { unique: true, sparse: true },
    },
    abhaAddress: {
      type: String,
      index: { unique: true, sparse: true },
    },
    abhaProfile: {
      photo: String,
      kycVerified: {
        type: Boolean,
        default: false,
      },
      mobileLinked: {
        type: Boolean,
        default: false,
      },
    },

    // 📊 Status
    status: {
      type: String,
      enum: ["Active", "Inactive", "Deceased", "Transferred"],
      default: "Active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // 👤 Created By
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
  },
  { timestamps: true }
);

patientSchema.pre("validate", async function () {
  if (!this.patientId) {
    try {
      // Find hospital name from Client model
      const Client = mongoose.model("Client");
      const hospital = await Client.findById(this.tenantId);
      
      let prefix = "HOSP";
      if (hospital && hospital.hospitalName) {
        // Use first word or first 4-5 chars of hospital name, slugified
        prefix = hospital.hospitalName
          .split(' ')[0]
          .replace(/[^a-zA-Z0-9]/g, '')
          .toUpperCase();
      }

      // Find total count of patients for this tenant (hospital)
      const count = await this.constructor.countDocuments({
        tenantId: this.tenantId
      });

      this.patientId = `${prefix}-${(count + 1).toString().padStart(3, "0")}`;
    } catch (error) {
      console.error("Error generating patientId:", error);
      // Fallback ID if lookup fails
      const timestamp = Date.now().toString().slice(-4);
      this.patientId = `PAT-${timestamp}`;
    }
  }

  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    this.age = { years, months, days };
  }
});

// Indexes for better performance
patientSchema.index({ tenantId: 1, mobile: 1 });
patientSchema.index({ tenantId: 1, firstName: 1, lastName: 1 });
patientSchema.index({ tenantId: 1, createdAt: -1 });

patientSchema.plugin(mongoosePaginate);

export default mongoose.model("Patient", patientSchema);