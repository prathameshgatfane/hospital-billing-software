import ImageKit from "imagekit";
import LabDocument from "../models/LabDocument.js";
import Patient from "../models/Patient.js";

// Initialize ImageKit securely
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// @desc    Upload a new laboratory document
// @route   POST /api/lab/upload
// @access  Private (Hospital)
export const uploadLabDocument = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id || req.user.clientId;
    const { patientId, doctorId, documentName, documentType, notes } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    // Verify patient exists and belongs to this hospital
    const patient = await Patient.findOne({ _id: patientId, tenantId });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // multer memoryStorage provides the buffer
      fileName: req.file.originalname,
      folder: `/Billing-ABHA/LabDocuments/${tenantId}/${patientId}`,
    });

    // Create DB Record
    const labDoc = await LabDocument.create({
      tenantId,
      patientId,
      doctorId: doctorId || null,
      documentName,
      documentType: documentType || "Other",
      fileUrl: uploadResponse.url,
      fileId: uploadResponse.fileId,
      uploadedBy: req.user.id || req.user._id,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: labDoc,
    });
  } catch (error) {
    console.error("Upload Lab Document Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to upload document" });
  }
};

// @desc    Get all documents for a specific patient
// @route   GET /api/lab/patient/:patientId
// @access  Private
export const getPatientDocuments = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id || req.user.clientId;
    const { patientId } = req.params;

    const documents = await LabDocument.find({ tenantId, patientId })
      .populate("doctorId", "fullName speciality")
      .populate("uploadedBy", "hospitalName email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a laboratory document
// @route   DELETE /api/lab/:documentId
// @access  Private
export const deleteLabDocument = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id || req.user.clientId;
    const { documentId } = req.params;

    const document = await LabDocument.findOne({ _id: documentId, tenantId });
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Attempt to delete from ImageKit
    try {
      await imagekit.deleteFile(document.fileId);
    } catch (ikError) {
      console.error("ImageKit Deletion Error (Continuing anyway):", ikError.message);
    }

    // Delete DB record
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
