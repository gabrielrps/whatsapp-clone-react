import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './App.css';
import Chat from './Chat';

function App() {

  const [room, setRoom] = useState();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (

      <div className="app">

        <div className="app__body">      
          
          <Sidebar setIsChatOpen={setIsChatOpen} setRoom={setRoom} />

          {isChatOpen && (<Chat key={room} nameRoom={room} />)}
          
        </div>      
      </div>
  );

}

export default App;
