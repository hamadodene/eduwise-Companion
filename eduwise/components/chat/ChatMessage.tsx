'use client'

import React from "react"

const ChatMessage = ({ text, isBot }) => {
    const alignmentClass = isBot ? 'justify-start mr-auto' : 'justify-end  ml-auto'
    const marginLeft = isBot ? 'mr-auto' : 'ml-auto'
    const messageBgColor = isBot ? 'bg-[#e9ecef]' : 'bg-[#f8f9fa]'

    return (
        <div className={`flex flex-col justify-center mb-4 ${alignmentClass}`}>
            <div className={`w-10 h-10 rounded-full ${marginLeft}`}>
                <img
                    src={`${isBot ? '/avatars/chatbot.png' : '/avatars/01.png'}`}
                    alt={`Image ${isBot ? 'Bot' : 'User'}`}
                    className='rounded-lg'
                />
            </div>
            <div className={`rounded-lg border mt-2 p-2 flex-grow ${messageBgColor}`}>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default ChatMessage