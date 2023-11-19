const express=require('express');
const router=express.Router();
const {login,signup,resetPassword,resetPasswordToken,leaderBoard,getPremium}=require('../controllers/user');
const {isPremium}=require('../middlewares/auth')
// Route for user login
router.post('/login',login);

// Route for user signup
router.post("/signup", signup)

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

//purchase premium of expense tracker
router.post("/premium",getPremium);
//get learderboard for premium users
router.get('/leaderboard',leaderBoard);
// Export the router for use in the main application
module.exports = router