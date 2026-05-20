import express from "express";
import { getBillingSettings, updateBillingSettings } from "../../controllers/subadmin/billingSettingsController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getBillingSettings);
router.post("/", protect, updateBillingSettings);

export default router;
