import React from 'react'
import { useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import ProfileModal from './ProfileModal';
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {Menu,MenuButton,MenuDivider,MenuItem,MenuList,} from "@chakra-ui/menu";
import {Drawer,DrawerBody,DrawerContent,DrawerHeader,DrawerOverlay} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import {useNavigate} from "react-router-dom";
import ChatLoading from "../ChatLoading"
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
// import NotificationBadge, { Effect } from "react-notification-badge"

const SideDrawer = () => {

  const [search,setSearch]=useState("")
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadingChat,setLoadingChat]=useState();
  const {user,setSelectedChat,chats,setChats,setNotification,notification}=ChatState();  //ye sab chatstateProvider se nikal ke la rahe hai
  const navigate=useNavigate();
  const toast=useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    navigate("/");
  }
  const handleSearch=async()=>{
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try{
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        },
      };
      const {data}=await axios.get(` /api/user?search=${search}`,config);
      setLoading(false);
      setSearchResult(data);
     
    }catch(error){
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
       }
     
};
// hamne searchbar me search kiya wo banda hame mil gaya to uspar click karne par uske sare chats hame rightside box me dikhe aur ewo access kar paye sare chat ko
const accessChat= async (userId)=>{
  console.log(userId);

  try {
    setLoadingChat(true);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };//to create chat we have to send that bande ke userId
    const { data } = await axios.post(`/api/chat`, { userId }, config);

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);   //if chats is already with us then it is just going to update the list..by appending the chats
    setSelectedChat(data);
    setLoadingChat(false);
    onClose();
  } catch (error) {
    toast({
      title: "Error fetching the chat",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};
  
  
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
     {/* hamne tooltip ke andar wrap kardiya search user ko jisse when we hover we can see the content why we are using it=>refer more to AllConcepts */}
    <Tooltip label="Search Users to chat" hasArrow placement="bottom-end"> 
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
    </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
       AK CHATAPP
        </Text>

   <div>
      <Menu>
        {/* notification ke bagal drop down lane ke liye menu button ka use kiya */}
        <MenuButton p={1}>
        {/* <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              /> */}
        <BellIcon fontSize="2xl" m={1} />
        </MenuButton>
        <MenuList pl={2}>
              {!notification.length && "bhaiya nhi aaya No New Messages "}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                        // agar grp chat hai to grpchat ka name de do
                >
          
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
                ))}
            </MenuList>
      </Menu>
   
      {/* //rightside of top pe kam chalr aha hai,,avatar fro chakraui..wo dp bhai ,,It contains the profile picture of the user who is logged in ,,Hanme upar contextaPi ki madat se user nam ka state niakal aur yaha uske naam aur dp de dala */}
      <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
            {/* // yaha se user ka data supply kiye to jakar is component me show hoga */}
              <ProfileModal user={user}>  
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
             
            </MenuList>
          </Menu>
          </div>
       </Box>

 

      

  <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>

            <Box display="flex" pb={2} >
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (//ab skeleton system daal diye ho wo tab tak dikhega jab tak aap ka content load na ho jaye..and finally wo searchresult se option chaining kar rahe hai map lga ke aur wo sare data yaha par display hoge ek component ke through jisme ham data ko props ke tour par bhez rahe hai
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  
)};

export default SideDrawer


/* <Text display={{ base: "none", md: "flex" }} px={4}>
Search User
</Text>
In summary, this code sets up a responsive behavior for the visibility of the "Search User" text:
On screens smaller than the default (base) breakpoint (display: "none"), the text will not be displayed.
On screens equal to or larger than the medium (md) breakpoint (display: "flex"), the text will be displayed as a flex container.  */