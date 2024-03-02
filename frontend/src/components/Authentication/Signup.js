import React,{useState} from 'react'
import {VStack,FormLabel,FormControl,Input, InputRightElement,InputGroup} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import axios from "axios";
import { useToast } from '@chakra-ui/react'
import {useNavigate} from "react-router-dom"
const Signup = () => {
  const [show,setShow]=useState(false);
  const[name,setName]=useState();
  const[email,setEmail]=useState();
  const[password,setPassword]=useState();
  const [confirmpassword,setConfirmPassword]=useState();
  const [pic,setPic]=useState();
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast()
  let navigate=useNavigate();
 const handleClick=()=>{
   setShow(!show);
 }
 const postDetails=(pics)=>{// this is a postdetails fxn for upLoader the picture
  setPicLoading(true);
    if(pics===undefined){  //agar picture nhi liye to ye warning aa jaye
        toast({
            title:"Please Select An Image ayush!",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom",
        });
        return;
    }// aur agar picture signup form se chune aur uska format jpeg or png hai
    console.log("AK1",pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", `${process.env.REACT_APP_UPLOAD_PRESET}`);
        data.append("cloud_name", `${process.env.REACT_APP_CLOUD_NAME}`);
        fetch("https://api.cloudinary.com/v1_1/dgbaq2rdp/image/upload", {
          
        method: "post",
          body: data,
    

        })
          .then((res) => res.json())
          .then((data) => {
            // console.log("kaise ho kaku niyat")
            if (data.url) {
              setPic(data.url.toString());
              console.log(data.url.toString());
            } else {
              console.log("Error: data.url is undefined");
              // Handle the error appropriately, such as setting an error state or logging
            }
            setPicLoading(false);
          })
          .catch((err) => {
            console.log("Error aaya hai",err);
            setPicLoading(false);
          });
      } else {
        toast({
          title: "Please Select an Image Ayush!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
    }
 };

 const submitHandler=async ()=>{
  setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {  //sab kuch bhara hai ke nhi check karo
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }
      if (password !== confirmpassword) {       // password nhi match hua dono
        toast({
          title: "Passwords Do Not Match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }
      console.log(name, email, password, pic);   // apne liye print
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        // Makes an asynchronous API call to your backend using axios.post. It sends the user registration data (name, email, password, and pic) to the /api/user endpoint.
        const { data } = await axios.post("/api/user",{name,email,password,pic},config);
        console.log("hanuman",data);
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
//localstorage me data string format me store hota hai to convert karlo
        localStorage.setItem("userInfo", JSON.stringify(data));
        setPicLoading(false);
        navigate("/chats")
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
      }
    };


  return (
    <VStack spacing='5px' color='black'>
    <FormControl className='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter Your Name" onChange={(e)=>setName(e.target.value)}/>   
    </FormControl>
    <FormControl className='email' isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)}/>   
    </FormControl>

    <FormControl className='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input type={show?"text":"password"} placeholder="Enter Password" onChange={(e)=>setPassword(e.target.value)}/>   
        <InputRightElement width="4.5rem"><Button h="1.75rem" size="sm" onClick={handleClick}>{show?"Hide" : "Show"}</Button></InputRightElement>
        </InputGroup>

    </FormControl>
    <FormControl className='password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
        <Input type={show?"text":"password"} placeholder="Confirm Your Password" onChange={(e)=>setConfirmPassword(e.target.value)}/>   
        <InputRightElement width="4.5rem"><Button h="1.75rem" size="sm" onClick={handleClick}>{show?"Hide" : "Show"}</Button></InputRightElement>
        </InputGroup>

    </FormControl>

    <FormControl className="pic">
        <FormLabel>Upload your Picture</FormLabel>
    {/* inpu type is file for acceptoing images  */}
        <Input type="file" p={1.5} accept="image/*" onChange={(e)=>postDetails(e.target.files[0])}/>         
    </FormControl>

    <Button colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}  // uplaod hote waqt image me laoding wala symbol activate hoga aur after Loader signup button become active,,and whwn we click on this button subit handler fxn starts working
       >Sign Up</Button>
    </VStack>
  )
}

export default Signup


// accept="image/*":
// The accept attribute restricts the types of files that can be selected. In this case, it is set to "image/*", indicating that only image files are allowed. The /* wildcard allows any image format (e.g., JPEG, PNG).
// onChange={(e) => postDetails(e.target.files[0])}:
// type="file":
// This sets the type attribute of the input to "file". It creates a file input, allowing users to select files from their device.

// e.target.files is an array-like object that holds the selected files. Since the file input can accept multiple files (multiple attribute), e.target.files is an array-like object. In this case, e.target.files[0] is used to access the first (and presumably only) file selected.e.target.files: This is the files property of the file input element, which holds information about the selected files.Since a file input can accept multiple files (using the multiple attribute), e.target.files is an array-like object. If only one file is selected, you can access it using e.target.files[0].




// p={1.5}:
// This could be a styling prop, likely from a styling library such as Chakra UI.
// The p prop may stand for padding, and 1.5 might be the value of the padding applied to the Input component.

// onChange={(e) => setName(e.target.value)}: This is an event handler attached to the onChange event of the input field. When the user types something into the input field, the onChange event is triggered. The event handler function takes an event object e as a parameter. e.target refers to the DOM element that triggered the event (in this case, the input field), and e.target.value retrieves the current value of the input field.

// The value obtained (e.target.value) is then passed to the setName function. 

