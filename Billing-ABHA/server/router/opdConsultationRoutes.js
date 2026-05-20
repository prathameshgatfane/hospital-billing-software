import express from "express";
import { opdConsultationController } from "../controllers/opdConsultationController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require client/staff authentication
router.use(protect);

// Queue Management
router.get("/queue/:doctorId", opdConsultationController.getDoctorQueue);
router.put("/expire/:billId", opdConsultationController.expireBill);

// Consultation Recording
router.post("/save", opdConsultationController.saveConsultation);
router.get("/details/:id", opdConsultationController.getConsultationDetails);

// History
router.get("/history/:patientId", opdConsultationController.getPatientHistory);

export default router;
