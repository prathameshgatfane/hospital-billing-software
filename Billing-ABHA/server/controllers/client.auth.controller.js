import bcrypt from "bcrypt";
import Client from "../models/Client.js";
import generateToken from "../utils/generateToken.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

/* ===========================
   OTP GENERATOR
   =========================== */
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ======================================
   REGISTER CLIENT (OTP AT REGISTER)
   ====================================== */
export const registerClient = async (req, res) => {
  try {
    const { hospitalName, doctorName, contactNumber, email, password, address, location } =
      req.body;

    if (!hospitalName || !doctorName || !contactNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Client.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    await Client.create({
      hospitalName,
      doctorName,
      contactNumber,
      email,
      password: hash,
      address,
      location,
      emailOtp: otp,
      emailOtpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      emailVerified: false,
      registrationStage: "BASIC",
      accountStatus: "PENDING",
    });

    await sendOtpEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to email. Please verify to continue.",
    });
  } catch (err) {
    console.error("REGISTER CLIENT ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ======================================
   VERIFY OTP (REGISTER TIME)
   ====================================== */
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (client.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (client.emailOtp !== otp || client.emailOtpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    client.emailVerified = true;
    client.emailOtp = null;
    client.emailOtpExpiry = null;
    client.accountStatus = "ACTIVE";

    await client.save();

    res.json({
      message: "Email verified successfully. You can now login.",
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ======================================
   RESEND OTP (IF EXPIRED / USER REQUEST)
   ====================================== */
export const resendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (client.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = generateOtp();

    client.emailOtp = otp;
    client.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await client.save();

    await sendOtpEmail(email, otp);

    res.json({
      message: "New OTP sent to email",
    });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

/* ======================================
   LOGIN CLIENT (NO OTP HERE)
   ====================================== */
export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!client.emailVerified) {
      return res.status(403).json({
        message: "Email not verified. Please verify OTP first.",
      });
    }

    const match = await bcrypt.compare(password, client.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken({
        id: client._id,
        type: "client",
        tenantId: client.tenantId || client._id,
      }),
      registrationStage: client.registrationStage,
      accountStatus: client.accountStatus,
    });
  } catch (err) {
    console.error("LOGIN CLIENT ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const otp = generateOtp();

    client.resetPasswordOtp = otp;
    client.resetPasswordOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await client.save();

    await sendOtpEmail(email, otp);

    res.json({
      message: "Password reset OTP sent to email",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (
      client.resetPasswordOtp !== otp ||
      client.resetPasswordOtpExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    client.password = hash;
    client.resetPasswordOtp = null;
    client.resetPasswordOtpExpiry = null;

    await client.save();

    res.json({
      message: "Password reset successful. You can now login.",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Password reset failed" });
  }
};

/* ======================================
   GET LOGGED-IN CLIENT PROFILE
   ====================================== */
export const getMyClientProfile = async (req, res) => {
  try {
    const client = await Client.findById(req.user.id).select(
      "-password -emailOtp -emailOtpExpiry -resetPasswordOtp -resetPasswordOtpExpiry"
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({
      success: true,
      client,
    });
  } catch (err) {
    console.error("GET CLIENT PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ======================================
   UPDATE CLIENT PROFILE (LIMITED FIELDS)
   ====================================== */
export const updateMyClientProfile = async (req, res) => {
  try {
    const { email, doctorName } = req.body;

    const client = await Client.findById(req.user.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    let responseMessage = [];

    /* ✅ Update doctor name directly */
    if (doctorName) {
      client.doctorName = doctorName;
      responseMessage.push("Doctor name updated");
    }

    /* 🔐 Email change → OTP required */
    if (email && email !== client.email) {
      const otp = generateOtp();

      client.pendingEmail = email;
      client.emailChangeOtp = otp;
      client.emailChangeOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      client.emailVerified = false;

      await sendOtpEmail(email, otp);

      responseMessage.push("OTP sent to new email for verification");
    }

    if (responseMessage.length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    await client.save();

    res.json({
      success: true,
      message: responseMessage.join(". "),
    });
  } catch (err) {
    console.error("UPDATE CLIENT PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const verifyEmailChangeOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    const client = await Client.findById(req.user.id);
    if (!client || !client.pendingEmail) {
      return res.status(400).json({ message: "No email change request found" });
    }

    if (
      client.emailChangeOtp !== otp ||
      client.emailChangeOtpExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    client.email = client.pendingEmail;
    client.pendingEmail = null;
    client.emailChangeOtp = null;
    client.emailChangeOtpExpiry = null;
    client.emailVerified = true;

    await client.save();

    res.json({
      success: true,
      message: "Email updated and verified successfully",
    });
  } catch (err) {
    console.error("VERIFY EMAIL CHANGE ERROR:", err);
    res.status(500).json({ message: "Email verification failed" });
  }
};
