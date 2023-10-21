"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChatTitleDialog } from "@/components/chat/ChatTitleDialog"
import { useSidebar } from '../context/sidebarContext'
import { ListMinus } from "lucide-react"

const NavBar = () => {
    const { toggleSidebar } = useSidebar()
    return (
        <div className="flex items-center justify-beetween border">
            <div className="flex items-center justify-beetween p-4 rounded-lg space-x-2">
                <Button variant="ghost" onClick={toggleSidebar} className="ml-auto mr-2 px-4 py-2 lg:hidden">
                    <ListMinus />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold">New conversation</h1>
                    <p className="text-sm">2 messages with eduwise</p>
                </div>

            </div>
            <div className="space-x-4 ml-auto mr-2">
                <ChatTitleDialog />
            </div>
        </div>
    )
}

export default NavBar