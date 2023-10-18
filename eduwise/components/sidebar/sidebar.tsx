"use client"

// components/Sidebar.js
import React from 'react'
import { Icons } from '../icons'
import { CircleIcon, Delete, PlusCircleIcon, Settings2Icon, StarIcon, XIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import Link from 'next/link'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useSidebar } from '../sidebarContext'
import ChatHistory from './chatHistory'



const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar()

    return (
        <div className={`absolute lg:relative flex inset-y-0 left-0 flex-col h-screen lg:h-full
        transition-all duration-300 ease-in-out bg-[#A3E4D7] dark:bg-gray-800 z-20 w-full md:w-4/12 ${isSidebarOpen ? '' : 'hidden'} lg:block`}>
            <div className="mb-4 mt-4 ml-4 mr-4 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Eduwise companion</h1>
                    <p className="text-sm">Empower Your Learning</p>
                </div>
                <Icons.logo className='h-10 w-10'></Icons.logo>
            </div>
            <div className='mb-4'></div>
            {/* Chat history */}
            <ScrollArea className='h-full lg:h-3/4 mr-4 ml-4'>
                <ChatHistory/>
            </ScrollArea>
            <div className="bottom-0 left-0 right-0 p-4 mt-4 flex justify-between items-center border-t">

                <Button variant="link" onClick={toggleSidebar} className="rounded-lg bg-white dark:bg-slate-900">
                    <Link href="/settings"><Settings2Icon size={15} /></Link>
                </Button>

                <Button variant="link" onClick={toggleSidebar} className="px-4 py-2 rounded-lg transition duration-300 bg-white flex  dark:bg-slate-900 items-center">
                    <Link href="/">New Chat</Link>
                </Button>
            </div>
        </div>
    )
}

export default Sidebar
