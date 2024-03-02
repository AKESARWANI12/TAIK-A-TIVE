const mongoose = require("mongoose");

const messageModal = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },/// id of the sender(user)
    content: { type: String, trim: true },   // content of the message,string form me hoga
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, //reference to the chat to which it belongs to
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageModal);
module.exports = Message;   //ham export kar rahe hai isko aage use karne ke liye   



// It includes the following fields:
// sender: Represents the sender of the message. It's of type ObjectId and is referencing the "User" model.
// content: Represents the content of the message, a string that is trimmed (leading and trailing whitespaces removed).
// chat: Represents the chat to which the message belongs. It's also of type ObjectId and references the "Chat" model.
// readBy: An array of user IDs who have read the message. Each ID references the "User" model.
// { timestamps: true }: This option adds createdAt and updatedAt fields to the schema, automatically managing the creation and update times.
// trim: true is an option used for the String type. When trim is set to true, it means that any leading and trailing whitespaces in the string will be removed before saving the data to the MongoDB collection