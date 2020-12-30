import React, {useState, useRef, useEffect} from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import {SearchOutlined, AttachFile, MoreVert,} from '@material-ui/icons/';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import axios from './axios';
import SockJsClient from 'react-stomp';
import Dropzone from 'react-dropzone';
import MicRecorder from 'mic-recorder-to-mp3';

import "./Chat.css";

const SOCKET_URL = 'http://localhost:8080/ws-chat/';

function Chat(props) {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const clientRef = useRef();
    const chatLog = useRef(null);
    
    const [Mp3Recorder, setMp3Recorder] = useState({});

    const sendMessage = (e) => {
        e.preventDefault();

        clientRef.current.sendMessage('/app/send', JSON.stringify({
            message: input,
            name: props.login,
            timestamp: new Date().toDateString(),
            received: false,
            upload: false
        }));  
        
      
        axios.post("/api/messages/new", {
            message: input,
            name: props.login,
            timestamp: new Date().toDateString(),
            received: false,
            upload: false
        });
      
        setInput("");
    }
	

    useEffect(() => {
        axios.get("/api/messages/sync")
          .then(response => {
            setMessages(response.data);
          });

          setMp3Recorder(new MicRecorder({ bitRate: 128 }));
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

    async function onDrop(acceptedFiles) {
        var file = "";

        acceptedFiles.forEach(fileRet => {
            file = fileRet;
        });

        const formData = new FormData();
        formData.append("file", file);
        
        const response = await axios.post(`/api/upload/${props.login}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        setMessages([...messages, response.data]);
        
    }

    function handleImage(file){
        if (file){
            return "data:image/png;base64,"+file.data;       
        }
    }

    function handleSound(file){
        if (file){
            return "data:audio/mp3;base64,"+file.data;       
        }
    }

    function start(){
        Mp3Recorder.start().then(() => {
            setIsRecording(true);
        }).catch((e) => console.error(e));
    }

    async function stop(){
        await Mp3Recorder.stop().getMp3().then(([buffer, blob]) => {
            

            const formData = new FormData();
            formData.append("file", blob);
            
            axios.post(`/api/uploadSound/${props.login}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(response => {
                setIsRecording(false);
                setMessages([...messages, response.data]);
            });

        }).catch((e) => console.log(e));
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
                       
                       <Dropzone className="chat__headerRight__dropzone" accept="image/*" onDrop={(acceptedFiles) => onDrop(acceptedFiles)}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <AttachFile />
                                    </div>
                                </section>
                            )}
                        </Dropzone> 
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
                        {!message.upload && !message.sound && (message.message)}
                        {message.upload && !message.sound && (
                            <span><img src={handleImage(message.file)} className="img__message" alt="" /></span>  
                        )}
                        {!message.upload && message.sound && (
                            <span><audio src={handleSound(message.file)} controls="controls" /></span>  
                        )}
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
                
                <button onClick={start} disabled={isRecording}>
                    Record
                </button>

                <button onClick={stop} disabled={!isRecording}>
                    Stop
                </button>

                
              
           </div>

        </div>
    );
}

export default Chat;
