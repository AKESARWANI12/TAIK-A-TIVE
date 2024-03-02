const mongoose=require('mongoose')

const chatModel=mongoose.Schema(
    {
     chatName:{type:String,trim:true},
     isGroupChat:{type:Boolean,default:false},
     users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     },
    ],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
},
{
    timestamps:true,
}
);
const Chat=mongoose.model("Chat",chatModel);

module.exports=Chat;
//Chat naam ka ek array ban gaya hai

//chatname
//isGroupchat
//users
//latestmessage
// groupadmin
// if it is agrp chat then who is the grp admin
// Timestamps:

// In Mongoose, the timestamps option is used to automatically add createdAt and updatedAt fields to a schema. These fields represent the timestamp of when a document was created (createdAt) and when it was last updated (updatedAt).
// When a document is created, Mongoose automatically sets the createdAt field to the current date and time. When a document is updated, Mongoose automatically updates the updatedAt field. This provides a convenient way to track when documents were created or modified