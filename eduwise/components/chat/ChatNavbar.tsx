"use client"

import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChatTitleDialog } from "@/components/chat/ChatTitleDialog"
import { SidebarContextType, useSidebar } from '../context/sidebarContext'
import { ListMinus } from "lucide-react"
import { DialogContextType, useDialog } from "../context/DialogContext"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { useLocalChatStore } from "@/lib/chat/local-chat-state"
import { Chat } from "@/lib/chat/store-chats"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const NavBar = () => {
    const { toggleSidebar } = useSidebar() as SidebarContextType
    const { dialogs, openDialog, closeDialog } = useDialog() as DialogContextType
    const { activeChatId, chats } = useLocalChatStore.getState()
    const activeChat: Chat = chats.find(chat => chat.id === activeChatId) as Chat
    const numMessage = activeChat?.messages.length

    useEffect(() => {

    }, [chats, activeChatId])

    return (
        <div className="flex items-center justify-beetween border">
            <div className="flex items-center justify-beetween p-4 rounded-lg space-x-2">
                <Button variant="ghost" onClick={toggleSidebar} className="ml-auto mr-2 px-4 py-2 lg:hidden">
                    <ListMinus />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold">{activeChat?.userTitle || activeChat?.autoTitle || "New conversation"}</h1>
                    <p className="text-sm">{numMessage-1} message/s</p>
                </div>

            </div>
            <div className="space-x-4 ml-auto mr-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" onClick={() => openDialog(`chatTitleDialog`)} className="border-2 border-[#12b886]" size="icon">
                                <Pencil1Icon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side='bottom' className='mr-9'>
                            <p>Edit title</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <ChatTitleDialog
                chatTitle={activeChat?.userTitle || activeChat?.autoTitle}
                isOpen={dialogs['chatTitleDialog']}
                toogleDialog={() => closeDialog('chatTitleDialog')}
            />
        </div>
    )
}

export default NavBar