const { Schema, model } = require("mongoose");
const PackageSchema = new Schema({
  description: { type: String, required: true },
  vendor: [
    {
      type: Schema.Types.ObjectId,
      ref: "vendor",
    },
  ],
  rating: [
    {
      ratedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      star: {
        type: Number,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
});

module.exports = { PackageSchema };
