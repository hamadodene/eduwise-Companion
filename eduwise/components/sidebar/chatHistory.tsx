'use client'

import React, { useCallback, useEffect, useState } from "react"
import { MessageSquareIcon, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useSidebar } from "../context/sidebarContext"
import { Chat } from "@/lib/chat/store-chats"
import { useLocalChatStore } from "@/lib/chat/local-chat-state"
import { getChats } from "@/lib/courses"
import { shallow } from "zustand/shallow"
import { Button } from "../ui/button"
import DeleteChatDialog from "./deleteChatDialog"
import { useDialog } from "../context/DialogContext"

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
    }), shallow)
    const { dialogs, openDialog, closeDialog } = useDialog()

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
        <>
            {
                chatList.length > 0 ? (
                    chatList.map((chat, index) => (
                        <div
                            key={index}
                            className={` group p-4 rounded-lg flex items-center mb-2 ${useLocalChatStore.getState().activeChatId === chat.id ? 'bg-[#099268]' : ''
                                } hover:bg-[#099268] hover:cursor-pointer`}
                            onClick={(e) => handleCardClick(e, chat)}
                        >                        <div className="flex-shrink-0 mr-4">
                                <MessageSquareIcon color="white" />
                            </div>
                            <div>
                                <h2 className="text-lg text-white text-opacity-90 font-semibold line-clamp-1">{chat.userTitle || chat.autoTitle || "New chat"}</h2>
                                <p className="text-sm text-white text-opacity-70">{chat.courseName}</p>
                            </div>
                            <Button className="hidden bg-transparent hover:bg-transparent group-hover:block" onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                openDialog(`deleteChatDialog${chat.id}`)
                            }} variant="ghost"><Trash2 color="white" /></Button>

                            <DeleteChatDialog
                                isOpen={dialogs[`deleteChatDialog${chat.id}`]}
                                toogleDialog={() => closeDialog(`deleteChatDialog${chat.id}`)}
                                chat={chat}
                            />
                        </div>
                    ))) :
                    (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-center text-white">No chat available.</p>
                        </div>
                    )
            }
        </>
    )
}

export default ChatHistory
