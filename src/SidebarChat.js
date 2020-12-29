import { Avatar } from '@material-ui/core';
import React from 'react';
import './SidebarChat.css';

function SidebarChat(props) {

    function handleClickRoom(){
        props.setIsChatOpen(true);
        props.setRoom(props.nomeRoom);
    }

    return (
        <div className="sidebarChat">
            <Avatar src="" />

            <div className="sidebarChat__info" onClick={handleClickRoom}>
                <h2>Romm name</h2>
                <p>This is the last message</p>
            </div>
            
        </div>
    )
}

export default SidebarChat
