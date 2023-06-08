const { Schema, model } = require("mongoose");
const UserSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  gender: {
    type: String,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: Array,
    },
  },
});

UserSchema.index({ location: "2dsphere" });
module.exports = model("user", UserSchema);
