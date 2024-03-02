const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String", // ye bhi string hoga kyuki link string format me hai
    
      default: // ye default picture hai agr user nhi leta picture tho
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    // isAdmin: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword=async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
}
// password save karne se pahle usko salt de kar hash karke save karo bcrypt module se
userSchema.pre('save',async function(next){
  if(!this.isModified){
    next();
  }
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
});
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("User", userSchema);

module.exports = User;


// In Mongoose, the timestamps option is used to automatically add createdAt and updatedAt fields to a schema. These fields represent the timestamp of when a document was created (createdAt) and when it was last updated (updatedAt).
// When a document is created, Mongoose automatically sets the createdAt field to the current date and time. When a document is updated, Mongoose automatically updates the updatedAt field. This provides a convenient way to track when documents were created or modified