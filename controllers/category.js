const Category = require("../models/category");
const { Service } = require("../models/service");
const SubCategory = require("../models/subCategory");
const SubCategory2 = require("../models/subCategory2");
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
        "silver.rating.ratedBy": { $nin: body.userId },
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

