import asyncHandler from "express-async-handler";
import Patient from "../models/Patient.js";
import Client from "../models/Client.js";
import { exportToCSV, exportToExcel, exportToPDF } from "../utils/exportUtils.js";
import { validatePatientData } from "../utils/validationUtils.js";

// @desc    Register a new patient
// @route   POST /api/patients
// @access  Private (Hospital)
const registerPatient = asyncHandler(async (req, res) => {
  // Get hospital (client) ID from logged-in user
  const hospitalId = req.user.tenantId || req.user.clientId;

  // Validate patient data
  const validationErrors = validatePatientData(req.body);
  if (validationErrors.length > 0) {
    res.status(400);
    throw new Error(validationErrors.join(", "));
  }

  const { email, mobile } = req.body;

  // Check if patient already exists (considering hospital isolation)
  const existingPatient = await Patient.findOne({
    tenantId: hospitalId,
    $or: [
      { email: email?.toLowerCase() },
      { mobile }
    ]
  });

  if (existingPatient) {
    res.status(400);
    throw new Error("Patient with this email or phone already exists");
  }

  // Create patient with all provided data
  const patient = await Patient.create({
    ...req.body,
    tenantId: hospitalId,
    createdBy: req.user._id
  });

  if (patient) {
    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: patient
    });
  } else {
    res.status(400);
    throw new Error("Invalid patient data");
  }
});

// @desc    Get all patients with pagination and filters
// @route   GET /api/patients
// @access  Private (Hospital)
const getPatients = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
    search,
    gender,
    bloodGroup,
    status = 'Active'
  } = req.query;

  // Get hospital ID from logged-in user
  const hospitalId = req.user.tenantId || req.user.clientId;

  // Build query
  const query = { tenantId: hospitalId };

  // Apply status filter
  if (status) {
    query.status = status;
  }

  // Apply gender filter
  if (gender) {
    query.gender = gender;
  }

  // Apply blood group filter
  if (bloodGroup) {
    query.bloodGroup = bloodGroup;
  }

  // Apply search filter
  if (search) {
    query.$or = [
      { patientId: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } }
    ];
  }

  // Execute query with pagination
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    populate: [
      { path: "createdBy", select: "hospitalName email" },
      { path: "lastUpdatedBy", select: "hospitalName email" }
    ]
  };

  const patients = await Patient.paginate(query, options);

  res.json({
    success: true,
    data: patients.docs,
    pagination: {
      total: patients.totalDocs,
      page: patients.page,
      pages: patients.totalPages,
      limit: patients.limit,
      hasNext: patients.hasNextPage,
      hasPrev: patients.hasPrevPage
    }
  });
});

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private (Hospital)
const getPatientById = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.clientId;

  const patient = await Patient.findOne({
    _id: req.params.id,
    tenantId: hospitalId
  })
    .populate("createdBy", "hospitalName email")
    .populate("lastUpdatedBy", "hospitalName email");

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  res.json({
    success: true,
    data: patient
  });
});

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private (Hospital)
const updatePatient = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.clientId;

  const patient = await Patient.findOne({
    _id: req.params.id,
    tenantId: hospitalId
  });

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  // Check for duplicate email/phone excluding current patient
  if (req.body.email || req.body.phone) {
    const duplicateQuery = {
      tenantId: hospitalId,
      _id: { $ne: patient._id },
      $or: []
    };

    if (req.body.email) {
      duplicateQuery.$or.push({ email: req.body.email.toLowerCase() });
    }
    if (req.body.mobile) {
      duplicateQuery.$or.push({ mobile: req.body.mobile });
    }

    if (duplicateQuery.$or.length > 0) {
      const duplicatePatient = await Patient.findOne(duplicateQuery);
      if (duplicatePatient) {
        res.status(400);
        throw new Error("Email or phone already exists for another patient");
      }
    }
  }

  // Validate updated data
  const updateData = { ...req.body, updatedBy: req.user._id };
  if (updateData.email) {
    updateData.email = updateData.email.toLowerCase();
  }

  const validationErrors = validatePatientData(updateData, true);
  if (validationErrors.length > 0) {
    res.status(400);
    throw new Error(validationErrors.join(", "));
  }

  const updatedPatient = await Patient.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate("updatedBy", "hospitalName email");

  res.json({
    success: true,
    message: "Patient updated successfully",
    data: updatedPatient
  });
});

// @desc    Delete patient (soft delete)
// @route   DELETE /api/patients/:id
// @access  Private (Hospital)
const deletePatient = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.clientId;

  const patient = await Patient.findOne({
    _id: req.params.id,
    tenantId: hospitalId
  });

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  // Soft delete by updating status
  patient.status = "inactive";
  patient.deletedAt = Date.now();
  patient.deletedBy = req.user._id;
  await patient.save();

  res.json({
    success: true,
    message: "Patient deleted successfully"
  });
});

