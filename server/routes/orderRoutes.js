const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { products, total, mockupImage, shippingAddress } = req.body;

    const newOrder = await Order.create({
      user: req.user._id,
      products,
      total,
      mockupImage, 
      shippingAddress,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/orders/:id', authMiddleware, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});
router.get('/:id', authMiddleware, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:id/receipt", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate("products.productId")
      .populate("user", "email");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({
      orderId: order._id,
      products: order.products,
      total: order.total,
      status: order.status,
      user: order.user.email,
      createdAt: order.createdAt,
      mockupImage: order.mockupImage,
      shippingAddress: order.shippingAddress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;