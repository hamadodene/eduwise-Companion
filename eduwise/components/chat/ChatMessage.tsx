'use client'

import React from "react"

const ChatMessage = ({ text, isBot }) => {
    const alignmentClass = isBot ? 'justify-start mr-auto' : 'justify-end  ml-auto'
    const bgColorClass = isBot ? 'bg-blue' : 'bg-green'
    const marginLeft = isBot ? 'mr-auto' : 'ml-auto'
    const messageBgColor = isBot ? 'bg-[#BFE4EE] dark:bg-transparent' : 'bg-[#5DF0D0] dark:bg-gray-800'

    return (
        <div className={`flex flex-col mb-4 ${alignmentClass}`}>
            <div className={`w-10 h-10 rounded-full ${marginLeft}`}>
                <img
                    src={`${isBot ? '/avatars/chatbot.png' : '/avatars/01.png'}`}
                    alt={`Image ${isBot ? 'Bot' : 'User'}`}
                    className='rounded-lg'
                />
            </div>
            <div className={`${bgColorClass}-500 rounded-lg border mt-2 p-2 max-w-4xl flex-grow ${messageBgColor}`}>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default ChatMessage