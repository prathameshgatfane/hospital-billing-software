import jwt from "jsonwebtoken";
import Client from "../models/Client.js";

export const protect = (req, res, next) => {
  console.log(`📡 [Middleware] Request: ${req.method} ${req.originalUrl}`);
  console.log("📨 Raw Auth Header:", JSON.stringify(req.headers.authorization));
  console.log("🛡️ [Middleware] Secret Check:", process.env.JWT_SECRET ? `${process.env.JWT_SECRET.substring(0, 3)}...` : "NONE");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("🔴 [Middleware] JWT Verification Failed!");
    console.error("   Error Name:", err.name);
    console.error("   Error Message:", err.message);
    console.error("   Used Secret (first 3):", process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 3) : "UNDEFINED");
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.type !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

/* ===========================
   CLIENT MUST BE ADMIN-APPROVED
   =========================== */
export const allowOnlyApprovedClients = async (req, res, next) => {
  try {
    // Use tenantId from user, or fallback to id (for clients where they are the same)
    const tenantId = req.user?.tenantId || req.user?.id;
    const userType = req.user?.type;

    if (!tenantId) {
      console.error("🔴 [Approval Check] FAILED: No ID (tenantId or id) found in req.user");
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only clients/staff need to be "Approved" - Admins are already approved
    if (userType === "admin") {
      return next();
    }

    const client = await Client.findOne({ tenantId });

    if (!client || client.accountStatus !== "ACTIVE") {
      return res.status(403).json({
        message: "Account pending admin verification",
      });
    }

    next();
  } catch (err) {
    console.error("APPROVAL CHECK ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};