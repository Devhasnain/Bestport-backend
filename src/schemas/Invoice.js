const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Kis customer ke liye hai
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
      },
    ],
    totalMaterialCost: {
      type: Number,
      required: true,
      default: 0,
    },
    amountReceived: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate total material cost automatically if needed
InvoiceSchema.pre("save", function (next) {
  this.totalMaterialCost = this.products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  next();
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
