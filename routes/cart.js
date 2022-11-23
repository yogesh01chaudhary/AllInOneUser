const express = require("express");
const {
  addToCartSilver,
  addToCartGold,
  addToCartPlatinum,
  myCart,
  deleteCart,
  increaseQuantity,
  decreaseQuantity,
} = require("../controllers/cart");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

//USER
router.post("/silver", verifyToken, addToCartSilver);
router.post("/gold", verifyToken, addToCartGold);
router.post("/platinum", verifyToken, addToCartPlatinum);
router.get("/", verifyToken, myCart);
router.delete("/", verifyToken, deleteCart);

//NOT_IN_USE
router.put("/increase", verifyToken, increaseQuantity);
router.put("/decrease", verifyToken, decreaseQuantity);

module.exports = router;
