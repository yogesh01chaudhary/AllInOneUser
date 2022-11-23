const express = require("express");
const {
  addBooking,
  getBookingUser,
  getBookingsUser,
  cancelBooking,
  payment,
  checkout,
  paymentVerify,
} = require("../controllers/booking");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

//USER
router.post("/", verifyToken, addBooking);
router.get("/",verifyToken, getBookingsUser);
router.get("/:bookingId",verifyToken, getBookingUser);
router.put("/cancel",verifyToken, cancelBooking);

//PAYMENT
router.post("/payment", verifyToken, payment);
router.post("/checkout", verifyToken, checkout);
router.post("/paymentVerify", verifyToken, paymentVerify);

module.exports = router;
