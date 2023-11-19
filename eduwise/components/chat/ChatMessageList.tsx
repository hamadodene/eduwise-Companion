'use client'

import React from "react"
import ChatMessage from "./ChatMessage"
import { useLocalChatStore } from "@/lib/chat/local-chat-state"
import useStore from "@/lib/chat/useStore"
import { shallow } from "zustand/shallow"
import { Smile } from "lucide-react"

const MessageList = (props: { chatId: string }) => {
    const messagesEndRef = React.useRef<HTMLDivElement | null>(null)

    // https://docs.pmnd.rs/zustand/integrations/persisting-store-data#usage-in-next.js
    // TODO
    const messages = useLocalChatStore(state => {
        const chat = state.chats.find(chat => chat.id === props.chatId)
        return chat ? chat.messages : []
    }, shallow)

    /*const messages = useStore(useLocalChatStore, (state) => {
         const chat = state.chats.find(chat => chat.id === props.chatId)
         return chat ? chat.messages : []
     })*/


    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    return (
        <>
            {messages && messages.length > 0 ? (
                messages
                    .filter((message) => message.role !== 'system')
                    .map((message, index) => (
                        <ChatMessage
                            key={index}
                            text={message.text.split(' relatedDocuments')[0]}
                            model={message.model}
                            isBot={message.role === 'assistant'}
                        />
                    ))
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <img src="/cep_logo_1.png" alt="" className="" />
                    <div className="mt-4 text-center">
                        <h1 className="text-2xl">Welcome to Comunity education platform for Africa</h1>
                        <h2 className="mr-48 ml-48 mt-2">I am here to help you with any questions and doubts you have.
                            I will guide you in your learning process.
                            Never give up, and you will achieve all your goals</h2>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef}></div>
        </>
    )
}

export default MessageList