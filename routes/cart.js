const express = require("express");
const {
  addToCartSilver,
  addToCartGold,
  addToCartPlatinum,
  myCart,
  deleteCart,
  getCartAdmin,
  getCartsAdmin,
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
router.delete("/cart", verifyToken, deleteCart);

//ADMIN
router.get("/admin/:id", getCartAdmin);
router.get("/admin", getCartsAdmin);

//NOT_IN_USE
router.put("/increase", verifyToken, increaseQuantity);
router.put("/decrease", verifyToken, decreaseQuantity);

module.exports = router;
