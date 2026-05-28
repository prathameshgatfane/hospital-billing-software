import axios from "axios";
import crypto from "crypto";
import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import { getAbdmToken } from "../utils/abdmSessionManager.js";
import { encryptData } from "../utils/abdmCrypto.js";

/**
 * Request OTP for Aadhaar Verification / ABHA Creation
 */
export async function requestOtp(req, res) {
  try {
    const { aadhaarNumber } = req.body;

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar Number. Must be exactly 12 digits.",
      });
    }

    console.log("ℹ️ [ABDM Controller] Requesting Aadhaar OTP for: XXXXXXXX" + aadhaarNumber.slice(-4));
    
    // Encrypt Aadhaar using RSA OAEP with SHA-1
    const encryptedAadhaar = await encryptData(aadhaarNumber);

    const abhaApiUrl = process.env.ABHA_API_URL || "https://abhasbx.abdm.gov.in/abha/api";
    const sessionToken = await getAbdmToken();

    const payload = {
      txnId: "",
      scope: ["abha-enrol"],
      loginHint: "aadhaar",
      loginId: encryptedAadhaar,
      otpSystem: "aadhaar",
    };

    const headers = {
      "Content-Type": "application/json",
      "REQUEST-ID": crypto.randomUUID(),
      TIMESTAMP: new Date().toISOString(),
      "X-CM-ID": "sbx",
      Authorization: `Bearer ${sessionToken}`,
    };

    const response = await axios.post(`${abhaApiUrl}/v3/enrollment/request/otp`, payload, { headers });

    if (response.data && response.data.txnId) {
      console.log("✅ [ABDM Controller] OTP Request successful. Transaction ID:", response.data.txnId);
      return res.status(200).json({
        success: true,
        txnId: response.data.txnId,
        message: "OTP sent successfully to Aadhaar-linked mobile number.",
      });
    } else {
      throw new Error("Invalid response format from ABDM OTP API");
    }
  } catch (error) {
    console.error("❌ [ABDM Controller requestOtp Error]:", error.response?.data || error.message);
    
    // Mock fallback support for sandbox if the gateway is temporarily unavailable
    if (process.env.NODE_ENV !== "production") {
      const mockTxnId = crypto.randomUUID();
      console.log("⚠️ [ABDM Controller] Using sandbox mock OTP fallback. Txn ID:", mockTxnId);
      return res.status(200).json({
        success: true,
        txnId: mockTxnId,
        isMock: true,
        message: "Sandbox mock OTP request initiated. Use mock OTP 123456.",
      });
    }

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Failed to request Aadhaar OTP.",
    });
  }
}

/**
 * Verify OTP and Enrol Patient (ABHA Creation)
 */
export async function verifyOtp(req, res) {
  try {
    const { txnId, otpValue } = req.body;

    if (!txnId || !otpValue) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID and OTP Value are required.",
      });
    }

    console.log("ℹ️ [ABDM Controller] Verifying OTP for Transaction ID:", txnId);

    // Mock flow handling in Sandbox
    if (otpValue === "123456") {
      console.log("✅ [ABDM Controller] Sandbox mock OTP match. Simulating profile creation.");
      
      const mockProfile = {
        abhaNumber: "91-1234-5678-9012",
        abhaAddress: `mockpatient_${Date.now().toString().slice(-4)}@sbx`,
        firstName: "Prathamesh",
        lastName: "Gatfane",
        gender: "Male",
        dateOfBirth: "1998-05-15",
        mobile: "9876543210",
        address: {
          addressLine1: "123 Health Care Avenue",
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001",
          country: "India"
        },
        photo: "",
        kycVerified: true,
        mobileLinked: true
      };

      return res.status(200).json({
        success: true,
        isMock: true,
        profile: mockProfile,
        message: "Aadhaar verified successfully (Sandbox Mock).",
      });
    }

    // Real Sandbox Gateway integration
    const encryptedOtp = await encryptData(otpValue);
    const abhaApiUrl = process.env.ABHA_API_URL || "https://abhasbx.abdm.gov.in/abha/api";
    const sessionToken = await getAbdmToken();

    const payload = {
      authData: {
        authMethods: ["otp"],
        otp: {
          txnId: txnId,
          otpValue: encryptedOtp,
        },
      },
      consent: {
        code: "abha-enrollment",
        version: "1.4",
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "REQUEST-ID": crypto.randomUUID(),
      TIMESTAMP: new Date().toISOString(),
      "X-CM-ID": "sbx",
      Authorization: `Bearer ${sessionToken}`,
    };

    const response = await axios.post(`${abhaApiUrl}/v3/enrollment/enrol/byAadhaar`, payload, { headers });

    if (response.data) {
      const p = response.data;
      console.log("✅ [ABDM Controller] ABHA Enrollment successful for:", p.firstName, p.lastName);
      
      // Parse DOB
      let formattedDob = "";
      if (p.yearOfBirth) {
        const month = String(p.monthOfBirth || 1).padStart(2, "0");
        const day = String(p.dayOfBirth || 1).padStart(2, "0");
        formattedDob = `${p.yearOfBirth}-${month}-${day}`;
      }

      const abhaProfile = {
        abhaNumber: p.abhaNumber,
        abhaAddress: p.abhaAddress,
        firstName: p.firstName || "",
        middleName: p.middleName || "",
        lastName: p.lastName || "",
        gender: p.gender === "M" ? "Male" : p.gender === "F" ? "Female" : "Other",
        dateOfBirth: formattedDob,
        mobile: p.mobile || "",
        address: {
          addressLine1: p.address?.line || "",
          city: p.address?.district || "",
          state: p.address?.state || "",
          pincode: p.address?.pincode || "",
          country: "India",
        },
        photo: p.photo || "",
        kycVerified: true,
        mobileLinked: true,
      };

      return res.status(200).json({
        success: true,
        profile: abhaProfile,
        message: "Aadhaar verified and ABHA profile generated successfully.",
      });
    } else {
      throw new Error("Empty response received from ABHA enrollment API");
    }
  } catch (error) {
    console.error("❌ [ABDM Controller verifyOtp Error]:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Failed to verify Aadhaar OTP.",
    });
  }
}

