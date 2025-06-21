const Cart = require("../models/CartModel");
const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token missing or malformed");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded || !decoded.id) {
    throw new Error("Invalid token payload");
  }

  return decoded.id;
};

const getCart = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const cart = await Cart.findOne({ user: userId }).populate("products.productId");

    res.status(200).json({
      success: true,
      products: cart?.products || [],
    });
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};


const saveCart = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { cartItems } = req.body;

    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ success: false, error: "cartItems must be an array" });
    }

    const formattedProducts = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { products: formattedProducts },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Cart saved successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Save cart error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    await Cart.findOneAndDelete({ user: userId });

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.error("Delete cart error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getCart,
  saveCart,
  deleteCart,
};