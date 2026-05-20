import BillingSettings from "../../models/BillingSettings.js";

// @desc    Get billing settings for the hospital
// @route   GET /api/opd/settings
// @access  Private (Sub-Admin / Staff)
export const getBillingSettings = async (req, res) => {
  try {
    const tenantId = req.user.id;
    let settings = await BillingSettings.findOne({ tenantId });

    if (!settings) {
      settings = {
        defaultTax: 0,
        defaultDiscount: 0,
        billTemplate: {},
      };
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching billing settings",
    });
  }
};

// @desc    Update billing settings for the hospital
// @route   POST /api/opd/settings
// @access  Private (Sub-Admin)
export const updateBillingSettings = async (req, res) => {
  try {
    const tenantId = req.user.id;
    const { defaultTax, defaultDiscount, billTemplate } = req.body;

    const updatePayload = {
      defaultTax: Number(defaultTax) || 0,
      defaultDiscount: Number(defaultDiscount) || 0,
    };

    // Only update billTemplate if it was provided
    if (billTemplate && typeof billTemplate === "object") {
      updatePayload.billTemplate = {
        hospitalName:  billTemplate.hospitalName  ?? "",
        address:       billTemplate.address       ?? "",
        phone:         billTemplate.phone         ?? "",
        email:         billTemplate.email         ?? "",
        accentColor:   billTemplate.accentColor   ?? "#DC2626",
        headerBg:      billTemplate.headerBg      ?? "dark",
        logoUrl:       billTemplate.logoUrl        ?? "",
        logoText:      billTemplate.logoText       ?? "",
        showBorderTop: billTemplate.showBorderTop  ?? true,
        footerNote:    billTemplate.footerNote     ?? "Computer generated invoice. No signature required.",
      };
    }

    const settings = await BillingSettings.findOneAndUpdate(
      { tenantId },
      { $set: updatePayload },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Billing settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating billing settings",
    });
  }
};
