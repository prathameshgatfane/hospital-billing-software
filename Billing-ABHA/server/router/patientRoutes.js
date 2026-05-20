import express from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import {
  registerPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
  getPatientStats,
  checkDuplicatePatient,
  exportPatients,
  adminGetPatientsByHospital,
  adminTogglePatientStatus,
} from "../controllers/patientController.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

/* ===========================
   CLIENT ROUTES (Hospital-specific)
   =========================== */

// Patient CRUD operations for the hospital
router.route("/")
  .post(registerPatient)          // Register new patient
  .get(getPatients);              // Get all patients with filters

router.route("/search").get(searchPatients);       // Search patients
router.route("/stats").get(getPatientStats);       // Get patient statistics
router.route("/export").get(exportPatients);       // Export patients data
router.route("/check-duplicate").post(checkDuplicatePatient); // Check for duplicate

router.route("/:id")
  .get(getPatientById)            // Get single patient
  .put(updatePatient)             // Update patient
  .delete(deletePatient);         // Soft delete patient

/* ===========================
   ADMIN ROUTES
   =========================== */

// Admin can view patients across all hospitals
router.get("/admin/hospital/:clientId", protect, adminOnly, adminGetPatientsByHospital);

// Admin can toggle patient status (activate/deactivate)
router.patch("/admin/toggle/:patientId", protect, adminOnly, adminTogglePatientStatus);

export default router;