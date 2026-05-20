import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.middleware.js";
import {
  uploadLabDocument,
  getPatientDocuments,
  deleteLabDocument,
} from "../controllers/labController.js";

const router = express.Router();

// Memory storage to process buffers directly with ImageKit
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Protect all routes
router.use(protect);

router.post("/upload", upload.single("document"), uploadLabDocument);
router.get("/patient/:patientId", getPatientDocuments);
router.delete("/:documentId", deleteLabDocument);

export default router;
