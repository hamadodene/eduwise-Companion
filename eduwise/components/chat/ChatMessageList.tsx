'use client'
import React, { useEffect, useState } from "react"
import { useChatContext } from "@/components/context/ChatHistoryContext"
import ChatMessage from "./ChatMessage"
import { Message } from "@/lib/store-chats"

const MessageList = () => {
    const { activeChat } = useChatContext()
    const [messages, setMessages] = useState<Partial<Message>[]>([])

    useEffect(() => {
        if (activeChat) {
            const messages = activeChat.messages
            setMessages(messages)
        }
    }, [activeChat, messages])


    return (
        <>
            {messages &&
                messages
                    .filter((message) => message.role !== 'system')
                    .map((message, index) => (
                        <ChatMessage
                            key={index}
                            text={message.text}
                            isBot={message.role === 'assistant'}
                        />
                    ))
            }

        </>
    )
}

export default MessageList