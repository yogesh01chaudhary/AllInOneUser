const express=require("express");
const { getBooking, getBookings, addBooking, payment, checkout, paymentVerify,  } = require("../controllers/booking");
const { verifyToken } = require("../middlewares/auth");
const router=express.Router()

router.get("/booking/:id", getBooking);
router.get("/booking", getBookings);

router.post("/booking", verifyToken, addBooking);
router.post("/payment", verifyToken, payment);
router.post("/checkout", verifyToken, checkout);
router.post("/paymentVerify", verifyToken,paymentVerify);


module.exports=router
