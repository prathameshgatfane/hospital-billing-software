import Doctor from "../models/Doctor.js";
import HospitalProfile from "../models/HospitalProfile.js";
import { doctorSpecialties } from "../config/doctorSpecialties.js";

/* ===========================
   CLIENT – ADD DOCTOR
   =========================== */
export const addDoctor = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const {
      speciality,
      subSpeciality,
      agreementAccepted,
      doctorRegistrationNumber,
    } = req.body;

    /* 🔐 CHECK HOSPITAL APPROVAL STATUS */
    const hospital = await HospitalProfile.findOne({
      tenantId,
      verificationStatus: "APPROVED",
      isActive: true,
    });

    if (!hospital) {
      return res.status(403).json({
        message: "Hospital must be approved before adding doctors",
      });
    }

    /* 🔒 AGREEMENT CHECK */
    if (!agreementAccepted) {
      return res.status(400).json({
        message: "Doctor agreement must be accepted",
      });
    }

    /* 🔒 DUPLICATE DOCTOR CHECK (SAME HOSPITAL) */
    const exists = await Doctor.findOne({
      doctorRegistrationNumber,
      tenantId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Doctor already exists with this registration number",
      });
    }

    /* 🔒 VALIDATE SPECIALITY */
    const specialityObj = doctorSpecialties.find((s) => s.name === speciality);

    if (!specialityObj) {
      return res.status(400).json({
        message: "Invalid speciality selected",
      });
    }

    /* 🔒 VALIDATE SUB-SPECIALITY (DEPENDENCY) */
    if (
      subSpeciality &&
      !specialityObj.subSpecialties.includes(subSpeciality)
    ) {
      return res.status(400).json({
        message: `Invalid sub-speciality for ${speciality}`,
      });
    }

    /* ✅ CREATE DOCTOR */
    const doctor = await Doctor.create({
      ...req.body,
      tenantId,
      verificationStatus: "PENDING",
      verifiedByAdmin: false,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor submitted for admin approval",
      doctorId: doctor._id,
    });
  } catch (err) {
    console.error("ADD DOCTOR ERROR:", err);
    return res.status(500).json({
      message: "Failed to add doctor",
    });
  }
};

export const getMyDoctors = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    // Fetch doctors and also look up if they have linked staff accounts
    const doctors = await Doctor.find({ tenantId }).sort({ createdAt: -1 });
    
    // For each doctor, we can check if a Staff record exists with their doctorId
    // Standardizing the response to include isLinked boolean
    const Staff = (await import("../models/Staff.js")).default;
    const staffMembers = await Staff.find({ tenantId, role: "doctor" });

    const doctorsWithLogin = doctors.map(doc => {
      const hasLogin = staffMembers.some(s => s.doctorId?.toString() === doc._id.toString());
      return {
        ...doc.toObject(),
        hasLogin
      };
    });

    res.json({
      success: true,
      count: doctors.length,
      doctors: doctorsWithLogin,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clientToggleDoctorStatus = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { doctorId } = req.params;
    const { isActive } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { _id: doctorId, tenantId },
      { isActive },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found or unauthorized" });
    }

    res.json({
      success: true,
      message: `Doctor ${isActive ? "activated" : "deactivated"} successfully`,
      data: doctor
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getActiveDoctorsForBilling = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const doctors = await Doctor.find({
      tenantId,
      verificationStatus: "APPROVED",
      isActive: true,
    }).select("fullName speciality subSpeciality charges");

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (err) {
    console.error("GET ACTIVE DOCTORS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

/* ===========================
   Admin -Opreations
   =========================== */

export const adminGetPendingDoctors = async (req, res) => {
  const doctors = await Doctor.find({
    verificationStatus: "PENDING",
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: doctors.length,
    doctors,
  });
};

export const adminApproveDoctor = async (req, res) => {
  const { doctorId } = req.params;

  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    {
      verificationStatus: "APPROVED",
      verifiedByAdmin: true,
      rejectionReason: null,
    },
    { new: true }
  );

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  res.json({
    success: true,
    message: "Doctor approved successfully",
  });
};

export const adminRejectDoctor = async (req, res) => {
  const { doctorId } = req.params;
  const { reason } = req.body;

  await Doctor.findByIdAndUpdate(doctorId, {
    verificationStatus: "REJECTED",
    verifiedByAdmin: false,
    rejectionReason: reason || "Not specified",
  });

  res.json({
    success: true,
    message: "Doctor rejected",
  });
};

export const adminGetDoctorsByHospital = async (req, res) => {
  console.log("ADMIN USER:", req.user);
  console.log("TENANT ID:", req.params.tenantId);
  try {
    const { tenantId } = req.params;

    const doctors = await Doctor.find({ tenantId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (err) {
    console.error("ADMIN GET DOCTORS BY HOSPITAL ERROR:", err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

export const adminToggleDoctorStatus = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { isActive } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { isActive },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      success: true,
      message: `Doctor ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (err) {
    console.error("TOGGLE DOCTOR ERROR:", err);
    res.status(500).json({ message: "Failed to update doctor status" });
  }
};
