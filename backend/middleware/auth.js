// import jwt from "jsonwebtoken";

// const authMiddleware = async(req, res, next) =>{
// const {token} = req.headers;
// if(!token){
//     return res.json({success:false, message:"Not Authurised Login Again"}); 
// }
// try{
//   const token_decode = jwt.verify(token,process.env.JWT_SECRET);
//   req.body.userId = token_decode.id;
//   next();
// }
// catch(err){
//     console.log(`Error is ${err}`, err);
//     res.json({success: false, message: "Error"})
// }

// }

// export default authMiddleware;

import jwt from "jsonwebtoken";
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from the `Authorization` header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please log in again.",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = token_decode.id; // Attach user ID to the request body
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.error(`Error: Token expired at ${err.expiredAt}`);
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    console.error(`Error is ${err}`, err);
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Invalid token.",
    });
  }
};

export default authMiddleware;
