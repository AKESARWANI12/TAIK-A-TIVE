import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Text } from '@chakra-ui/layout';
import { useState,useEffect } from 'react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/button';
import ProfileModal from './miscellaneous/ProfileModal';
import { getSender, getSenderFull } from '../config/ChatLogics';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { Spinner } from '@chakra-ui/spinner';
import { Input } from '@chakra-ui/input';
import { FormControl} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import "./styles.css"
// import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../animations/typing.json";
import ScrollableChat1 from './ScrollableChat';
const ENDPOINT=`${process.env.REACT_APP_BACKEND_URL}`;
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const[newMessage,setNewMessage]=useState();
  const [socketConnected,setSocketConnected]=useState(false);
  const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState();
  const [typing,setTyping]=useState(false);
  const [istyping,setIsTyping]=useState(false);
const toast=useToast();

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const typingHandler = (e) => {
  setNewMessage(e.target.value);

  if (!socketConnected) return;

  if (!typing) {
    setTyping(true);
    socket.emit("typing", selectedChat._id);
  }
  let lastTypingTime = new Date().getTime();
  var timerLength = 3000;
  setTimeout(() => {
    var timeNow = new Date().getTime();
    var timeDiff = timeNow - lastTypingTime;
    if (timeDiff >= timerLength && typing) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }
  }, timerLength);
};
  //Typing indicator logic here

 const fetchMessages = async () => {
  //if no chat is selected
  if (!selectedChat) return;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    setLoading(true);
    const { data } = await axios.get(`/api/message/${selectedChat._id}`,config);
    console.log("check kare",data)
    setMessages(data);
    setLoading(false);

    socket.emit("join chat", selectedChat._id);   //join chat ke kahane yaha frontend se backend me bheza ja raha ahi...yaha se wo selectedchat ke id bhi bhez rahe hai ham
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: "Failed to Load the Messages",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
};
 const sendMessage = async (event) => {
  if (event.key === "Enter" && newMessage) {
     socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "/api/message",
        {
          content: newMessage,
          chatId: selectedChat,
        },
        config
      );
      socket.emit("new message", data);   //this new messgae contains the data
      // console.log("akri",data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
};


useEffect(()=>{
  socket=io(ENDPOINT);
  socket.emit("setup",user);  //yaha se send kar rahe hai..backend me receive/listen
  socket.on("connected",()=>setSocketConnected(true));
  socket.on('typing',()=>setIsTyping(true))
  socket.on("stop typing",()=>setIsTyping(false));
  // eslint-disable-next-line
},[]);


useEffect(()=>{
  fetchMessages();
  selectedChatCompare=selectedChat;
  // eslint-disable-next-line
},[selectedChat]);


useEffect(() => {
  //hamne message received kiya ab check karo
  socket.on("message recieved", (newMessageRecieved) => {
    // Check if the selected chat is not available or doesn't match the current chat
    if (
      !selectedChatCompare || // if chat is not selected or doesn't match current chat  (suppose ham kritika shram se baat kar rahe hai aur hanuman ne message kar diya to hanuman ka chat ko notification me bhezo nak i kritika sharm a ki chat me)
      selectedChatCompare._id !== newMessageRecieved.chat._id
    ) { 
      // Check if the new message is not already in the notification list
    if (!notification.includes(newMessageRecieved)) {
        // Add the new message to the notification list
        setNotification([newMessageRecieved, ...notification]);
        // Trigger a fetch by updating a state variable (possibly for re-rendering) update the list of chat
        setFetchAgain(!fetchAgain);
      }
    } 
    else{
      // If the chat is selected, add the new message to the messages array
      setMessages([...messages, newMessageRecieved]);
  }
  });
  });



    return (
      <>
      {selectedChat ? (
        <>
        <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
         
            <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
      
         {loading?<Spinner   size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"/>:(
                  <div className="messages">
                  <ScrollableChat1 messages={messages}/>
                  </div>)}

              <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3} > 
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>

            </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
