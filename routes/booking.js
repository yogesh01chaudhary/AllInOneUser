const express = require("express");
const {
  addBooking,
  getBookingUser,
  getBookingsUser,
  getBookingAdmin,
  getBookingsAdmin,
  payment,
  checkout,
  paymentVerify,
} = require("../controllers/booking");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

//ADMIN
router.get("/admin", getBookingsAdmin);
router.get("/admin/:bookingId", getBookingAdmin);

//USER
router.post("/", verifyToken, addBooking);
router.get("/",verifyToken, getBookingsUser);
router.get("/:bookingId",verifyToken, getBookingUser);

//PAYMENT
router.post("/payment", verifyToken, payment);
router.post("/checkout", verifyToken, checkout);
router.post("/paymentVerify", verifyToken, paymentVerify);

module.exports = router;
