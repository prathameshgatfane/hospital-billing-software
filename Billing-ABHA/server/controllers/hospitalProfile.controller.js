import HospitalProfile from "../models/HospitalProfile.js";
import Client from "../models/Client.js";
import { sendApprovalEmail, sendRejectionEmail } from "../utils/sendEmail.js";

/* ===========================
   CREATE / UPDATE PROFILE
   =========================== */
export const saveHospitalProfile = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    delete req.body.tenantId;
    delete req.body.isActive;
    delete req.body.verificationStatus;
    delete req.body.verifiedByAdmin;

    const existingProfile = await HospitalProfile.findOne({ tenantId });

    if (
      existingProfile &&
      ["PENDING", "APPROVED"].includes(existingProfile.verificationStatus)
    ) {
      return res.status(403).json({
        message: "Profile already submitted and under review",
      });
    }

    const profile = await HospitalProfile.findOneAndUpdate(
      { tenantId, isActive: true },
      {
        ...req.body,
        tenantId,
        verificationStatus: "PENDING",
        verifiedByAdmin: false,
      },
      { upsert: true, new: true }
    );

    // Client completed form, but NOT approved yet
    await Client.findOneAndUpdate(
      { tenantId },
      { registrationStage: "BASIC", accountStatus: "PENDING" }
    );

    return res.json({
      success: true,
      message: "Profile submitted for admin verification",
      profile,
    });
  } catch (err) {
    console.error("SAVE PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to submit hospital profile",
    });
  }
};

/* ===========================
   GET FULL PROFILE (MERGED)
   =========================== */
export const getHospitalProfile = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const client = await Client.findOne({ tenantId }).select(
      "hospitalName doctorName contactNumber email registrationStage"
    );

    const profile = await HospitalProfile.findOne({
      tenantId,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      basicInfo: client,
      profile,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hospital profile",
    });
  }
};

/* ===========================
   ADMIN DELETE (SOFT)
   =========================== */
export const adminDeleteHospitalProfile = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID required" });
    }

    const profile = await HospitalProfile.findOneAndUpdate(
      { tenantId },
      { isActive: false },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Hospital profile not found" });
    }

    // Optional: block client access
    await Client.findOneAndUpdate({ tenantId }, { accountStatus: "BLOCKED" });

    return res.json({
      success: true,
      message: "Hospital profile deactivated by admin",
    });
  } catch (err) {
    console.error("ADMIN DELETE PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete hospital profile",
    });
  }
};

export const adminApproveHospitalProfile = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const profile = await HospitalProfile.findOneAndUpdate(
      { tenantId },
      {
        verificationStatus: "APPROVED",
        verifiedByAdmin: true,
        verifiedAt: new Date(),
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const client = await Client.findOneAndUpdate(
      { tenantId },
      {
        accountStatus: "ACTIVE",
        registrationStage: "COMPLETED",
      },
      { new: true }
    );

    // 📧 SEND APPROVAL EMAIL
    await sendApprovalEmail({
      to: client.email,
      hospitalName: client.hospitalName,
      doctorName: client.doctorName,
    });

    res.json({
      success: true,
      message: "Hospital profile approved and email sent",
    });
  } catch (err) {
    console.error("ADMIN APPROVE ERROR:", err);
    res.status(500).json({ message: "Approval failed" });
  }
};

export const adminRejectHospitalProfile = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { reason } = req.body;

    const profile = await HospitalProfile.findOneAndUpdate(
      { tenantId },
      {
        verificationStatus: "REJECTED",
        verifiedByAdmin: false,
        rejectionReason: reason || "Not specified",
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const client = await Client.findOneAndUpdate(
      { tenantId },
      { accountStatus: "BLOCKED" },
      { new: true }
    );

    // 📧 SEND REJECTION EMAIL
    await sendRejectionEmail({
      to: client.email,
      hospitalName: client.hospitalName,
      doctorName: client.doctorName,
      reason,
    });

    res.json({
      success: true,
      message: "Hospital profile rejected and email sent",
    });
  } catch (err) {
    console.error("ADMIN REJECT ERROR:", err);
    res.status(500).json({ message: "Rejection failed" });
  }
};

/* ===========================
   ADMIN – GET ALL PENDING PROFILES
   =========================== */
