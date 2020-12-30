import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './App.css';
import Chat from './Chat';
import LoginForm from './LoginForm';

function App() {

  const [room, setRoom] = useState();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [login, setLogin] = useState("");

  return (

      <div className="app">

        <div className="app__body">

            {login === "" && (
              <LoginForm className="app__login" setLogin={setLogin}/>      
            )}
            
            {login !== "" && (
              <Sidebar setIsChatOpen={setIsChatOpen} setRoom={setRoom} />
            )}      

            {login !== "" && isChatOpen && (<Chat key={room} nameRoom={room} login={login} />)}


        </div>      
      </div>
  );

}

export default App;
