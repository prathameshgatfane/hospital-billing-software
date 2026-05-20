import InvestigationSettings from '../../models/InvestigationSettings.js';

// @desc    Get investigation settings for hospital
// @route   GET /api/settings/investigation
// @access  Private (SubAdmin)
export const getSettings = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id;
    console.log('[getSettings] Fetching settings for tenantId:', tenantId);

    let settings = await InvestigationSettings.findOne({ tenantId });
    console.log('[getSettings] DB query result:', settings);

    if (!settings) {
      console.log('[getSettings] No settings found, creating defaults for tenantId:', tenantId);
      // Create default settings if they don't exist
      settings = new InvestigationSettings({
        tenantId,
        hasInhouseInvestigation: false,
        departments: [
          { name: "Pathology", categories: [] },
          { name: "Radiology", categories: [] }
        ]
      });
      await settings.save();
      console.log('[getSettings] Default settings created:', settings);
    }

    console.log('[getSettings] Returning settings:', settings);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('[getSettings] Error fetching investigation settings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

// @desc    Update investigation settings for hospital
// @route   PUT /api/settings/investigation
// @access  Private (SubAdmin)
export const updateSettings = async (req, res) => {
  try {
    const tenantId = req.user.tenantId || req.user.id;
    const { hasInhouseInvestigation, departments } = req.body;

    let settings = await InvestigationSettings.findOne({ tenantId });

    if (!settings) {
      settings = new InvestigationSettings({
        tenantId,
        hasInhouseInvestigation,
        departments: departments || []
      });
    } else {
      settings.hasInhouseInvestigation = hasInhouseInvestigation;
      if (departments) {
        settings.departments = departments;
      }
    }

    await settings.save();
    res.status(200).json({ success: true, data: settings, message: "Settings updated successfully" });
  } catch (error) {
    console.error('[updateSettings] Error updating investigation settings:', error);
    res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

// @desc    Bulk upload investigation settings via Excel
// @route   POST /api/settings/investigation/bulk
// @access  Private (SubAdmin)
export const bulkUploadSettings = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const tenantId = req.user.tenantId || req.user.id;
    const xlsx = await import('xlsx');
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return res.status(400).json({ success: false, message: "Excel file is empty" });
    }

    // Expected Columns: Department, Category, Service Name, Price, Description
    const departmentsMap = new Map();

    data.forEach((row) => {
      const deptName = (row.Department || row.department || "General").trim();
      const catName = (row.Category || row.category || "General").trim();
      const serviceName = (row['Service Name'] || row.serviceName || row.name || "").trim();
      const price = parseFloat(row.Price || row.price || 0);
      const description = (row.Description || row.description || "").trim();

      if (!serviceName) return; // Skip rows without a service name

      if (!departmentsMap.has(deptName)) {
        departmentsMap.set(deptName, new Map());
      }

      const categoriesMap = departmentsMap.get(deptName);
      if (!categoriesMap.has(catName)) {
        categoriesMap.set(catName, []);
      }

      categoriesMap.get(catName).push({
        name: serviceName,
        price,
        description
      });
    });

    const departments = Array.from(departmentsMap.entries()).map(([deptName, categoriesMap]) => ({
      name: deptName,
      categories: Array.from(categoriesMap.entries()).map(([catName, services]) => ({
        name: catName,
        services
      }))
    }));

    let settings = await InvestigationSettings.findOne({ tenantId });

    if (!settings) {
      settings = new InvestigationSettings({
        tenantId,
        hasInhouseInvestigation: true,
        departments
      });
    } else {
      // Overwrite departments for bulk upload
      settings.departments = departments;
    }

    await settings.save();
    res.status(200).json({ 
      success: true, 
      data: settings, 
      message: `Bulk upload successful. Imported ${data.length} services.` 
    });
  } catch (error) {
    console.error('[bulkUploadSettings] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process Excel file' });
  }
};
