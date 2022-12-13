const User = require("../models/user");
const { Vendor } = require("../models/vendor");
const Joi = require("joi");
const mongoose = require("mongoose");

//* desc   give review to vendor
//* route  POST /vendor/review/:id
//* access Private
exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({
      success: false,
      message: "Missing infomation",
    });
  }

  try {
    let vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: "vendor not found",
      });
    }
    let review = vendor.reviews;
    const alreadyReviewed = vendor.reviews.find(
      (item) => item.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      let vendor = await Vendor.findOneAndUpdate(
        {
          $and: [
            { _id: req.params.id },
            { "reviews.user": { $eq: req.user._id } },
          ],
        },
        {
          $set: {
            "reviews.$.rating": 0 || Number(rating),
            "reviews.$.comment": comment,
          },
        },
        { new: true }
      );
      let review = vendor.reviews;
      (vendor.rating =
        review.reduce((acc, item) => item.rating + acc, 0) / review.length),
        (vendor = await vendor.save());

      //   vendor = await Vendor.findOneAndUpdate(
      //     {
      //       _id: req.params.id,
      //     },
      //     {
      //       $set: {
      //         rating:
      //           review.reduce((acc, item) => item.rating + acc, 0) /
      //           review.length,
      //       },
      //     },
      //     { new: true }
      //   );

      return res.status(400).json({
        success: true,
        message: "User have updated reviewed for this vendor",
        rating: vendor.rating,
        reviews: vendor.reviews,
        reviewNumber: vendor.reviewNumber,
      });
    }
    let user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User Doesn't Exists" });
    }
    let newReview = {
      rating: 0 || Number(rating),
      comment,
      name: `${user.firstName} ${user.lastName}`,
      user: req.user._id,
    };

    review.push(newReview);
    vendor.reviewNumber = review.length;
    vendor.rating =
      review.reduce((acc, item) => item.rating + acc, 0) / review.length;

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "User Reviewed successfully",
      rating: vendor.rating,
      reviews: vendor.reviews,
      reviewNumber: vendor.reviewNumber,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};

//* desc   delete review to vendor
//* route  POST /vendor/review/delete/:id
//* access Private
exports.deleteReview = async (req, res) => {
  const session = await mongoose.startSession();
  const { params, user } = req;
  const { error } = Joi.object()
    .keys({
      id: Joi.string().required(),
    })
    .required()
    .validate(params);
  console.log(error);
  if (error) {
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  }

  try {
    let vendor = await Vendor.findById(params.id);
    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: "vendor not found",
      });
    }

    let review = vendor.reviews;

    const userFound = review.find(
      (item) => item.user.toString() === req.user._id.toString()
    );

    session.startTransaction();
    if (userFound) {
      let vendor = await Vendor.findOneAndUpdate(
        {
          $and: [{ _id: params.id }, { "reviews.user": { $eq: user._id } }],
        },
        {
          $pull: {
            reviews: {
              user: req.user._id,
            },
          },
        },
        { new: true, session }
      );
      if (!vendor) {
        return res
          .status(404)
          .send({ success: false, message: "No Data Found" });
      }
      let review = vendor.reviews;
      vendor = await Vendor.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: {
            rating:
              review.reduce((acc, item) => item.rating + acc, 0) /
              review.length,
            reviewNumber: review.length,
          },
        },
        { new: true, session }
      );
      await session.commitTransaction();
      await session.endSession();
      return res.status(400).json({
        success: true,
        message: "User Reviewed Deleted Successfully",
        rating: vendor.rating,
        reviews: vendor.reviews,
        reviewNumber: vendor.reviewNumber,
      });
    }
    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json({
      success: false,
      message: "User Has Not Reviewed Or Deleted Already",
      rating: vendor.rating,
      reviews: vendor.reviews,
      reviewNumber: vendor.reviewNumber,
    });
  } catch (e) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};