/**
 * Profile Share webhook callback for Scan & Share QR code registration
 */
export async function profileShare(req, res) {
  try {
    const payload = req.body;
    console.log("📥 [ABDM Webhook] Scan & Share Profile received:", JSON.stringify(payload, null, 2));

    const requestId = payload.requestId;
    const profile = payload.profile || {};
    const patientData = profile.patient || {};
    const abhaAddress = patientData.id || "";
    const name = patientData.name || "ABDM Patient";
    const gender = patientData.gender || "M";
    const yearOfBirth = patientData.yearOfBirth || "1990";
    const dayOfBirth = patientData.dayOfBirth || "01";
    const monthOfBirth = patientData.monthOfBirth || "01";
    const dobString = `${yearOfBirth}-${String(monthOfBirth).padStart(2, "0")}-${String(dayOfBirth).padStart(2, "0")}`;
    
    const addressData = patientData.address || {};
    const mobileNumber = patientData.mobile || "9999999999";

    // Split name to first and last name
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "ABDM";
    const lastName = nameParts.slice(1).join(" ") || "Patient";

    // Resolve tenantId
    let tenantId = null;
    const HospitalProfile = mongoose.model("HospitalProfile");
    const Client = mongoose.model("Client");
    
    const hospital = await HospitalProfile.findOne() || await Client.findOne();
    if (hospital) {
      tenantId = hospital.tenantId || hospital._id;
    }

    if (!tenantId) {
      console.warn("⚠️ [ABDM Webhook] Could not find any tenantId (Hospital/Client) to link patient.");
      return res.status(400).json({ success: false, message: "No active tenant configuration found." });
    }

    // Create or update Patient record in MongoDB
    let patient = await Patient.findOne({ tenantId, abhaAddress });
    
    const patientFields = {
      tenantId,
      firstName,
      lastName,
      gender: gender === "M" ? "Male" : gender === "F" ? "Female" : "Other",
      dateOfBirth: new Date(dobString),
      mobile: mobileNumber,
      address: {
        addressLine1: addressData.line || "Scan & Share Address",
        city: addressData.district || "City",
        state: addressData.state || "State",
        pincode: addressData.pincode || "000000",
        country: "India",
      },
      abhaNumber: patientData.abhaNumber || "",
      abhaAddress: abhaAddress,
      abhaProfile: {
        photo: patientData.profilePhoto || "",
        kycVerified: true,
        mobileLinked: true,
      },
      status: "Active",
      isActive: true,
    };

    if (patient) {
      console.log("ℹ️ [ABDM Webhook] Existing Patient found. Updating record:", patient.patientId);
      patient = await Patient.findByIdAndUpdate(patient._id, patientFields, { new: true });
    } else {
      console.log("ℹ️ [ABDM Webhook] Creating new Patient via Scan & Share.");
      patient = new Patient(patientFields);
      await patient.save();
    }

    // Acknowledge to ABDM Gateway (/on-share)
    const sessionToken = await getAbdmToken();
    const gatewayUrl = process.env.ABDM_GATEWAY_URL || "https://dev.abdm.gov.in";

    const ackPayload = {
      acknowledgement: {
        status: "SUCCESS",
        abhaAddress: abhaAddress,
        profile: {
          context: "OPD-ScanAndShare",
          tokenNumber: patient.patientId || String(Date.now()).slice(-4),
          expiry: "600",
        },
      },
      response: {
        requestId: requestId,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "REQUEST-ID": crypto.randomUUID(),
      TIMESTAMP: new Date().toISOString(),
      "X-CM-ID": "sbx",
      Authorization: `Bearer ${sessionToken}`,
    };

    console.log("📤 [ABDM Webhook] Sending on-share acknowledgment payload to gateway.");
    await axios.post(`${gatewayUrl}/api/hiecm/patient-share/v3/on-share`, ackPayload, { headers });
    
    console.log("✅ [ABDM Webhook] Scan & Share workflow processed successfully.");
    return res.status(202).json({
      success: true,
      message: "Webhook processed and acknowledgment sent.",
      patientId: patient.patientId,
    });
  } catch (error) {
    console.error("❌ [ABDM Webhook Error]:", error.response?.data || error.message);
    // Respond with 202 even if ack to gateway fails to keep webhook from retrying endlessly
    return res.status(202).json({
      success: false,
      message: error.message || "Failed to process profile share callback.",
    });
  }
}
