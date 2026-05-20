import dotenv from "dotenv";
dotenv.config(); // ✅ ADD THIS LINE

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"MAPVON PVT LTD – Billing Software" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Email Verification OTP | MAPVON Billing",
    html: `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;
                border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      
      <!-- HEADER -->
      <div style="background:#0D0D46;color:#ffffff;padding:16px 24px;">
        <h2 style="margin:0;font-size:20px;">MAPVON PVT LTD</h2>
        <p style="margin:4px 0 0;font-size:14px;opacity:0.9;">
          Secure Billing & Healthcare Management
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:24px;color:#111827;">
        <h3 style="margin-top:0;">Email Verification</h3>

        <p style="font-size:15px;">
          Thank you for registering with <strong>MAPVON Billing Software</strong>.
          Please use the OTP below to verify your email address:
        </p>

        <div style="text-align:center;margin:24px 0;">
          <span style="
            display:inline-block;
            font-size:28px;
            letter-spacing:4px;
            padding:12px 24px;
            background:#F3F4F6;
            border-radius:6px;
            font-weight:bold;
            color:#0D0D46;">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px;color:#374151;">
          ⏳ This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p style="font-size:14px;color:#374151;">
          If you did not request this verification, please ignore this email.
        </p>

        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />

        <p style="font-size:13px;color:#6B7280;">
          Need help? Contact our support team at
          <a href="mailto:support@mapvon.com" style="color:#2563eb;text-decoration:none;">
            support@mapvon.com
          </a>
        </p>
      </div>

      <!-- FOOTER -->
      <div style="background:#F9FAFB;padding:16px;text-align:center;
                  font-size:12px;color:#6B7280;">
        © ${new Date().getFullYear()} MAPVON PVT LTD. All rights reserved.
      </div>

    </div>
  `,
  });
};

/* ===========================
   ADMIN APPROVAL EMAIL
   =========================== */
export const sendApprovalEmail = async ({ to, hospitalName, doctorName }) => {
  await transporter.sendMail({
    from: `"MAPVON PVT LTD – Billing Software" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Hospital Profile Approved | MAPVON Billing",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;
                  border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

        <!-- HEADER -->
        <div style="background:#0D0D46;color:#ffffff;padding:16px 24px;">
          <h2 style="margin:0;">MAPVON PVT LTD</h2>
          <p style="margin:4px 0 0;font-size:14px;">
            Billing & Healthcare Management
          </p>
        </div>

        <!-- BODY -->
        <div style="padding:24px;color:#111827;">
          <h3>🎉 Profile Approved Successfully</h3>

          <p>
            Dear <strong>${doctorName}</strong>,
          </p>

          <p>
            We are pleased to inform you that your hospital
            <strong>${hospitalName}</strong> has been successfully
            <strong>verified and approved</strong> by our admin team.
          </p>

          <p>
            You can now access:
          </p>

          <ul>
            <li>Billing & Invoicing</li>
            <li>Patient Management</li>
            <li>Reports & Dashboard</li>
          </ul>

          <p>
            👉 Please login to your dashboard to continue.
          </p>

          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />

          <p style="font-size:13px;color:#6B7280;">
            Regards,<br />
            <strong>MAPVON PVT LTD – Billing Team</strong>
          </p>
        </div>

        <!-- FOOTER -->
        <div style="background:#F9FAFB;padding:16px;text-align:center;
                    font-size:12px;color:#6B7280;">
          © ${new Date().getFullYear()} MAPVON PVT LTD. All rights reserved.
        </div>

      </div>
    `,
  });
};

/* ===========================
   ADMIN REJECTION EMAIL
   =========================== */
export const sendRejectionEmail = async ({
  to,
  hospitalName,
  doctorName,
  reason,
}) => {
  await transporter.sendMail({
    from: `"MAPVON PVT LTD – Billing Software" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Hospital Profile Rejected | MAPVON Billing",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;
                  border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

        <!-- HEADER -->
        <div style="background:#7C0A02;color:#ffffff;padding:16px 24px;">
          <h2 style="margin:0;">MAPVON PVT LTD</h2>
          <p style="margin:4px 0 0;font-size:14px;">
            Billing & Healthcare Management
          </p>
        </div>

        <!-- BODY -->
        <div style="padding:24px;color:#111827;">
          <h3>❌ Profile Verification Rejected</h3>

          <p>
            Dear <strong>${doctorName}</strong>,
          </p>

          <p>
            We regret to inform you that your hospital
            <strong>${hospitalName}</strong> has been
            <strong>rejected</strong> during the verification process.
          </p>

          <p>
            <strong>Reason:</strong>
          </p>

          <div style="
            background:#FEF2F2;
            border-left:4px solid #DC2626;
            padding:12px;
            margin:12px 0;
            color:#991B1B;
            font-size:14px;
          ">
            ${reason || "Not specified"}
          </div>

          <p>
            👉 You may login to your dashboard, review the details,
            correct the information, and resubmit your profile for verification.
          </p>

          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />

          <p style="font-size:13px;color:#6B7280;">
            Regards,<br />
            <strong>MAPVON PVT LTD – Verification Team</strong>
          </p>
        </div>

        <!-- FOOTER -->
        <div style="background:#F9FAFB;padding:16px;text-align:center;
                    font-size:12px;color:#6B7280;">
          © ${new Date().getFullYear()} MAPVON PVT LTD. All rights reserved.
        </div>

      </div>
    `,
  });
};
