import asyncHandler from "express-async-handler";
import OpdBilling from "../models/OpdBilling.js";
import Patient from "../models/Patient.js";

// @desc    Generate a new OPD bill
// @route   POST /api/opd/billing
// @access  Private (Hospital)
export const createOpdBill = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.id;
  const { 
    patientId, 
    doctorId,
    services, 
    subTotal, 
    tax, 
    discount, 
    totalAmount, 
    paymentStatus, 
    paymentMode,
    notes
  } = req.body;

  if (!patientId || !services || services.length === 0) {
    res.status(400);
    throw new Error("Patient ID and at least one service are required");
  }

  // Check if patient exists
  const patient = await Patient.findOne({ _id: patientId, tenantId: hospitalId });
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  const bill = await OpdBilling.create({
    tenantId: hospitalId,
    patient: patientId,
    doctor: doctorId,
    services,
    subTotal,
    tax,
    discount,
    totalAmount,
    paymentStatus,
    paymentMode,
    notes,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: bill });
});

// @desc    Get all OPD bills for a hospital
// @route   GET /api/opd/billing
// @access  Private (Hospital)
export const getBills = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.id;
  const { patientId, startDate, endDate, page = 1, limit = 20 } = req.query;

  const query = { tenantId: hospitalId };
  if (patientId) query.patient = patientId;
  if (startDate && endDate) {
    query.billDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const bills = await OpdBilling.find(query)
    .populate("patient", "firstName lastName patientId mobile")
    .populate("doctor", "fullName speciality")
    .sort("-billDate")
    .skip(skip)
    .limit(parseInt(limit));

  const total = await OpdBilling.countDocuments(query);

  res.json({
    success: true,
    count: bills.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: bills,
  });
});

// @desc    Get a single bill by ID
// @route   GET /api/opd/billing/:id
// @access  Private (Hospital)
export const getBillById = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.id;
  const bill = await OpdBilling.findOne({ _id: req.params.id, tenantId: hospitalId })
    .populate("patient", "firstName lastName patientId mobile address")
    .populate("doctor", "fullName speciality")
    .populate("services.serviceId", "name category");

  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }

  res.json({ success: true, data: bill });
});

// @desc    Update a bill (e.g., payment status)
// @route   PUT /api/opd/billing/:id
// @access  Private (Hospital)
export const updateBill = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.id;
  const bill = await OpdBilling.findOneAndUpdate(
    { _id: req.params.id, tenantId: hospitalId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }

  res.json({ success: true, data: bill });
});
