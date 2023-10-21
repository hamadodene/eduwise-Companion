'use client'
import Chat from "@/components/chat/Chat"
import ChatFooter from "@/components/chat/ChatFooter"
import NavBar from "@/components/chat/ChatNavbar"
import { Layout } from "@/components/layouts/layout"
import { ScrollArea } from "@/components/ui/scroll-area"
import React, { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import useChatStore, { Message } from "@/lib/store-chats"
import { usePathname } from 'next/navigation'
import { useChatContext } from "@/components/context/ChatHistoryContext"
import { Course, useCourseContext } from "@/components/context/CourseContext"
import { streamAssistantMessage } from "@/lib/openai/ai"
import { updateAutoConversationTitle } from "@/lib/openai/ai"
import { useSettingsContext } from "@/components/context/SettingsContext"

const runAssistantUpdatingState = async (chatId: string, assistantModelId: string, userId: string, activeChat, courseList, addMessage, openaiCredential, updateMessage) => {
    const history = activeChat.messages
    let chatCourse: Course
    courseList.forEach((course) => {
        if (course.id === activeChat.courseId) {
            chatCourse = course
            return
        }
    })

    const systemMessage = history ? history.find((message) => message.role === "system") : null

    if (!systemMessage) {
        const newSystemMessage: Partial<Message> = {
            role: "system",
            sender: '',
            text: chatCourse.systemPrompt,
            createdAt: Date.now(),
        }

        await useChatStore.addMessageToChat(chatId, newSystemMessage.text, newSystemMessage.sender, newSystemMessage.role, userId)

        addMessage(newSystemMessage)
    }

    const newAssistantMessage: Partial<Message> = {
        role: "assistant",
        text: "...",
        sender: "Bot",
        createdAt: Date.now(),
        model: assistantModelId,
    };

    const newAssistantMessageStored = await useChatStore.addMessageToChat(chatId, newAssistantMessage.text, newAssistantMessage.sender, newAssistantMessage.role, userId)

    newAssistantMessageStored.typing = true


    addMessage(newAssistantMessageStored)

    await streamAssistantMessage(chatId, newAssistantMessageStored.id, activeChat.messages, openaiCredential, updateMessage, userId)
    await updateAutoConversationTitle(chatId, userId, activeChat, openaiCredential);
}


export default function page() {
    const { data: session } = useSession()
    const chatPathName = usePathname()
    const { addMessage, chatList, setCurrentPage, activeChat, updateMessage } = useChatContext()
    const { openaiCredential } = useSettingsContext()
    const [userMessage, setUserMessage] = useState('')
    const { courseList } = useCourseContext()


    const handleLoadChatMessages = useCallback(async () => {
        if (session) {
            const result = await useChatStore.getMessagesForChat(chatPathName)
            result.forEach(res => {
                addMessage(res)
            })
        }
    }, [session])


    useEffect(() => {
        const loadChatData = async () => {
            await handleLoadChatMessages()
            const parts = chatPathName.split('/')
            const chatId = parts[parts.length - 1]
            setCurrentPage(chatId)
        }

        loadChatData();
    }, [session, chatList])

    const handleSendMessage = async () => {
        const parts = chatPathName.split('/')
        const chatId = parts[parts.length - 1]

        const chat = await useChatStore.getChatInfo(chatId)

        if (chat && openaiCredential.model) {
            const userMsg: Partial<Message> = {
                role: "user",
                text: userMessage,
                sender: 'You'
            }
            const userMessageStored = await useChatStore.addMessageToChat(chatId, userMsg.text, userMsg.sender, userMsg.role, session.user.id)
            if (userMessageStored.id) {
                addMessage(userMessageStored)
                await runAssistantUpdatingState(chat.id, openaiCredential.model, session.user.id, activeChat, courseList, addMessage, openaiCredential, updateMessage)
            }

        }
        
        setUserMessage('')
    }

    return (
        <Layout>
            <div className="flex flex-col h-screen">
                <NavBar />
                <ScrollArea className="flex-grow">
                    <Chat />
                </ScrollArea>
                <ChatFooter userMessage={userMessage} setUserMessage={setUserMessage} handleSendMessage={handleSendMessage} />
            </div>
        </Layout>
    )
}