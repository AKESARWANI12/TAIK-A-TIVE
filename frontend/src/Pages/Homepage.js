import React,{useEffect} from 'react'
import {Container,Box,Text,Tabs,Tab,TabList,TabPanel,TabPanels} from "@chakra-ui/react"
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate } from "react-router-dom";
const Homepage = () => {
  const navigate=useNavigate();
 
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"));
   console.log("seekho man",user) 
    if(!user){
        navigate("/chats")
    }
   },[navigate]);
  
  
  
  return (
    <Container maxW="xl" centerContent>
    <Box display="flex" justifyContent="center" p={3} bg="white" w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">
      <Text fontSize="4xl" fontFamily="Work sans">
        AK CHATAPP
      </Text>
    </Box>
    
    <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
    <Tabs variant='soft-rounded' colorScheme='red' text="black">
  <TabList mb="1em">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">SignUp</Tab>
  </TabList>

  <TabPanels>
    <TabPanel>
     <Login/>
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
    </Box>
   
    </Container>
  )
}

export default Homepage
