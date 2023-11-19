// Importing required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// Configuring dotenv to load environment variables from .env file
dotenv.config();

// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
	console.log("is running")
	try {
		// Extracting JWT from request cookies, body or header
		console.log("11 line is executed ")
		const token = req.headers.authorization.replace('Bearer ', '');
		console.log(token)
		// Extracting the token from the Authorization header
		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}
        console.log("19 line is executed ")
		try {
			// Verifying the JWT using the secret key stored in environment variables
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			console.log("decoding jwt token",decode);
			// Storing the decoded JWT payload in the request object for further use
			req.user = decode;
			console.log("26 line is executed ")
		} catch (error) {
			// If JWT verification fails, return 401 Unauthorized response
			return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
		}

		// If JWT is valid, move on to the next middleware or request handler
		console.log("34 line is executed ")
		next();
	} catch (error) {
		// If there is an error during the authentication process, return 401 Unauthorized response
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};

exports.isPremium=async (req,res,next)=>{
    try {
        next();
    } catch (error) {
        
    }
}