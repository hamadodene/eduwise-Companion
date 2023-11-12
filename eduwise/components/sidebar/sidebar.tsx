"use client"

// components/Sidebar.js
import React from 'react'
import { Icons } from '../icons'
import { LogOutIcon, PanelLeftClose, PlusIcon, Settings2Icon, X } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useSidebar } from '../context/sidebarContext'
import ChatHistory from './chatHistory'
import { useRouter } from "next/navigation"
import { getSession, signOut, useSession } from 'next-auth/react'
import { useLocalChatStore } from '@/lib/chat/local-chat-state'
import { useLocalSettingsStore } from '@/lib/settings/local-settings-store'
import { Separator } from '../ui/separator'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar()
    const router = useRouter()
    const { data: session } = useSession()

    function signOutHandler() {
        useLocalChatStore.persist.clearStorage()
        useLocalSettingsStore.persist.clearStorage()
        router.push("/login");
    }

    return (

        <div className={`rounded fixed flex flex-col p-2 h-screen w-72 bg-[#12b886] z-40 transition-transform transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="mb-1 flex items-center justify-between mb-6 ">
                <Link href="/" className="bg-transparent px-4 py-2 w-4/6 space-x-2 border h-12 rounded-lg flex items-center justify-left">
                    <div className='space-x-2 text-white text-opacity-70 flex items-center'>
                        <PlusIcon size={15} />
                        <h1>New Chat</h1>
                    </div>
                </Link>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="link" onClick={toggleSidebar} className=" text-xl font-semibold h-12 bg-transparent text-white text-opacity-70 border rounded-lg">
                                <X />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Close sidebar</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto no-scrollbar">
                <ChatHistory />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <div className=" flex  items-center justify-betwee hover:cursor-pointer">
                        <div className='pt-2 flex items-center space-x-2'>
                            <div className="bg-transparent w-10 h-10 border rounded-lg flex items-center justify-center text-xl font-semibold text-white text-opacity-25">
                                {session ? session.user.name.slice(0, 2) : ""}
                            </div>
                            <div className='text-white text-opacity-25'>{session ? session.user.name : ""}</div>
                        </div>
                        <div className='text-white text-opacity-25'>...</div>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="mr-4 bg-[#0ca678] border-none rounded-lg w-72">
                    <div>
                        <div>
                            <Link href="/settings" className="rounded-lg flex items-center mb-4">
                                <div className='bg-transparent h-10 flex items-center space-x-2 text-white text-opacity-90'>
                                    <Settings2Icon size={15} />
                                    <h1>Settings</h1>
                                </div>
                            </Link>
                        </div>
                        <Separator />
                        <div>
                            <Link href="#" className="rounded-lg flex items-center mt-4" onClick={() => {
                                signOutHandler();
                                signOut({ redirect: true }).then(() => {
                                    router.push("/login");
                                });
                            }}>
                                <div className="rounded-lg bg-transparent mt-2 flex items-center space-x-2 text-white text-opacity-90">
                                    <LogOutIcon size={15} />
                                    <p>Logout</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

        </div>
    )
}

export default Sidebar
