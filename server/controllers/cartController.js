const Cart = require("../models/CartModel");
const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("No token provided");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};


const getCart = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const cart = await Cart.findOne({ user: userId }).populate("products.productId");

    res.status(200).json(cart?.products || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveCart = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { cartItems } = req.body;

    const formattedProducts = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { products: formattedProducts },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Cart saved successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    await Cart.findOneAndDelete({ user: userId });
    res.status(200).json({ message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCart,
  saveCart,
  deleteCart,
};