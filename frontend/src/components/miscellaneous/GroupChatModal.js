import React from 'react'
import { Modal, ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,Button,useDisclosure,FormControl,Input, useToast,Box,} from "@chakra-ui/react";
  import axios from "axios";
  import { useState } from "react";
  import UserListItem from '../UserAvatar/UserListItem';
  import { ChatState } from "../../Context/ChatProvider";
 import UserBadgeItem from '../UserAvatar/UserBadgeItem';
  const GroupChatModal = ({children   }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

  const { user, chats, setChats } = ChatState();
  const handleSubmit = async () => {
    // Check if groupChatName or selectedUsers is missing
    if (!groupChatName || !selectedUsers) {
      // Display a warning toast if any field is missing
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      // Exit the function to prevent further execution
      return;
    }
  
    try {
      // Prepare headers for the API request, including the user's token
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      // Make a POST request to create a new group chat
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
  
      // Update the state with the new group chat
      setChats([data, ...chats]);
  
      // Close the modal or perform any UI-related actions
      onClose();
  
      // Display a success toast indicating that the group chat was created
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      // Display an error toast if the group chat creation fails
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
};
  /////////////****************************handle delete fxna lity from grp chat modal */
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  ///////*******************add karne ke fxnality */
  const handleGroup = (userToAdd) => {
    // Check if the userToAdd is already included in the selectedUsers array
    if (selectedUsers.includes(userToAdd)) {
      // If userToAdd is already in the group, show a warning toast
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      // Exit the function to prevent adding the same user multiple times
      return;
    }
  
    // If userToAdd is not in the group, add it to the selectedUsers array
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  
  

  //////////////*************handle search fxnality pe work */
  const handleSearch = async (query) => {
    setSearch(query); // Set the search query in the component's state
    if (!query) {
      return; // If the query is empty, exit the function
    }
  
    try {
      setLoading(true); // Set loading state to true, indicating that the search is in progress
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include user token in the request headers
        },
      };
      // Make a GET request to the server's "/api/user" endpoint with the search query
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log("tumne to mujhe paraya kar dia",data); // Log the search results to the console
      setLoading(false); // Set loading state to false, indicating that the search is complete
      setSearchResult(data); // Set the search results in the component's state
    } catch (error) {
      // If an error occurs during the search request, display an error toast notification
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  

  return (
    <>
    <span onClick={onOpen}>{children}</span>
   
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
        >
          Create Group Chat
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" alignItems="center">
          <FormControl>
            <Input
              placeholder="Chat Name"
              mb={3}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add Users eg: John, Piyush, Jane"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          <Box w="100%" display="flex" flexWrap="wrap">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
         {loading ? (
  // If loading is true, display a loading message or component
  <div>Loading...</div>
) : (
  // If loading is false, render search results
  searchResult
    ?.slice(0, 4) // Take only the first 4 results (if available)
    .map((user) => (
      // Map through the search results and render a component for each user
      <UserListItem
        key={user._id} // Provide a unique key for React optimization
        user={user} // Pass the user object as a prop to the UserListItem component
        handleFunction={() => handleGroup(user)} // Pass a function as a prop to handle a specific action for each user
      />
    ))
)}

        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit} colorScheme="blue">
            Create Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default GroupChatModal
