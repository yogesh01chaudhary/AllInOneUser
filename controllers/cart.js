const { Service } = require("../models/service");
const Joi = require("Joi");
const mongoose = require("mongoose");
const Cart = require("../models/cart");

// ***************************************USER********************************************************************************//
// @desc add silver package to cart
// @route POST cart/silver
// @acess Private
exports.addToCartSilver = async (req, res) => {
  try {
    const { body, user } = req;
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        packageId: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      console.log(error);
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }
    let matchQuery = {
      $match: {
        $and: [
          { _id: mongoose.Types.ObjectId(body.serviceId) },
          { "silver._id": mongoose.Types.ObjectId(body.packageId) },
        ],
      },
    };

    let data = await Service.aggregate([
      {
        $facet: {
          totalData: [matchQuery],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Result Found Or Only Silver Package Allowed To Add",
      });
    }

    let package;
    if (result[0].silver._id.toString() === body.packageId)
      package = result[0].silver;

    let userCart = await Cart.find({ userId: req.user._id });
    if (!userCart) {
      return res
        .status(400)
        .send({ success: false, message: "Something went wrong" });
    }
    if (userCart.length === 0) {
      let cart = new Cart({
        userId: user._id,
        service: result[0]._id,
        "item.description": package.description,
        "item.packageId": package._id,
        "item.price": package.price,
        // "item.rating":package.rating
      });

      cart = await cart.save();

      if (!cart) {
        return res
          .status(400)
          .send({ success: false, message: "Package Not Added To Cart" });
      }

      return res
        .status(200)
        .send({ success: true, message: "Package Added To Cart", cart });
    }
    if (userCart[0].service.toString() !== result[0]._id.toString()) {
      return res.status(400).send({
        success: false,
        message:
          "Different type of Service Can not be added For A User First Clear The Cart",
      });
    }

    if (userCart[0].item.packageId.toString() !== package._id.toString()) {
      return res.status(400).send({
        success: false,
        message:
          "Different type of Package Can not be added For A User First Clear The Cart",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Package Already In Cart",
      package,
      userCart,
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// @desc add gold package to cart
// @route POST cart/gold
// @acess Private
exports.addToCartGold = async (req, res) => {
  try {
    const { body, user } = req;
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        packageId: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      console.log(error);
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }
    let matchQuery = {
      $match: {
        $and: [
          { _id: mongoose.Types.ObjectId(body.serviceId) },
          { "gold._id": mongoose.Types.ObjectId(body.packageId) },
        ],
      },
    };

    let data = await Service.aggregate([
      {
        $facet: {
          totalData: [matchQuery],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Result Found Or Gold Package Is Allowed To Add",
      });
    }

    let package;
    if (result[0].gold._id.toString() === body.packageId)
      package = result[0].gold;

    let userCart = await Cart.find({ userId: req.user._id });
    if (!userCart) {
      return res
        .status(400)
        .send({ success: false, message: "Something went wrong" });
    }
    if (userCart.length === 0) {
      let cart = new Cart({
        userId: user._id,
        service: result[0]._id,
        "item.description": package.description,
        "item.packageId": package._id,
        "item.price": package.price,
        // "item.rating":package.rating
      });

      cart = await cart.save();

      if (!cart) {
        return res
          .status(400)
          .send({ success: false, message: "Package Not Added To Cart" });
      }

      return res
        .status(200)
        .send({ success: true, message: "Package Added To Cart", cart });
    }
    if (userCart[0].service.toString() !== result[0]._id.toString()) {
      return res.status(400).send({
        success: false,
        message:
          "Different type of Service Can not be added For A User First Clear The Cart",
      });
    }

    if (userCart[0].item.packageId.toString() !== package._id.toString()) {
      return res.status(400).send({
        success: false,
        message:
          "Different type of Package Can not be added For A User First Clear The Cart",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Package Already In Cart",
      package,
      userCart,
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// @desc add platinum package to cart
// @route POST cart/platinum
// @acess Private
exports.addToCartPlatinum = async (req, res) => {
  try {
    const { body, user } = req;
    const { error } = Joi.object()
      .keys({
        serviceId: Joi.string().required(),
        packageId: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      console.log(error);
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }
    let matchQuery = {
      $match: {
        $and: [
          { _id: mongoose.Types.ObjectId(body.serviceId) },
          { "platinum._id": mongoose.Types.ObjectId(body.packageId) },
        ],
      },
    };

    let data = await Service.aggregate([
      {
        $facet: {
          totalData: [matchQuery],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Result Found Or Platinum Package Is Allowed To Add",
      });
    }

    let package;
    if (result[0].platinum._id.toString() === body.packageId)
      package = result[0].platinum;

    let userCart = await Cart.find({ userId: user._id });
    if (!userCart) {
      return res
        .status(400)
        .send({ success: false, message: "Something went wrong" });
    }
    if (userCart.length === 0) {
      let cart = new Cart({
        userId: user._id,
        service: result[0]._id,
        "item.description": package.description,
        "item.packageId": package._id,
        "item.price": package.price,
        // "item.rating":package.rating
      });

      cart = await cart.save();

      if (!cart) {
        return res
          .status(400)
          .send({ success: false, message: "Package Not Added To Cart" });
      }

      return res
        .status(200)
        .send({ success: true, message: "Package Added To Cart", cart });
    }
    if (userCart[0].service.toString() !== result[0]._id.toString()) {
      return res.status(400).send({
        success: false,
        message:
          "Different type of Service Can not be added For A User First Clear The Cart",
      });
    }

    if (userCart[0].item.packageId.toString() !== package._id.toString()) {
      return res.status(400).send({
        success: false,
        message:
          "Different type of Package Can not be added For A User First Clear The Cart",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Package Already In Cart",
      package,
      userCart,
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// @desc get myCart
// @route get /cart
// @acess Private
exports.myCart = async (req, res) => {
  try {
    const { user } = req;
    let matchQuery = {
      $match: { userId: mongoose.Types.ObjectId(user._id) },
    };

    let data = await Cart.aggregate([
      {
        $facet: {
          totalData: [
            matchQuery,
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "serviceData",
              },
            },

            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
          ],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Result Found ",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User's Cart Fetched Successfully",
      myCart: result[0],
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// @desc increase the package quantity to cart
// @route PUT cart/increase
// @acess Private
exports.deleteCart = async (req, res) => {
  try {
    const { body, user } = req;
    const { error } = Joi.object()
      .keys({
        cartId: Joi.string().required(),
        // serviceId: Joi.string().required(),
        // packageId: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }
    let matchQuery = {
      $match: {
        $and: [
          { _id: mongoose.Types.ObjectId(body.cartId) },
          { userId: mongoose.Types.ObjectId(user._id) },
          // { "item.packageId": mongoose.Types.ObjectId(body.packageId) },
        ],
      },
    };

    let data = await Cart.aggregate([
      {
        $facet: {
          totalData: [matchQuery],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message:
          "No Result Found,May Be cartId or userId is invalid. Provide Correct details",
      });
    }

    result = result[0];

    result = await Cart.findByIdAndDelete(body.cartId);

    if (!result) {
      return res.status(500).send({ success: false, message: "Not Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Deleted Successfully",
      result,
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// **********************************NOT_IN_USE*************************************************************************//
// @desc increase the package quantity to cart
// @route PUT cart/increase
// @acess Private
exports.increaseQuantity = async (req, res) => {
  try {
    const { body, user } = req;
    const { error } = Joi.object()
      .keys({
        cartId: Joi.string().required(),
        serviceId: Joi.string().required(),
        packageId: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      console.log(error);
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }
    let matchQuery = {
      $match: {
        $and: [
          { _id: mongoose.Types.ObjectId(body.cartId) },
          { userId: mongoose.Types.ObjectId(user._id) },
          { service: mongoose.Types.ObjectId(body.serviceId) },
          { "item.packageId": mongoose.Types.ObjectId(body.packageId) },
        ],
      },
    };

    let data = await Cart.aggregate([
      {
        $facet: {
          totalData: [matchQuery],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Result Found",
      });
    }

    result = result[0];
    let newQuantity;
    if (result.item.quantity >= 1) {
      newQuantity = result.item.quantity + 1;
    }
    result = await Cart.findByIdAndUpdate(
      body.cartId,
      { "item.quantity": newQuantity, total: result.item.price * newQuantity },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Quantity Increased",
      result,
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// @desc decrease the package quantity to cart
// @route PUT cart/decrease
// @acess Private
exports.decreaseQuantity = async (req, res) => {
  try {
    const { body, user } = req;
    const { error } = Joi.object()
      .keys({
        cartId: Joi.string().required(),
        serviceId: Joi.string().required(),
        packageId: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      console.log(error);
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }
    let matchQuery = {
      $match: {
        $and: [
          { _id: mongoose.Types.ObjectId(body.cartId) },
          { service: mongoose.Types.ObjectId(body.serviceId) },
          { "item.packageId": mongoose.Types.ObjectId(body.packageId) },
        ],
      },
    };

    let data = await Cart.aggregate([
      {
        $facet: {
          totalData: [matchQuery],
          totalCount: [matchQuery, { $count: "count" }],
        },
      },
    ]);

    let result = data[0].totalData;
    let count = data[0].totalCount;

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Result Found",
      });
    }

    result = result[0];
    let newQuantity;
    if (result.item.quantity > 1) {
      newQuantity = result.item.quantity - 1;

      result = await Cart.findByIdAndUpdate(
        body.cartId,
        {
          "item.quantity": newQuantity,
          total: result.item.price * newQuantity,
        },
        { new: true }
      );

      return res.status(200).send({
        success: true,
        message: "Quantity Decreased",
        result,
        count,
      });
    }
    return res.status(200).send({
      success: false,
      message: "Quantity Can't be negative",
      result,
      count,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};
