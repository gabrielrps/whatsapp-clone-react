import React, {useState, useRef, useEffect} from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import {SearchOutlined, AttachFile, MoreVert,} from '@material-ui/icons/';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios';
import SockJsClient from 'react-stomp';

import "./Chat.css";

const SOCKET_URL = 'http://localhost:8080/ws-chat/';

function Chat(props) {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const clientRef = useRef();
    const chatLog = useRef(null);

    const sendMessage = (e) => {
        e.preventDefault();

        clientRef.current.sendMessage('/app/send', JSON.stringify({
            message: input,
            name: props.login,
            timestamp: new Date().toDateString(),
            received: false,
        }));  
        
      
        axios.post("/api/messages/new", {
            message: input,
            name: props.login,
            timestamp: new Date().toDateString(),
            received: false,
        });
      
        setInput("");
    }
	

    useEffect(() => {
        axios.get("/api/messages/sync")
          .then(response => {
            setMessages(response.data);
          });
    },[]);  

    useEffect(() => {
        chatLog.current.scrollTop = chatLog.current.scrollHeight;
    },[messages]);

    function onMessage(msg){
        setMessages([...messages, msg]);
    }

    function handleInput(e){
        e.preventDefault();
        const value = e.target.value;
        setInput(value);
    }

    return (
        <div className="chat">

            <SockJsClient 
                url={SOCKET_URL} 
                topics={['/topic/teste']}
                onMessage={(msg) => onMessage(msg)}
                ref={clientRef} 
            />

           <div className="chat__header">
                <Avatar />

                <div className="chat__headerInfo">
                    <h3>Room chat</h3>
                    <p>Last seen at...</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                       <AttachFile /> 
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>                
                </div>
           </div>

           <div className="chat__body" ref={chatLog}>
                {messages.map((message, index) => (
                    <p key={index} className={`chat__message ${message.name === props.login && 'chat__receiver'}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">{message.timestamp}</span>
                    </p>
                ))}  
           </div>

           <div className="chat__footer">
                <InsertEmoticonIcon />
                
                <form>
                    <input value={input} onChange={handleInput} placeholder="Type a message" type="text" />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>  

                <MicIcon />  
           </div>

        </div>
    );
}

export default Chat;
