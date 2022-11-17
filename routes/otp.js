const express=require("express")
const { sendOTPToMail, verifyOTP, phoneOTP } = require("../controllers/otp")

const router=express.Router()

router.post("/emailOTP",sendOTPToMail)
router.post("/phoneOTP",phoneOTP)
router.post("/verifyOTP",verifyOTP)

module.exports=router
