import asyncHandler from "express-async-handler";
import OpdService from "../models/OpdService.js";

// @desc    Get all OPD services for a hospital
// @route   GET /api/opd/services
// @access  Private (Hospital)
export const getOpdServices = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.id;
  const services = await OpdService.find({ tenantId: hospitalId, isActive: true });
  res.json({ success: true, count: services.length, data: services });
});

// @desc    Add a new OPD service
// @route   POST /api/opd/services
// @access  Private (Hospital)
export const addOpdService = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.id;
  const { name, price, category, description } = req.body;

  if (!name || !price) {
    res.status(400);
    throw new Error("Please provide service name and price");
  }

  const service = await OpdService.create({
    tenantId: hospitalId,
    name,
    price,
    category,
    description,
  });

  res.status(201).json({ success: true, data: service });
});

// @desc    Update an OPD service
// @route   PUT /api/opd/services/:id
// @access  Private (Hospital)
export const updateOpdService = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.id;
  const service = await OpdService.findOneAndUpdate(
    { _id: req.params.id, tenantId: hospitalId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  res.json({ success: true, data: service });
});

// @desc    Delete (deactivate) an OPD service
// @route   DELETE /api/opd/services/:id
// @access  Private (Hospital)
export const deleteOpdService = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.id;
  const service = await OpdService.findOneAndUpdate(
    { _id: req.params.id, tenantId: hospitalId },
    { isActive: false },
    { new: true }
  );

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  res.json({ success: true, message: "Service deactivated successfully" });
});

// @desc    Bulk Add/Update OPD services
// @route   POST /api/opd/services/bulk
// @access  Private (Hospital)
export const bulkAddOpdServices = asyncHandler(async (req, res) => {
  const hospitalId = req.user.tenantId || req.user.id;
  const services = req.body;

  if (!Array.isArray(services)) {
    res.status(400);
    throw new Error("Invalid request: Expected an array of services");
  }

  const operations = services.map(s => ({
    updateOne: {
      filter: { tenantId: hospitalId, name: s.name },
      update: {
        $set: {
          category: s.category || "Consultation",
          price: s.price,
          description: s.description || "",
          isActive: true
        }
      },
      upsert: true
    }
  }));

  const result = await OpdService.bulkWrite(operations);
  res.json({ success: true, data: result });
});
