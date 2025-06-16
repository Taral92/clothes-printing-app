const express = require("express");
const router = express.Router();
const { uploadFromUrl, uploadMockupFromUrl } = require("../controllers/uploadController");

router.post("/", uploadFromUrl);
router.post("/mockup", uploadMockupFromUrl);

module.exports = router;

