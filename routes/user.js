const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const { verifyToken } = require("../middlewares/auth");
const { upload } = require("../middlewares/imageUpload");

router.post("/sendOTP", user.phoneLogin);
router.post("/verifyOTP", user.verifyOTP);
router.put("/profile", verifyToken, user.updateProfile);
router.put("/coordinates", verifyToken, user.updateCoordinates);
router.put("/phone", verifyToken, user.changePhone);
router.get("/profile", verifyToken, user.getMyProfile);
router.put("/sendMail", verifyToken, user.sendMailOTP);
router.post("/verifyMailOTP", verifyToken, user.verifyMailOTP);
router.post("/profilePicture", verifyToken, upload, user.uploadProfilePicture);
router.put("/profilePicture", verifyToken, upload, user.updateProfilePicture);
router.post("/refreshToken", user.refreshToken);
module.exports = router;
