'use client'

import React, { useCallback, useEffect, useState } from 'react'
import MessageList from './ChatMessageList'
import { ScrollArea } from '../ui/scroll-area'
import NavBar from './ChatNavbar'
import ChatFooter from './ChatFooter'
import useChatStore, { Chat as ChatModel, Message } from '@/lib/chat/store-chats'
import { useLocalChatStore } from '@/lib/chat/local-chat-state'
import { useSession } from 'next-auth/react'
import { useSettingsStore } from '@/lib/settings/store-settings'
import { streamAssistantMessage, updateAutoConversationTitle } from '@/lib/openai/ai'
import { useLocalSettingsStore } from '@/lib/settings/local-settings-store'


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


const Chat = (props: { chatId: string }) => {
    const { data: session } = useSession({
        required: true
    })
    const [userMessage, setUserMessage] = useState('')
    const { setMessages, chats, appendMessage } = useLocalChatStore.getState()


    const { apiKey, apiOrganizationId, gptModel, setApiKey, setApiOrganizationId, setGtpModel } = useLocalSettingsStore.getState()
    const [chatTitle, setChatTile] = useState("New conversation")
    const [numMessage, setNumMessages] = useState<number>()

    const handleLoadChatMessages = useCallback(async () => {
        if (session) {
            // check if chats is on state side
            const chat = chats.find(chat => chat.id === props.chatId)
            if (chat) {
                const messages = chat ? chat.messages : []
                setChatTile(chat.userTitle || chat.autoTitle)
                setNumMessages(messages.length)
                // maybe not save locally
                if (!messages) {
                    // try get message from db
                    const result = await useChatStore.getMessagesForChat(props.chatId)
                    // save message locally
                    setMessages(props.chatId, result)
                }
            }
        }
    }, [session, chats])


    useEffect(() => {
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
    }, [session])

    const _findConversation = (conversationId: string) =>
        conversationId ? useLocalChatStore.getState().chats.find(c => c.id === conversationId) ?? null : null


    const handleSendMessage = async () => {
        //const chat = await useChatStore.getChatInfo(chatId)
        const chat = _findConversation(props.chatId)

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

            const userMessageStored = await useChatStore.addMessageToChat(props.chatId, userMsg.text, userMsg.sender, userMsg.role, session.user.id)
            if (userMessageStored.id) {
                appendMessage(props.chatId, userMessageStored)
                setUserMessage('')
                await runAssistantUpdatingState(chat, openaiCredential.model, session.user.id, [...chat.messages, userMessageStored], openaiCredential)
            }
        }
    }


    return (
        <div className="flex flex-col h-screen bg-[#F8F8F8]">
            <NavBar chatTitle={chatTitle} numMessage={numMessage} />
            <ScrollArea className='flex-1'>
                <div className="flex flex-col p-4 w-full">
                    <MessageList chatId={props.chatId} />
                </div>
            </ScrollArea>
            <div className="sticky bottom-0 mb-0">
                <ChatFooter userMessage={userMessage} setUserMessage={setUserMessage} handleSendMessage={handleSendMessage} />
            </div>
        </div>
    )
}

export default Chat