export const adminGetPendingProfiles = async (req, res) => {
  try {
    const profiles = await HospitalProfile.find({
      verificationStatus: "PENDING",
      isActive: true,
    }).sort({ createdAt: -1 });

    // 🔥 merge Client data
    const enrichedProfiles = await Promise.all(
      profiles.map(async (profile) => {
        const client = await Client.findOne({
          tenantId: profile.tenantId,
        }).select(
          "hospitalName doctorName email contactNumber accountStatus registrationStage"
        );

        return {
          ...profile.toObject(),
          ...client?.toObject(),
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: enrichedProfiles.length,
      profiles: enrichedProfiles,
    });
  } catch (err) {
    console.error("ADMIN GET PENDING ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending profiles",
    });
  }
};

/* ===========================
   ADMIN – VIEW SINGLE PROFILE
   =========================== */
export const adminGetHospitalProfileByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const client = await Client.findOne({ tenantId }).select(
      "hospitalName doctorName contactNumber email accountStatus"
    );

    const profile = await HospitalProfile.findOne({ tenantId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      success: true,
      client,
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ===========================
   ADMIN – SEND MESSAGE
   =========================== */
export const adminSendMessage = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { message, attachments = [] } = req.body;

    if (!message && attachments.length === 0) {
      return res.status(400).json({
        message: "Message or attachment is required",
      });
    }

    const profile = await HospitalProfile.findOneAndUpdate(
      { tenantId, isActive: true },
      {
        $push: {
          verificationConversation: {
            sender: "ADMIN",
            message,
            attachments,
          },
        },
        verificationStatus: "PENDING",
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Hospital profile not found" });
    }

    res.json({
      success: true,
      message: "Message sent to client",
    });
  } catch (err) {
    console.error("ADMIN SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/* ===========================
   CLIENT – SEND MESSAGE
   =========================== */
export const clientSendMessage = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { message, attachments = [] } = req.body;

    if (!message && attachments.length === 0) {
      return res.status(400).json({
        message: "Message or attachment is required",
      });
    }

    const profile = await HospitalProfile.findOneAndUpdate(
      { tenantId, isActive: true },
      {
        $push: {
          verificationConversation: {
            sender: "CLIENT",
            message,
            attachments,
          },
        },
        verificationStatus: "PENDING",
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Hospital profile not found" });
    }

    res.json({
      success: true,
      message: "Message sent to admin",
    });
  } catch (err) {
    console.error("CLIENT SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/* ===========================
   GET VERIFICATION CONVERSATION
   =========================== */
export const getVerificationConversation = async (req, res) => {
  try {
    const tenantId =
      req.user.type === "admin" ? req.params.tenantId : req.user.tenantId;

    const profile = await HospitalProfile.findOne({ tenantId }).select(
      "verificationConversation verificationStatus"
    );

    if (!profile) {
      return res.status(404).json({ message: "Hospital profile not found" });
    }

    res.json({
      success: true,
      verificationStatus: profile.verificationStatus,
      conversation: profile.verificationConversation,
    });
  } catch (err) {
    console.error("GET CONVERSATION ERROR:", err);
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
};

/* ===========================
   GET ALL APPROVED HOSPITALS
   =========================== */
export const getAllApprovedHospitals = async (req, res) => {
  try {
    const profiles = await HospitalProfile.find({
      verificationStatus: "APPROVED",
      isActive: true,
    }).sort({ verifiedAt: -1 });

    const hospitals = await Promise.all(
      profiles.map(async (profile) => {
        const client = await Client.findOne({
          tenantId: profile.tenantId,
        }).select("hospitalName doctorName contactNumber email");

        return {
          tenantId: profile.tenantId,
          hospitalName: client?.hospitalName,
          doctorName: client?.doctorName,
          contactNumber: client?.contactNumber,
          email: client?.email,

          serviceType: profile.serviceType,
          address: profile.address,
          pincode: profile.pincode,
          latitude: profile.latitude,
          longitude: profile.longitude,

          hospitalImages: profile.hospitalImages,
          verifiedAt: profile.verifiedAt,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });
  } catch (err) {
    console.error("GET APPROVED HOSPITALS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch approved hospitals",
    });
  }
};

/* ===========================
   ADMIN – TOGGLE HOSPITAL ACTIVE / INACTIVE
   =========================== */
export const adminToggleHospitalStatus = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false",
      });
    }

    const profile = await HospitalProfile.findOneAndUpdate(
      { tenantId },
      { isActive },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        message: "Hospital profile not found",
      });
    }

    // Optional: sync client account access
    await Client.findOneAndUpdate(
      { tenantId },
      {
        accountStatus: isActive ? "ACTIVE" : "BLOCKED",
      }
    );

    return res.json({
      success: true,
      message: `Hospital ${
        isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (err) {
    console.error("ADMIN TOGGLE HOSPITAL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update hospital status",
    });
  }
};
