// Certainly! The getSender function takes two parameters: loggedUser and users. The purpose of this function is to determine the sender's name in a chat scenario where there are two users involved, and it's not a group chat. The logic is designed to return the name of the user who is not the logged-in user.
export const getSender = (loggedUser, users) => {
    // Check if the ID of the first user in the array is the same as the logged-in user's ID  ? represents this users[0] is not null or undefined
    if (users[0]?._id === loggedUser?._id) {
        // If true, return the name of the second user (users[1])
        return users[1].name;
    } else {
        // If false, return the name of the first user (users[0])
        return users[0].name;
    }
};


// Function to get the sender's information (user object) in a conversation
export const getSenderFull = (loggedUser, users) => {
    // Check if the ID of the first user in the array matches the ID of the logged-in user
    if (users[0]._id === loggedUser._id) {
      // If true, the first user is the sender, so return the second user in the array
      return users[1];
    } else {
      // If false, the second user is the sender, so return the first user in the array
      return users[0];
    }
  };
  

  // Determine the left margin for the message based on sender conditions
export const isSameSenderMargin = (messages, currentMessage, currentIndex, userId) => {
  // Check if the next message has the same sender and the current message is not from the current user
  if (
    currentIndex < messages.length - 1 &&
    messages[currentIndex + 1].sender._id === currentMessage.sender._id &&
    currentMessage.sender._id !== userId
  ) {
    return 33; // Return a specific margin if the next message has the same sender
  } else if (
    // Check if the next message has a different sender, the current message is not from the current user
    // or if it's the last message and the current message is not from the current user
    (currentIndex < messages.length - 1 &&
      messages[currentIndex + 1].sender._id !== currentMessage.sender._id &&
      currentMessage.sender._id !== userId) ||
    (currentIndex === messages.length - 1 && currentMessage.sender._id !== userId)
  ) {
    return 0; // Return 0 margin if the conditions are met for different senders or the last message
  } else {
    return "auto"; // Return "auto" if none of the specific conditions are met
  }
};

  

  //(this will take all of themessages,current messages,index of the current messages,and the loggedin userid)
  export const isSameSender = (messages, m, i, userId) => {
    return (
      //if  i(it) is less than the length of all the messages && (if the next message is not equal to the current[loggedin] sender) ||  && current message is not from the logged user...so basically the opposite user will not be logged in user.then only we are going to display the profile...loggeduserke prfile pivutr ham nhi dikhayege 
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };
  
  // we are taking all of the messages array,current index and the userID(we are checking is this the last message of the opp user or not that he has sent...and the id of the logged user array is not equal to the id of the current user array)
  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };
  
// Check if the sender of the current message is the same as the sender of the previous message
export const isSameUser = (messages, currentMessage, currentIndex) => {
  // Ensure that there is a previous message (currentIndex > 0)
  // and the sender of the previous message is the same as the sender of the current message
  return currentIndex > 0 && messages[currentIndex - 1].sender._id === currentMessage.sender._id;
};
