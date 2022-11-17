const { Schema, model } = require("mongoose");
const OTPSchema = new Schema(
  {
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    otp: {
      type: Number,
    },
    expiredAt: {
      type: Date,
    },
    verified: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = model("otp", OTPSchema);
