const Joi = require("Joi");
const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Booking = require("../models/booking");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// **************************************USER*****************************************************************************//
// @desc add Booking
// @route POST /booking
// @acess Private
exports.addBooking = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { body, user } = req;
    const { error } = Joi.object()
      .keys({
        cartId: Joi.string().required(),
        start: Joi.string().required(),
        end: Joi.string().required(),
        bookingDate:Joi.string().required(),
        payby: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      console.log(error);
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }

    let userCartService = await Cart.findById(body.cartId);
    if (!userCartService) {
      return res
        .status(404)
        .send({ success: false, mesaage: "Nothing In User's Cart" });
    }
    if (userCartService.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .send({ success: false, message: "Not A Valid User" });
    }

    let booking = await Booking.find({
      $and: [
        { userId: userCartService.userId },
        { service: userCartService.service },
        { "item.packageId": userCartService.item.packageId },
        { $or: [{ bookingStatus: "Confirmed" }, { bookingStatus: "Pending" }] },
      ],
    });

    if (booking.length !== 0) {
      return res.status(409).send({
        success: false,
        message: `Booking Already Present, Please Clear You Cart having CartID ${body.cartId}`,
      });
    }

    let data = {
      userId: userCartService.userId,
      service: userCartService.service,
      "item.packageId": userCartService.item.packageId,
      "item.price": userCartService.item.price,
      "item.rating": userCartService.item.rating,
      "item.description": userCartService.description,
      "timeSlot.start": body.start,
      "timeSlot.end": body.end,
      "timeSlot.bookingDate":body.bookingDate,
      total: userCartService.item.price * 100,
      payby: body.payby,
    };
    booking = new Booking(data);

    booking = await booking.save({ session });

    if (!booking) {
      return res
        .status(400)
        .send({ success: false, message: "Booking Failed" });
    }
    let deleteCart = await Cart.findByIdAndDelete(body.cartId, { session });
    await session.commitTransaction();
    await session.endSession();
    return res.status(200).send({
      success: true,
      message:
        "Booking Created, Please Check the Status, We will notify you as it is confirmed",
      booking,
      deleteCart,
    });
  } catch (e) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// @desc see  all booking of an user using userId
// @route GET /booking
// @acess Private
exports.getBookingsUser = async (req, res) => {
  try {
    const { user } = req;

    let matchQuery = {
      $match: { userId: mongoose.Types.ObjectId(user._id) },
    };

    let data = await Booking.aggregate([
      {
        $facet: {
          totalData: [
            matchQuery,
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "serviceData",
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
      return res.status(200).send({ success: false, message: "No Data Found" });
    }

    return res.status(200).send({
      success: true,
      message: "Bookings Fetched Successfully",
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

// @desc see booking using bookingId
// @route GET /:bookingId
// @acess Private USER
exports.getBookingUser = async (req, res) => {
  try {
    const { params, user } = req;
    const { error } = Joi.object()
      .keys({
        bookingId: Joi.string().required(),
      })
      .required()
      .validate(params);
    if (error) {
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }
    let matchQuery = {
      $match: {
        $and: [
          { _id: mongoose.Types.ObjectId(params.bookingId) },
          { userId: mongoose.Types.ObjectId(user._id) },
        ],
      },
    };

    let data = await Booking.aggregate([
      {
        $facet: {
          totalData: [
            matchQuery,
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "serviceData",
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
      return res.status(200).send({
        success: false,
        message:
          "No Data Found, May be Invalid UserId or BookingId Or Booking Doesn't Belongs To this User",
      });
    }
    result = result[0];

    return res.status(200).send({
      success: true,
      message: "Bookings Fetched Successfully",
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

//@desc admin send booking to nearbyvendors and vendor will confirm the booking
//@route PUT vendor/complete
//@access Private
exports.cancelBooking = async (req, res) => {
  try {
    const { body, user } = req;
    const { error } = Joi.object()
      .keys({
        bookingId: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });
    }
    let matchQuery = {
      $match: {
        $and: [
          { _id: mongoose.Types.ObjectId(body.bookingId) },
          {
            $or: [ { bookingStatus: "Confirmed" },{ bookingStatus: "Pending" }],
          },
          { userId: mongoose.Types.ObjectId(user._id) },
        ],
      },
    };

    let data = await Booking.aggregate([
      {
        $facet: {
          totalData: [
            matchQuery,
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
          ],
        },
      },
    ]);

    let result = data[0].totalData;

    if (result.length === 0) {
      return res.status(404).send({ success: false, message: "No Data Found" });
    }
    result = result[0];
    if (!result.userData[0].email && !result.userData[0].phone) {
      return res
        .status(400)
        .send({ success: false, mesage: "User Mail Id Or Phone Is Required" });
    }

    let booking = await Booking.findByIdAndUpdate(
      body.bookingId,
      {
        bookingStatus: "Cancelled",
      },
      { new: true }
    );

    // send mail or sms to user to let him know that his booking is confirmed
    let transporter = await nodemailer.createTransport({
      service: process.env.SERVICE,
      host: process.env.HOST,
      port: process.env.PORTMAIL,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const mailResponse = await transporter.sendMail({
      from: `"Yogesh Chaudhary" <${process.env.USER}>`,
      to: `${result.userData[0].email}`,
      subject: `OrderID ${body.bookingId} Status`,
      text:
        `Dear User, \n\n` +
        `Your booking having booking id ${body.bookingId} is cancelled. \n\n` +
        "This is an auto-generated email. Please do not reply to this email.\n\n" +
        "Regards\n" +
        "Yogesh Chaudhary\n\n",
    });

    if (!mailResponse) {
      return res
        .status(400)
        .send({ success: true, message: "Something went wrong" });
    }
    if (mailResponse.accepted.length === 0) {
      return res.status(400).send({ success: false, mailResponse });
    }
    return res.status(200).send({
      success: true,
      message: "Booking Cancelled",
      booking,
      mailResponse,
    });
  } catch (e) {
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// **************************************PAYMENT*****************************************************************************//
// @desc make payment
// @route POST cart/payment
// @acess Private
exports.payment = async (req, res) => {
  try {
    const { body } = req;
    let instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log(instance);
    let options = {
      amount: body.amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    console.log(options);
    let order = await instance.orders.create(options);
    if (!order) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong" });
    }
    res.status(201).send({ sucess: true, message: "Order Created", order });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

// @desc send order id t front end
// @route POST cart/checkOut
// @acess Private
exports.checkout = async (req, res) => {
  const { body } = req;
  console.log(body);
  let options = {
    key_id: process.env.RAZORPAY_KEY_ID,
    amount: body.amount,
    currency: "INR",
    order_id: body.id,
    handler: function (response) {
      console.log(response.razorpay_payment_id);
      console.log(response.razorpay_order_id);
      console.log(response.razorpay_signature);
    },
  };
  let rzp1 = new Razorpay(options);
  console.log(rzp1);
  // rzp1.on("payment.failed", function (response) {
  //   alert(response.error.code);
  //   alert(response.error.description);
  //   alert(response.error.source);
  //   alert(response.error.step);
  //   alert(response.error.reason);
  //   alert(response.error.metadata.order_id);
  //   alert(response.error.metadata.payment_id);
  // });
};

// @desc make payment verify signature
// @route POST cart/paymentVerify
// @acess Private
exports.paymentVerify = async (req, res) => {
  let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

  let expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log("sig received ", req.body.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.razorpay_signature)
    response = { signatureIsValid: "true" };
  return res.send(response);
};
