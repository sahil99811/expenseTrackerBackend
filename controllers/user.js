const User=require('../models/user');
const bcrypt = require("bcrypt")
const jwt=require('jsonwebtoken')
const mailSender=require('../utils/mail-sender');
const crypto = require("crypto");
// Signup Controller for Registering USers
exports.signup=async (req,res)=>{
    try{
        // Destructure fields from the request body
      const {
        name,
        email,
        password
      }=req.body;
      // Check if All Details are there or not
      if(!name || !email || !password){
        return res.status(403).send({
            success: false,
            message: "All Fields are required",
          })
      }
      // Check if user already exists
      const existingUser = await User.findOne({ where:{
        email:email
      } })
      if (existingUser) {
        return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
        })
       }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10)

      //create user
      const user=await User.create({
        name,email,password:hashedPassword
      });
      return res.status(200).json({
        success: true,
        user,
        message: "User registered successfully",
      })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "User cannot be registered. Please try again.",
        })
    }
}


// Login controller for authenticating users
exports.login=async (req,res)=>{
    try{
      // Get email and password from request body
      const { email, password } = req.body

       // Check if email or password is missing
       if (!email || !password) {
         // Return 400 Bad Request status code with error message
         return res.status(400).json({
         success: false,
         message: `Please Fill up All the Required Fields`,
         })
       }
       // Find user with provided email
       const user = await User.findOne({ where:{
        email:email
       } });
       // If user not found with provided email
        if (!user) {
         // Return 401 Unauthorized status code with error message
         return res.status(401).json({
          success: false,
          message: `User is not Registered with Us Please SignUp to Continue`,
         })
        }
        // Generate JWT token and Compare Password
        const ans=await bcrypt.compare(password, user.password)
        if (ans==true) {
        const token = jwt.sign({ email: user.email,name:user.name, id: user.id,totalExpense:user.totalExpense},
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
        )
        // Save token to user document in database
         user.token = token
         user.password = undefined
         res.status(200).json({
          success: true,
          token,
          user,
          message: `User Login Success`,
         })
        }else{
          return res.status(401).json({
            success: false,
            message: `Password is incorrect`,
          })
        }
    }catch(error){
        console.error(error)
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
          success: false,
          message: `Login Failure Please Try Again`,
        })
    }
}


exports.resetPasswordToken = async (req, res) => {
	try {
		const email = req.body.email;
    console.log("email for sending link",email)
		const user = await User.findOne({ where:{email: email }});
		console.log(user)
    if (!user) {
			return res.status(400).json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
    console.log("hello ji");
		const token = crypto.randomBytes(20).toString("hex");
  
		const updatedDetails = await User.update(
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
      {
        where:{
          email:email
        }
      }
		);
    console.log(updatedDetails)
     
    const url=`${process.env.URL}${token}`
   console.log("link url:",url)
		await mailSender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
		);

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;
    console.log(password,confirmPassword,token)
		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		const userDetails = await User.findOne({ where:{token: token} });
		if (!userDetails) {
			return res.status(400).json({
				success: false,
				message: "Token is Invalid",
			});
		}
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
		// const encryptedPassword = await bcrypt.hash(password, 10);
		const hashedPassword = await bcrypt.hash(password, 10)
    await User.update(
			{ password: hashedPassword },{
        where:{
          token:token
        }
      }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};
exports.getPremium=async (req,res)=>{
  try {
    
  } catch (error) {
    
  }
}
exports.leaderBoard=async (req,res)=>{
  try {

    const result=await User.findAll({
      attributes: ['name', 'totalExpense'], // Select only 'name' and 'amount' columns
      order: [['totalExpense', 'DESC']], // Order by 'amount' in descending order
      limit:10
    })
    return res.status(200).json({
      success:true,
      message:"leaderboard fetched successfully",
      data:result
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"something went wrong,plz try again"
    })
  }
}
