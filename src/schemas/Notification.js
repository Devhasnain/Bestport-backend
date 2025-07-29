const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    reference: { type: String },
    redirect: { type: String },
    is_read:{type:Boolean,default:false}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
