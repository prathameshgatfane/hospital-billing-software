import OpdConsultation from "../models/OpdConsultation.js";
import OpdBilling from "../models/OpdBilling.js";
import Patient from "../models/Patient.js";
import mongoose from "mongoose";

export const opdConsultationController = {
  // Get waiting queue for a specific doctor
  getDoctorQueue: async (req, res) => {
    try {
      const { doctorId } = req.params;
      const tenantId = req.user.tenantId;

      // 1. Get bills for this doctor (All historical bills that are NOT expired)
      const bills = await OpdBilling.find({
        tenantId,
        doctor: doctorId,
        status: { $ne: "Expired" } // Include legacy records where status is undefined
      })
      .populate("patient", "patientId firstName lastName gender dateOfBirth bloodGroup mobile")
      .populate("doctor", "fullName speciality")
      .sort({ createdAt: -1 }); // Newest first

      // 2. Fetch already completed consultations for these bills
      const billIds = bills.map(b => b._id);
      const completedConsultations = await OpdConsultation.find({
        billId: { $in: billIds }
      }).select("billId");

      const completedBillIds = completedConsultations.map(c => c.billId.toString());

      // 3. Separate into Waiting and Completed
      const queue = bills.map(bill => {
        const isCompleted = completedBillIds.includes(bill._id.toString());
        
        // Match by doctor ID (handling populated or unpopulated field)
        const billDocId = bill.doctor?._id ? bill.doctor._id.toString() : bill.doctor?.toString();
        const isAllotted = billDocId === doctorId.toString();
        
        const hasDocFee = bill.services.some(s => 
          s.category === "Doctor Fees" || 
          s.category === "Consultation" ||
          s.name.toLowerCase().includes("consultation") || 
          s.name.toLowerCase().includes("doctor fee")
        );
        
        if (!isAllotted && !hasDocFee) return null;

        return {
          billId: bill._id,
          billNumber: bill.billNumber,
          patient: bill.patient,
          doctor: bill.doctor,
          isCompleted,
          time: bill.createdAt
        };
      }).filter(item => item !== null);

      res.status(200).json({
        success: true,
        data: queue
      });
    } catch (error) {
      console.error("Queue Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Expire a bill (remove from queue)
  expireBill: async (req, res) => {
    try {
      const { billId } = req.params;
      const tenantId = req.user.tenantId;

      const bill = await OpdBilling.findOneAndUpdate(
        { _id: billId, tenantId },
        { status: "Expired" },
        { new: true }
      );

      if (!bill) {
        return res.status(404).json({ success: false, message: "Bill not found" });
      }

      res.status(200).json({
        success: true,
        message: "Patient session expired successfully",
        data: bill
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Save new consultation
  saveConsultation: async (req, res) => {
    try {
      const tenantId = req.user.tenantId;
      const consultationData = {
        ...req.body,
        tenantId
      };

      const consultation = new OpdConsultation(consultationData);
      await consultation.save();

      res.status(201).json({
        success: true,
        message: "Consultation recorded successfully",
        data: consultation
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get patient medical history
  getPatientHistory: async (req, res) => {
    try {
      const { patientId } = req.params;
      const history = await OpdConsultation.find({ patientId })
        .populate("doctorId", "fullName speciality")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get single consultation details
  getConsultationDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const consultation = await OpdConsultation.findById(id)
        .populate("patientId")
        .populate("doctorId")
        .populate("suggestedInvestigations.serviceId");

      if (!consultation) {
        return res.status(404).json({ success: false, message: "Consultation not found" });
      }

      res.status(200).json({
        success: true,
        data: consultation
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
