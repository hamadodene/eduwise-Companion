'use client'

import React from "react"
import ChatMessage from "./ChatMessage"
import { useLocalChatStore } from "@/lib/chat/local-chat-state"
import useStore from "@/lib/chat/useStore"
import { shallow } from "zustand/shallow"

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
            {messages &&
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
            }
            <div ref={messagesEndRef}></div>
        </>
    )
}

export default MessageList