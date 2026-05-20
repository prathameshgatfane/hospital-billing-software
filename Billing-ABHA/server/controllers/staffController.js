import bcrypt from "bcrypt";
import Staff from "../models/Staff.js";
import Client from "../models/Client.js";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

// Helper: Generate password like "HOSP1234"
const generateStaffPassword = (hospitalName) => {
  const prefix = hospitalName
    .split(" ")[0]
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 5);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${suffix}`;
};

// @desc   Send credentials email to staff
const sendStaffCredentialsEmail = async ({ to, name, hospitalName, plainPassword }) => {
  await transporter.sendMail({
    from: `"MAPVON PVT LTD – Billing Software" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Staff Login Credentials | MAPVON Billing",
    html: `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;
                border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <div style="background:#0D0D46;color:#ffffff;padding:16px 24px;">
        <h2 style="margin:0;">MAPVON PVT LTD</h2>
        <p style="margin:4px 0 0;font-size:14px;opacity:0.9;">Secure Billing & Healthcare Management</p>
      </div>
      <div style="padding:24px;color:#111827;">
        <h3 style="margin-top:0;">Welcome to ${hospitalName}!</h3>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your staff login has been created. Use the credentials below to access the system:</p>
        <div style="background:#F3F4F6;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:0 0 8px;font-size:14px;color:#374151;"><strong>Login URL:</strong> ${process.env.FRONTEND_URL || "http://localhost:5173"}/staff/login</p>
          <p style="margin:0 0 8px;font-size:14px;color:#374151;"><strong>Username (Email):</strong> ${to}</p>
          <p style="margin:0;font-size:14px;color:#374151;"><strong>Password:</strong> <span style="font-family:monospace;background:#e5e7eb;padding:2px 6px;border-radius:4px;">${plainPassword}</span></p>
        </div>
        <p style="color:#6B7280;font-size:13px;">Please keep these credentials safe. You can change your password after logging in.</p>
        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
        <p style="font-size:13px;color:#6B7280;">
          Need help? Contact support at
          <a href="mailto:support@mapvon.com" style="color:#2563eb;">support@mapvon.com</a>
        </p>
      </div>
      <div style="background:#F9FAFB;padding:16px;text-align:center;font-size:12px;color:#6B7280;">
        © ${new Date().getFullYear()} MAPVON PVT LTD. All rights reserved.
      </div>
    </div>
  `,
  });
};

// @desc    Create a new staff member
// @route   POST /api/staff
// @access  Private (Hospital Client only)
export const createStaff = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id;
    const { name, email, mobile, permissions } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({ success: false, message: "Name, email, and mobile are required." });
    }

    // Check for duplicate email
    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "A staff member with this email already exists." });
    }

    // Fetch hospital name for password generation
    const client = await Client.findById(tenantId);
    const plainPassword = generateStaffPassword(client?.hospitalName || "HOSP");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const staff = await Staff.create({
      tenantId,
      name,
      email,
      mobile,
      password: hashedPassword,
      permissions: permissions || [],
      role: req.body.role || "staff",
      doctorId: req.body.doctorId,
    });

    // Send credentials email
    try {
      await sendStaffCredentialsEmail({
        to: email,
        name,
        hospitalName: client?.hospitalName || "Your Hospital",
        plainPassword,
      });
    } catch (emailErr) {
      console.error("Staff credentials email failed:", emailErr.message);
      // Don't fail the whole request if email fails
    }

    res.status(201).json({
      success: true,
      message: `Staff member created. Credentials sent to ${email}.`,
      data: { ...staff.toObject(), password: undefined },
    });
  } catch (err) {
    console.error("CREATE STAFF ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all staff for this hospital
// @route   GET /api/staff
// @access  Private (Hospital Client only)
export const getStaff = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id;
    const staff = await Staff.find({ tenantId }).select("-password").sort("-createdAt");
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update staff permissions or status
// @route   PUT /api/staff/:id
// @access  Private (Hospital Client only)
export const updateStaff = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id;
    const { permissions, isActive, name, mobile, role, doctorId } = req.body;

    const staff = await Staff.findOne({ _id: req.params.id, tenantId });
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found." });

    if (permissions !== undefined) staff.permissions = permissions;
    if (isActive !== undefined) staff.isActive = isActive;
    if (name) staff.name = name;
    if (mobile) staff.mobile = mobile;
    if (role) staff.role = role;
    if (doctorId) staff.doctorId = doctorId;

    await staff.save();
    res.json({ success: true, message: "Staff updated.", data: { ...staff.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/staff/:id
// @access  Private (Hospital Client only)
export const deleteStaff = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id;
    const staff = await Staff.findOneAndDelete({ _id: req.params.id, tenantId });
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found." });
    res.json({ success: true, message: "Staff member removed." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Staff Login
// @route   POST /api/staff/login
// @access  Public
export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(401).json({ success: false, message: "Invalid credentials." });
    if (!staff.isActive) return res.status(403).json({ success: false, message: "Your account has been disabled. Contact your hospital administrator." });

    const match = await bcrypt.compare(password, staff.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials." });

    const token = generateToken({
      id: staff._id,
      type: "staff",
      tenantId: staff.tenantId || staff._id, // Staff usually have a tenantId, but fallback just in case
      permissions: staff.permissions,
      role: staff.role || "staff",
      doctorId: staff.doctorId,
    });

    res.json({
      success: true,
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        permissions: staff.permissions,
        tenantId: staff.tenantId,
        role: staff.role || "staff",
        doctorId: staff.doctorId,
      },
    });
  } catch (err) {
    console.error("STAFF LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Login failed." });
  }
};
