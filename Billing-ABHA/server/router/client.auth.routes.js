import express from "express";
import {
  registerClient,
  verifyRegisterOtp,
  resendRegisterOtp,
  loginClient,
  forgotPassword,
  resetPassword,
  getMyClientProfile,
  updateMyClientProfile,
  verifyEmailChangeOtp,
} from "../controllers/client.auth.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerClient);
router.post("/verify-otp", verifyRegisterOtp);
router.post("/resend-otp", resendRegisterOtp);
router.post("/login", loginClient);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* CLIENT PROFILE */
router.get("/client-me", protect, getMyClientProfile);
router.put("/client-me-update", protect, updateMyClientProfile);

router.post("/verify-email-change", protect, verifyEmailChangeOtp);

export default router;
