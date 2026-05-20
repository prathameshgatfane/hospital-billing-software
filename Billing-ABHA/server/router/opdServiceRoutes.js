import express from "express";
import {
  getOpdServices,
  addOpdService,
  updateOpdService,
  deleteOpdService,
  bulkAddOpdServices
} from "../controllers/opdServiceController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected by client/hospital auth
router.use(protect);

router.get("/", getOpdServices);
router.post("/", addOpdService);
router.post("/bulk", bulkAddOpdServices);
router.put("/:id", updateOpdService);
router.delete("/:id", deleteOpdService);

export default router;
