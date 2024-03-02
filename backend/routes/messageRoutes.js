const express=require("express");
const { protect } = require("../middleware/authMiddleware")

const {sendMessage,allMessages} =require("../controllers/messageControllers")
const router=express.Router();

router.route('/').post(protect,sendMessage); // jab ham kisi ko message bhezte hai individual or grp me to ye work karta haima
 router.route('/:chatId').get(protect,allMessages); // fetch all messages of individual user or grp when you clicked on left side.jisse aapko baat karne hai    
module.exports=router;