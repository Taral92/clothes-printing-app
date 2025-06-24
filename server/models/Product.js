const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ["T-Shirt", "Hoodie", "Sweatshirt", "Cap", "Other"],
    required: true,
  },
  sizes: {
    type: [String],
    enum: ["S", "M", "L", "XL", "XXL"],
    default: ["M"],
  },
  colors: {
    type: [String],
    default: ["Black"],
  },
  basePrice: {
    type: Number,
    required: true,
  },
  images: [String], // cloudinary links
  stock: {
    type: Number,
    default: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);