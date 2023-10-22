'use client'

import React, { useCallback, useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CircleIcon, StarIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useSidebar } from "../context/sidebarContext"
import { Chat } from "@/lib/chat/store-chats"
import { useLocalChatStore } from "@/lib/chat/local-chat-state"
import { getChats } from "@/lib/courses"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useChatIDs } from "@/lib/chat/local-chat-state"
import { shallow } from "zustand/shallow"

const ChatHistory = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const { setIsSidebarOpen } = useSidebar()
    const [chatList, setChatList] = useState<Chat[]>([])
    // external state
    const { chats, setActiveChatId, createChat } = useLocalChatStore(state => ({
        chats: state.chats,
        setActiveChatId: state.setActiveChatId,
        createChat: state.createChat,
        deleteChat: state.deleteChat,
        setActiveChat: state.setActiveChatId,
    }), shallow);

    const handleGetAllchats = useCallback(async () => {
        if (session) {
            if (chats.length === 0) {
                const result = await getChats(session.user.id)
                result.forEach(res => {
                    createChat(res)
                })
            }
            setChatList(chats)
        }
    }, [session, chats, createChat])

    useEffect(() => {
        handleGetAllchats()
    }, [session, handleGetAllchats])

    const handleCardClick = (e, chat: Chat) => {
        e.preventDefault()
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false)
        }
        setActiveChatId(chat.id)
        router.push(`/chat/${chat.id}`)
    }

    return (
        <ScrollArea className='h-full lg:h-3/4 mr-4 ml-4'>
            {
                chatList.map((chat, index) => (
                    <Card key={index} onClick={(e) => handleCardClick(e, chat)} className='hover:border-sky-800 hover:bg-[#f3f3f3] mt-2'>
                        <CardHeader className="flex flex-col items-start gap-4 space-y-0">
                            <div className='w-full'>
                                <CardTitle className='overflow-hidden truncate'>{chat.autoTitle || chat.userTitle || "New chat"}</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="flex space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <CircleIcon className="mr-1 h-3 w-3 fill-red-400 text-sky-400" />
                                    {chat.courseName}
                                </div>
                                <div className="flex items-center">
                                    <StarIcon className="mr-1 h-3 w-3" />
                                    {chat.messages ? `${chat.messages.length} msg` : '0 msg'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </ScrollArea>
    )
}

export default ChatHistory