import express from "express";
import {
  registerAdmin,
  loginAdmin,
  adminCreateClient,
} from "../controllers/admin.auth.controller.js";

import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Admin → Create Client
router.post("/create-client", protect, adminOnly, adminCreateClient);

export default router;
