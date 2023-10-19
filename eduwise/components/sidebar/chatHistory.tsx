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
import { chat, course, getChats, getCourse } from "@/lib/courses"
import { useRouter } from 'next/navigation'
import { useChatContext } from "@/components//context/ChatHistoryContext"
import { useSidebar } from "../context/sidebarContext"

const ChatHistory = () => {
    const { data: session } = useSession()
    const { addChat, chatList } = useChatContext()
    const router = useRouter()
    const { setIsSidebarOpen } = useSidebar()

    const handleGetAllchats = useCallback(async () => {
        if (session) {
            const result = await getChats(session.user.id)
            console.log("chats "+ JSON.stringify(result))
            result.forEach(res => {
                addChat(res)
            })
        }
    }, [session])

    useEffect(() => {
        if (chatList.length === 0) { // Controlla se la lista è vuota
            handleGetAllchats()
        }
    }, [session,handleGetAllchats])

    const handleCardClick = (e, chatId) => {
        e.preventDefault()
        if(window.innerWidth <= 768) {
            setIsSidebarOpen(false)
        }
        router.push(`/chat/${chatId}`)
    }

    return (
        <>
            {
                chatList.map((chat, index) => (
                    <Card key={index} onClick={(e) => handleCardClick(e, chat.id)} className='hover:border-sky-300 hover:bg-[#f3f3f3] mt-2'>
                        <CardHeader className="flex flex-col items-start gap-4 space-y-0">
                            <div className='w-full'>
                                <CardTitle className='overflow-hidden truncate'>{chat.autoTitle || chat.userTitle || "New conversation"}</CardTitle>
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
        </>
    )
}

export default ChatHistory