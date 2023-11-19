// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/payment")
const { auth} = require("../middlewares/auth")
router.post("/capturePayment", auth, capturePayment)
router.post("/verifyPayment", verifyPayment)
router.post("/sendPaymentSuccessEmail", sendPaymentSuccessEmail);

module.exports = router