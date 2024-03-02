import React,{useEffect} from 'react'
import {ChatState} from "../Context/ChatProvider";
import { useToast } from "@chakra-ui/toast";
import { useState } from 'react';
import axios from 'axios';
import { Box, Stack, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from "../config/ChatLogics"
import GroupChatModal from "../components/miscellaneous/GroupChatModal"
const MyChats = ({fetchAgain}) => {

    const [loggedUser,setLoggedUser]=useState();  
    const {selectedChat,setSelectedChat,user,chats,setChats}=ChatState();
    const toast = useToast();
    const fetchChats = async () => {
    // console.log(user._id);
    try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get("/api/chat", config);
    console.log("om namaha fshiauay",data);
    setChats(data);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: "Failed to Load the chats",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};
// i am going to call this  above fxn from useEffect   
useEffect(() => {
  setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  fetchChats();
  // eslint-disable-next-line
}, [fetchAgain]);
return (
  <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
  >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px" }}
      fontFamily="Work sans"
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      My Chats
      <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
      </GroupChatModal>
    </Box>
    <Box
      display="flex"
      flexDir="column"
      p={3}
      bg="#F8F8F8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
    >
      {chats ? (
        <Stack overflowY="scroll">
          {chats.map((chat) => (
            <Box
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat === chat ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}
            >
              <Text>
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </Text>
              {chat.latestMessage && (
                <Text fontSize="xs">
                  <b>{chat.latestMessage.sender.name} : </b>
                  {chat.latestMessage.content.length > 50
                    ? chat.latestMessage.content.substring(0, 51) + "..."
                    : chat.latestMessage.content}
                </Text>
              )}
            </Box>
          ))}
        </Stack>
      ) : (
        <ChatLoading />
      )}
    </Box>
  </Box>
);

};


export default MyChats;

// ye jo leftside me dikh raha hai wo ham yahe par bana rhe hai...GroupChats create karne wale button aur bhi bahut kuch



// i need two things..i want that this MyChats and this newGroupChatIcon both will occur simulatenoulsy in a row one at left Corner with some spacing from left... and GroupChatIcon with text on the rightSide of the box..and i want this red background color till left of the height below...in the screen and width will remain same