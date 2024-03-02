 const asyncHandler=require("express-async-handler");
// ye uparwale linehai, express-async-handler: This is likely a Node.js module that simplifies error handling for asynchronous Express.js route handlers. It's common to use async/await in route handlers to handle asynchronous operations, and express-async-handler helps to catch errors in a cleaner way than using traditional try/catch blocks.
const User=require("../modals/userModal");
const generateToken=require('../config/generateToken');



const registerUser=asyncHandler(async(req,res)=>{
    console.log("om namah shivay")
    const {name,email,password,pic}=req.body;
    console.log("hlo")
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter all the details correct,kuch galat daal rahe ho email name password me");
    }
    const userExists=await User.findOne({email});   //ye User usermodal ka hai
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    // console.log("hlo")
    //agar sab kuch sahe raha  then ham user ko create karege mongodb ke fxn se
        const user=await User.create({name, email, password, pic});
        //ab agar registration sahe se ho gaya to send karo response niche ..aur sath me token bhi bhezdo create karke
   if(user){
    res.status(201).json({
   _id:user._id,
   name:user.name,
   email:user.email,
   pic:user.pic,
   token:generateToken(user._id)
    });
   }else{
    res.status(400);
    throw new Error("Failed to create the user");
   }
}
);

//login ke liye backend hai
const authUser=asyncHandler(async(req,res)=>{    
const {email,password}=req.body;
const user=await User.findOne({email});
console.log('kapil');

if(user && (await user.matchPassword(password))){
    res.json({
   _id:user._id,
   name:user.name,
   email:user.email,
   pic:user.pic,
   token:generateToken(user._id),
    });

}else{
    res.status(401);
    throw new Error("Invalid EMail or Password");
}
});

// req.query.search: Extracts the "search" query parameter from the URL.
// Mongoose Query Construction:
// const keyword = req.query.search ? ... : {};: Constructs a MongoDB query object (keyword) based on whether the "search" parameter is present in the URL.
// If "search" is present, it creates a $or query that performs a case-insensitive search on both the name and email fields using a regular expression.
// Database Query:
// const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });: Performs a Mongoose query to find users based on the constructed keyword. Additionally, it excludes the current user (whose ID is not equal to req.user._id).
// Response:
// res.send(users);: Sends the found users as a response.
// The $or operator performs a logical OR operation on an array of one or more <expressions> and selects the documents that satisfy at least one of the <expressions>.

// In MongoDB, the $regex operator is used for performing regular expression searches on string data. It allows you to match documents based on a specified pattern. The basic syntax of the $regex operator in MongoDB is as follows:
// /api/user?search=ayush   =>(search=ayush)ye ek query hai isko retrieve karne ke liye req.query hota hai
/**[[[[[ search all users me upar search bar rahta hai agar k search kar diye to k naam se sare logo ke naam aa jayege bus phir tumhe choose karna hai kisi ek se baat karne ke liye]]]]]***////// 
const SearchallUsers=asyncHandler(async(req,res)=>{
  const keyword=req.query.search?{
  $or:[
    {name:{$regex:req.query.search ,$options:'i'}},
    {email:{$regex:req.query.search,$options:"i"}},
  ]
  }:{};
 // except that particular current user (_id:=>curent user:{$ ne means not equal to:req.user._id}=>except this user return me every other user that is the part of this search result
  const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
  res.send(users);
});

module.exports={registerUser,authUser,SearchallUsers};

// The await User.create(...) line of code is using a method provided by an Object-Document Mapper (ODM) or Object-Relational Mapper (ORM) library in the context of MongoDB and Mongoose (a popular ODM for MongoDB). This method is commonly used to create a new document (record) in a MongoDB collection.

// The syntax throw new Error("...") is used in JavaScript to explicitly throw an error. It can be used to handle exceptional cases in your code, and it's commonly used when validation fails or when an unexpected condition occurs