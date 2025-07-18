const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "employee", "customer"],
      required: true,
      default: "customer",
    },
    date_of_birth: { type: Date },
    about: String,
    is_active: Boolean,
    is_locked: Boolean,
    phone: String,
    address: String,
    profile_img: String,
    rating: { type: Number, default: 0 },
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
    fcm_token: { type: String, default: null },
    is_available: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
