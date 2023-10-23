'use client'

import React from 'react'
import MessageList from './ChatMessageList'

const Chat = (props: {chatId: string}) => {
    return (
        <div className="flex flex-col p-4 w-full">
            <MessageList chatId={props.chatId}/>
        </div>
    )
}

export default Chat
