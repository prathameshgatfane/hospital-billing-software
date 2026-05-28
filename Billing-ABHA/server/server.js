import express from "express";
import dotenv from "dotenv";
dotenv.config();

console.log("🔑 [Server] JWT_SECRET Status:", process.env.JWT_SECRET ? "LOADED" : "MISSING");
import cors from "cors";

import connectDB from "./config/db.js";

import adminRoutes from "./router/admin.auth.routes.js";
import clientRoutes from "./router/client.auth.routes.js";
import hospitalProfileRoutes from "./router/hospitalProfile.routes.js";
import uploadRoutes from "./router/uploadimagekitroutes.js";
import registerdoctorRoutes from "./router/doctor.routes.js";
import patientRoutes from "./router/patientRoutes.js";
import opdServiceRoutes from "./router/opdServiceRoutes.js";
import opdBillingRoutes from "./router/opdBillingRoutes.js";
import billingSettingsRoutes from "./router/subadmin/billingSettingsRoutes.js";
import investigationSettingsRoutes from "./router/subadmin/investigationSettingsRoutes.js";
import ipdRoutes from "./router/ipdRoutes.js";
import labRoutes from "./router/labRoutes.js";
import staffRoutes from "./router/staffRoutes.js";
import opdConsultationRoutes from "./router/opdConsultationRoutes.js";
import publicRoutes from "./router/publicRoutes.js";
import abdmRoutes from "./router/abdmRoutes.js";

console.log("ENV CHECK:", {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_APP_PASS: process.env.EMAIL_APP_PASS ? "SET" : "NOT SET",
  JWT_SECRET_PREVIEW: process.env.JWT_SECRET ? `${process.env.JWT_SECRET.substring(0, 3)}...` : "NONE"
});

connectDB();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/profile", hospitalProfileRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/doctor", registerdoctorRoutes);
app.use("/api/opd/patient", patientRoutes);
app.use("/api/opd/services", opdServiceRoutes);
app.use("/api/opd/billing", opdBillingRoutes);
app.use("/api/opd/settings", billingSettingsRoutes);
app.use("/api/settings/investigation", investigationSettingsRoutes);
app.use("/api/ipd", ipdRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/opd/consultation", opdConsultationRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/abdm", abdmRoutes);
app.use("/", abdmRoutes); // To intercept root-level webhook callback endpoints (/v1.0/... and /api/v3/...)

app.get("/", (req, res) => {
  res.send("Billing SaaS Backend Running");
});

const PORT = process.env.PORT || 5012;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
