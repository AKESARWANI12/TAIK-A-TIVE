require('dotenv').config();
const connectToMongo=require('./config/db');
const express = require('express')
connectToMongo();
const cors = require('cors')
const userRoutes=require('./routes/userRoutes');
const chatRoutes=require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes")
const {notFound,errorHandler}=require('./middleware/errorMiddleware')
const app = express()
app.use(cors())
const port = process.env.PORT || 5000;
// The app.use(express.json()) middleware in an Express.js application is used to parse incoming requests with JSON payloads. When a client sends data to the server in the body of an HTTP request, it is often in JSON format. The express.json() middleware enables Express to parse and extract this JSON data, making it available for use in your route handlers.
// When a request with a JSON payload is received, the express.json() middleware parses the JSON data in the request body. It then adds the parsed data to the request object as req.body.

app.use(express.json()) // kyuki ham frontend se data le rahe hai to hamko express ko json ke liye
const chats=require("./data/data")
// app.get('/',(req,res)=>{
//   res.send("API is running Succesfully")
// });

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);
app.use(notFound);   // agar routing me kisi prakar ka error aata hai..to ham ismiddlewareko call karege manlo fetchlink he galat hai
app.use(errorHandler); // agar req wale line sahe hai to bhi kuch aur he error hai to uske liye



const server=app.listen(port,console.log(`Server started on the  PORT ${port}` .yellow.bold) );

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.FRONTEND_URL,
      // credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
 // Joining a Room: The socket.join(userData._id) line is instructing the server-side socket to join a room identified by the userData._id. In Socket.IO, rooms are a way to group sockets together. In this case, you are creating a room for each user based on their unique ID.  
// The userData in your code is likely the data specific to the user who is emitting the "setup" event. Generally, in a Socket.IO setup like this, when a user logs in or connects to your application, you might send their user data to the server. This data could include information such as the user's ID, username, authentication tokens, or any other relevant information.

// The key point here is that the userData in the "setup" event pertains to the user who is currently interacting with your application. It is not a collection of data for multiple users. Each time a user connects or logs in, they send their own data to the server, and the server processes that information for that specific user.
  //here i am gonna vreate socket.on setup fxn this will take {user data} from the frontend...we are creating a new socket where frontend will create some data and joined a room ...and we will create a new room with the id of the user ..so this will createa room for taht particular id
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("ka hal chal Yaha logged in user ke liye special room ban jata hai..individual room bole to",userData._id)// we get the user id as soon as user join the application
        socket.emit("connected");    // ye bhezega fronetnd ko ...to wo waha listen karke stateupdate karega socketconnected true
      });
    //[[[[[[[[[[[[[   The "setup" event is generally used for initializing a connection and setting up individual rooms for users, while the "join chat" event is used to join specific rooms, possibly for group conversations or chat functionality in your application]]]]]]]]]]]]]]
      ////////////****************************////join Chat**************///////////////// */
    //  join chat=> this will take room id for the frontend and we create a room with the id of th room.. when we click on an of the chat..this will create a new room with that particular user and the logged in user...ye chat karne ke liye hai ....dusre user se or grp me baat karne ke liye
      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined kar chuka hai Room: " + room);
      });

// new socket for send message hokar yaha aaya  or new message jo receive hua hai
      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;     //find out chat data from there
    
        if (!chat.users) return console.log("chat.users not defined");  // if that chat doesnt have any users
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;  // if this is send by logggeduser then return it
        // agar koi aur bheza hai to bhezo kaha ......in matlab inside that user_id room me bhez do ke message received hua(below is newmessagereceived )
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });
      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
    
});













// const io = require("socket.io")(server, { ... });:

// This line imports the socket.io library and immediately invokes it with the server as its first argument and an options object as its second argument.
// pingTimeout: 60000:

// The pingTimeout option is set to 60,000 milliseconds (60 seconds). It determines the maximum time allowed for a client to respond to a ping from the server. If a client fails to respond within this timeout, it will be considered disconnected.
// cors: { origin: "http://localhost:3000" }:

// The cors (Cross-Origin Resource Sharing) option is configured to allow connections only from the specified origin (http://localhost:3000). This defines which domains are permitted to access the WebSocket server.
// io.on("connection", (socket) => { ... });:

// This sets up an event listener for the "connection" event, which is emitted whenever a new client establishes a connection to the WebSocket server.
// (socket) => { console.log("connected to socket.io"); }:

// The callback function receives a socket object representing the individual connection. In this case, it simply logs a message to the console indicating that a client has connected to the WebSocket server.
