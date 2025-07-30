const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    service_type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    preferred_date: { type: Date, required: true },
    urgency: { type: String, required: true },
    city: { type: String, required: true },
    post_code: { type: String, required: true },
    address: { type: String, required: true },
    instructions: String,
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
    assigned_candidates:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
