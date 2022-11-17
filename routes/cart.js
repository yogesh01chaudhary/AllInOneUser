const express = require("express");
const {
  addBooking,
  addToCartSilver,
  addToCartGold,
  addToCartPlatinum,
  myCart,
  getCart,
  getCarts,
  increaseQuantity,
  deleteCart,
  decreaseQuantity,
  getBooking,
  getBookings,
  payment,
  checkOut,
  paymentVerify,
} = require("../controllers/cart");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/silver", verifyToken, addToCartSilver);
router.post("/gold", verifyToken, addToCartGold);
router.post("/platinum", verifyToken, addToCartPlatinum);
router.get("/myCart", verifyToken, myCart);
router.put("/increase", verifyToken, increaseQuantity);
router.put("/decrease", verifyToken, decreaseQuantity);
router.delete("/cart", verifyToken, deleteCart);

router.get("/cart/:id", getCart);
router.get("/carts", getCarts);

module.exports = router;
