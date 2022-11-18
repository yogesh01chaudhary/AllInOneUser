const User = require("./user");
const { Service } = require("./service");
const { Schema, model } = require("mongoose");
const CartSchema = new Schema({
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
    description: {
      type: String,
    },
    rating: {
      type: Number,
      default: 5,
    },
    price: {
      type: Number,
    },
  },
});
module.exports = model("cart", CartSchema);
