import express from "express";
import { 
  admitPatient, getActiveAdmissions, addServiceRecord, 
  getAdmissionDetails, dischargePatient, getDischargedAdmissions 
} from "../controllers/ipdController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // All IPD routes are protected

router.post("/admissions", admitPatient);
router.get("/admissions/active", getActiveAdmissions);
router.get("/admissions/discharged", getDischargedAdmissions);
router.get("/admissions/:id", getAdmissionDetails);
router.post("/services", addServiceRecord);
router.post("/discharge/:id", dischargePatient);

export default router;
