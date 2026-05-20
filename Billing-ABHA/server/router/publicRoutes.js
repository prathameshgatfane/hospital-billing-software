import express from "express";
import { getHospitals } from "../controllers/publicController.js";

const router = express.Router();

// GET /api/public/hospitals
router.get("/hospitals", getHospitals);

export default router;
