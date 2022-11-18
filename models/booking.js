const User = require("./user");
const { Service } = require("./service");
const { Schema, model } = require("mongoose");
const BookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: Service,
  },

  item: {
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    price: {
      type: Number,
    },
  },
  total: {
    type: Number,
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "Vendor",
  },
  timeSlot: {
    start: {
      type: String,
    },
    end: {
      type: String,
    },
  },
  bookingStatus: {
    type: String,
    enum: ["Confirmed", "Pending", "Cancelled", "Completed"],
    default: "Pending",
  },
  payby: {
    type: String,
    enum: ["online", "cash"],
  },
  paid: {
    type: Boolean,
    default: false,
  },
  transactionId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ["Failed", "Successful", "Pending"],
    default: "Pending",
  },
});
module.exports = model("booking", BookingSchema);
