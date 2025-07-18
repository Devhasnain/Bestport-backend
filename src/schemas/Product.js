// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // Store image URL or file path
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
