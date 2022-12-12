const express = require("express");
const { createReview } = require("../controllers/vendor");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/review/:id", verifyToken, createReview);

module.exports = router;
