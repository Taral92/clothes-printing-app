const express = require("express");
const router = express.Router();
const { createCart, getCart, updateCart, deleteCart } = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, createCart);
router.get("/:userId", authMiddleware, getCart);
router.put("/:userId", authMiddleware, updateCart);
router.delete("/:userId", authMiddleware, deleteCart);

module.exports = router;
