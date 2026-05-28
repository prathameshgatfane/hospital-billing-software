import express from "express";
import { requestOtp, verifyOtp, profileShare } from "../controllers/abdmController.js";

const router = express.Router();

// Client-facing ABDM verification routes
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

// Webhook endpoint routes for Scan & Share integration
router.post("/profile/share", profileShare);
router.post("/v1.0/patients/profile/share", profileShare);
router.post("/api/v3/hip/patient/share", profileShare);

export default router;
