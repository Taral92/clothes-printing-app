const cloudinary = require("../config/cloudinary");

const uploadFromUrl = async (req, res) => {
  const { imageUrl } = req.body;

  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "clothes_printing_app",
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadFromUrl };