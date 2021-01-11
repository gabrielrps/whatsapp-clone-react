import { Avatar } from '@material-ui/core';
import React from 'react';
import './SidebarChat.css';

function SidebarChat(props) {

    function handleClickRoom(){
        props.setIsChatOpen(true);
        props.setRoom(props.nomeRoom);
    }

    return (
        <div className="sidebarChat" onClick={handleClickRoom}>
            <Avatar src="" />

            <div className="sidebarChat__info">
                <h2>Romm name</h2>
            </div>
            
        </div>
    )
}

export default SidebarChat
