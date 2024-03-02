const asyncHandler = require("express-async-handler");
const Chat=require("../modals/chatModal")
const User =require("../modals/userModal")

// this route is responsible for fetching one to one chat

// Certainly! In simple words, the populate function in Mongoose is like a magic trick that helps you fetch more information about something referred to in your data.Imagine you have two collections: one for users and another for messages. Each message stores the ID of the user who sent it. Now, when you retrieve a message, you want to know more details about the user who sent it, not just their ID.the populate function is used to replace specified paths in a document with documents from another collection. It allows you to reference documents in other collections and retrieve the referenced documents' data.


// req.user._id is typically associated with the currently authenticated user and is often used for operations specific to that user(logged in user ke baat).
// req.body.users is more generic and can represent an array of user IDs sent in the request body for various purposes, such as creating or updating data involving multiple users.

//@description     Create or fetch One to One Chat (ye grpChat nhi hai,isliye line 22 me isGroupChat:false hai)
//@route           POST /api/chat/
//@access          Protected
//   userId->this is the id with which we are trying to create the chat.(ye wah dusra banda hai)
// req.user._id=>this is the current logged in user
const accessChat = asyncHandler(async (req, res) => {
    //,jo user login kiya wo yaha aaya,take the user id with which we are going to create chat
    const { userId } = req.body;
  //hamne waha se userId nikala
    if (!userId) {
      console.log("UserId nhi exist karta(wah banda jiske sath aapko baat karne hai),params not sent with request");
      return res.sendStatus(400);
    }
  // agar wah banda exist karta hai ,to ham check karege ke kya with this  userId a chat exist(pahle se baat hui hai) .so findout it ...otherwise we create a new chat with userId
  //  console.log("Ayush bhai tumhare bagal usse bande ke userId hai jisse login user ko baat karne hai usne search kiya hai ya phir wo already pada hua hai",userId);
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [ //eq means equal to
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    // agar chat exist kartahai ,,, to hame user ke sare information chahiye to use populate
      .populate("users", "-password")
      .populate("latestMessage");
  //this isChat ke andar sara data aa gaya hai populate karke(niche wala word)
  // It further populates information about the sender of the latest message in the chat, including the name, profile picture (pic), and email.
  console.log("Saurabh",isChat);
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",     
      select: "name pic email",
    });
    // console.log("Nirma",isChat);
  //agar chat ka sara data nikalne ke baad ye pata chala ki chat ke length >0 ,matlab kuch na kuch baat hui hai to send it otherwise naya reln banao
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender", //chatname sender hai kyuki jo bheza hai wo wahe hoga jo login kiya hai usse sender bol de rahe hai
        isGroupChat: false,
        users: [req.user._id, userId],
      };
  
      try {
        // hamne naaya chat create kiya .....
        const createdChat = await Chat.create(chatData);

        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users","-password");
        console.log("swapnil",FullChat);
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  });



  ///////////////*************************************************////////////// */
//@description     Fetch all chats for a user(Chat naam se mongodb me store hua hai data usme find karo jaha jaha login id wala user ka chat ho sab bahar laao.) Going to get all of our chat from database from a particular user
//@route           GET /api/chat/
//@access          Protected
// { users: { $elemMatch: { $eq: req.user._id } } } means that the query is looking for documents where the users array contains at least one element that is equal to the _id of the current user (req.user._id).
// Here's a step-by-step breakdown:

// For each document, the query checks the users array.
// It uses $elemMatch to ensure that at least one element in the array satisfies the conditions.
// The condition is specified by $eq, which checks if an element in the users array is equal to req.user._id.
// If such a match is found for any element in the array, the document is considered a match for the query.
// sort({ updatedAt: -1 })=>matlab descending order me chat ko likho but updated at the most recent ke hisab se..ye fxn timestamps k andar se aaya hai
const fetchChats = asyncHandler(async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users","-password")
        .populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }); 


//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
//req.user hamko denote kar raha hai
const createGroupChat = asyncHandler(async (req, res) => {
    // This part checks if the request body contains the required information, specifically an array of users (req.body.users) and the name of the group chat  agar nhi hai to pahle create karo
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the fields" });
    }
     
  // we are converting stringify into javascript object
    var users = JSON.parse(req.body.users);
 // whatsapp grp banate waqt kam se kam apne alawa do log ko lo 
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  //ab apne ko bhi push karo us users wale list me
    users.push(req.user);
    // It adds the current user (the one making the request) to the list of users for the group
  // ab database me create karo naye request
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,  // grpadmin will be us kyuki ham is grp ko create kar rahe hai
      });
  
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
        // After creating the group chat, it fetches the full details of the group chat, including user details and group admin details using Mongoose's populate method. The -password option is used to exclude the password field from the populated user and admin objects.
        // Finally, it sends the full details of the created group chat as a JSON response.


      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  // @desc    Rename Group
  // @route   PUT /api/chat/rename
  // @access  Protected
  const renameGroup = asyncHandler(async (req, res) => {
    // ham chatId aur chatname uss grp ka nikalege(jab naya grp create hua to usk achatId aur chatname store hua )
    console.log("Practice makes a man perfect",req.body);
    const { chatId, chatName } = req.body;  
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,// rightside me naya chatname hai)
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      console.log("ram",updatedChat)
      res.json(updatedChat);
    }
  });

//hame do chiz chahiye ek to wo chatId jisme hame add karna hai naye bande ko,,dusra wo userID jis id ko add karna ha
// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
  const addToGroup=asyncHandler(async(req,res)=>{
   const {chatId,userId}=req.body;
  
   // check if the requester is admin
   const added = await Chat.findByIdAndUpdate(
    chatId,
    {
        // push kardo(update karo users array ko )
      $push: { users: userId },
    },
    {
      new: true,  // isko likh rahe hai to return latest field
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");  

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
  });

  
// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    // check if the requester is admin
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  });
  module.exports={accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}



  
// The req.user._id method is often available in Node.js/Express applications that use authentication middleware. 
// When a user logs in, the authentication middleware (such as Passport.js) verifies the user's credentials and attaches the authenticated user information to the req object.
// req.user:

// After successful authentication, the authenticated user's information is stored in req.user. This object typically contains details about the authenticated user, such as username, email, roles, and the unique identifier, often referred to as _id (ObjectId).
// Accessing User ID:

// To access the unique identifier of the authenticated user, you can use req.user._id. This allows you to perform operations specific to that authenticated user, such as querying data related to them.