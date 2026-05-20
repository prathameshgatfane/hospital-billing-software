import express from "express";
import { 
  createOpdBill, 
  getBills, 
  getBillById, 
  updateBill 
} from "../controllers/opdBillingController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected by client/hospital auth
router.use(protect);

router.get("/", getBills);
router.post("/", createOpdBill);
router.get("/:id", getBillById);
router.put("/:id", updateBill);

export default router;
