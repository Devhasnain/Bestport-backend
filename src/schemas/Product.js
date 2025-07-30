// models/Product.js
const mongoose = require("mongoose");
let TypeString = {
  type: String,
};
const productSchema = new mongoose.Schema(
  {
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
      path: TypeString,
      mimetype: TypeString,
      filename: TypeString,
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
