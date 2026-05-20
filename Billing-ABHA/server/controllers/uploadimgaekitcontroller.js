import imagekit from "../config/imagekit.js";

/* ===========================
   UPLOAD IMAGE TO IMAGEKIT
   =========================== */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const tenantId = req.user.tenantId;

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // binary
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: `/mapvon/${tenantId}/hospital`,
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (err) {
    console.error("IMAGE UPLOAD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};
