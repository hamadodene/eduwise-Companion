'use client'

import React, { useCallback, useEffect, useState } from 'react'
import MessageList from './ChatMessageList'
import { ScrollArea } from '../ui/scroll-area'
import NavBar from './ChatNavbar'
import ChatFooter from './ChatFooter'
import useChatStore, { Chat, Chat as ChatModel, Message } from '@/lib/chat/store-chats'
import { useLocalChatStore } from '@/lib/chat/local-chat-state'
import { useSession } from 'next-auth/react'
import { useSettingsStore } from '@/lib/settings/store-settings'
import { streamAssistantMessage, updateAutoConversationTitle } from '@/lib/openai/ai'
import { useLocalSettingsStore } from '@/lib/settings/local-settings-store'
import { usePathname } from 'next/navigation'

import {
    WEBSOCKET_URL,
    APP_NAME,
    TENANT,
    CONSUMER,
    PRODUCER,
    CREDENTIALS
} from '@/lib/config'
import useWebSockets, { ConnectionType, WsMessage } from '@/hooks/useLangStreamWebSocket'
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"

const FormSchema = z.object({
    chat_message: z
        .string()
        .min(1, {
            message: "You must write at least one message before sending.",
        })
})

function generateUniqueId(): string {
    const timestamp = new Date().getTime().toString(16);
    const randomPart = Math.random().toString(16).substr(2, 8);
    return `${timestamp}${randomPart}`;
}

const runAssistantUpdatingState = async (chat: ChatModel, assistantModelId: string, userId: string, history: Message[],
    openaiCredential) => {
    const chatId = chat.id
    const { appendMessage, setMessages, editMessage } = useLocalChatStore.getState()

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


const Chat = () => {
    const { data: session } = useSession({
        required: true
    })
    const { setMessages, chats, appendMessage, editMessage } = useLocalChatStore.getState()
    const [courseId, setCourseId] = useState("")
    const [chat, setChat] = useState<Chat>()
    const { apiKey, apiOrganizationId, gptModel, setApiKey, setApiOrganizationId, setGtpModel } = useLocalSettingsStore.getState()
    const chatPathName = usePathname()
    const parts = chatPathName.split('/')
    const chatId = parts[parts.length - 1]
    const { connect, isConnected, messages, sendMessage, waitingForMessage } = useWebSockets()
    const [relatedDocuments, setRelatedDocuments] = useState<WsMessage>()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            chat_message: ''
        }
    })

    const connectWs = () => {
        const sessionId = session.user.id
        connect({
            consumer: {
                baseUrl: WEBSOCKET_URL,
                appName: APP_NAME,
                tenant: TENANT,
                gateway: CONSUMER,
                credentials: CREDENTIALS,
                type: ConnectionType.Consumer,
                sessionId
            },
            producer: {
                baseUrl: WEBSOCKET_URL,
                appName: APP_NAME,
                tenant: TENANT,
                gateway: PRODUCER,
                credentials: CREDENTIALS,
                type: ConnectionType.Producer,
                sessionId
            },
        })
    }

    const handleLoadChatMessages = useCallback(async () => {
        if (session) {
            // check if chats is on state side
            const chat = chats.find(chat => chat.id === chatId)
            setCourseId(chat.courseId)
            setChat(chat)
            if (chat) {
                const messages = chat ? chat.messages : []
                // maybe not save locally
                if (!messages) {
                    // try get message from db
                    const result = await useChatStore.getMessagesForChat(chatId)
                    // save message locally
                    setMessages(chatId, result)
                }
            }
        }
    }, [session, chats, isConnected])


    useEffect(() => {
        if (!isConnected && session) {
            console.log("try connection")
            connectWs()
        }
        const loadChatData = async () => {
            await handleLoadChatMessages()
        }
        const loadOpenAiCredential = async () => {
            if (!apiKey || !apiOrganizationId || !gptModel) {
                if (session) {
                    // load from db
                    const result = await useSettingsStore.loadOpenAIConfig(session.user.id)
                    setApiKey(result.apiKey)
                    setApiOrganizationId(result.apiOrganizationId)
                    setGtpModel(result.model)
                }
            }
        }
        loadChatData()
        loadOpenAiCredential()
    }, [session, isConnected])

    useEffect(() => {
        const checkMessage = () => {
            if (!waitingForMessage && messages.length > 0) {
                setRelatedDocuments(messages.pop())
            }
        }
        checkMessage()
    }, [waitingForMessage, messages])

    const _findConversation = (conversationId: string) =>
        conversationId ? useLocalChatStore.getState().chats.find(c => c.id === conversationId) ?? null : null

    function waitForMessage(): Promise<void> {
        return new Promise<void>((resolve) => {
            const checkMessage = () => {
                if (!waitingForMessage || relatedDocuments) {
                    resolve()
                } else {
                    setTimeout(checkMessage, 1000)
                }
            };
            checkMessage()
        });
    }


    const handleSendMessage = async (data: z.infer<typeof FormSchema>) => {
        //const chat = await useChatStore.getChatInfo(chatId)
        const chat = _findConversation(chatId)
        const tmpId = generateUniqueId()
        const userMsg: Message = {
            id: tmpId,
            role: "user",
            text: data.chat_message,
            sender: 'You',
            userId: session.user.id,
            createdAt: Date.now(),
        }
        appendMessage(chatId, userMsg)

        const openaiCredential = {
            apiKey: apiKey,
            apiOrganizationId: apiOrganizationId,
            model: gptModel
        }
        //let relatedDocuments: WsMessage
        // try get related documents from langStream
        !isConnected ? connectWs() : ''
        if (isConnected) {
            sendMessage(chat.courseName + ":" + data.chat_message)
            await waitForMessage()
        } else {
            console.log('LangStream is not connected, continue without related documents')
        }
        if (chat && openaiCredential.model) {
            const userMessageStored = await useChatStore.addMessageToChat(chatId, userMsg.text, userMsg.sender, userMsg.role, session.user.id)
            editMessage(chatId, tmpId, userMessageStored, false)
            let text = ""
            if (!relatedDocuments) {
                text = userMessageStored.text
            } else {
                text = userMessageStored.text + "\n relatedDocuments=" + relatedDocuments?.value
            }
            if (userMessageStored.id) {
                const userMessageStoredWithReleatedDocuments = {
                    id: userMessageStored.id,
                    text: text,
                    sender: userMessageStored.sender,
                    model: userMessageStored.model,
                    userId: userMessageStored.userId,
                    updateAt: userMessageStored.updateAt,
                    createdAt: userMessageStored.createdAt,
                    role: userMessageStored.role
                }
                form.reset()
                await runAssistantUpdatingState(
                    chat, openaiCredential.model,
                    session.user.id,
                    [...chat.messages, userMessageStoredWithReleatedDocuments],
                    openaiCredential)
            }
        }
    }


    return (
        <div className="flex flex-col h-screen bg-[#F8F8F8]">
            <NavBar />
            <ScrollArea className='flex-1'>
                <div className="flex flex-col p-4 w-full">
                    <MessageList chatId={chatId} />
                </div>
            </ScrollArea>
            <div className="sticky bottom-0 mb-0">
                <ChatFooter
                    chatId={chatId}
                    courseId={courseId}
                    form={form}
                    openaiCredential={{
                        apiKey: apiKey,
                        apiOrganizationId: apiOrganizationId,
                        model: gptModel
                    }}
                    handleSendMessage={handleSendMessage} />
            </div>
        </div>
    )
}

export default Chat
