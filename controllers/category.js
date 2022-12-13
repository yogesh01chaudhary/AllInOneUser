const Category = require("../models/category");
const { Service } = require("../models/service");
const SubCategory = require("../models/subCategory");
const SubCategory2 = require("../models/subCategory2");
const Joi = require("joi");
const User = require("../models/user");
//=============================================== get all detailed categories ===============================================//
exports.getAllCategory = async (req, res) => {
  try {
    let category = await Category.find(
      {},
      { _id: 1, name: 1, subCategory: 1, service: 1 }
    ).populate({
      path: "subCategory",
      select: { _id: 1, name: 1, service: 1 },
      populate: {
        path: "subCategory2",
        select: { _id: 1, name: 1, service: 1 },
      },
    });

    if (!category) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
    return res.status(200).json({
      message: "All Category SubCategory SubCategory2 fetched successfully",
      category,
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.name });
  }
};
//============================================ get service by categories ==============================================//
exports.getCategoryServices = async (req, res) => {
  try {
    const result = await Category.findById(req.params.id, {
      service: 1,
      _id: 0,
    }).populate("service", { __v: 0, createdAt: 0, updatedAt: 0 });
    if (!result) {
      return res
        .status(404)
        .json({ message: "Category not found of id " + req.params.id });
    }
    if (result.service.length === 0) {
      return res
        .status(404)
        .json({ message: "No service found in the given id " + req.params.id });
    }
    return res.status(200).json({ result: result.service });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//========================================== get service by sub categories =================================================//
exports.getSubCategoryServices = async (req, res) => {
  try {
    const result = await SubCategory.findById(req.params.id, {
      service: 1,
      _id: 0,
    }).populate("service", { __v: 0, createdAt: 0, updatedAt: 0 });
    if (!result) {
      return res
        .status(404)
        .json({ message: "Sub-Category not found of id " + req.params.id });
    }
    if (result.service.length === 0) {
      return res
        .status(404)
        .json({ message: "No service found in the given id " + req.params.id });
    }
    return res.status(200).json({ result: result.service });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//=================================================== get service by sub category 2 ======================================//
exports.getSubCategory2Services = async (req, res) => {
  try {
    const result = await SubCategory2.findById(req.params.id, {
      service: 1,
      _id: 0,
    }).populate("service", { __v: 0, createdAt: 0, updatedAt: 0 });
    if (!result) {
      return res
        .status(404)
        .json({ message: "Sub-Category2 not found of id " + req.params.id });
    }
    if (result.service.length === 0) {
      return res
        .status(404)
        .json({ message: "No service found in the given id " + req.params.id });
    }
    return res.status(200).json({ result: result.service });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//***********************************************FOR-USERS*************************************************************************//
//***************************************giveRatingAndUpdate*************************************************************************//
exports.rateSilver = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "gold.rating.ratedBy": { $nin: body.userId },
      },
      {
        $addToSet: {
          "silver.rating": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).send({
        success: true,
        message: "No Data Found, Maybe User Already rated/ Service Not Exists",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated Silver Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.rateGold = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "gold.rating.ratedBy": { $nin: body.userId },
      },
      {
        $addToSet: {
          "gold.rating": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    console.log(service);
    if (!service) {
      return res.status(404).send({
        success: true,
        message: "No Data Found, Maybe User Already rated/ Service Not Exists",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated  Gold Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.ratePlatinum = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "platinum.rating.ratedBy": { $nin: body.userId },
      },
      {
        $addToSet: {
          "platinum.rating": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    console.log(service);
    if (!service) {
      return res.status(404).send({
        success: true,
        message: "No Data Found, Maybe User Already rated/ Service Not Exists",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated Platinum Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.updateRateSilver = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "silver.rating.ratedBy": { $eq: body.userId },
      },
      {
        $set: {
          "silver.rating.$": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    console.log(service);
    if (!service) {
      return res.status(404).send({
        success: true,
        message: "No Service Found/ MayBe User Not Rated",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.updateRateGold = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "gold.rating.ratedBy": { $in: body.userId },
      },

      {
        $set: {
          "gold.rating.$": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    // console.log(service);
    if (!service) {
      return res
        .status(404)
        .send({ success: true, message: "No Service Found" });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.updateRatePlatinum = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        userId: Joi.string().required(),
        star: Joi.number(),
      })
      .required()
      .validate(body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    let service = await Service.findOneAndUpdate(
      {
        _id: body.serviceId,
        "platinum.rating.ratedBy": { $nin: body.userId },
      },

      {
        $set: {
          "platinum.rating.$": {
            ratedBy: body.userId,
            star: body.star,
          },
        },
      },
      { new: true }
    );

    console.log(service);
    if (!service) {
      return res
        .status(404)
        .send({ success: true, message: "No Service Found" });
    }
    return res.status(200).send({
      success: true,
      message: "User Rated Successfully",
      service,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

//* desc   give review to vendor
//* route  POST /admin/reviewSilver
//* access Private
exports.
review = async (req, res) => {
  const { star, comment, serviceId, packageId } = req.body;

  const { error } = Joi.object()
    .keys({
      serviceId: Joi.string().required(),
      packageId: Joi.string().required(),
      star: Joi.number().required(),
      comment: Joi.string(),
    })
    .required()
    .validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    let service = await Service.findById(serviceId);
    if (!service) {
      return res.status(400).json({
        success: false,
        message: "service not found",
      });
    }
    if (service.silver._id.toString() === packageId.toString()) {
      let ratings = service.silver.rating;
      const alreadyReviewed = service.silver.rating.find(
        (item) => item.ratedBy.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        let service = await Service.findOneAndUpdate(
          {
            $and: [
              { _id: serviceId },
              { "silver._id": packageId },
              { "silver.rating.ratedBy": { $eq: req.user._id } },
            ],
          },
          {
            $set: {
              "silver.rating.$.star": 0 || Number(star),
              "silver.rating.$.comment": comment,
            },
          },
          { new: true }
        );
        let ratings = service.silver.rating;
        (service.silver.overallRating =
          ratings.reduce((acc, item) => item.star + acc, 0) / ratings.length),
          (service = await service.save());

        return res.status(400).json({
          success: true,
          message: "User have updated reviewed for this vendor",
          rating: service.silver.overallRating,
          reviews: service.silver.rating,
          reviewNumber: service.silver.reviewNumber,
        });
      }
      let user = await User.findById(req.user._id);
      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: "User Doesn't Exists" });
      }
      let newReview = {
        star: 0 || Number(star),
        comment,
        name: `${user.firstName} ${user.lastName}`,
        ratedBy: req.user._id,
      };

      ratings.push(newReview);
      service.silver.reviewNumber = ratings.length;
      service.silver.overallRating =
        ratings.reduce((acc, item) => item.star + acc, 0) / ratings.length;

      await service.save();

      return res.status(200).json({
        success: true,
        message: "User Reviewed successfully",
        rating: service.silver.overallRating,
        reviews: service.silver.rating,
        reviewNumber: service.silver.reviewNumber,
      });
    }
    if (service.gold._id.toString() === packageId.toString()) {
      let ratings = service.gold.rating;
      const alreadyReviewed = service.gold.rating.find(
        (item) => item.ratedBy.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        let service = await Service.findOneAndUpdate(
          {
            $and: [
              { _id: serviceId },
              { "gold._id": packageId },
              { "gold.rating.ratedBy": { $eq: req.user._id } },
            ],
          },
          {
            $set: {
              "gold.rating.$.star": 0 || Number(star),
              "gold.rating.$.comment": comment,
            },
          },
          { new: true }
        );
        let ratings = service.gold.rating;
        (service.gold.overallRating =
          ratings.reduce((acc, item) => item.star + acc, 0) / ratings.length),
          (service = await service.save());

        return res.status(400).json({
          success: true,
          message: "User have updated reviewed for this vendor",
          rating: service.gold.overallRating,
          reviews: service.gold.rating,
          reviewNumber: service.gold.reviewNumber,
        });
      }
      let user = await User.findById(req.user._id);
      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: "User Doesn't Exists" });
      }
      let newReview = {
        star: 0 || Number(star),
        comment,
        name: `${user.firstName} ${user.lastName}`,
        ratedBy: req.user._id,
      };

      ratings.push(newReview);
      service.gold.reviewNumber = ratings.length;
      service.gold.overallRating =
        ratings.reduce((acc, item) => item.star + acc, 0) / ratings.length;

      await service.save();

      return res.status(200).json({
        success: true,
        message: "User Reviewed successfully",
        rating: service.gold.overallRating,
        reviews: service.gold.rating,
        reviewNumber: service.gold.reviewNumber,
      });
    }
    if (service.platinum._id.toString() === packageId.toString()) {
      let ratings = service.platinum.rating;
      const alreadyReviewed = service.platinum.rating.find(
        (item) => item.ratedBy.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        let service = await Service.findOneAndUpdate(
          {
            $and: [
              { _id: serviceId },
              { "platinum._id": packageId },
              { "platinum.rating.ratedBy": { $eq: req.user._id } },
            ],
          },
          {
            $set: {
              "platinum.rating.$.star": 0 || Number(star),
              "platinum.rating.$.comment": comment,
            },
          },
          { new: true }
        );
        let ratings = service.platinum.rating;
        (service.platinum.overallRating =
          ratings.reduce((acc, item) => item.star + acc, 0) / ratings.length),
          (service = await service.save());

        return res.status(400).json({
          success: true,
          message: "User have updated reviewed for this vendor",
          rating: service.platinum.overallRating,
          reviews: service.platinum.rating,
          reviewNumber: service.platinum.reviewNumber,
        });
      }
      let user = await User.findById(req.user._id);
      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: "User Doesn't Exists" });
      }
      let newReview = {
        star: 0 || Number(star),
        comment,
        name: `${user.firstName} ${user.lastName}`,
        ratedBy: req.user._id,
      };

      ratings.push(newReview);
      service.platinum.reviewNumber = ratings.length;
      service.platinum.overallRating =
        ratings.reduce((acc, item) => item.star + acc, 0) / ratings.length;

      await service.save();

      return res.status(200).json({
        success: true,
        message: "User Reviewed successfully",
        rating: service.platinum.overallRating,
        reviews: service.platinum.rating,
        reviewNumber: service.platinum.reviewNumber,
      });
    }
    return res
      .status(404)
      .send({ success: false, message: "No Package Found" });
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
