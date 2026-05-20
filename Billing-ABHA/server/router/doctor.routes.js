import express from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import {
  addDoctor,
  getMyDoctors,
  adminGetPendingDoctors,
  adminApproveDoctor,
  adminRejectDoctor,
  adminGetDoctorsByHospital,
  adminToggleDoctorStatus,
  getActiveDoctorsForBilling,
  clientToggleDoctorStatus,
} from "../controllers/doctor.controller.js";
import { doctorSpecialties } from "../config/doctorSpecialties.js";

const router = express.Router();

/* ===========================
   META – DOCTOR SPECIALTIES
   =========================== */
router.get("/specialties", (req, res) => {
  res.json({
    success: true,
    specialties: doctorSpecialties,
  });
});

/* CLIENT */
router.post("/add", protect, addDoctor);
router.get("/my", protect, getMyDoctors);
router.get("/active", protect, getActiveDoctorsForBilling);
router.patch("/toggle/:doctorId", protect, clientToggleDoctorStatus);

/* ADMIN */
router.get("/admin/pending", protect, adminOnly, adminGetPendingDoctors);
router.post("/admin/approve/:doctorId", protect, adminOnly, adminApproveDoctor);
router.post("/admin/reject/:doctorId", protect, adminOnly, adminRejectDoctor);
router.get(
  "/admin/hospital/:tenantId",
  protect,
  adminOnly,
  adminGetDoctorsByHospital
);
router.patch(
  "/admin/toggle/:doctorId",
  protect,
  adminOnly,
  adminToggleDoctorStatus
);

export default router;
