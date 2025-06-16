const express = require("express");
const router = express.Router();
const { createCart, getCart, updateCart, deleteCart } = require("../controllers/cartController");

router.post("/", createCart);
router.get("/:userId", getCart);
router.put("/:userId", updateCart);
router.delete("/:userId", deleteCart);

module.exports = router;
