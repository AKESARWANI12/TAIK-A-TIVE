const express=require('express');
const {registerUser,authUser,SearchallUsers}=require("../controllers/userControllers");
const router=express.Router();

const { protect } = require('../middleware/authMiddleware'); 

//if you want to chain multiple end points( different way..inotebook me hamne padha tha ki router.get(/api/createuser) direct likh dete the,then router.get(/api/login/user) so  mainly ye sab controllers ke andar aate hai....ham iske liye yaha par route word use kar rahe hai)
router.route('/').post(registerUser);
router.route('/').get(protect,SearchallUsers); // allusers fetch karne se pahle us user ko ek middleware me bhezege for authentication then wo allUsers wale req par jayega
router.post('/login',authUser);

module.exports=router;