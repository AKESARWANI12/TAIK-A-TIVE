
import {createContext,useContext,useEffect,useState} from "react"

import {useNavigate} from "react-router-dom";
const ChatContext=createContext();

const ChatProvider=({children})=>
{
    const[user,setUser]=useState();
    const[selectedChat,setSelectedChat]=useState(); // isko bana rahe hai ham isliye jab wah a select kare chat ko search karke..to jo data ho us bande ka wo transfer ho sake ek jagah se dusri jagaah
    const[chats,setChats]=useState([]);   //we can populate all of our current chat in this chats state
    const[notification,setNotification]=useState([]);
    let navigate=useNavigate();

   useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if(!userInfo){
        navigate("/")
    }
   },[navigate]);
//   if (!userInfo) { navigate("/"); }: Checks whether userInfo is falsy (e.g., null, undefined, or an empty object). If userInfo is falsy, it means that there is no user information in the localStorage. In this case, the code uses the navigate function to redirect the user to the root URL ("/"). 
   
    return (
        <ChatContext.Provider  value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState=()=>{
    return useContext(ChatContext);
};
export default ChatProvider;