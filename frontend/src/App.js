import React from 'react'
import  {Route,Routes}  from "react-router-dom";
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';

import "./App.css";
const App = () => {
  return (
    
   
   <div className="App">
    <Routes>
    <Route exact path="/" element={<Homepage/>}></Route>
    <Route exact path="/chats" element={<ChatPage/>}></Route>
    </Routes>
    </div>
  
 
  )
}

export default App

