import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import Client from "../models/Client.js";
import generateToken from "../utils/generateToken.js";

/* ===========================
   REGISTER ADMIN (ONE TIME)
   =========================== */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await Admin.create({
      name,
      email,
      password: hash,
    });

    res.status(201).json({
      message: "Admin registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Admin registration failed" });
  }
};

/* ===========================
   LOGIN ADMIN
   =========================== */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken({
        id: admin._id,
        type: "admin",
      }),
    });
  } catch (err) {
    res.status(500).json({ message: "Admin login failed" });
  }
};

/* ===========================
   ADMIN CREATES CLIENT
   =========================== */

export const adminCreateClient = async (req, res) => {
  try {
    const { hospitalName, doctorName, contactNumber, email, password } =
      req.body;

    if (!hospitalName || !doctorName || !contactNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Client.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Client already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const client = await Client.create({
      hospitalName,
      doctorName,
      contactNumber,
      email,
      password: hash,

      // SaaS Rules
      emailVerified: true, // ✅ No OTP needed
      createdByAdmin: true, // ✅ Admin-created flag
      accountStatus: "ACTIVE", // ✅ Can login
      registrationStage: "BASIC", // ❌ Billing still locked
    });

    return res.status(201).json({
      success: true,
      message: "Client created by admin successfully",
      client: {
        id: client._id,
        email: client.email,
        hospitalName: client.hospitalName,
      },
    });
  } catch (err) {
    console.error("ADMIN CREATE CLIENT ERROR:", err);
    return res.status(500).json({ message: "Client creation failed" });
  }
};
