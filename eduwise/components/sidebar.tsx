"use client"

// components/Sidebar.js
import React from 'react'
import { Icons } from './icons'
import { CircleIcon, Delete, PlusCircleIcon, Settings2Icon, StarIcon, XIcon } from 'lucide-react'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import Link from 'next/link'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useSidebar } from './sidebarContext'



const Sidebar = () => {
    const { isSidebarOpen } = useSidebar()

    return (
        <div className={`relative flex flex-col h-full  bg-[#A3E4D7] dark:bg-gray-800  w-full md:w-4/12 ${isSidebarOpen ? '' : 'hidden'} lg:block`}>
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
                {Array.from({ length: 5 }, (v, i) => (
                    <Card key={i} className='hover:border-sky-300  mt-2'>
                        <CardHeader className="flex flex-col items-start gap-4 space-y-0">
                            <div className='w-full'>
                                <CardTitle className='overflow-hidden truncate'>Studio del Machine learning</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="flex space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <CircleIcon className="mr-1 h-3 w-3 fill-red-400 text-sky-400" />
                                    Machine learning
                                </div>
                                <div className="flex items-center">
                                    <StarIcon className="mr-1 h-3 w-3" />
                                    2 msg
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 p-4 mt-4 flex justify-between items-center border-t">
                <Link href="/settings">
                    <Button variant="ghost" className="rounded-lg bg-white dark:bg-slate-900">
                        <Settings2Icon size={15} />
                    </Button>
                </Link>
                <Button asChild variant="ghost" className="px-4 py-2 rounded-lg transition duration-300 bg-white flex  dark:bg-slate-900 items-center">
                     <Link href="/">New Chat</Link>
                </Button>
            </div>
        </div>
    )
}

export default Sidebar
