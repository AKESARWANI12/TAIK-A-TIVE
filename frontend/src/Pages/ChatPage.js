import { Box } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider'
import React from 'react'
import { useState } from 'react';
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
const ChatPage = () => {

  // hamne user ko destructure kar liya login karne ke baad
  const {user}=ChatState() ;
  const [fetchAgain,setFetchAgain]=useState(false); // this state is made ke agar tum koi change karte ho naye bande ko add karte ho to state change hogi aapki to left and right side me dubara phir se refresh ho jjayega
  return (
    <div style={{width:"100%"}}>
 
      {user && <SideDrawer/>}
     
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  )
}

export default ChatPage

// the SideDrawer component will only be rendered if the user object exists and is truthy. This is a precautionary check to avoid rendering the SideDrawer when the user object is null, undefined, or any other falsy value. 
