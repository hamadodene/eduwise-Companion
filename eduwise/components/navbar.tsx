"use client"

import * as React from "react"
import { Button } from "@/components/ui/button";
import { Share2Icon } from 'lucide-react';
import { EnterFullScreenIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { ChatTitleDialog } from "@/components/ChatTitleDialog";
import { ExportChatDialog } from "./ExportChatDialog";

const NavBar = () => {
    return (
        <div className="p-4 flex items-center justify-between border-b">
            <div>
                <h1 className="text-2xl font-semibold">Nuova conversasione</h1>
                <p className="text-sm">2 messaggi con eduwise</p>
            </div>
            <div className="flex space-x-4">
                <ChatTitleDialog/>
                <ExportChatDialog/>
                <Button variant="ghost" className="border-2" size="icon">
                    <EnterFullScreenIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default NavBar;