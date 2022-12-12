const { Schema, model } = require("mongoose");

//RatingSchema
const RatingSchema = new Schema(
  {
    name: { type: String },
    star: { type: Number },
    comment: { type: String },
    ratedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

//PackageSchema
const PackageSchema = new Schema({
  vendor: [
    {
      type: Schema.Types.ObjectId,
      ref: "vendor",
    },
  ],
  description: { type: String, required: true },
  rating: [RatingSchema],
  overallRating: { type: Number, default: 0 },
  reviewNumber: { type: Number, default: 0 },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = { PackageSchema };
