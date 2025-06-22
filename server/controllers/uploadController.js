// server/controllers/uploadController.js
const cloudinary = require("../config/cloudinary");

const uploadMockupFromBlob = async (req, res) => {
  try {
    const chunks = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const buffer = Buffer.concat(chunks);

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "clothes_mockups",
          resource_type: "image",
          public_id: `mockup_${Date.now()}`,
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload failed:", error);
            return res.status(500).json({ success: false, message: "Upload failed" });
          }

          return res.status(200).json({
            success: true,
            message: "Upload successful",
            url: result.secure_url,
          });
        }
      );

      stream.end(buffer);
    });

    req.on("error", (err) => {
      console.error("❌ Request stream error:", err);
      res.status(500).json({ success: false, message: "Stream error" });
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { uploadMockupFromBlob };