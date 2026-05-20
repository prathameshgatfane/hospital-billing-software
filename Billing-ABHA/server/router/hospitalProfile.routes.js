import express from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import {
  saveHospitalProfile,
  getHospitalProfile,
  adminDeleteHospitalProfile,
  adminApproveHospitalProfile,
  adminRejectHospitalProfile,
  adminGetPendingProfiles,
  adminGetHospitalProfileByTenant,
  adminSendMessage,
  clientSendMessage,
  getVerificationConversation,
  getAllApprovedHospitals,
  adminToggleHospitalStatus,
} from "../controllers/hospitalProfile.controller.js";

const router = express.Router();

/* ===========================
   CLIENT ROUTES
   =========================== */

router.post("/save", protect, saveHospitalProfile);
router.get("/me", protect, getHospitalProfile);
router.post("/conversation/send", protect, clientSendMessage);
router.get("/conversation/me", protect, getVerificationConversation);

/* ===========================
   ADMIN ROUTES
   =========================== */

// Delete hospital profile by tenant ID
router.delete(
  "/admin/:tenantId",
  protect,
  adminOnly,
  adminDeleteHospitalProfile
);

router.get("/admin/pending", protect, adminOnly, adminGetPendingProfiles);

router.post(
  "/admin/approve/:tenantId",
  protect,
  adminOnly,
  adminApproveHospitalProfile
);

router.post(
  "/admin/reject/:tenantId",
  protect,
  adminOnly,
  adminRejectHospitalProfile
);

router.get(
  "/admin/view/:tenantId",
  protect,
  adminOnly,
  adminGetHospitalProfileByTenant
);

router.post(
  "/admin/conversation/:tenantId",
  protect,
  adminOnly,
  adminSendMessage
);

router.get(
  "/admin/conversation/:tenantId",
  protect,
  adminOnly,
  getVerificationConversation
);

router.get("/approved", protect, adminOnly, getAllApprovedHospitals);

router.patch(
  "/admin/toggle/:tenantId",
  protect,
  adminOnly,
  adminToggleHospitalStatus
);
export default router;

// note point when we use the biiling and other services we have to make sure that the hospital profile is approved by admin before allowing any billing operations
// hence we will use the allowOnlyApprovedClients middleware in those routes to ensure that only approved clients can access those services
// router.post(
//   "/create",
//   protect,
//   allowOnlyApprovedClients, // 🔒 ONLY HERE
//   createBill
// );
