const express = require("express");
const { uploadMockupFromBlob } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", uploadMockupFromBlob);

module.exports = router;