// @desc    Search patients with advanced filters
// @route   GET /api/patients/search
// @access  Private (Hospital)
const searchPatients = asyncHandler(async (req, res) => {
  const {
    query,
    gender,
    bloodGroup,
    ageFrom,
    ageTo,
    dateFrom,
    dateTo,
    status = 'active'
  } = req.query;

  const hospitalId = req.user.tenantId || req.user.clientId;
  const searchQuery = { tenantId: hospitalId, status };

  // Text search
  if (query) {
    searchQuery.$or = [
      { patientId: { $regex: query, $options: "i" } },
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { mobile: { $regex: query, $options: "i" } }
    ];
  }

  // Gender filter
  if (gender) {
    searchQuery.gender = gender;
  }

  // Blood group filter
  if (bloodGroup) {
    searchQuery.bloodGroup = bloodGroup;
  }

  // Age range filter
  if (ageFrom || ageTo) {
    const today = new Date();
    const minDate = new Date();
    const maxDate = new Date();

    if (ageTo) {
      minDate.setFullYear(today.getFullYear() - ageTo - 1);
    }
    if (ageFrom) {
      maxDate.setFullYear(today.getFullYear() - ageFrom);
    }

    searchQuery.dateOfBirth = {};
    if (ageTo) searchQuery.dateOfBirth.$gte = minDate;
    if (ageFrom) searchQuery.dateOfBirth.$lte = maxDate;
  }

  // Date range filter (created date)
  if (dateFrom || dateTo) {
    searchQuery.createdAt = {};
    if (dateFrom) {
      searchQuery.createdAt.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      searchQuery.createdAt.$lte = new Date(dateTo);
    }
  }

  const patients = await Patient.find(searchQuery)
    .sort("-createdAt")
    .limit(50)
    .populate("createdBy", "hospitalName email");

  res.json({
    success: true,
    count: patients.length,
    data: patients
  });
});

// @desc    Get patient statistics
// @route   GET /api/patients/stats
// @access  Private (Hospital)
const getPatientStats = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;
  const hospitalId = req.user.tenantId || req.user.clientId;
  const today = new Date();
  let startDate;

  switch (period) {
    case "day":
      startDate = new Date(today.setDate(today.getDate() - 1));
      break;
    case "week":
      startDate = new Date(today.setDate(today.getDate() - 7));
      break;
    case "month":
      startDate = new Date(today.setMonth(today.getMonth() - 1));
      break;
    case "year":
      startDate = new Date(today.setFullYear(today.getFullYear() - 1));
      break;
    default:
      startDate = new Date(today.setMonth(today.getMonth() - 1));
  }

  // Total patients
  const totalPatients = await Patient.countDocuments({ tenantId: hospitalId });

  // Active patients
  const activePatients = await Patient.countDocuments({
    tenantId: hospitalId,
    status: "active"
  });

  // New patients in period
  const newPatients = await Patient.countDocuments({
    tenantId: hospitalId,
    createdAt: { $gte: startDate }
  });

  // Gender distribution
  const genderStats = await Patient.aggregate([
    {
      $match: { tenantId: hospitalId, status: "active" }
    },
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 }
      }
    }
  ]);

  // Blood group distribution
  const bloodGroupStats = await Patient.aggregate([
    {
      $match: {
        tenantId: hospitalId,
        status: "active",
        bloodGroup: { $exists: true, $ne: "" }
      }
    },
    {
      $group: {
        _id: "$bloodGroup",
        count: { $sum: 1 }
      }
    }
  ]);

  // Monthly registration trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Patient.aggregate([
    {
      $match: {
        tenantId: hospitalId,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    },
    {
      $limit: 6
    }
  ]);

  res.json({
    success: true,
    data: {
      total: totalPatients,
      active: activePatients,
      new: newPatients,
      genderDistribution: genderStats,
      bloodGroupDistribution: bloodGroupStats,
      monthlyTrend: monthlyTrend
    }
  });
});

// @desc    Check for duplicate patient
// @route   POST /api/patients/check-duplicate
// @access  Private (Hospital)
const checkDuplicatePatient = asyncHandler(async (req, res) => {
  const { email, mobile, patientId, firstName, lastName, dateOfBirth } = req.body;
  const hospitalId = req.user.tenantId || req.user.clientId;

  if (!email && !mobile && !patientId && !(firstName && lastName && dateOfBirth)) {
    res.status(400);
    throw new Error("Provide at least one search criterion");
  }

  const query = { tenantId: hospitalId, status: "active" };

  if (patientId) {
    query.patientId = patientId;
  } else {
    const orConditions = [];
    if (email) orConditions.push({ email: email.toLowerCase() });
    if (mobile) orConditions.push({ mobile });
    if (firstName && lastName && dateOfBirth) {
      orConditions.push({
        firstName: { $regex: new RegExp(`^${firstName}$`, "i") },
        lastName: { $regex: new RegExp(`^${lastName}$`, "i") },
        dateOfBirth: new Date(dateOfBirth)
      });
    }
    query.$or = orConditions;
  }

  const duplicatePatient = await Patient.findOne(query);

  res.json({
    success: true,
    isDuplicate: !!duplicatePatient,
    data: duplicatePatient || null
  });
});

