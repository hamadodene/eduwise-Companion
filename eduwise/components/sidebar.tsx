"use client"

// components/Sidebar.js
import React from 'react';
import { Icons } from './icons';
import { PlusCircleIcon, Settings2Icon, XIcon } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import Link from 'next/link';


const Sidebar = () => {
    return (
        <div className="relative flex flex-col h-full bg-sky-100 dark:bg-gray-800 w-96">
            <div className="mb-4 mt-4 ml-4 mr-4 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Eduwise companion</h1>
                    <p className="text-sm">Empower Your Learning</p>
                </div>
                <Icons.logo className='h-10 w-10'></Icons.logo>
            </div>
            <div className='mb-8'></div>
            {/* Chat history */}
            <ScrollArea>
                {/* border only on active chat*/}
                <div className="relative mb-2 mr-4 ml-4 p-2 bg-white dark:bg-slate-900 border-2 border-sky-300 hover:bg-gray-300 rounded-lg group">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold">Nuova conversasione</h2>
                        <Button variant="ghost" className="absolute top-0 right-0 p-1 text-red-600 rounded-md group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-transparent">
                            <XIcon />
                        </Button>
                    </div>
                    <div className="mb-2"></div>
                    <div className="flex justify-between">
                        <p className="text-sm">2 messaggi</p>
                        <p className="text-sm">2023-10-01 10:50:55</p>
                    </div>
                </div>
                <div className='mb-2'></div>
                <div className="relative mb-2 mr-4 ml-4 p-2 bg-white dark:bg-slate-900 hover:bg-gray-300 rounded-lg group">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold">Nuova conversasione</h2>
                        <Button variant="ghost" className="absolute top-0 right-0 p-1 text-red-600 rounded-md group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                            <XIcon />
                        </Button>
                    </div>
                    <div className="mb-2"></div>
                    <div className="flex justify-between">
                        <p className="text-sm">5 messaggi</p>
                        <p className="text-sm">2023-10-01 10:50:55</p>
                    </div>
                </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
                <Link href="/settings">
                    <Button variant="ghost" className="rounded-lg bg-white dark:bg-slate-900">
                        <Settings2Icon size={15} />
                    </Button>
                </Link>
                <Link href="/courses">
                    <Button variant="ghost" className="px-4 py-2 rounded-lg transition duration-300 bg-white flex  dark:bg-slate-900 items-center">
                        <PlusCircleIcon className="w-4 h-4 mr-2" size={15} /> New Chat
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
