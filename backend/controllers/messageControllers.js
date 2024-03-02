const asyncHandler = require("express-async-handler");
const Message = require("../modals/messageModel");
const User = require("../modals/userModal");
const Chat = require("../modals/chatModal");
//chatId  on which chat we have to send the message
//@description     Get all Messages(fetching all the messages for a particular chat)  =>frontend me jab aap left side kisi bande par click karte ho baat karne ke liye to waha se uska pura chat nikalene keliye yahe call kiya jata hai.....aur yaha se maal wapis waha bheza zata hai...jo ki tum check kare se console me print kiye ho
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    // console.log("vaishu",req.params.chatId)
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
      console.log("jai mata di",messages);
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error("AK",error.message);
  }
});

//@description     Create New Message 
//@route           POST /api/Message/
//@access          Protected
// Import necessary modules or dependencies (not shown in the provided code)

// Define an asynchronous function to handle sending a message
const sendMessage = asyncHandler(async (req, res) => {
    // Extract content and chatId from the request body
    const { content, chatId } = req.body;
  
    // Check if both content and chatId are not present in the request body
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400); // Send a 400 (Bad Request) status if data is missing
    }
  
    // Create a new message object with sender, content, and chat properties
    var newMessage = {
      sender: req.user._id, // Sender is assumed to be the current user making the request(who is the sender of the message)  //i get the sender from the middleware ..from the logged in user
      content: content,  // actual message
      chat: chatId,   //on which chat we have to send the message
    };
  
    try {
      // Attempt to create a new message in the database
      var message = await Message.create(newMessage);
    //   In Mongoose, the populate() method is used to replace specified paths in a document with documents from other collections. The execPopulate() method is then used to execute the population, and it returns a promise.
      // Populate sender field with additional user data (name, pic)
     // Populate sender field with additional user data (name, pic)
    //  console.log("ayushi yaha se hame sirf thoda detail mil raha hai iske baad populate lagagke andha pura detail milega=>jaya wale case me",message);
message = await message.populate("sender", "name pic")  ;

// Populate chat field with user data (name, pic, email)
message = await message.populate("chat");

  
      // Populate additional user data in the chat.users field
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });
  
      console.log("good morning ",message);   // Update the latestMessage field of the chat with the newly created message
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
      // Send the enriched message object as a JSON response to the client
      res.json(message);
    } catch (error) {
      // Handle errors by setting the response status to 400 and throwing an error
      res.status(400);
      throw new Error(error.message);
    }
  });
  
  // Export the functions to be used elsewhere in the application
  module.exports = { allMessages, sendMessage };
  