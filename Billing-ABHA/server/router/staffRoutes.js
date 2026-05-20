import express from "express";
import {
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff,
  staffLogin,
} from "../controllers/staffController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.post("/login", staffLogin);

// Protected (Client only)
router.get("/", protect, getStaff);
router.post("/", protect, createStaff);
router.put("/:id", protect, updateStaff);
router.delete("/:id", protect, deleteStaff);

export default router;
