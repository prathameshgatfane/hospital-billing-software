import IpdAdmission from "../models/IpdAdmission.js";
import IpdServiceRecord from "../models/IpdServiceRecord.js";
import IpdBilling from "../models/IpdBilling.js";
import Patient from "../models/Patient.js";

// @desc    Admit a patient to IPD
// @route   POST /api/ipd/admissions
// @access  Private
export const admitPatient = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id || req.user.clientId;
    const {
      patientId, ward, bedNumber, doctorInCharge,
      reasonForAdmission, initialVitals, notes
    } = req.body;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Check if patient is already admitted
    const existingAdmission = await IpdAdmission.findOne({
      patientId,
      status: "Admitted",
      tenantId
    });

    if (existingAdmission) {
      return res.status(400).json({
        success: false,
        message: "Patient is already admitted with an active status"
      });
    }

    const admission = await IpdAdmission.create({
      tenantId,
      patientId,
      ward,
      bedNumber,
      doctorInCharge,
      reasonForAdmission,
      initialVitals,
      notes,
      admissionDate: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Patient admitted successfully",
      data: admission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active admissions
// @route   GET /api/ipd/admissions/active
// @access  Private
export const getActiveAdmissions = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id || req.user.clientId;
    const admissions = await IpdAdmission.find({ tenantId, status: "Admitted" })
      .populate("patientId", "firstName lastName patientId mobile")
      .populate("doctorInCharge", "fullName speciality")
      .sort("-admissionDate");

    res.status(200).json({
      success: true,
      data: admissions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a service/treatment record to an admission
// @route   POST /api/ipd/services
// @access  Private
export const addServiceRecord = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id || req.user.clientId;
    const { admissionId, serviceName, category, price, quantity, notes } = req.body;

    const admission = await IpdAdmission.findById(admissionId);
    if (!admission || admission.status !== "Admitted") {
      return res.status(404).json({ success: false, message: "Active admission not found" });
    }

    const totalAmount = (Number(price) || 0) * (Number(quantity) || 1);

    const record = await IpdServiceRecord.create({
      tenantId,
      admissionId,
      serviceName,
      category,
      price: Number(price),
      quantity: Number(quantity) || 1,
      totalAmount,
      notes,
      addedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Service record added successfully",
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all discharged/inactive admissions
// @route   GET /api/ipd/admissions/discharged
// @access  Private
export const getDischargedAdmissions = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id || req.user.clientId;
    const admissions = await IpdAdmission.find({ tenantId, status: { $ne: "Admitted" } })
      .populate("patientId", "firstName lastName patientId mobile")
      .populate("doctorInCharge", "fullName speciality")
      .sort("-dischargeDate");

    res.status(200).json({
      success: true,
      data: admissions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get full details of an admission including stay timeline
// @route   GET /api/ipd/admissions/:id
// @access  Private
export const getAdmissionDetails = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id || req.user.clientId;
    const admission = await IpdAdmission.findOne({ _id: req.params.id, tenantId })
      .populate("patientId")
      .populate("doctorInCharge");

    if (!admission) {
      return res.status(404).json({ success: false, message: "Admission not found" });
    }

    const serviceRecords = await IpdServiceRecord.find({ admissionId: req.params.id, tenantId })
      .sort("-dateAdded");

    const bill = await IpdBilling.findOne({ admissionId: req.params.id, tenantId });

    res.status(200).json({
      success: true,
      data: {
        admission,
        serviceRecords,
        bill
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Discharge patient and generate final bill
// @route   POST /api/ipd/discharge/:id
// @access  Private
export const dischargePatient = async (req, res) => {
  try {
    console.log("=== DISCHARGE PATIENT API CALLED ===");

    const tenantId = req.user.tenantId || req.user.id || req.user.clientId;
    console.log("Tenant ID:", tenantId);

    const { dischargeDate, bedRate, tax, discount, notes, paymentMode } = req.body;
    console.log("Request Body:", req.body);

    const admission = await IpdAdmission.findOne({
      _id: req.params.id,
      tenantId,
      status: "Admitted"
    });

    console.log("Admission Found:", admission);

    if (!admission) {
      console.log("❌ No active admission found");
      return res.status(404).json({ success: false, message: "Active admission not found" });
    }

    const services = await IpdServiceRecord.find({
      admissionId: admission._id,
      tenantId
    });

    console.log("Services:", services);

    const serviceTotal = services.reduce((sum, s) => sum + s.totalAmount, 0);
    console.log("Service Total:", serviceTotal);

    // Calculate bed charges
    const d1 = new Date(admission.admissionDate);
    const d2 = new Date(dischargeDate || new Date());

    console.log("Admission Date:", d1);
    console.log("Discharge Date:", d2);

    const diffTime = Math.abs(d2 - d1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) diffDays = 1;

    console.log("Total Days:", diffDays);

    const bedTotal = diffDays * (Number(bedRate) || 0);
    console.log("Bed Total:", bedTotal);

    const subTotal = serviceTotal + bedTotal;
    console.log("Sub Total:", subTotal);

    const taxAmount = (subTotal * (Number(tax) || 0)) / 100;
    console.log("Tax Amount:", taxAmount);

    const totalAmount = subTotal + taxAmount - (Number(discount) || 0);
    console.log("Final Total Amount:", totalAmount);

    // Create Final Bill
    const bill = await IpdBilling.create({
      tenantId,
      admissionId: admission._id,
      patientId: admission.patientId,
      billDate: d2,
      services: services.map(s => ({
        serviceName: s.serviceName,
        price: s.price,
        quantity: s.quantity,
        total: s.totalAmount,
        date: s.dateAdded
      })),
      bedCharges: {
        rate: Number(bedRate),
        days: diffDays,
        total: bedTotal
      },
      subTotal,
      tax: Number(tax),
      discount: Number(discount),
      totalAmount,
      paymentStatus: "Paid",
      paymentMode,
      notes
    });

    console.log("✅ Bill Created:", bill);

    // Update Admission Status
    admission.status = "Discharged";
    admission.dischargeDate = d2;

    await admission.save();
    console.log("✅ Admission Updated to Discharged");

    res.status(200).json({
      success: true,
      message: "Patient discharged and bill generated successfully",
      data: bill
    });

  } catch (error) {
    console.error("❌ Error in dischargePatient:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
