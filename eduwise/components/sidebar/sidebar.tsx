"use client"

// components/Sidebar.js
import React from 'react'
import { Icons } from '../icons'
import { LogOutIcon, PanelLeftClose, PlusIcon, Settings2Icon } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useSidebar } from '../context/sidebarContext'
import ChatHistory from './chatHistory'
import { useRouter } from "next/navigation"
import { getSession, signOut, useSession } from 'next-auth/react'
import { useLocalChatStore } from '@/lib/chat/local-chat-state'
import { useLocalSettingsStore } from '@/lib/settings/local-settings-store'
import { Separator } from '../ui/separator'

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

        <div className={`rounded-lg fixed flex flex-col p-2 h-screen w-72 bg-[#A3E4D7] z-40 transition-transform transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="mb-1 flex items-center justify-between mb-6">
                <Link href="/" className="bg-gray-100 px-4 py-2 border w-4/6 space-x-2 rounded-lg bg-gray-100">
                    <Button variant="link" className='space-x-2'>
                        <PlusIcon /><h1>New Chat</h1>
                    </Button>
                </Link>
                <Button variant="link" onClick={toggleSidebar} className="bg-gray-100 text-xl font-semibold h-12 bg-gray-100">
                    <PanelLeftClose />
                </Button>
            </div>
            <div className="flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto">
                <ChatHistory />
            </div>

            <div className="flex items-center justify-between mb-2">
                <Link href="/settings" className="rounded-lg bg-gray-100 py-2 h-10 mt-4 flex items-center">
                    <Button variant="link" className='space-x-2'>
                        <Settings2Icon /> <h1>Settings</h1>
                    </Button>
                </Link>
                <Button className="rounded-lg bg-gray-100  h-10 mt-4" variant="link" onClick={() => {
                    signOutHandler()
                    signOut({ redirect: false }).then(() => {
                        router.push("/login")
                    })
                }}>
                    <LogOutIcon />
                </Button>
            </div>

            <Separator></Separator>
            <div className="pt-2 flex items-center space-x-2">
                <div className="bg-red-500 w-10 h-10 border rounded-lg flex items-center justify-center text-xl text-white font-semibold">
                    {session ? session.user.name.slice(0, 2) : ""}
                </div>
                <div>{session ? session.user.email : ""}</div>
            </div>
        </div>
    )
}

export default Sidebar
