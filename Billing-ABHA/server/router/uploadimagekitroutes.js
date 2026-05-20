import express from "express";
import multer from "multer";
import ImageKit from "imagekit";
import { protect } from "../middleware/auth.middleware.js";
import { uploadImage } from "../controllers/uploadimgaekitcontroller.js";

const router = express.Router();

/* ===========================
   IMAGEKIT INSTANCE (FROM ENV)
   =========================== */
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/* ===========================
   MULTER CONFIG
   =========================== */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ===========================
   IMAGEKIT AUTH ENDPOINT
   =========================== */
router.get("/auth", protect, (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.status(200).json(result);
});

/* ===========================
   IMAGE UPLOAD ROUTE
   =========================== */
router.post(
  "/image",
  protect,               // 🔐 logged-in client
  upload.single("file"), // 📁 field name = file
  uploadImage
);

export default router;
