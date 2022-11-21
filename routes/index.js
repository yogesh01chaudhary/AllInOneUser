const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const categoryRoutes = require("./category");
const cartRoutes=require("./cart")
const bookingRoutes=require("./booking")

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/cart",cartRoutes)
router.use("/booking",bookingRoutes)

module.exports = router;
