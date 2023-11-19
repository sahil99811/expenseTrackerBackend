const {instance} = require("../config/razorpay");
const User = require('../models/user');
const mailSender = require("../utils/mail-sender");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
require('dotenv').config();
//initiate the razorpay order
exports.capturePayment = async(req, res) => {

    const userId = req.user.id;
    console.log("user id",userId)
    let totalAmount = 1000*100;
    const currency = "INR";
    const options = {
        amount: totalAmount,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }
    console.log("heelo ji 101");
    try{
        console.log("heelo ji 102");
        const paymentResponse = await instance.orders.create(options);

        res.json({
            success:true,
            data:paymentResponse,
            username:req.user.name,
            email:req.user.email,
            userId:userId
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

}


//verify the payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body.razorpay_order_id;
    const razorpay_payment_id = req.body.razorpay_payment_id;
    const razorpay_signature = req.body.razorpay_signature;
    const userId=req.body.userId;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature) {
            //enroll karwao student ko
            User.update(
                { isPremiumUser: true },
                {
                    where: {
                        id: userId
                    }
                }
            )            
            //return res
            return res.status(200).json({success:true, message:"Payment Verified"});
        }
        return res.status(200).json({success:"false", message:"Payment Failed"});

}


exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const user = await User.findOne({
            where:{
                id:userId
            }
        });
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
             paymentSuccessEmail(`${user.name}`,
             amount/100,orderId, paymentId)
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}