// @desc    Export patients data
// @route   GET /api/patients/export
// @access  Private (Hospital)
const exportPatients = asyncHandler(async (req, res) => {
  const { format = "csv", ...filters } = req.query;
  const hospitalId = req.user.tenantId || req.user.clientId;

  // Build query based on filters
  const query = { tenantId: hospitalId, status: "active" };

  if (filters.gender) query.gender = filters.gender;
  if (filters.bloodGroup) query.bloodGroup = filters.bloodGroup;
  if (filters.dateFrom || filters.dateTo) {
    query.createdAt = {};
    if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
  }

  const patients = await Patient.find(query)
    .sort("createdAt")
    .select("-__v -tenantId -deletedAt -deletedBy")
    .lean();

  if (patients.length === 0) {
    res.status(404);
    throw new Error("No patients found to export");
  }

  // Format data for export
  const exportData = patients.map(patient => ({
    "Patient ID": patient.patientId,
    "First Name": patient.firstName,
    "Last Name": patient.lastName,
    "Date of Birth": patient.dateOfBirth.toISOString().split('T')[0],
    "Gender": patient.gender,
    "Email": patient.email || "",
    "Mobile": patient.mobile || "",
    "Blood Group": patient.bloodGroup || "",
    "Address": patient.address || "",
    "Emergency Contact": patient.emergencyContact?.name || "",
    "Emergency Mobile": patient.emergencyContact?.mobile || "",
    "Insurance Provider": patient.insuranceInfo?.provider || "",
    "Policy Number": patient.insuranceInfo?.policyNumber || "",
    "Allergies": patient.allergies?.join(", ") || "",
    "Medical History": patient.medicalHistory || "",
    "Registration Date": patient.createdAt.toISOString().split('T')[0],
    "Status": patient.status
  }));

  let fileData;
  let fileName;
  let contentType;

  switch (format.toLowerCase()) {
    case "excel":
      fileData = await exportToExcel(exportData, "patients");
      fileName = `patients_${Date.now()}.xlsx`;
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      break;

    case "pdf":
      fileData = await exportToPDF(exportData, "Patients Report");
      fileName = `patients_${Date.now()}.pdf`;
      contentType = "application/pdf";
      break;

    case "csv":
    default:
      fileData = exportToCSV(exportData);
      fileName = `patients_${Date.now()}.csv`;
      contentType = "text/csv";
  }

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.send(fileData);
});

// @desc    Admin: Get patients by hospital (client)
// @route   GET /api/patients/admin/hospital/:clientId
// @access  Private/Admin
const adminGetPatientsByHospital = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
    search,
    status
  } = req.query;

  // Verify client (hospital) exists
  const client = await Client.findById(clientId);
  if (!client) {
    res.status(404);
    throw new Error("Hospital not found");
  }

  // Build query
  const query = { tenantId: clientId };

  // Apply status filter
  if (status) {
    query.status = status;
  }

  // Apply search filter
  if (search) {
    query.$or = [
      { patientId: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } }
    ];
  }

  // Execute query with pagination
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    populate: [
      { path: "createdBy", select: "hospitalName email" },
      { path: "updatedBy", select: "hospitalName email" }
    ]
  };

  const patients = await Patient.paginate(query, options);

  res.json({
    success: true,
    hospital: {
      id: client._id,
      name: client.hospitalName,
      email: client.email
    },
    data: patients.docs,
    pagination: {
      total: patients.totalDocs,
      page: patients.page,
      pages: patients.totalPages,
      limit: patients.limit,
      hasNext: patients.hasNextPage,
      hasPrev: patients.hasPrevPage
    }
  });
});

// @desc    Admin: Toggle patient status
// @route   PATCH /api/patients/admin/toggle/:patientId
// @access  Private/Admin
const adminTogglePatientStatus = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { status, reason } = req.body;

  if (!status || !["active", "inactive", "suspended"].includes(status)) {
    res.status(400);
    throw new Error("Valid status required: active, inactive, or suspended");
  }

  const patient = await Patient.findById(patientId).populate("tenantId", "hospitalName email");

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  // Save previous status for audit trail
  const previousStatus = patient.status;

  // Update status
  patient.status = status;
  patient.updatedBy = req.user._id;

  // Add status change history
  patient.statusHistory = patient.statusHistory || [];
  patient.statusHistory.push({
    from: previousStatus,
    to: status,
    changedBy: req.user._id,
    reason: reason || "Admin action",
    changedAt: new Date()
  });

  await patient.save();

  // Populate changedBy info
  const updatedPatient = await Patient.findById(patientId)
    .populate("tenantId", "hospitalName email")
    .populate("updatedBy", "hospitalName email");

  res.json({
    success: true,
    message: `Patient status updated from ${previousStatus} to ${status}`,
    data: updatedPatient
  });
});

export {
  registerPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
  getPatientStats,
  checkDuplicatePatient,
  exportPatients,
  adminGetPatientsByHospital,
  adminTogglePatientStatus
};