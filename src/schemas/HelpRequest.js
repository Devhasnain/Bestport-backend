const mongoose = require("mongoose");
const helpRequestSchema = new mongoose.Schema(
  {
    ticketId: { required: true, unique: true, type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    phone: {
      type: String,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HelpRequest", helpRequestSchema);
