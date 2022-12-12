const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const categoryRoutes = require("./category");
const cartRoutes=require("./cart")
const bookingRoutes=require("./booking")
const vendorRoutes=require("./vendor")

router.use("/", userRoutes);
router.use("/category", categoryRoutes);
router.use("/cart",cartRoutes)
router.use("/booking",bookingRoutes)
router.use("/vendor",vendorRoutes)

module.exports = router;
