const express = require("express");
const router = express.Router();
const {
  saveCart,
  getCart,
  deleteCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");


router.get("/", authMiddleware, getCart);      
router.post("/", authMiddleware, saveCart);    
router.delete("/", authMiddleware, deleteCart); 

module.exports = router;