'use client'

import React from 'react'
import MessageList from './ChatMessageList'

const Chat = () => {
    return (
        <div className="flex flex-col p-4 w-full">
            <MessageList/>
        </div>
    )
}

export default Chat
