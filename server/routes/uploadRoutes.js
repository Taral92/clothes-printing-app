const express = require("express");
const router = express.Router();
const { uploadFromUrl } = require("../controllers/uploadController");

router.post("/", uploadFromUrl);

module.exports = router;

