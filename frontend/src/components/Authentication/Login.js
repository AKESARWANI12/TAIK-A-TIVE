import { Button,  Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import {FormControl, FormLabel} from "@chakra-ui/react"
import React,{useState} from 'react'
import { useToast } from '@chakra-ui/react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = () => {

const [password,setPassword]=useState();
const [email,setEmail]=useState();
const[show,setShow]=useState(false);
const [Loading,setLoading]=useState(false);
let navigate=useNavigate();
const toast=useToast();

const submitHandler=async()=>{
    setLoading(true);
    if (!email || !password) {   // agar email aur password filled na ho
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post( `${process.env.REACT_APP_BACKEND_URL}/api/user/login`,{ email, password },config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    //   setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
}

const handleClick=()=>{
    setShow(!show);
}

  return (
  <VStack spacing='10px' >
    <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input placeholder="Enter Your Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>   
    </FormControl>
    <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input type={show?"text":"password"} placeholder="Enter Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>   
        <InputRightElement width="4.5rem"><Button h="1.75rem" size="sm" onClick={handleClick}>{show?"Hide" : "Show"}</Button></InputRightElement>
        </InputGroup>

    </FormControl>
    <Button colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={Loading}
       >Login</Button>
    <Button colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={()=>{
            setEmail("guest@example.com");
            setPassword("123456");
        }}
       >Get Guest User Credentials</Button>
  </VStack>
  );
};

export default Login
