const express = require("express");
const { createReview, deleteReview } = require("../controllers/vendor");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/review/:id", verifyToken, createReview);
router.delete("/review/delete/:id", verifyToken, deleteReview);

module.exports = router;
