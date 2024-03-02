const jwt = require("jsonwebtoken");

const User=require("../modals/userModal.js")

const asyncHandler = require("express-async-handler");
// is middleware ka naam protect hai 
const protect = asyncHandler(async (req, res, next) => {   //ye middleware hai to it contains req,res,next to move on to nother operation
  let token;
// req ke andar header ke andar he token hoga jo authorisation naam se hai aur wo start hoga bearer se
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
   {
    try {
        // bearer ndwkbdwedjwdjwnef =>so hamne bearer ko split kardiya
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };




