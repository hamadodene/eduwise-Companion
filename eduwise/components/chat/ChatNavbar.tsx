"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChatTitleDialog } from "@/components/chat/ChatTitleDialog"
import { useSidebar } from '../context/sidebarContext'
import { ListMinus } from "lucide-react"
import { useDialog } from "../context/DialogContext"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { Chat } from "@/lib/chat/store-chats"

interface NavBarProps {
    chatTitle: string
    numMessage: number
}
const NavBar: React.FC<NavBarProps> = ({chatTitle, numMessage}) => {
    const { toggleSidebar } = useSidebar()
    const { dialogs, openDialog, closeDialog } = useDialog()


    return (
        <div className="flex items-center justify-beetween border">
            <div className="flex items-center justify-beetween p-4 rounded-lg space-x-2">
                <Button variant="ghost" onClick={toggleSidebar} className="ml-auto mr-2 px-4 py-2 lg:hidden">
                    <ListMinus />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold">{chatTitle}</h1>
                    <p className="text-sm">{numMessage} message/s</p>
                </div>

            </div>
            <div className="space-x-4 ml-auto mr-2">
                <Button variant="ghost" onClick={() => openDialog(`chatTitleDialog`)} className="border-2" size="icon">
                    <Pencil1Icon className="h-4 w-4" />
                </Button>
            </div>
            <ChatTitleDialog
                isOpen={dialogs['chatTitleDialog']}
                toogleDialog={() => closeDialog('chatTitleDialog')}
            />
        </div>
    )
}

export default NavBar