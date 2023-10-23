"use client"

// components/Sidebar.js
import React from 'react'
import { Icons } from '../icons'
import { LogOutIcon, Settings2Icon } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useSidebar } from '../context/sidebarContext'
import ChatHistory from './chatHistory'
import { useRouter } from "next/navigation"
import { getSession, signOut } from 'next-auth/react'
import { useLocalChatStore } from '@/lib/chat/local-chat-state'

export async function getServerSideProps(context: any) {
    const session = await getSession(context)
    return {
      props: { session }
    }
  }

const Sidebar = () => {
    const { isSidebarOpen } = useSidebar()
    const router = useRouter()
    const {} = useLocalChatStore.getState()

    function signOutHandler() {
        useLocalChatStore.persist.clearStorage()
        router.push("/login");
      }

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
            <ChatHistory />
            <div className="bottom-0 left-0 right-0 p-4 mt-4 flex justify-between items-center border-t">
                <div className='space-x-2'>
                <Button variant="link" className="rounded-lg bg-white dark:bg-slate-900">
                    <Link href="/settings"><Settings2Icon size={15} /></Link>
                </Button>
                <Button  className="rounded-lg bg-white dark:bg-slate-900" variant="link" onClick={() => {
                    signOutHandler()
                    signOut({ redirect: true }).then(() => {
                        router.push("/login")
                    })
                }}>
                    <LogOutIcon size={15} />
                </Button>
                </div>
                <Button variant="link" className="px-4 py-2 rounded-lg transition duration-300 bg-white flex  dark:bg-slate-900 items-center">
                    <Link href="/">New Chat</Link>
                </Button>
            </div>
        </div>
    )
}

export default Sidebar
