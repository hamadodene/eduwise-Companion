'use client'
import Chat from "@/components/chat/Chat"
import ChatFooter from "@/components/chat/ChatFooter"
import NavBar from "@/components/chat/ChatNavbar"
import { Layout } from "@/components/layouts/layout"
import { ScrollArea } from "@/components/ui/scroll-area"
import React, { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import useChatStore, { Chat as ChatModel, Message } from "@/lib/chat/store-chats"
import { usePathname } from 'next/navigation'
import { streamAssistantMessage } from "@/lib/openai/ai"
import { updateAutoConversationTitle } from "@/lib/openai/ai"
import { useLocalChatStore } from "@/lib/chat/local-chat-state"
import { useLocalSettingsStore } from "@/lib/settings/local-settings-store"
import { useSettingsStore } from "@/lib/settings/store-settings"

const runAssistantUpdatingState = async (chat: ChatModel, assistantModelId: string, userId: string, history: Message[], openaiCredential) => {
    const chatId = chat.id
    const { appendMessage, setMessages } = useLocalChatStore.getState()

    const systemMessage = history ? history.find((message) => message.role === "system") : null
    
    if (!systemMessage) {
        const newSystemMessage: Partial<Message> = {
            role: "system",
            sender: '',
            text: chat.systemPrompt
        }

        const systemMessageStored = await useChatStore.addMessageToChat(chatId, newSystemMessage.text, newSystemMessage.sender, newSystemMessage.role, userId)
        history.unshift(systemMessageStored)

        setMessages(chatId, history)
    }

    const newAssistantMessage: Partial<Message> = {
        role: "assistant",
        text: "...",
        sender: "Bot",
        model: assistantModelId,
    }

    const newAssistantMessageStored = await useChatStore.addMessageToChat(chatId, newAssistantMessage.text, newAssistantMessage.sender, newAssistantMessage.role, userId)

    newAssistantMessageStored.typing = true
    appendMessage(chatId, newAssistantMessageStored)

    await streamAssistantMessage(chatId, newAssistantMessageStored.id, history, openaiCredential, userId)
    await updateAutoConversationTitle(chatId, userId, openaiCredential)
}


export default function page() {
    const { data: session } = useSession()
    const chatPathName = usePathname()
    const [userMessage, setUserMessage] = useState('')
    const { setMessages, chats, appendMessage } = useLocalChatStore.getState()
    const parts = chatPathName.split('/')
    const chatId = parts[parts.length - 1]
    const { apiKey, apiOrganizationId, gptModel, setApiKey, setApiOrganizationId, setGtpModel} = useLocalSettingsStore.getState()

    const handleLoadChatMessages = useCallback(async () => {
        if (session) {
            const chat = chats.find(chat => chat.id === chatId)
            const messages = chat ? chat.messages : []

            // maybe not save locally
            if (!messages) {
                // try get message from db
                const result = await useChatStore.getMessagesForChat(chatPathName)
                // save message locally
                setMessages(chatId, result)
            }
        }
    }, [session])


    useEffect(() => {
        const loadChatData = async () => {
            await handleLoadChatMessages()
        }
        const loadOpenAiCredential = async () => {
            if(!apiKey || !apiOrganizationId || !gptModel) {
                // load from db
                const result = await useSettingsStore.loadOpenAIConfig(session.user.id)
                setApiKey(result.apiKey)
                setApiOrganizationId(result.apiOrganizationId)
                setGtpModel(result.model)
            }
        }
        loadChatData()
        loadOpenAiCredential()
    }, [session])

    const _findConversation = (conversationId: string) =>
        conversationId ? useLocalChatStore.getState().chats.find(c => c.id === conversationId) ?? null : null


    const handleSendMessage = async () => {
        const parts = chatPathName.split('/')
        const chatId = parts[parts.length - 1]

        //const chat = await useChatStore.getChatInfo(chatId)
        const chat = _findConversation(chatId)

        const openaiCredential = {
            apiKey: apiKey,
            apiOrganizationId: apiOrganizationId,
            model: gptModel
        }

        if (chat && openaiCredential.model) {
            const userMsg: Partial<Message> = {
                role: "user",
                text: userMessage,
                sender: 'You'
            }

            const userMessageStored = await useChatStore.addMessageToChat(chatId, userMsg.text, userMsg.sender, userMsg.role, session.user.id)
            if (userMessageStored.id) {
                appendMessage(chatId, userMessageStored)
                setUserMessage('')
                await runAssistantUpdatingState(chat, openaiCredential.model, session.user.id, [...chat.messages, userMessageStored], openaiCredential)
            }
        }
    }

    return (
        <Layout>
            <div className="flex flex-col h-screen">
                <NavBar />
                <ScrollArea className="flex-grow">
                    <Chat chatId={chatId} />
                </ScrollArea>
                <ChatFooter userMessage={userMessage} setUserMessage={setUserMessage} handleSendMessage={handleSendMessage} />
            </div>
        </Layout>
    )
}