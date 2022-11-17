const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const categoryRoutes = require("./category");
const cartRoutes=require("./cart")
const bookingRoutes=require("./booking")
const otpRoutes=require("./otp")

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/cart",cartRoutes)
router.use("/otp",otpRoutes)
router.use("/booking",bookingRoutes)

module.exports = router;
