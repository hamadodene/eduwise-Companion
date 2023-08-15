"use client"

import * as React from "react"
import { useRef } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { ChatHistory, chatHistory } from "@/data/chathistory"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Settings, Blocks } from "lucide-react";


interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    chatHistory: ChatHistory[]
}

export function Sidebar({ className, chatHistory }: SidebarProps) {

    return (
        <>
            <div className="flex gap-2 items-center hover:bg-secondary p-2 h-[60px] border-b-2">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-lg">
                    <p className="text-sm font-semibold">Edu wise</p>
                </div>
            </div>
            <div className={cn("pb-12", className)}>
                <div className="space-y-4 py-4">
                    <div className="px-3 py-2">
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                            Discover
                        </h2>
                        <div className="space-y-1">
                            <Button variant="secondary" className="w-full justify-start">
                                <Home className="mr-2 h-4 w-4"/>
                                Dashboard
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4"/>
                                Settings
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-2">
                <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                    Your chats
                </h2>
                <ScrollArea className="h-[400px] px-1">
                    <div className="space-y-1 p-2">
                        {chatHistory?.map((chathistory, i) => (
                            <Button
                                key={`${chathistory}-${i}`}
                                variant="ghost"
                                className="w-full justify-start font-normal"
                            >
                                <Blocks className="mr-2 h-4 w-4"/>
                                {chathistory}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </>
    )
}