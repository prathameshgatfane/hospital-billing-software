import express from "express";
import multer from "multer";
import { getSettings, updateSettings, bulkUploadSettings } from "../../controllers/subadmin/investigationSettingsController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);
router.post("/bulk", protect, upload.single("file"), bulkUploadSettings);

export default router;
